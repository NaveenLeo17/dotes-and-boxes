import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCurrentUser,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/me", getCurrentUser);
router.patch("/profile", updateUserProfile);

export default router;
