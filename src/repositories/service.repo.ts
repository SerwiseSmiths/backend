import { ServiceModel } from "../models/schema/Service.schema";
import { IService } from "../models/schema/Service.schema";

export const createService = async (
  data: Partial<IService>
): Promise<IService | null> => {
  const service = new ServiceModel(data);
  await service.save();
  return service;
};

export const retrieveAllServices = async (): Promise<IService[]> => {
  return await ServiceModel.find();
};

export const retrieveServiceById = async (
  id: string
): Promise<IService | null> => {
  return await ServiceModel.findById(id);
};

export const updateServiceById = async (
  id: string,
  data: Partial<IService>
): Promise<IService | null> => {
  return await ServiceModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteServiceById = async (
  id: string
): Promise<IService | null> => {
  return await ServiceModel.findByIdAndDelete(id);
};
