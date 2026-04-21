import * as contactService from "../services/contact.service";

export const syncContacts = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { contacts } = req.body;
    const result = await contactService.syncContacts(userId, contacts);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await contactService.getContacts(userId);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
};
