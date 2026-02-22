/**
 * @file user.controller.ts
 * @description Controller for handling user-related HTTP requests
 * @module controllers/user.controller
 */
import { promises } from "dns";
import * as userService from "../services/user.services";
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
    const userData = req.body;

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

    const token =await userResult.data!.user!.generateAuthTokens();

    res.status(newUserResult.statusCode).json(
      new ApiSuccess<{user: UserDocument, token: IAuthTokens}>(201, "user registed successfully", {
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
