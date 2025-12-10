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

export const deleteQuote = async (req:ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {
  try {
    const result = await quoteService.deleteQuote(req.params.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    next(err);
  }
};
