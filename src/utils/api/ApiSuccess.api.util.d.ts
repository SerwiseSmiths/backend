import * as SucessType from "../../types/api/ApiSuccess.type";
declare class ApiSuccess<T> {
    statusCode: SucessType.statusCode;
    message: SucessType.message;
    data: T | null;
    constructor(statusCode: SucessType.statusCode, message: SucessType.message, data?: T | null);
}
export type ApiSuccessType<T> = InstanceType<typeof ApiSuccess<T>>;
export default ApiSuccess;
//# sourceMappingURL=ApiSuccess.api.util.d.ts.map