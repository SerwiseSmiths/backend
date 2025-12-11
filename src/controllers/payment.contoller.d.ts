import { Request, Response } from "express";
declare class PaymentController {
    createPayment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    webhook(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: PaymentController;
export default _default;
//# sourceMappingURL=payment.contoller.d.ts.map