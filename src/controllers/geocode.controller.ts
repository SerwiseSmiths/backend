import { Request, Response } from "express";
import { geocodeAddress } from "../services/geocode.service";

export const getLatLngFromAddress = async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    if (!address)
      return res.status(400).json({ message: "Address is required" });

    const data = await geocodeAddress(address);

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
  } catch (error: any) {
    console.error("Geocode error:", error?.response?.data || error);
    res.status(500).json({
      success: false,
      message: "Failed to geocode address",
      error: error?.response?.data || error.message,
    });
  }
};
