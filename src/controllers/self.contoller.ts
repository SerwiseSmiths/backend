import ApiSuccess from "../utils/api/ApiSuccess.api.util";

const home = (req: ExpressRequest, res: ExpressResponse, next:ExpressNextFunction ) => {
    res.status(200).json(new ApiSuccess(200, "API is running", { status: "OK" }));
}