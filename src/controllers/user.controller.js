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

  if (!password) {
    throw new ApiError(400, "passwor is required");
  }
  //   -----------------check user is exist Or Not---------------

  const findUser = await user.findOne({
    $or: [{username}, {email}],
  });

  if (findUser) {
    throw new ApiError(400, "user is alredy exists");
  }

  //   add images

  const AvtarImage = req?.files?.avatar[0]?.path;
  const coverAvtarImage = req?.files?.coverImage[0]?.path ||"";

  const uplodedAvtar = await UploadFiles(AvtarImage);
  const uploadCover = await UploadFiles(coverAvtarImage);
  if (!uplodedAvtar) {
    throw new ApiError(400, "avtar is required");
  }

  //    create user

  const ourUser = {
    username: username?.toLowerCase(),
    email: email?.toLowerCase(),
    fullName,
    password,
    avatar: uplodedAvtar.url,
    coverImage: uploadCover.url,
  };

  // crate user

  const addUser = await user.create(ourUser);

  // check user is creted

  if (!addUser) {
    throw new ApiError(500, "internal error user is not created");
  }

  return res.status(200).json(new ApiResponse(200, "user created suceesfully"));
});

export { register };
