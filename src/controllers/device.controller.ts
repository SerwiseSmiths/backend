import { Request, Response, NextFunction } from "express";
import * as deviceService from "../services/device.service";

export const createDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceService.create(req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceService.retrieve(req.params.id!);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceService.retrieveAll();
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceService.update(req.params.id!, req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceService.softDelete(req.params.id!);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
