"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelfAddress = void 0;
const addressRepo = require("../repositories/address.repo");
const getSelfAddress = async (userId) => {
    const addresses = await addressRepo.getAddressesByUser(userId);
    return addresses;
};
exports.getSelfAddress = getSelfAddress;
// export const getHome = async (userId: string)  => {
//     return {
//         name: "Patel",
//         profileImage: null,
//         total: 15298.36,        // fractional allowed
//         todaysEarning: 265.3,  // fractional allowed
//         totalTask: 1,
//     };
// }
// export const getSelfDevice = async (user) => {}
//# sourceMappingURL=self.service.js.map