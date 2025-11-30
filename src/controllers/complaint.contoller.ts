import { Request, Response } from "express";
import { ComplaintService } from "../services/complaint.service";

const complaint = new ComplaintService();

export class ComplaintController {
  static async getAll(req: Request, res: Response) {
    res.json(await complaint.getAll());
  }

  static async getOne(req: Request, res: Response) {
    res.json(await complaint.getOne(req.params.id!));
  }

  static async create(req: Request, res: Response) {
    res.json(await complaint.create(req.body));
  }

  static async update(req: Request, res: Response) {
    res.json(await complaint.update(req.params.id!, req.body));
  }

  static async delete(req: Request, res: Response) {
    res.json(await complaint.delete(req.params.id!));
  }
}
