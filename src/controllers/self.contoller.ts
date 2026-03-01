import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";

import * as selfService from "../services/self.service";
import * as deviceService from "../services/device.service";
import * as complaintService from "../services/complaint.service";
import * as walletService from "../services/wallet.services";
import * as userService from "../services/user.services";
import notificationService from "../services/notification.service";
import { serverQueryClient } from "../utils/serverQueryClient";

export type HomeStats = {
  name: string;
  notifications: number;
  wallet: number;
};


export const home = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    const userId = req.user.id;
    const data = await serverQueryClient.fetchQuery<HomeStats>({
      queryKey: ["self", "home", userId],
      staleTime: 60 * 1000, // 1 minute
      queryFn: async () => {
        // Fetch user details
        const userRes = await userService.retirveUserById(userId);
        if (!userRes.data) throw new ApiError(500, "Failed to fetch user data");
        const user = userRes.data.user;

        // Fetch unseen notification count
        const notifications = await notificationService.getUnseenNotificationCount(userId);

        // Fetch wallet balance
        const walletRes = await walletService.getWallet(userId);
        if (!walletRes.data) throw new ApiError(500, "Failed to fetch wallet data");
        const wallet = walletRes.data.wallet;

        return {
          name: user.firstName,
          notifications,
          wallet: wallet.balance,
        };
      },
    });

    return res.json(
      new ApiSuccess<HomeStats>(200, "Home details fetched successfully", data)
    );
  } catch (error) {
    next(error);
  }
}

export const getSelfAddress = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  console.log(req.user);
  const userId = req.user.id;
  console.log("User ID in getSelfAddress:", userId);
  const address = await serverQueryClient.fetchQuery({
    queryKey: ["self", "address", userId],
    staleTime: 60 * 1000,
    queryFn: () => selfService.getSelfAddress(userId),
  });

  return res.json(new ApiSuccess<any>(200, "Address details fatched successfully", { address }));
}

export const getSelfDevices = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  console.log(req.user);
  const userId = req.user.id;
  console.log("User ID in getSelfDevices:", userId);
  const devices = await serverQueryClient.fetchQuery({
    queryKey: ["self", "devices", userId],
    staleTime: 60 * 1000,
    queryFn: () => deviceService.getDevicesByUser(userId),
  });
  return res.json(new ApiSuccess<any>(200, "Device details fatched successfully", { devices }));
}



export const getSelfWallet = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  const userId = req.user.id;
  const result = await serverQueryClient.fetchQuery({
    queryKey: ["self", "wallet", userId],
    staleTime: 60 * 1000,
    queryFn: () => walletService.getWallet(userId),
  });
  return res.status(result.statusCode).json(result);
};

export const getSelfComaplints = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  console.log(req.user);
  const userId = req.user.id;
  console.log("User ID in getSelfComplaints:", userId);
  const complaints = await serverQueryClient.fetchQuery({
    queryKey: ["self", "complaints", userId],
    staleTime: 60 * 1000,
    queryFn: () => complaintService.listComplaintsByUser(userId),
  });
  return res.json(new ApiSuccess<any>(200, "Complaint details fatched successfully", { complaints }));
}

export const updateProfileImage = async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    const userId = req.user.id;
    const { profileImageUrl } = req.body;

    if (!profileImageUrl || typeof profileImageUrl !== 'string') {
      return next(new ApiError(400, "profileImageUrl is required and must be a string"));
    }

    const result = await userService.updateProfileImage(userId, profileImageUrl);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    next(error);
  }
}