"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const home = (req, res, next) => {
    res.status(200).json(new ApiSuccess_api_util_1.default(200, "API is running", { status: "OK" }));
};
//# sourceMappingURL=self.contoller.js.map