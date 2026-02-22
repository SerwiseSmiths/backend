"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_schema_1 = require("../models/schema/User.schema");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
class UsernameService {
    /**
     * Generates a unique username based on first and last name.
     */
    async generateUniqueUsername(firstName, lastName) {
        const base = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`.replace(/\s+/g, "");
        let username = base;
        let isUnique = false;
        let counter = 1;
        while (!isUnique) {
            const existingUser = await User_schema_1.default.findOne({ username });
            if (!existingUser) {
                isUnique = true;
            }
            else {
                username = `${base}${counter}`;
                counter++;
            }
        }
        return username;
    }
    /**
     * Updates a user's username.
     */
    async updateUsername(userId, newUsername) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!regex.test(newUsername)) {
            throw new ApiError_api_util_1.default(400, "Username must be 3-20 characters long and contain only letters, numbers, and underscores.");
        }
        const existingUser = await User_schema_1.default.findOne({ username: newUsername });
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new ApiError_api_util_1.default(400, "Username is already taken.");
        }
        const user = await User_schema_1.default.findById(userId);
        if (!user) {
            throw new ApiError_api_util_1.default(404, "User not found.");
        }
        user.username = newUsername;
        user.hasSetUsername = true;
        await user.save();
        return user;
    }
}
exports.default = new UsernameService();
//# sourceMappingURL=username.service.js.map