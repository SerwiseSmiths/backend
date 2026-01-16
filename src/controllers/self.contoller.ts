import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import * as selfService from "../services/self.service";
import * as deviceService from "../services/device.service";
import * as complaintService from "../services/complaint.service";

export type ProviderStats = {
  name: string;
  profileImage: string|null;
  total: number;          // fractional allowed
  todaysEarning: number;  // fractional allowed
  totalTask: number;
};


export const home = (req: ExpressRequest, res: ExpressResponse, next:ExpressNextFunction ) => {
    return res.json(new ApiSuccess<ProviderStats>(200, "Home details fatched successfully", {
        name: "Patel",
        profileImage: null,
        total: 15298.36,        // fractional allowed
        todaysEarning: 265.3,  // fractional allowed
        totalTask: 1,
    }));
}

export const getSelfAddress = async (req: ExpressRequest, res: ExpressResponse, next:ExpressNextFunction ) => {
  console.log(req.user);
  const userId = req.user.id;
  console.log("User ID in getSelfAddress:", userId);
  const address = await selfService.getSelfAddress(userId);

    return res.json(new ApiSuccess<any>(200, "Address details fatched successfully", {address}));
}

export const getSelfDevices = async (req: ExpressRequest, res: ExpressResponse, next:ExpressNextFunction ) => {
  console.log(req.user);
  const userId = req.user.id;
  console.log("User ID in getSelfDevices:", userId);
  const devices = await deviceService.getDevicesByUser(userId);
    return res.json(new ApiSuccess<any>(200, "Device details fatched successfully", {devices}));
} 

export const getSelfComaplints = async (req: ExpressRequest, res: ExpressResponse, next:ExpressNextFunction ) => {
  console.log(req.user);
  const userId = req.user.id;
  console.log("User ID in getSelfComplaints:", userId);
  const complaints = await complaintService.listComplaintsByUser(userId);
    return res.json(new ApiSuccess<any>(200, "Complaint details fatched successfully", {complaints}));
}