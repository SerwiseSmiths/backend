export const errorHandler = (err: ApiErrorType, req: ExpressRequest, res:ExpressResponse, next: ExpressNextFunction): Response => {
    return res.status(err.statusCode || 500).json(err);
}