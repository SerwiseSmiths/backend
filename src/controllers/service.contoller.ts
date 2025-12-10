import * as serviceService from "../services/service.service";

export const createService = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await serviceService.createService(req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getAllServices = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await serviceService.getAllServices();
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getServiceById = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await serviceService.getServiceById(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await serviceService.updateService(req.params.id, req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await serviceService.deleteService(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
