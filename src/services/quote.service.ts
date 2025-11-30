import { QuoteRepo } from "../repositories/quote.repo";

export class QuoteService {
  private repo = new QuoteRepo();

  getAll() {
    return this.repo.findAll();
  }
  getOne(id: string) {
    return this.repo.findById(id);
  }
  create(data: any) {
    return this.repo.create(data);
  }
  update(id: string, data: any) {
    return this.repo.update(id, data);
  }
  delete(id: string) {
    return this.repo.delete(id);
  }
}
