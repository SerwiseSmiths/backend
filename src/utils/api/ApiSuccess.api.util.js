"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiSuccess {
    statusCode;
    message;
    data;
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
exports.default = ApiSuccess;
//# sourceMappingURL=ApiSuccess.api.util.js.map