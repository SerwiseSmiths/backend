"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json(err);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.middleware.js.map