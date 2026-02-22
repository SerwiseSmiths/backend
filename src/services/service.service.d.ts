import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { IService } from "../models/schema/Service.schema";
export declare function createService(data: Partial<IService>): Promise<ApiSuccess<{
    service: IService | null;
}>>;
export declare function getAllServices(): Promise<ApiSuccess<{
    services: IService[];
}>>;
export declare function getServiceById(id: string): Promise<ApiSuccess<{
    service: IService;
}>>;
export declare function updateService(id: string, data: Partial<IService>): Promise<ApiSuccess<{
    service: IService;
}>>;
export declare function deleteService(id: string): Promise<ApiSuccess<unknown>>;
//# sourceMappingURL=service.service.d.ts.map