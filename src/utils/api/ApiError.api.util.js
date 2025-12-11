"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class ApiError extends mongoose_1.Error {
    statusCode;
    message;
    error;
    constructor(statusCode, message, error = null) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.api.util.js.map