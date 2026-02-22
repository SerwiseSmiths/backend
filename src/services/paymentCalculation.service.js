"use strict";
/**
 * Payment Calculation Service
 * Calculates payment amount for complaints considering subscriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
const Quote_schema_1 = require("../models/schema/Quote.schema");
const subscription_schema_1 = require("../models/schema/subscription.schema");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const strapi_config_1 = require("../config/strapi.config");
class PaymentCalculationService {
    /**
     * Fetch a part from Strapi by ID
     */
    async fetchPartFromStrapi(partId) {
        try {
            const response = await fetch((0, strapi_config_1.getStrapiUrl)(`/parts/${partId}`), {
                method: "GET",
                headers: (0, strapi_config_1.getStrapiHeaders)(),
            });
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                console.error(`Failed to fetch part ${partId} from Strapi:`, response.statusText);
                return null;
            }
            const data = await response.json();
            const part = Array.isArray(data.data) ? data.data[0] : data.data;
            // Handle both Strapi v4 (with attributes) and v5 (flat structure)
            if (part && 'attributes' in part) {
                return part;
            }
            else if (part) {
                // Convert flat structure to attributes structure for consistency
                return {
                    id: part.id,
                    attributes: {
                        name: part.name || '',
                        price: parseFloat(part.price || 0),
                        type: part.type,
                        category: part.category,
                    }
                };
            }
            return null;
        }
        catch (error) {
            console.error(`Error fetching part ${partId} from Strapi:`, error);
            return null;
        }
    }
    /**
     * Fetch multiple parts from Strapi by IDs
     */
    async fetchPartsFromStrapi(partIds) {
        const partsMap = new Map();
        // Fetch all parts in parallel
        const fetchPromises = partIds.map(async (id) => {
            const part = await this.fetchPartFromStrapi(id);
            if (part) {
                partsMap.set(id, part);
            }
        });
        await Promise.all(fetchPromises);
        return partsMap;
    }
    /**
     * Fetch subscription details from Strapi by plan type
     */
    async fetchSubscriptionFromStrapi(planType) {
        try {
            const response = await fetch((0, strapi_config_1.getStrapiUrl)(`/subscriptions?filters[plan_type][$eq]=${planType}&populate=*`), {
                method: "GET",
                headers: (0, strapi_config_1.getStrapiHeaders)(),
            });
            if (!response.ok) {
                console.error(`Failed to fetch subscription ${planType} from Strapi:`, response.statusText);
                return null;
            }
            const data = await response.json();
            const subscriptions = Array.isArray(data.data) ? data.data : [data.data];
            return (subscriptions.length > 0 ? subscriptions[0] : undefined) ?? null;
        }
        catch (error) {
            console.error(`Error fetching subscription ${planType} from Strapi:`, error);
            return null;
        }
    }
    /**
     * Get subscription services/parts IDs that are included in the subscription
     */
    getSubscriptionIncludedIds(subscription) {
        const includedIds = new Set();
        if (!subscription) {
            return includedIds;
        }
        // Check if subscription has services
        if (subscription.attributes.services?.data) {
            subscription.attributes.services.data.forEach((service) => {
                includedIds.add(service.id);
            });
        }
        // Check if subscription has parts
        if (subscription.attributes.parts?.data) {
            subscription.attributes.parts.data.forEach((part) => {
                includedIds.add(part.id);
            });
        }
        return includedIds;
    }
    /**
     * Calculate payment amount for a complaint
     * - If complaint has subscription, get related services from subscription type from Strapi
     * - For subscription services, cost is zero
     * - For remaining services, cost should be considered from Strapi
     * - Result is cached in complaint to avoid recalculation
     */
    async calculatePaymentAmount(complaintId) {
        // Check if already calculated and cached
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId)
            .populate("quote")
            .populate("subscriptionId");
        if (!complaint) {
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        }
        // Return cached value if available and recent (within 1 hour)
        if (complaint.calculatedPaymentAmount !== null &&
            complaint.calculatedPaymentAmount !== undefined &&
            complaint.calculatedPaymentAt) {
            const cacheAge = Date.now() - complaint.calculatedPaymentAt.getTime();
            const oneHour = 60 * 60 * 1000;
            if (cacheAge < oneHour) {
                return complaint.calculatedPaymentAmount;
            }
        }
        // Get quote items (Strapi part IDs)
        if (!complaint.quote) {
            throw new ApiError_api_util_1.default(400, "Complaint does not have a quote");
        }
        const quote = typeof complaint.quote === "object" && "items" in complaint.quote
            ? complaint.quote
            : await Quote_schema_1.QuoteModel.findById(complaint.quote);
        if (!quote || !quote.items || quote.items.length === 0) {
            // No items in quote, payment is zero
            await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
                calculatedPaymentAmount: 0,
                calculatedPaymentAt: new Date(),
            });
            return 0;
        }
        const quotePartIds = quote.items;
        // Fetch all parts from Strapi
        const partsMap = await this.fetchPartsFromStrapi(quotePartIds);
        // Get subscription included services/parts if complaint has subscription
        let subscriptionIncludedIds = new Set();
        if (complaint.subscriptionId) {
            const subscription = typeof complaint.subscriptionId === "object" && "type" in complaint.subscriptionId
                ? complaint.subscriptionId
                : await subscription_schema_1.SubscriptionModel.findById(complaint.subscriptionId);
            if (subscription && subscription.type) {
                const strapiSubscription = await this.fetchSubscriptionFromStrapi(subscription.type);
                subscriptionIncludedIds = this.getSubscriptionIncludedIds(strapiSubscription);
            }
        }
        // Calculate total payment
        let totalAmount = 0;
        for (const partId of quotePartIds) {
            const part = partsMap.get(partId);
            if (!part) {
                console.warn(`Part ${partId} not found in Strapi, skipping`);
                continue;
            }
            // Check if this part is included in subscription
            const isIncludedInSubscription = subscriptionIncludedIds.has(partId);
            if (!isIncludedInSubscription) {
                // Not included in subscription, add price
                // Handle both structures (with attributes or flat)
                const price = part.attributes?.price || part.price || 0;
                totalAmount += parseFloat(price.toString());
            }
            // If included in subscription, cost is zero (do nothing)
        }
        // Cache the calculated amount
        await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
            calculatedPaymentAmount: totalAmount,
            calculatedPaymentAt: new Date(),
        });
        return totalAmount;
    }
    /**
     * Get remaining payment amount (after any cash collected)
     */
    async getRemainingPaymentAmount(complaintId) {
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId);
        if (!complaint) {
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        }
        // Calculate payment if not already calculated
        const totalAmount = await this.calculatePaymentAmount(complaintId);
        // If cash was collected, remaining is zero
        if (complaint.cashCollected) {
            return 0;
        }
        return totalAmount;
    }
    /**
     * Recalculate payment amount (force recalculation, ignore cache)
     */
    async recalculatePaymentAmount(complaintId) {
        // Clear cache first
        await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
            calculatedPaymentAmount: null,
            calculatedPaymentAt: null,
        });
        // Recalculate
        return await this.calculatePaymentAmount(complaintId);
    }
}
exports.default = new PaymentCalculationService();
//# sourceMappingURL=paymentCalculation.service.js.map