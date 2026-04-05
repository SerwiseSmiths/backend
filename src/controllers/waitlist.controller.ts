import * as WaitlistService from "../services/waitlist.service";

export const joinWaitlist = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const { phoneNo, countryCode, source } = req.body;
    const result = await WaitlistService.joinWaitlist(phoneNo, countryCode, source);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getWaitlist = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const result = await WaitlistService.getWaitlist();
    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};
