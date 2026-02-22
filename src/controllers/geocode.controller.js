"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatLngFromAddress = void 0;
const geocode_service_1 = require("../services/geocode.service");
const getLatLngFromAddress = async (req, res) => {
    try {
        const { address } = req.body;
        if (!address)
            return res.status(400).json({ message: "Address is required" });
        const data = await (0, geocode_service_1.geocodeAddress)(address);
        // Mappls returns data.copResults / data.results
        return res.json({
            success: true,
            raw: data,
            lat: data?.copResults?.latitude,
            lng: data?.copResults?.longitude,
            eloc: data?.copResults?.eLoc,
            formattedAddress: data?.copResults?.formattedAddress,
            level: data?.copResults?.geocodeLevel,
            components: {
                city: data?.copResults?.city,
                state: data?.copResults?.state,
                pincode: data?.copResults?.pincode,
                district: data?.copResults?.district,
                subLocality: data?.copResults?.subLocality,
                poi: data?.copResults?.poi,
            }
        });
    }
    catch (error) {
        console.error("Geocode error:", error?.response?.data || error);
        res.status(500).json({
            success: false,
            message: "Failed to geocode address",
            error: error?.response?.data || error.message,
        });
    }
};
exports.getLatLngFromAddress = getLatLngFromAddress;
//# sourceMappingURL=geocode.controller.js.map