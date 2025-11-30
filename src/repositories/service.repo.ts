import { ServiceModel } from "../models/schema/Service.schema";

export class ServiceRepo {
  findAll() {
    return ServiceModel.find();
  }
  findById(id: string) {
    return ServiceModel.findById(id);
  }
  create(data: any) {
    return ServiceModel.create(data);
  }
  update(id: string, data: any) {
    return ServiceModel.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id: string) {
    return ServiceModel.findByIdAndDelete(id);
  }
}
