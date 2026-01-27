import mongoose, { Model, Schema } from "mongoose";
import { IUser, UserDocument } from "../../types/user.type";
import { UserType } from "../../constants/user.constant";
import * as bcrypt from "bcryptjs";
import ApiError from "../../utils/api/ApiError.api.util";
import * as jwt from "jsonwebtoken";
import { generateReferenceCode } from "../../utils/refCode.utils";

// =====================================
// JWT SECRET KEYS
// =====================================
const ACCESS_SECRET =
  process.env.JWT_SECRET!;
const REFRESH_SECRET =
  process.env.JWT_SECRET!;

// =====================================
// Mongoose Schema
// =====================================
const UserSchema = new Schema<IUser>(
  {
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
      enum: Object.values(UserType),
      default: UserType.CUSTOMER,
    },

    refreshToken: { type: String, default: null },
    source: { type: String, required: false },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isStaff: { type: Boolean, default: false },

    // 🔥 Newly Added for Chat:
    username: { type: String, unique: true, sparse: true, trim: true },
    hasSetUsername: { type: Boolean, default: false },
    circles: [{ type: Schema.Types.ObjectId, ref: "Circle" }],
  },
  {
    timestamps: true,
  }
);

// -----------------------------------------
// TEXT INDEXES
// -----------------------------------------
UserSchema.index({ firstName: "text", lastName: "text" });

// -----------------------------------------
// Pre-save hook
// -----------------------------------------
UserSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  if (!user.refrenceCode) {
    try {
      user.refrenceCode = generateReferenceCode();
    } catch (err) {
      return next(
        new ApiError(
          500,
          "Failed to generate reference code",
          "REFERENCE_CODE_ERROR"
        )
      );
    }
  }

  next();
});

// -----------------------------------------
// Instance Method: Full Name
// -----------------------------------------
UserSchema.methods.fullName = function (): string {
  return `${this.firstName} ${this.middleName ? this.middleName + " " : ""}${this.lastName}`;
};

// -----------------------------------------
// Instance Method: Compare profileImage hash
// -----------------------------------------
UserSchema.methods.validateprofileImage = async function (
  _enteredprofileImage: string
): Promise<boolean> {
  return bcrypt.compare(_enteredprofileImage, this.profileImage);
};

// ===================================================================
// INSTANCE METHOD: Generate Access + Refresh Tokens & Save Refresh
// ===================================================================
UserSchema.methods.generateAuthTokens = async function () {
  const user = this as UserDocument;

  // Access Token (Short-lived)
  const accessToken = jwt.sign(
    {
      id: user._id.toString(),
      phoneNo: user.phoneNo,
      userType: user.userType,
    },
    ACCESS_SECRET,
    { expiresIn: "15m" } // Adjust as needed
  );

  // Refresh Token (Long-lived)
  const refreshToken = jwt.sign({ id: user._id.toString() }, REFRESH_SECRET, {
    expiresIn: "7d",
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
  const user = this as UserDocument;

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
const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
