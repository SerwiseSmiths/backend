// controllers/complaint.controller.ts
import * as complaintService from "../services/complaint.service";

export const createComplaint = async (req: ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const userId = req.user._id; // from auth middleware
    const result = await complaintService.createComplaint(req.body, userId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getComplaint = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await complaintService.getComplaint(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const listComplaints = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await complaintService.listComplaints();
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateComplaint = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await complaintService.updateComplaint(req.params.id, req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteComplaint = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await complaintService.deleteComplaint(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateStage = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const { stage } = req.body;
    const result = await complaintService.updateStage(req.params.id, stage);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const addQuote = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const { quoteId } = req.body;
    const result = await complaintService.addQuote(req.params.id, quoteId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
