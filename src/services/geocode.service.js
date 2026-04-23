"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeAddress = void 0;
const axios_1 = require("axios");
const mappleToken_service_1 = require("./mappleToken.service");
const geocodeAddress = async (address) => {
    const token = await (0, mappleToken_service_1.getMapplsToken)();
    const url = `https://atlas.mapmyindia.com/api/places/geocode`;
    const response = await axios_1.default.get(url, {
        params: { address },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data; // includes everything from MapMyIndia
};
exports.geocodeAddress = geocodeAddress;
//# sourceMappingURL=geocode.service.js.map