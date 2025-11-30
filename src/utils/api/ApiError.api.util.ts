import { Error } from "mongoose";
import * as ErrorType from "../../types/api/ApiError.type"

class ApiError extends Error {
  statusCode: ErrorType.statusCode;
  message: ErrorType.message;
  error: ErrorType.error;

  constructor(
    statusCode: ErrorType.statusCode,
    message: ErrorType.message,
    error: ErrorType.error = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}
export type ApiErrorType = InstanceType<typeof ApiError>;

export default ApiError;
