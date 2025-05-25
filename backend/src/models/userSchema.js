import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  recents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  playlists: [
    {
      name: { type: String, required: true },
      songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }]
    }
  ],

  isAdmin: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);

/*
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "user" },
  profilePic: { type: String },
  likedSongs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
  playlists: [{
    name: String,
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
  },
  ],
  recents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    }
  ]
});

export default mongoose.model('User', userSchema);*/
