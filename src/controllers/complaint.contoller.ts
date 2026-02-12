// controllers/complaint.controller.ts
import * as complaintService from "../services/complaint.service";

export const createComplaint = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const userId = req.user.id; // from auth middleware
    const result = await complaintService.createComplaint(req.body, userId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getComplaint = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const result = await complaintService.getComplaint(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const listComplaints = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const result = await complaintService.listComplaints();
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateComplaint = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const result = await complaintService.updateComplaint(
      req.params.id,
      req.body
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteComplaint = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const result = await complaintService.deleteComplaint(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateStage = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const { stage, rejectionReason } = req.body;
    const result = await complaintService.updateStage(req.params.id, stage, rejectionReason);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const addQuote = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const { quoteId } = req.body;
    const result = await complaintService.addQuote(req.params.id, quoteId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const addDevice = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const { deviceId } = req.body;
    const result = await complaintService.addDevice(req.params.id, deviceId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const addPayment = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const { paymentId } = req.body;
    const result = await complaintService.addPayment(req.params.id, paymentId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const reopenComplaint = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const userId = req.user.id;
    const parentId = req.params.id;
    const result = await complaintService.reopenComplaint(
      parentId,
      req.body,
      userId
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const listMyComplaints = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const userId = req.user.id;
    const result = await complaintService.listComplaintsByUser(userId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const listProviderComplaints = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const providerId = req.user.id;
    const result = await complaintService.listComplaintsByProvider(providerId);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

// Provider accepts complaint assignment
export const acceptComplaintAssignment = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const providerId = req.user.id;
    const result = await complaintService.acceptComplaintAssignment(
      req.params.id,
      providerId
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

// Provider rejects complaint assignment
export const rejectComplaintAssignment = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const providerId = req.user.id;
    const result = await complaintService.rejectComplaintAssignment(
      req.params.id,
      providerId
    );
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
