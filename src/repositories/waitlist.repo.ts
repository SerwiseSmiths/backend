import WaitlistModel, { WaitlistDocument } from "../models/schema/Waitlist.schema";

export const findByPhoneNo = async (phoneNo: string): Promise<WaitlistDocument | null> => {
  return WaitlistModel.findOne({ phoneNo });
};

export const create = async (data: {
  phoneNo: string;
  countryCode: string;
  source?: string;
}): Promise<WaitlistDocument> => {
  return WaitlistModel.create(data);
};

export const markTruecallerNotified = async (phoneNo: string): Promise<void> => {
  await WaitlistModel.updateOne(
    { phoneNo },
    { notifiedViaTruecaller: true, truecallerNotifiedAt: new Date() }
  );
};

export const getAll = async (): Promise<WaitlistDocument[]> => {
  return WaitlistModel.find().sort({ joinedAt: -1 });
};

export const count = async (): Promise<number> => {
  return WaitlistModel.countDocuments();
};
