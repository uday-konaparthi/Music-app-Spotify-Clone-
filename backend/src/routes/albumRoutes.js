import { Router } from "express";
import { getAlbumById, getAllAlbums, getAlbumsByFilter } from "../controllers/albumController.js";

const router = Router();

router.get("/genre", getAlbumsByFilter);     // ✅ Static route first
router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);       // ✅ Dynamic route last

export default router;