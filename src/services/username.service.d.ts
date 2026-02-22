declare class UsernameService {
    /**
     * Generates a unique username based on first and last name.
     */
    generateUniqueUsername(firstName: string, lastName: string): Promise<string>;
    /**
     * Updates a user's username.
     */
    updateUsername(userId: string, newUsername: string): Promise<import("mongoose").Document<unknown, {}, import("../types/user.type").IUser, {}, {}> & import("../types/user.type").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
declare const _default: UsernameService;
export default _default;
//# sourceMappingURL=username.service.d.ts.map