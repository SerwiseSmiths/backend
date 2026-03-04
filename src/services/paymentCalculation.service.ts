/**
 * Payment Calculation Service
 * Calculates payment amount for complaints considering subscriptions
 */

import { ComplaintModel } from "../models/schema/Complaint.schema";
import { QuoteModel } from "../models/schema/Quote.schema";
import { SubscriptionModel } from "../models/schema/subscription.schema";
import ApiError from "../utils/api/ApiError.api.util";
import { getStrapiHeaders, getStrapiUrl } from "../config/strapi.config";
import { serverQueryClient } from "../utils/serverQueryClient";

interface StrapiPart {
  id: number;
  attributes: {
    name: string;
    price: number;
    type?: string;
    category?: string;
    [key: string]: any;
  };
}

interface StrapiSubscription {
  id: number;
  attributes: {
    plan_type: string; // e.g., "A3", "A4", "A6", "B3", "B4", "B6", "C"
    services?: {
      data: Array<{
        id: number;
        attributes: {
          name: string;
          price: number;
          [key: string]: any;
        };
      }>;
    };
    parts?: {
      data: Array<{
        id: number;
        [key: string]: any;
      }>;
    };
    [key: string]: any;
  };
}

interface StrapiResponse<T> {
  data: T | T[];
  meta: any;
}

class PaymentCalculationService {
  /**
   * Fetch a part from Strapi by ID
   */
  private async fetchPartFromStrapi(partId: number): Promise<StrapiPart | null> {
    return serverQueryClient.fetchQuery({
      queryKey: ["strapi", "part", partId],
      queryFn: async () => {
        try {
          const response = await fetch(getStrapiUrl(`/parts/${partId}`), {
            method: "GET",
            headers: getStrapiHeaders(),
          });

          if (!response.ok) {
            if (response.status === 404) {
              return null;
            }
            console.error(
              `Failed to fetch part ${partId} from Strapi:`,
              response.statusText
            );
            return null;
          }

          const data: StrapiResponse<StrapiPart> = await response.json();
          const part = Array.isArray(data.data) ? data.data[0] : data.data;

          // Handle both Strapi v4 (with attributes) and v5 (flat structure)
          if (part && "attributes" in part) {
            return part as StrapiPart;
          } else if (part) {
            // Convert flat structure to attributes structure for consistency
            return {
              id: (part as any).id,
              attributes: {
                name: (part as any).name || "",
                price: parseFloat((part as any).price || 0),
                type: (part as any).type,
                category: (part as any).category,
              },
            } as StrapiPart;
          }
          return null;
        } catch (error) {
          console.error(`Error fetching part ${partId} from Strapi:`, error);
          return null;
        }
      },
    });
  }

  /**
   * Fetch multiple parts from Strapi by IDs
   */
  private async fetchPartsFromStrapi(partIds: number[]): Promise<Map<number, StrapiPart>> {
    const partsMap = new Map<number, StrapiPart>();
    
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
  private async fetchSubscriptionFromStrapi(planType: string): Promise<StrapiSubscription | null> {
    return serverQueryClient.fetchQuery({
      queryKey: ["strapi", "subscription", planType],
      queryFn: async () => {
        try {
          const response = await fetch(
            getStrapiUrl(
              `/subscriptions?filters[plan_type][$eq]=${planType}&populate=*`
            ),
            {
              method: "GET",
              headers: getStrapiHeaders(),
            }
          );

          if (!response.ok) {
            console.error(
              `Failed to fetch subscription ${planType} from Strapi:`,
              response.statusText
            );
            return null;
          }

          const data: StrapiResponse<StrapiSubscription> =
            await response.json();
          const subscriptions = Array.isArray(data.data)
            ? data.data
            : [data.data];
          return (
            (subscriptions.length > 0 ? subscriptions[0] : undefined) ?? null
          );
        } catch (error) {
          console.error(
            `Error fetching subscription ${planType} from Strapi:`,
            error
          );
          return null;
        }
      },
    });
  }

  /**
   * Get subscription services/parts IDs that are included in the subscription
   */
  private getSubscriptionIncludedIds(subscription: StrapiSubscription | null): Set<number> {
    const includedIds = new Set<number>();

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
  async calculatePaymentAmount(complaintId: string): Promise<number> {
    // Check if already calculated and cached
    const complaint = await ComplaintModel.findById(complaintId)
      .populate("quote")
      .populate("subscriptionId");

    if (!complaint) {
      throw new ApiError(404, "Complaint not found");
    }

    // Return cached value if available and recent (within 1 hour)
    if (
      complaint.calculatedPaymentAmount !== null &&
      complaint.calculatedPaymentAmount !== undefined &&
      complaint.calculatedPaymentAt
    ) {
      const cacheAge = Date.now() - complaint.calculatedPaymentAt.getTime();
      const oneHour = 60 * 60 * 1000;
      if (cacheAge < oneHour) {
        return complaint.calculatedPaymentAmount;
      }
    }

    // Get quote items (Strapi part IDs)
    if (!complaint.quote) {
      throw new ApiError(400, "Complaint does not have a quote");
    }

    const quote = typeof complaint.quote === "object" && "items" in complaint.quote
      ? complaint.quote
      : await QuoteModel.findById(complaint.quote);

    if (!quote || !quote.items || quote.items.length === 0) {
      // No items in quote, payment is zero
      await ComplaintModel.findByIdAndUpdate(complaintId, {
        calculatedPaymentAmount: 0,
        calculatedPaymentAt: new Date(),
      });
      return 0;
    }

    const quotePartIds: number[] = quote.items;

    // Fetch all parts from Strapi
    const partsMap = await this.fetchPartsFromStrapi(quotePartIds);

    // Get subscription included services/parts if complaint has subscription
    let subscriptionIncludedIds = new Set<number>();
    if (complaint.subscriptionId) {
      const subscription = typeof complaint.subscriptionId === "object" && "type" in complaint.subscriptionId
        ? complaint.subscriptionId
        : await SubscriptionModel.findById(complaint.subscriptionId);

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
        const price = part.attributes?.price || (part as any).price || 0;
        totalAmount += parseFloat(price.toString());
      }
      // If included in subscription, cost is zero (do nothing)
    }

    // Cache the calculated amount
    await ComplaintModel.findByIdAndUpdate(complaintId, {
      calculatedPaymentAmount: totalAmount,
      calculatedPaymentAt: new Date(),
    });

    return totalAmount;
  }

  /**
   * Get remaining payment amount (after any cash collected)
   */
  async getRemainingPaymentAmount(complaintId: string): Promise<number> {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) {
      throw new ApiError(404, "Complaint not found");
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
  async recalculatePaymentAmount(complaintId: string): Promise<number> {
    // Clear cache first
    await ComplaintModel.findByIdAndUpdate(complaintId, {
      calculatedPaymentAmount: null,
      calculatedPaymentAt: null,
    });

    // Recalculate
    return await this.calculatePaymentAmount(complaintId);
  }
}

export default new PaymentCalculationService();

