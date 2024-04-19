import { Router } from "express";
import { logIn, logout, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  register
);
router.route("/login").post(logIn);

// secure routes 

router.route("/logout").post(authMiddleware,logout)


export default router;
