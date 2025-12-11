import { IService } from "../models/schema/Service.schema";
export declare const createService: (data: Partial<IService>) => Promise<IService | null>;
export declare const retrieveAllServices: () => Promise<IService[]>;
export declare const retrieveServiceById: (id: string) => Promise<IService | null>;
export declare const updateServiceById: (id: string, data: Partial<IService>) => Promise<IService | null>;
export declare const deleteServiceById: (id: string) => Promise<IService | null>;
//# sourceMappingURL=service.repo.d.ts.map