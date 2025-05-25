import { Router } from "express";
import {protectRoute} from "../middleware/protectedRoute.js";
import  {handleLike, handleGetAllSongs, handleAddtoPlaylist, handleCreatePlaylist, handlefetchPlaylists, handlefetchLikedSongs, handlefetchRecents, handleAddRecents, handlefetchPlaylistsSongs, handleSearch, handleGetSongById, handleGetSong, getSongsByFilter, handleEditPlaylistName} from "../controllers/songController.js";

const router = Router();
///user/songs/liked/get
router.get("/", handleGetAllSongs)

router.put("/like", protectRoute, handleLike);
router.post('/playlist/create', protectRoute, handleCreatePlaylist)

router.post('/playlist/add/:playListId', protectRoute, handleAddtoPlaylist)
router.post('/recents/add', protectRoute, handleAddRecents)

router.get('/playlists/get', protectRoute, handlefetchPlaylists)
router.post('/playlists/songs/get', protectRoute, handlefetchPlaylistsSongs)
router.post('/playlists/name',protectRoute, handleEditPlaylistName)

router.get('/liked/get', protectRoute, handlefetchLikedSongs)
router.get('/recents/get', protectRoute, handlefetchRecents);

router.post('/search', handleSearch);
router.post('/getById', handleGetSongById);

router.get('/genre', getSongsByFilter)
router.get('/song', handleGetSong)

export default router;