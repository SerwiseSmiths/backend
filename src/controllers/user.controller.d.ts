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
export declare const registerUser: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<void>;
export declare const validateRefCode: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<void>;
export declare const getAllUsers: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<void>;
export declare const createProvider: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
export declare const getProviders: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<void>;
export declare const toggleProviderStatus: (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => Promise<any>;
//# sourceMappingURL=user.controller.d.ts.map