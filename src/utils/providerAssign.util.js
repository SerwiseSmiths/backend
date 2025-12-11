"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutoAssignedProvider = void 0;
// utils/providerAssignment.util.ts
const User_schema_1 = require("../models/schema/User.schema");
const getAutoAssignedProvider = async () => {
    // Example Algo: pick any random provider with role = "provider"
    const providers = await User_schema_1.default.find({ role: "provider", isDeleted: false });
    if (!providers || providers.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * providers.length);
    return providers[randomIndex]?._id;
};
exports.getAutoAssignedProvider = getAutoAssignedProvider;
//# sourceMappingURL=providerAssign.util.js.map