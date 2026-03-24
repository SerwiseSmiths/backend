import * as subService from "../services/subscription.service";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";

export const purchaseSubscription = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    const userId = req.user.id;
    const result = await subService.purchaseSubscription(userId, req.body);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMySubscriptions = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    const userId = req.user.id;
    const result = await subService.retrieveSubscriptionsByUser(userId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const validateSubscription = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    const userId = req.user.id;
    const { userSubscriptionId } = req.params;
    const result = await subService.validateSubscriptionForComplaint(userId, userSubscriptionId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    const { id } = req.params;
    const result = await subService.getSubscriptionById(id);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getComplaintCharge = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    const { userSubscriptionId } = req.params;
    const result = await subService.getSubscriptionChargeForComplaint(userSubscriptionId);
    res.status(200).json({ statusCode: 200, message: "Charge computed", data: result });
  } catch (error) {
    next(error);
  }
};
