import { Song } from "../models/songSchema.js";
import { Album } from "../models/albumSchema.js";
import cloudinary from '../utils/cloudinary.js';
import * as mm from 'music-metadata';
import fs from 'fs';
import path from 'path';

// helper function for cloudinary uploads
const uploadToCloudinary = async (filePath, resource_type = "auto") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type,
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    const { title, artist, albumId, mood, genre } = req.body;
    const { audioFile } = req.files;

    if (!audioFile) {
      return res.status(400).json({ message: "Please upload an audio file." });
    }

    // Upload audio file to Cloudinary
    const audioUrl = await uploadToCloudinary(audioFile.tempFilePath, "video");

    let imageUrl = null;

    // Extract embedded image from MP3
    const metadata = await mm.parseFile(audioFile.tempFilePath);
    const picture = metadata.common.picture?.[0];
    const durationInSeconds = metadata.format.duration; // in seconds (e.g., 213.56)
    const duration = Math.floor(durationInSeconds); // just round it to integer seconds

    if (picture) {
      const coverPath = path.join(
        path.dirname(audioFile.tempFilePath),
        `cover-${Date.now()}.jpg`
      );
      fs.writeFileSync(coverPath, picture.data); // write image to temp file

      // Upload cover image to Cloudinary
      imageUrl = await uploadToCloudinary(coverPath, "image");

      // Clean up temporary image file
      fs.unlinkSync(coverPath);
    }

    const newSong = new Song({
      title,
      artist,
      audioUrl,
      coverImageUrl: imageUrl,
      duration,
      albumId: albumId || null,
      mood,
      genre,
    });

    await newSong.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: newSong._id },
      });
    }

    res.status(201).json(newSong);
  } catch (error) {
    console.log("Error in createSong:", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) return res.status(404).json({ message: "Song not found" });

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await song.deleteOne();

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong:", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releasedOn, language, genre } = req.body;
    const { imageFile } = req.files;

    if (!imageFile) {
      return res.status(400).json({ message: "Album image is required" });
    }

    const imageUrl = await uploadToCloudinary(imageFile.tempFilePath, "image");

    const newAlbum = new Album({
      title,
      artist,
      imageUrl,
      releasedOn,
      language,
      genre,
      songs: [],
    });

    await newAlbum.save();

    res.status(201).json(newAlbum);
  } catch (error) {
    console.log("Error in createAlbum:", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album and its songs deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum:", error);
    next(error);
  }
};

export const checkAdmin = (req, res) => {
  console.log("→ checkAdmin hit");
  res.json({ success: true, message: "Admin access confirmed" });
};
