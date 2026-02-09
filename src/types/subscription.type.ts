// Subscription type definitions

import { HydratedDocument, Document } from "mongoose";

export type SubscriptionState =
    | "active"
    | "expired"
    | "completed"
    | "cancelled"
    | "pending";

export type SubscriptionType = "A3" | "A4" | "A6" | "B3" | "B4" | "B6" | "C";

export interface ISubscription extends Document {
    user: mongodbId;
    created_at: Date;
    end_at: Date;
    remaining_service: number;
    used_service: number;
    state: SubscriptionState;
    auto_renew: boolean;
    payment_remaining: number;
    type: SubscriptionType;
    payments: mongodbId[];
    createdAt: Date;
    updatedAt: Date;
}

export type SubscriptionDocument = HydratedDocument<ISubscription>;

export interface ICreateSubscriptionInput {
    type: SubscriptionType;
    created_at: Date;
    end_at: Date;
    remaining_service: number;
    payment_remaining: number;
    auto_renew?: boolean;
    payments?: mongodbId[];
}

export interface IUpdateSubscriptionInput {
    state?: SubscriptionState;
    remaining_service?: number;
    used_service?: number;
    auto_renew?: boolean;
    payment_remaining?: number;
    end_at?: Date;
}
