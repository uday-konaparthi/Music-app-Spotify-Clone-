import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  audioUrl: { type: String, required: true },
  coverImageUrl: { type: String },
  duration: {type: Number, required: true},
  genre: { type: String, required: true },
  mood: { type: String },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" }, // optional
  uploadedAt: { type: Date, default: Date.now }
});

export const Song = mongoose.model("Song", songSchema);

/*const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);*/

