import { ServiceRepo } from "../repositories/service.repo";

export class ServiceService {
  private repo = new ServiceRepo();

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
