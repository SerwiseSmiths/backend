import { ComplaintModel } from "../models/schema/Complaint.schema";
import { QuoteModel } from "../models/schema/Quote.schema";
import { UserSubscriptionModel } from "../models/schema/UserSubscription.schema";
import { SubscriptionUsageModel } from "../models/schema/SubscriptionUsage.schema";
import ApiError from "../utils/api/ApiError.api.util";
import { getStrapiHeaders, getStrapiUrl } from "../config/strapi.config";
import { serverQueryClient } from "../utils/serverQueryClient";

interface StrapiPart {
  id: string;
  attributes: {
    name: string;
    face_value?: number;
    price?: number;
    provider_cut?: number;
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
  private async fetchPartFromStrapi(partId: string): Promise<StrapiPart | null> {
    return serverQueryClient.fetchQuery({
      queryKey: ["strapi", "part", partId],
      queryFn: async () => {
        try {
          const response = await fetch(getStrapiUrl(`/parts/${partId}`), {
            method: "GET",
            headers: getStrapiHeaders(),
          });

          if (!response.ok) return null;

          const data: StrapiResponse<StrapiPart> = await response.json();
          const part = Array.isArray(data.data) ? data.data[0] : data.data;

          if (part && "attributes" in part) {
            return part as StrapiPart;
          } else if (part) {
            return {
              id: (part as any).id,
              attributes: {
                name: (part as any).name || "",
                price: parseFloat((part as any).price || 0),
                face_value: parseFloat((part as any).face_value || 0),
                provider_cut: parseFloat((part as any).provider_cut || 0),
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
  private async fetchPartsFromStrapi(partIds: string[]): Promise<Map<string, StrapiPart>> {
    const partsMap = new Map<string, StrapiPart>();
    const fetchPromises = partIds.map(async (id) => {
      const part = await this.fetchPartFromStrapi(id);
      if (part) partsMap.set(id, part);
    });
    await Promise.all(fetchPromises);
    return partsMap;
  }
  
  async calculatePaymentAmount(complaintId: string): Promise<number> {
    const complaint = await ComplaintModel.findById(complaintId)
      .populate("quote")
      .populate("subscriptionId");

    if (!complaint) throw new ApiError(404, "Complaint not found");

    if (!complaint.quote) throw new ApiError(400, "Complaint does not have a quote");

    const quote = typeof complaint.quote === "object" && "items" in complaint.quote
      ? complaint.quote
      : await QuoteModel.findById(complaint.quote);

    if (!quote || !quote.items || quote.items.length === 0) return 0;

    const quotePartIds: string[] = quote.items.map(String);
    const partsMap = await this.fetchPartsFromStrapi(quotePartIds);

    let subscriptionIncludedIds = new Set<string>();
    let emiApplied = 0;

    let totalAmount = 0;
    let totalProviderCut = 0;
    let providerCutOverridden = false;

    if (complaint.subscriptionId) {
      const sub = typeof complaint.subscriptionId === "object" && "plan_snapshot" in complaint.subscriptionId
        ? complaint.subscriptionId
        : await UserSubscriptionModel.findById(complaint.subscriptionId);

      if (sub && sub.status === "active") {
        // Find usage index
        const usageCount = await SubscriptionUsageModel.countDocuments({ subscription: sub._id });
        const nextIndex = usageCount + 1;
        
        const mapping = sub.plan_snapshot.serviceMapping?.find((m: any) => m.usageIndex === nextIndex);
        if (mapping) {
          // Handle new repeatable component structure (relation to parts)
          if (mapping.parts && Array.isArray(mapping.parts)) {
            mapping.parts.forEach((p: any) => {
              const partId = p.documentId || p.id;
              if (partId) subscriptionIncludedIds.add(partId.toString());
            });
          }

          // If mapping defines a specific provider cut for this visit, use it as an override
          if (mapping.providerCut !== undefined && mapping.providerCut !== null) {
            totalProviderCut = mapping.providerCut;
            providerCutOverridden = true;
          }
        }

        // Metered Billing Logic: After lock-in, if payment not completed, trigger remaining on first service
        if (sub.paymentModel === "metered" && sub.paymentStatus !== "completed") {
          const monthsSinceStart = (new Date().getTime() - sub.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          if (monthsSinceStart > sub.plan_snapshot.lockInPeriod) {
            // After lock-in, first service triggers remaining payment
            emiApplied = sub.remainingAmount;
          }
        }
      }
    }

    for (const partId of quotePartIds) {
      const part = partsMap.get(partId);
      if (!part) continue;

      const isIncludedInSubscription = subscriptionIncludedIds.has(partId);
      
      // Only accumulate part-based provider cuts if not overridden by the subscription mapping
      if (!providerCutOverridden) {
        const providerCut = part.attributes?.provider_cut || (part as any).provider_cut || 0;
        totalProviderCut += parseFloat(providerCut.toString());
      }

      if (!isIncludedInSubscription) {
        const price = part.attributes?.face_value || part.attributes?.price || (part as any).face_value || (part as any).price || 0;
        totalAmount += parseFloat(price.toString());
      }
    }

    totalAmount += emiApplied;

    const totalPaid = (complaint as any).payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
    const remainingAmount = Math.max(0, totalAmount - totalPaid);

    await ComplaintModel.findByIdAndUpdate(complaintId, {
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
  
  async processPaymentCompletion(complaintId: string): Promise<void> {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) return;

    // 1. Credit provider cut
    if (complaint.providerCut && complaint.providerCut > 0 && complaint.provider) {
        // ... (existing wallet logic)
    }

    // 2. record usage and handle metered payment
    if (complaint.subscriptionId) {
       const { recordUsage, recordSubscriptionPayment } = await import("./subscription.service");
       const usageCount = await SubscriptionUsageModel.countDocuments({ subscription: complaint.subscriptionId });
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
  async getRemainingPaymentAmount(complaintId: string): Promise<number> {
    const complaint = await ComplaintModel.findById(complaintId).lean();
    if (!complaint) throw new ApiError(404, "Complaint not found");
    return (complaint as any).remainingAmount ?? (complaint as any).calculatedPaymentAmount ?? 0;
  }
}

export default new PaymentCalculationService();

