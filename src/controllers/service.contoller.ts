import { Request, Response } from "express";
import { ServiceService } from "../services/service.service";

const service = new ServiceService();

export class ServiceController {
  static async getAll(req: Request, res: Response) {
    res.json(await service.getAll());
  }

  static async getOne(req: Request, res: Response) {
    res.json(await service.getOne(req.params.id!));
  }

  static async create(req: Request, res: Response) {
    res.json(await service.create(req.body));
  }

  static async update(req: Request, res: Response) {
    res.json(await service.update(req.params.id!, req.body));
  }

  static async delete(req: Request, res: Response) {
    res.json(await service.delete(req.params.id!));
  }
}
