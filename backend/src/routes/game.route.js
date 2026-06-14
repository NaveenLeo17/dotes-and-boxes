import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getGamesHistory, saveGame } from "../controllers/game.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/", saveGame);
router.get("/history", getGamesHistory);

export default router;
