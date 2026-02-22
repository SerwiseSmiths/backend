"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.retrieveAllUsers = exports.retrieveUserByRefCode = exports.retriveUserById = exports.createUser = exports.retriveUserByEmail = exports.retriveUserByPhoneNo = void 0;
const Regex = require("../constants/regex.constant");
const User_schema_1 = require("../models/schema/User.schema");
const retriveUserByPhoneNo = async (_phoneNo) => {
    //validate phone number
    console.log("Validating phone no: ", _phoneNo, " ", _phoneNo.match(Regex.phoneRegex), Regex.phoneRegex);
    if (_phoneNo === "" ||
        typeof _phoneNo !== "string"
    // ||
    // !_phoneNo.match(Regex.phoneRegex)
    ) {
        return null;
    }
    console.log("Phone no valid");
    //fetch user from database by phone number
    const user = await User_schema_1.default.findOne({ phoneNo: _phoneNo, isDeleted: false });
    if (!user) {
        return null;
    }
    //return user
    return user;
};
exports.retriveUserByPhoneNo = retriveUserByPhoneNo;
const retriveUserByEmail = async (_email) => {
    //validate email
    if (_email === "" ||
        typeof _email !== "string" ||
        !_email.match(Regex.emailRegex)) {
        return null;
    }
    //fetch user from database by email
    const user = await User_schema_1.default.findOne({ email: _email, isDeleted: false });
    if (!user) {
        return null;
    }
    //return user
    return user;
};
exports.retriveUserByEmail = retriveUserByEmail;
const createUser = async (data) => {
    const newUser = new User_schema_1.default(data);
    await newUser.save();
    return newUser;
};
exports.createUser = createUser;
const retriveUserById = async (_id) => {
    const user = await User_schema_1.default.findById(_id);
    if (!user) {
        return null;
    }
    return user;
};
exports.retriveUserById = retriveUserById;
const retrieveUserByRefCode = async (refCode) => {
    try {
        if (!refCode || typeof refCode !== "string") {
            return null;
        }
        // Clean the reference code
        const cleanCode = refCode.trim().toUpperCase();
        // Find the user by referenceCode
        const user = await User_schema_1.default.findOne({ refrenceCode: cleanCode });
        return user;
    }
    catch (error) {
        console.error("Error retrieving user by reference code:", error);
        return null;
    }
};
exports.retrieveUserByRefCode = retrieveUserByRefCode;
const retrieveAllUsers = async () => {
    try {
        // Find the user by referenceCode
        const user = await User_schema_1.default.find();
        return user;
    }
    catch (error) {
        console.error("Error retrieving user by reference code:", error);
        return null;
    }
};
exports.retrieveAllUsers = retrieveAllUsers;
const updateUserById = async (_id, data) => {
    try {
        const user = await User_schema_1.default.findByIdAndUpdate(_id, { $set: data }, { new: true, runValidators: true });
        return user;
    }
    catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
};
exports.updateUserById = updateUserById;
//# sourceMappingURL=user.repo.js.map