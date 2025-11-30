// config/mongo.config.ts
import mongoose, { ConnectOptions, Types } from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URL as string,
      {
        // No need for useNewUrlParser, useUnifiedTopology in Mongoose 6+
      } as ConnectOptions
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.error(`❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};

export type mongodbId = Types.ObjectId;
