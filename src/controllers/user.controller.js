import asyncHandler from "../utils/asyncHandller.js";
import ApiError from "../utils/ApiError.js";
import { user } from "../model/user.model.js";
import UploadFiles from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, fullName, avatar, coverImage, password } = req.body;

  //   check all fields
  if (
    [username, email, password, fullName].some((fields) => fields?.trim() == "")
  ) {
    throw new ApiError(400, "all fields are is required");
  }
  console.log(password);

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

  res.status(200).json(
    new ApiResponse(200, "user created sucessfully")
  )
});

export { register };
