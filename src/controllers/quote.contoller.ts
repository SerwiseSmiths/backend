import * as quoteService from "../services/quote.service";

export const createQuote = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await quoteService.createQuote(req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getAllQuotes = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await quoteService.getAllQuotes();
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const getQuoteById = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await quoteService.getQuoteById(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateQuote = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await quoteService.updateQuote(req.params.id, req.body);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateQuoteStatus = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const { status, reason } = req.body;
    if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status logic. Allowed values: PENDING, APPROVED, REJECTED" });
    }
    const result = await quoteService.updateQuoteStatus(req.params.id, status, reason);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteQuote = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await quoteService.deleteQuote(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
