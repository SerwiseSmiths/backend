  import { Schema, model, Document } from "mongoose";

  export interface IService extends Document {
    name: string;
    price: number;
    title: string;
  }

  const serviceSchema = new Schema<IService>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
  });

  export const ServiceModel = model<IService>("Service", serviceSchema);
