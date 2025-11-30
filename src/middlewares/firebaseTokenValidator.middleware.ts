import firebaseAdmin from "../config/firebase.config";
import ApiError from "../utils/api/ApiError.api.util";

const firebaseTokenVlaidatore =async (req : ExpressRequest, res:ExpressResponse, next:ExpressNextFunction) => {

    try{
    //retrive token from header
    const authHeader: string|null = req.header.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ").length !== 2){
        throw new ApiError(401, "Verify Mobile no to continue.",!authHeader?"Authorization header required":"Invalid Authorization header.");
    }

    const idToken : string = authHeader.split(" ")[1]!;

    //verify token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    req.user = decodedToken;

    next();
}catch (err){
    console.log("FireBase Mob. no. validation failed : "+err);
    throw new ApiError(401,"Verify Mobile no to continue.", err);
}

}

export default firebaseTokenVlaidatore;