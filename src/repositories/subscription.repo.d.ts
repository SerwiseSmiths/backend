import { ISubscription } from "../models/schema/subscription.schema";
/** Create Subscription */
export declare const createSubscription: (data: Partial<ISubscription>) => Promise<ISubscription | null>;
/** Retrieve by ID */
export declare const retrieveSubscriptionById: (_id: mongodbId) => Promise<ISubscription | null>;
/** Retrieve all */
export declare const retrieveAllSubscriptions: () => Promise<ISubscription[]>;
/** Update partial fields */
export declare const updateSubscription: (_id: mongodbId, update: Partial<ISubscription>) => Promise<ISubscription | null>;
//# sourceMappingURL=subscription.repo.d.ts.map