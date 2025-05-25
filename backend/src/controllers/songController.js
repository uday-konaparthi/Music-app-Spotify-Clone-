import User from "../models/userSchema.js";
import { Song } from "../models/songSchema.js";


export const handleGetAllSongs = async (req, res, next) => {
	try {
		const songs = await Song.find();
		res.status(200).json(songs);
	} catch (error) {
		console.error("Error in handleLike:", error);
    res.status(500).json({ message: "Server error" });
	}
};

/* ----------------------------- LIKES ----------------------------- */

export const handleLike = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isAlreadyLiked = user.likedSongs.includes(songId);

    user.likedSongs = isAlreadyLiked
      ? user.likedSongs.filter(id => id.toString() !== songId)
      : [...user.likedSongs, songId];

    await user.save();

    res.status(200).json({
      message: isAlreadyLiked ? "Song unliked" : "Song liked",
      likedSongs: user.likedSongs,
    });

  } catch (error) {
    console.error("Error in handleLike:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const handlefetchLikedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const likedSongs = await Promise.all(
      user.likedSongs.map(async (id) => {
        const song = await Song.findById(id);
        if (!song) throw new Error(`Song with id ${id} not found`);
        return song;
      })
    );

    res.status(200).json({ likedSongs });

  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/* --------------------------- PLAYLISTS --------------------------- */

export const handleCreatePlaylist = async (req, res) => {
  try {
    const { playlistName } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.playlists.push({ name: playlistName, songs: [] });
    await user.save();

    res.status(200).json({
      message: "Playlist created successfully",
      playlists: user.playlists,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const handleAddtoPlaylist = async (req, res) => {
  try {
    const { playlistName, song } = req.body;
    const playListId = req.params.playListId;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let playlistFound = false;
    user.playlists.forEach((item) => {
      if (item._id.toString() === playListId) {
        item.songs.push(song);
        playlistFound = true;
      }
    });

    if (!playlistFound) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    await user.save();
    res.status(200).json({ message: "Song added to playlist successfully" });

  } catch (error) {
    console.error("Error adding to playlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const handlefetchPlaylists = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ playlists: user.playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const handlefetchPlaylistsSongs = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const playlist = user.playlists.find(p => p._id.toString() === playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    const songs = await Promise.all(
      playlist.songs.map(async (songId) => {
        const song = await Song.findById(songId);
        if (!song) throw new Error(`Song with id ${songId} not found`);
        return song;
      })
    );

    res.status(200).json({ songs, name: playlist.name });

  } catch (error) {
    console.error("Error fetching playlist songs:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/* ----------------------------- RECENTS ----------------------------- */

export const handleAddRecents = async (req, res) => {
  try {
    const { songId } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.recents = user.recents.filter(id => id !== songId);
    user.recents.unshift(songId);
    if (user.recents.length > 20) user.recents.pop();

    await user.save();
    res.status(201).json({ message: "Added to recents" });

  } catch (error) {
    console.error("Error adding to recents:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/* ----------------------- GET RECENTS SONGS ----------------------- */


export const handlefetchRecents = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recentSongs = await Song.find({ _id: { $in: user.recents } });
    if (!recentSongs.length) {
      return res.status(200).json({ message: "No recent songs found" });
    }

    res.status(200).json({ recents: recentSongs });

  } catch (error) {
    console.error("Error fetching recents:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------------------- SEARCH ----------------------------- */

export const handleSearch = async (req, res) => {
  try {
    const { value: inputVal } = req.body;

    const SongList = await Song.find({
      title: { $regex: inputVal, $options: "i" },
    });

    if (!SongList.length) {
      return res.status(200).json({ message: "No songs found" });
    }

    res.status(200).json({ SongList });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------------- GET SONG BY ID ----------------------- */

export const handleGetSongById = async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ message: "Song ID is required" });
    console.log(songId)

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    res.status(200).json({ song });

  } catch (error) {
    console.error("Get song by ID error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/* ----------------------- GET SONG BY SONG ID USING QUERY ----------------------- */

export const handleGetSong = async (req, res) => {
  try {
    const { songId } = req.query;
    if (!songId) return res.status(400).json({ message: "Song ID is required" });

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    res.status(200).json({ song });

  } catch (error) {
    console.error("Get song by ID error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/* ----------------------- GET SONG BY FILTER ----------------------- */


export const getSongsByFilter = async (req, res) => {
  try {
    const { genre, language } = req.query;

    const filter = {};
    if (genre) {
      filter.genre = { $regex: new RegExp(genre, "i") }; // case-insensitive
    }
    if (language) {
      filter.language = { $regex: new RegExp(language, "i") };
    }

    const songs = await Song.find(filter);

    res.status(200).json(songs);
  } catch (error) {
    console.error("Error fetching songs by filter:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ----------------------- CHANGING PLAYLIST NAME  ----------------------- */


export const handleEditPlaylistName = async (req, res) => {
  try {
    const {ind, updatedName} = req.body;
    const userId = req.userId;

    if(!ind || !updatedName){
      return res.status(400).json({message: "ind or updatedName is missing"})
    }

    const user = await User.findById(userId)

    const playlist = user.playlists[ind];
    playlist.name = updatedName;

    await user.save();
    res.status(200).json({playlist})
  } catch (error) {
    console.error("Error changing Name", error);
    res.status(500).json({ error: error.message });
  }
}