import { ComplaintModel } from "../models/schema/Complaint.schema";

export class ComplaintRepo {
  findAll() {
    return ComplaintModel.find()
      .populate("quote")
      .populate("parent");
  }

  findById(id: string) {
    return ComplaintModel.findById(id)
      .populate("quote")
      .populate("parent");
  }

  create(data: any) {
    return ComplaintModel.create(data);
  }

  update(id: string, data: any) {
    return ComplaintModel.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return ComplaintModel.findByIdAndDelete(id);
  }
}
