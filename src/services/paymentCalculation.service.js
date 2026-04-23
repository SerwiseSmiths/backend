"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Complaint_schema_1 = require("../models/schema/Complaint.schema");
const Quote_schema_1 = require("../models/schema/Quote.schema");
const UserSubscription_schema_1 = require("../models/schema/UserSubscription.schema");
const SubscriptionUsage_schema_1 = require("../models/schema/SubscriptionUsage.schema");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const strapi_config_1 = require("../config/strapi.config");
const serverQueryClient_1 = require("../utils/serverQueryClient");
class PaymentCalculationService {
    /**
     * Fetch a part from Strapi by ID
     */
    async fetchPartFromStrapi(partId) {
        return serverQueryClient_1.serverQueryClient.fetchQuery({
            queryKey: ["strapi", "part", partId],
            queryFn: async () => {
                try {
                    const response = await fetch((0, strapi_config_1.getStrapiUrl)(`/parts/${partId}`), {
                        method: "GET",
                        headers: (0, strapi_config_1.getStrapiHeaders)(),
                    });
                    if (!response.ok)
                        return null;
                    const data = await response.json();
                    const part = Array.isArray(data.data) ? data.data[0] : data.data;
                    if (part && "attributes" in part) {
                        return part;
                    }
                    else if (part) {
                        return {
                            id: part.id,
                            attributes: {
                                name: part.name || "",
                                price: parseFloat(part.price || 0),
                                face_value: parseFloat(part.face_value || 0),
                                provider_cut: parseFloat(part.provider_cut || 0),
                            },
                        };
                    }
                    return null;
                }
                catch (error) {
                    console.error(`Error fetching part ${partId} from Strapi:`, error);
                    return null;
                }
            },
        });
    }
    /**
     * Fetch multiple parts from Strapi by IDs
     */
    async fetchPartsFromStrapi(partIds) {
        const partsMap = new Map();
        const fetchPromises = partIds.map(async (id) => {
            const part = await this.fetchPartFromStrapi(id);
            if (part)
                partsMap.set(id, part);
        });
        await Promise.all(fetchPromises);
        return partsMap;
    }
    async calculatePaymentAmount(complaintId) {
        console.log(`[PaymentCalc] calculatePaymentAmount called for complaint: ${complaintId}`);
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId)
            .populate("quote")
            .populate("subscriptionId");
        if (!complaint)
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        if (!complaint.quote)
            throw new ApiError_api_util_1.default(400, "Complaint does not have a quote");
        const quote = typeof complaint.quote === "object" && "items" in complaint.quote
            ? complaint.quote
            : await Quote_schema_1.QuoteModel.findById(complaint.quote);
        console.log(`[PaymentCalc] Quote:`, { id: quote?._id, total: quote?.total, itemCount: quote?.items?.length });
        if (!quote || !quote.items || quote.items.length === 0) {
            console.log(`[PaymentCalc] No quote items — returning 0`);
            return 0;
        }
        const quotePartIds = quote.items.map(String);
        console.log(`[PaymentCalc] Part IDs from quote:`, quotePartIds);
        const partsMap = await this.fetchPartsFromStrapi(quotePartIds);
        console.log(`[PaymentCalc] Strapi resolved ${partsMap.size}/${quotePartIds.length} parts`);
        let subscriptionIncludedIds = new Set();
        let emiApplied = 0;
        let totalAmount = 0;
        let totalProviderCut = 0;
        let providerCutOverridden = false;
        if (complaint.subscriptionId) {
            const sub = typeof complaint.subscriptionId === "object" && "plan_snapshot" in complaint.subscriptionId
                ? complaint.subscriptionId
                : await UserSubscription_schema_1.UserSubscriptionModel.findById(complaint.subscriptionId);
            if (sub && sub.status === "active") {
                // Find usage index
                const usageCount = await SubscriptionUsage_schema_1.SubscriptionUsageModel.countDocuments({ subscription: sub._id });
                const nextIndex = usageCount + 1;
                console.log(`[PaymentCalc] Subscription active, usageCount: ${usageCount}, nextIndex: ${nextIndex}`);
                const mapping = sub.plan_snapshot.serviceMapping?.find((m) => m.usageIndex === nextIndex);
                if (mapping) {
                    // Handle new repeatable component structure (relation to parts)
                    if (mapping.parts && Array.isArray(mapping.parts)) {
                        mapping.parts.forEach((p) => {
                            const partId = p.documentId || p.id;
                            if (partId)
                                subscriptionIncludedIds.add(partId.toString());
                        });
                    }
                    console.log(`[PaymentCalc] Subscription-included part IDs:`, [...subscriptionIncludedIds]);
                    // If mapping defines a specific provider cut for this visit, use it as an override
                    if (mapping.providerCut !== undefined && mapping.providerCut !== null) {
                        totalProviderCut = mapping.providerCut;
                        providerCutOverridden = true;
                        console.log(`[PaymentCalc] Provider cut overridden by subscription mapping: ${totalProviderCut}`);
                    }
                }
                // Metered Billing Logic: After lock-in, if payment not completed, trigger remaining on first service
                if (sub.paymentModel === "metered" && sub.paymentStatus !== "completed") {
                    const monthsSinceStart = (new Date().getTime() - sub.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
                    if (monthsSinceStart > sub.plan_snapshot.lockInPeriod) {
                        // After lock-in, first service triggers remaining payment
                        emiApplied = sub.remainingAmount;
                        console.log(`[PaymentCalc] Metered EMI applied: ${emiApplied}`);
                    }
                }
            }
        }
        for (const partId of quotePartIds) {
            const part = partsMap.get(partId);
            if (!part) {
                console.warn(`[PaymentCalc] Part not found in Strapi: ${partId}`);
                continue;
            }
            const isIncludedInSubscription = subscriptionIncludedIds.has(partId);
            // Only accumulate part-based provider cuts if not overridden by the subscription mapping
            if (!providerCutOverridden) {
                const providerCut = part.attributes?.provider_cut || part.provider_cut || 0;
                totalProviderCut += parseFloat(providerCut.toString());
            }
            if (!isIncludedInSubscription) {
                const price = part.attributes?.face_value || part.attributes?.price || part.face_value || part.price || 0;
                const parsedPrice = parseFloat(price.toString());
                console.log(`[PaymentCalc] Part ${partId}: price=${parsedPrice}, providerCutOverridden=${providerCutOverridden}`);
                totalAmount += parsedPrice;
            }
            else {
                console.log(`[PaymentCalc] Part ${partId} covered by subscription — skipped from total`);
            }
        }
        totalAmount += emiApplied;
        // If Strapi part lookups returned nothing but the quote has a stored total,
        // fall back to quote.total so a non-zero quote is never treated as free.
        if (totalAmount === 0 && quote.total > 0) {
            console.warn(`[PaymentCalc] Strapi returned no matching parts but quote.total=${quote.total} — falling back to stored total`);
            totalAmount = quote.total;
        }
        const totalPaid = complaint.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        const remainingAmount = Math.max(0, totalAmount - totalPaid);
        console.log(`[PaymentCalc] Result — totalAmount: ${totalAmount}, totalPaid: ${totalPaid}, remainingAmount: ${remainingAmount}, providerCut: ${totalProviderCut}`);
        await Complaint_schema_1.ComplaintModel.findByIdAndUpdate(complaintId, {
            totalAmount: totalAmount,
            remainingAmount: remainingAmount,
            calculatedPaymentAmount: remainingAmount,
            calculatedPaymentAt: new Date(),
            emiApplied: emiApplied,
            providerCut: totalProviderCut
        });
        return totalAmount;
    }
    // ... rest of methods ...
    async processPaymentCompletion(complaintId) {
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId);
        if (!complaint)
            return;
        // 1. Credit provider cut
        if (complaint.providerCut && complaint.providerCut > 0 && complaint.provider) {
            // ... (existing wallet logic)
        }
        // 2. record usage and handle metered payment
        if (complaint.subscriptionId) {
            const { recordUsage, recordSubscriptionPayment } = await Promise.resolve().then(() => require("./subscription.service"));
            const usageCount = await SubscriptionUsage_schema_1.SubscriptionUsageModel.countDocuments({ subscription: complaint.subscriptionId });
            await recordUsage(complaint.subscriptionId, complaint._id, usageCount + 1);
            if (complaint.emiApplied && complaint.emiApplied > 0) {
                await recordSubscriptionPayment(complaint.subscriptionId, complaint.emiApplied, "metered_completion", complaintId.toString());
            }
        }
    }
    /**
     * Read the persisted remaining payment amount from the complaint.
     * This is set by calculateComplaintAmount and updated after payments.
     */
    async getRemainingPaymentAmount(complaintId) {
        const complaint = await Complaint_schema_1.ComplaintModel.findById(complaintId).lean();
        if (!complaint)
            throw new ApiError_api_util_1.default(404, "Complaint not found");
        return complaint.remainingAmount ?? complaint.calculatedPaymentAmount ?? 0;
    }
}
exports.default = new PaymentCalculationService();
//# sourceMappingURL=paymentCalculation.service.js.map