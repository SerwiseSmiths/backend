/**
 * @file user.controller.ts
 * @description Controller for handling user-related HTTP requests
 * @module controllers/user.controller
 */
import * as userService from "../services/user.services";
import * as userRepo from "../repositories/user.repo";
import usernameService from "../services/username.service";
import UserModel from "../models/schema/User.schema";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";
import { IAuthTokens, userApiData, UserDocument } from "../types/user.type";

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with phone number and basic details.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error or duplicate user
 */
export const registerUser = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
): Promise<void> => {
  try {
    const userData = req.body as any;

    const verificationSignature = userData.verificationSignature as string | undefined;
    if (!verificationSignature) {
      return next(new ApiError(400, "verificationSignature is required for signup", "Validation error"));
    }

    const jwt = require("jsonwebtoken");
    const ACCESS_SECRET = process.env.JWT_SECRET!;

    let payload: any;
    try {
      payload = jwt.verify(verificationSignature, ACCESS_SECRET);
    } catch (err) {
      return next(new ApiError(400, "Invalid or expired verification signature", "Validation error"));
    }

    if (!payload || payload.flow !== "signup" || !payload.phoneNo) {
      return next(new ApiError(400, "Invalid verification payload", "Validation error"));
    }

    userData.phoneNo = payload.phoneNo;

    if (!userData || typeof userData !== "object" || Object.keys(userData).length === 0) {
      return next(
        new ApiError(
          400,
          "Request body is required. Send JSON with header: Content-Type: application/json",
          "Validation error"
        )
      );
    }

    const newUserResult = await userService.registerUser(userData);
    if (
      !newUserResult ||
      newUserResult.statusCode >= 300 ||
      !newUserResult.data ||
      !newUserResult.data.user
    ) {
      next(new ApiError(500, "user not registered", "Internal server error"));
    }

    console.log(newUserResult);

    const userResult = await userService.retirveUserById(
      newUserResult.data!.user._id
    );
    if (
      !userResult ||
      userResult.statusCode >= 300 ||
      !userResult.data ||
      !userResult.data.user
    ) {
      next(new ApiError(500, "user not registered", "Internal server error"));
    }

    const token = await userResult.data!.user!.generateAuthTokens();

    res.status(newUserResult.statusCode).json(
      new ApiSuccess<{ user: UserDocument, token: IAuthTokens }>(201, "user registed successfully", {
        user: userResult.data!.user!,
        token,
      })
    );
  } catch (error) {
    next(new ApiError(500, "user not registered", error));
  }
};

export const validateRefCode = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {

  const { refCode }: { refCode: string | undefined } = req.params;

  const userResult = await userService.retriveUserByRefCode(refCode!);

  res.status(userResult.statusCode).json(userResult);
};

export const getAllUsers = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  const usersResult = await userService.retrieveAllUsers();

  res.status(usersResult.statusCode).json(usersResult);
};

// =====================================
// MANAGE PROVIDERS
// =====================================

export const createProvider = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const { phoneNo, firstName, lastName, email } = req.body as any;

    if (!phoneNo || !firstName || !lastName) {
      return next(new ApiError(400, "phoneNo, firstName and lastName are required"));
    }

    // Check if a user already exists with this phone number
    const existingByPhone = await userRepo.retriveUserByPhoneNo(phoneNo);
    if (existingByPhone) {
      return next(new ApiError(409, "A user with this phone number already exists"));
    }

    // Generate a unique username bypassing OTP/Joi validation
    const username = await usernameService.generateUniqueUsername(firstName, lastName);

    // Directly save to DB
    const newProvider = await userRepo.createUser({
      phoneNo,
      firstName,
      lastName,
      email: email || undefined,
      userType: "provider" as any,
      username,
      isActive: true,
      source: "admin_whitelist",
    });

    if (!newProvider) {
      return next(new ApiError(500, "Failed to create provider"));
    }

    res.status(201).json(
      new ApiSuccess(201, "Provider whitelisted successfully", { provider: newProvider })
    );
  } catch (error) {
    next(new ApiError(500, "Error creating provider", error));
  }
};

export const getProviders = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const providers = await UserModel.find({ userType: "provider", isDeleted: false }).sort({ createdAt: -1 });

    res.status(200).json(
      new ApiSuccess(200, "Providers fetched successfully", { providers })
    );
  } catch (error) {
    next(new ApiError(500, "Error fetching providers", error));
  }
};

export const toggleProviderStatus = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => {
  try {
    const { id } = req.params;

    const provider = await UserModel.findById(id);
    if (!provider) {
      return next(new ApiError(404, "Provider not found"));
    }

    provider.isActive = !provider.isActive;
    await provider.save();

    res.status(200).json(
      new ApiSuccess(200, `Provider ${provider.isActive ? "activated" : "deactivated"} successfully`, { provider })
    );
  } catch (error) {
    next(new ApiError(500, "Error updating provider status", error));
  }
};
