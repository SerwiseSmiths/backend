import { Request, Response, NextFunction } from "express";
import * as deviceTypeService from "../services/deviceType.service";

export const createDeviceType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceTypeService.create(req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDeviceTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceTypeService.retrieveAll();
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDeviceType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceTypeService.retrieveById(req.params.id!);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateDeviceType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceTypeService.update(req.params.id!, req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteDeviceType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceTypeService.softDelete(req.params.id!);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
