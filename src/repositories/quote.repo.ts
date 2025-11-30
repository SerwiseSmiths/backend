import { QuoteModel } from "../models/schema/Quote.schema";

export class QuoteRepo {
  findAll() {
    return QuoteModel.find().populate("items");
  }
  findById(id: string) {
    return QuoteModel.findById(id).populate("items");
  }
  create(data: any) {
    return QuoteModel.create(data);
  }
  update(id: string, data: any) {
    return QuoteModel.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id: string) {
    return QuoteModel.findByIdAndDelete(id);
  }
}
