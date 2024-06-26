import asyncHandler from "../utils/asyncHandller.js";
import ApiError from "../utils/ApiError.js";
import { user } from "../model/user.model.js";
import UploadFiles from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
  try {
    const currentUser = await user.findById(userId);
    const accessToken = await currentUser.generateAccessToken();
    const refreshToken = await currentUser.generateRefreshToken();
    currentUser.refreshToken = refreshToken;
    await currentUser.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "tokens not generated");
  }
};

const register = asyncHandler(async (req, res) => {
  const { username, email, fullName, avatar, coverImage, password } = req.body;

  //   check all fields
  if (
    [username, email, password, fullName].some((fields) => fields?.trim() == "")
  ) {
    throw new ApiError(400, "all fields are is required");
  }

  //   -----------------check user is exist Or Not---------------

  const findUser = await user.findOne({
    $or: [{ username }, { email }],
  });

  if (findUser) {
    throw new ApiError(400, "user is alredy exists");
  }

  //   add images

  const uploadAvatarImage = req?.files?.avatar[0].path;
  const uploadCoverImage = req?.files?.coverImage[0].path || "";

  const filesavtar = await UploadFiles(uploadAvatarImage);
  const fileCover = await UploadFiles(uploadCoverImage);
  if (!filesavtar) {
    throw new ApiError(400, "avtar is required");
  }

  const newUser = {
    username,
    fullName,
    email,
    password,
    avatar: filesavtar.url,
    coverImage: fileCover.url,
  };

  const addUser = await user.create(newUser);
  if (!addUser) {
    throw new ApiError(500, "user is not created");
  }

  res.status(200).json(new ApiResponse(200, "user created sucessfully"));
});

const logIn = asyncHandler(async (req, res) => {
  // get data

  const { username, email, password } = req.body;

  //  check user exist or not

  const checkUserExistance = await user.findOne({
    $or: [{ username }, { email }],
  });

  if (!checkUserExistance) {
    throw new ApiError(401, "user not found check your email or username");
  }

  // compare password

  const checkPassword = await checkUserExistance.comparePassword(password);
  if (!checkPassword) {
    throw new ApiError(400, "wrong password");
  }

  const { accessToken, refreshToken } = await generateTokens(
    checkUserExistance._id
  );

  const loggedInUser = await user
    .findById(checkUserExistance._id)
    .select("-password -refreshToken");

  const httpOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, httpOptions)
    .cookie("refreshToken", refreshToken, httpOptions)
    .json(
      new ApiResponse(200, "user login sucessfully", {
        ourUser: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logout = asyncHandler(async (req, res) => {
  const findedUser = req.newUser._id;
  await user.findByIdAndUpdate(
    findedUser,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const httpOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", httpOptions)
    .clearCookie("refreshToken", httpOptions)
    .json(new ApiResponse(200, "log out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefresh = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefresh) {
    throw new ApiError(
      401,
      "invalid not found refresh token or un authorized request"
    );
  }

  try {
    const decodedToken = await jwt.verify(
      incomingRefresh,
      process.env.REFRESH_TOKEN
    );
  
    const currentUser = await user.findById(decodedToken._id);
    if (!currentUser) {
      throw new ApiError(400, "invalid access token");
    }
  
    if(incomingRefresh!=currentUser.refreshToken){
      throw new ApiError(400,"invalid refresh token is not valid or incorrect")
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,refreshToken}=await generateTokens(currentUser._id);
  
    return res.status(200).json(
      new ApiResponse(200,"new access token is generated",{
        data:{
          newAccessToken:accessToken,
          newRefreshToken:refreshToken
      
        }
  
      }
        
      ).cookie("")
    )
  } catch (error) {
    
  }
});

export { register, logIn, logout, refreshAccessToken };
