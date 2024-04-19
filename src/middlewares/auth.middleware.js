import asyncHandler from "../utils/asyncHandller.js";

const authMiddleware=asyncHandler(async(req,res)=>{
    const token=req?.cookies?.accessToken;
   const refresh= req?.cookies?.refreshToken ||req?.header("Authorization")?.replace("bearer ","");
   

})