import { Request, Response, NextFunction } from "express";
declare class PaymentController {
    createPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: PaymentController;
export default _default;
//# sourceMappingURL=payment.contoller.d.ts.map