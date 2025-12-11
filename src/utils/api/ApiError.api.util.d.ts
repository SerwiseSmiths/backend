import { Error } from "mongoose";
import * as ErrorType from "../../types/api/ApiError.type";
declare class ApiError extends Error {
    statusCode: ErrorType.statusCode;
    message: ErrorType.message;
    error: ErrorType.error;
    constructor(statusCode: ErrorType.statusCode, message: ErrorType.message, error?: ErrorType.error);
}
export type ApiErrorType = InstanceType<typeof ApiError>;
export default ApiError;
//# sourceMappingURL=ApiError.api.util.d.ts.map