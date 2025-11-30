export interface DeviceTypeDocument extends Document {
  name: string;
  description?: string;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}