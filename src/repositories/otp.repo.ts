import OtpModel, { IOtp } from "../models/schema/Otp.schema";

export const upsertOtp = async (
  phoneNo: string,
  hash: string,
  expiresAt: Date
): Promise<IOtp> => {
  const record = await OtpModel.findOneAndUpdate(
    { phoneNo },
    {
      phoneNo,
      otp: hash,
      expiresAt,
      consumed: false,
      attempts: 0,
    },
    { upsert: true, new: true }
  );

  return record as IOtp;
};

export const findLatestActiveOtp = async (phoneNo: string): Promise<IOtp | null> => {
  const record = await OtpModel.findOne({ phoneNo, consumed: false }).sort({
    createdAt: -1,
  });

  return record as IOtp | null;
};

export const consumeOtp = async (id: string): Promise<void> => {
  await OtpModel.findByIdAndUpdate(id, { consumed: true });
};

export const incrementAttempts = async (id: string): Promise<void> => {
  await OtpModel.findByIdAndUpdate(id, { $inc: { attempts: 1 } });
};

