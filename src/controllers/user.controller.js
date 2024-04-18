import asyncHandler from "../utils/asyncHandller.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, password, avtar, coverAvtar } = req.body;
  console.log(username);
});

export { register };
