import { Router } from "express";
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from "../controllers/adminController.js";
import {
  protectRoute,
  requireAdmin,
} from "../middleware/protectedRoute.js";

const router = Router();

// Protect all routes under /admin
//router.use(protectRoute, requireAdmin);

// Admin test route
router.get("/check", checkAdmin);

// Song routes
router.post("/songs", protectRoute, requireAdmin, createSong);
router.delete("/songs/:id", protectRoute, requireAdmin,  deleteSong);

// Album routes
router.post("/albums", protectRoute, requireAdmin,  createAlbum);
router.delete("/albums/:id", protectRoute, requireAdmin,  deleteAlbum);

export default router;
