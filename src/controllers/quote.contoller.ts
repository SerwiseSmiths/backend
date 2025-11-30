import { Request, Response } from "express";
import { QuoteService } from "../services/quote.service";

const quote = new QuoteService();

export class QuoteController {
  static async getAll(req: Request, res: Response) {
    res.json(await quote.getAll());
  }

  static async getOne(req: Request, res: Response) {
    res.json(await quote.getOne(req.params.id!));
  }

  static async create(req: Request, res: Response) {
    res.json(await quote.create(req.body));
  }

  static async update(req: Request, res: Response) {
    res.json(await quote.update(req.params.id!, req.body));
  }

  static async delete(req: Request, res: Response) {
    res.json(await quote.delete(req.params.id!));
  }
}
