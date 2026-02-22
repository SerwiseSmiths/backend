"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../../constants/user.constant");
const bcrypt = require("bcryptjs");
const ApiError_api_util_1 = require("../../utils/api/ApiError.api.util");
const jwt = require("jsonwebtoken");
const refCode_utils_1 = require("../../utils/refCode.utils");
// =====================================
// JWT SECRET KEYS
// =====================================
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_SECRET;
// =====================================
// Mongoose Schema
// =====================================
const UserSchema = new mongoose_1.Schema({
    phoneNo: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true,
    },
    profileImage: { type: String, required: false },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    refrenceCode: { type: String, required: false, unique: true },
    userType: {
        type: String,
        enum: Object.values(user_constant_1.UserType),
        default: user_constant_1.UserType.CUSTOMER,
    },
    refreshToken: { type: String, default: null },
    source: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isStaff: { type: Boolean, default: false },
    // 🔥 Newly Added for Chat:
    username: { type: String, unique: true, sparse: true, trim: true },
    hasSetUsername: { type: Boolean, default: false },
    circles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Circle" }],
}, {
    timestamps: true,
});
// -----------------------------------------
// TEXT INDEXES
// -----------------------------------------
UserSchema.index({ firstName: "text", lastName: "text" });
// -----------------------------------------
// Pre-save hook
// -----------------------------------------
UserSchema.pre("save", async function (next) {
    const user = this;
    if (!user.refrenceCode) {
        try {
            user.refrenceCode = (0, refCode_utils_1.generateReferenceCode)();
        }
        catch (err) {
            return next(new ApiError_api_util_1.default(500, "Failed to generate reference code", "REFERENCE_CODE_ERROR"));
        }
    }
    next();
});
// -----------------------------------------
// Instance Method: Full Name
// -----------------------------------------
UserSchema.methods.fullName = function () {
    return `${this.firstName} ${this.middleName ? this.middleName + " " : ""}${this.lastName}`;
};
// -----------------------------------------
// Instance Method: Compare profileImage hash
// -----------------------------------------
UserSchema.methods.validateprofileImage = async function (_enteredprofileImage) {
    return bcrypt.compare(_enteredprofileImage, this.profileImage);
};
// ===================================================================
// INSTANCE METHOD: Generate Access + Refresh Tokens & Save Refresh
// ===================================================================
UserSchema.methods.generateAuthTokens = async function () {
    const user = this;
    // Access Token (Short-lived)
    const accessToken = jwt.sign({
        id: user._id.toString(),
        phoneNo: user.phoneNo,
        userType: user.userType,
    }, ACCESS_SECRET, { expiresIn: "30d" } // Rolling 30-day access token
    );
    // Refresh Token (Long-lived)
    const refreshToken = jwt.sign({ id: user._id.toString() }, REFRESH_SECRET, {
        expiresIn: "120d", // 4 months
    });
    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
};
// ===================================================================
// INSTANCE METHOD: Logout (Remove refresh token)
// ===================================================================
UserSchema.methods.logout = async function () {
    const user = this;
    user.refreshToken = null;
    await user.save();
    return true;
};
// -----------------------------------------
// Static Method Example
// -----------------------------------------
UserSchema.statics.findActiveUsers = function () {
    return this.find({ isActive: true, isDeleted: false });
};
// -----------------------------------------
// Export Model
// -----------------------------------------
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
//# sourceMappingURL=User.schema.js.map