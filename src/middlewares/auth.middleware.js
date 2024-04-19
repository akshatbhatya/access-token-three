import { user } from "../model/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandller.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req?.header("Authorization")?.replace("bearer ", "");
    
      console.log(token);
    if (!token) {
      throw new ApiError(401, "unotherization request");
    }

    const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN);
    const User = await user
      .findById(decodedToken._id)
      .select("-password -refreshToken");

    if (!User) {
      throw new ApiError(401, "invalid access token");
    }
    
    req.newUser = User;
    
    next()
  }
   catch (error) {
    throw new ApiError(401, error);
  }
});
export default authMiddleware;
