import { ComplaintRepo } from "../repositories/complaint.repo";

export class ComplaintService {
  private repo = new ComplaintRepo();

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
