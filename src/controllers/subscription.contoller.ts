import * as subService from "../services/subscription.service";
// import ApiError from "../utils/api/ApiError.api.util";

export const createSubscription = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const userId = req.user.id; // from auth middleware
    const result = await subService.createSubscription(userId, req.body);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await subService.retrieveSubscriptionById(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await subService.retrieveAllSubscriptions();
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateState = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const { state } = req.body;
    const result = await subService.changeState(req.params.id, state);
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentRemaining = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const { amount } = req.body;
    const result = await subService.updatePaymentRemaining(
      req.params.id,
      amount
    );
    res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};
