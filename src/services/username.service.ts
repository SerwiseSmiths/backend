import UserModel from "../models/schema/User.schema";
import ApiError from "../utils/api/ApiError.api.util";

class UsernameService {
    /**
     * Generates a unique username based on first and last name.
     */
    async generateUniqueUsername(firstName: string, lastName: string): Promise<string> {
        const base = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`.replace(/\s+/g, "");
        let username = base;
        let isUnique = false;
        let counter = 1;

        while (!isUnique) {
            const existingUser = await UserModel.findOne({ username });
            if (!existingUser) {
                isUnique = true;
            } else {
                username = `${base}${counter}`;
                counter++;
            }
        }

        return username;
    }

    /**
     * Updates a user's username.
     */
    async updateUsername(userId: string, newUsername: string) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!regex.test(newUsername)) {
            throw new ApiError(400, "Username must be 3-20 characters long and contain only letters, numbers, and underscores.");
        }

        const existingUser = await UserModel.findOne({ username: newUsername });
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new ApiError(400, "Username is already taken.");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        user.username = newUsername;
        user.hasSetUsername = true;
        await user.save();

        return user;
    }
}

export default new UsernameService();
