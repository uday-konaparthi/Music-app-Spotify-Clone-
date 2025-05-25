import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likedSongs: [], // array of song ids
};

const likedSongsSlice = createSlice({
  name: 'likedSongs',
  initialState,
  reducers: {
    likeSong: (state, action) => {
      const song = action.payload.songId; // 🛠 picking songId from payload
      const alreadyLiked = state.likedSongs.some((s) => s.id === song._id);
      if (!alreadyLiked) {
        state.likedSongs.push(song._id);
      }
    },
    unlikeSong: (state, action) => {
      const song = action.payload.songId; // 🛠 picking songId from payload
      state.likedSongs = state.likedSongs.filter((id) => id !== song._id);
    },
    setLikedSongs: (state, action) => {
      state.likedSongs = action.payload; // for localStorage/server loading
    },
    resetLikedSongs: (state) => {
      state.likedSongs = [];
    }
  },
});

export const { likeSong, unlikeSong, setLikedSongs, resetLikedSongs } = likedSongsSlice.actions;
export default likedSongsSlice.reducer;

export const fetchLikedSongs = () => async (dispatch) => {
  try {
    const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

    const response = await fetch(`${serverURL}/user/songs/liked/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      dispatch(setLikedSongs(data.likedSongs));
    } else {
      console.error("Error fetching liked songs");
    }
  } catch (error) {
    console.error("Fetch liked songs failed:", error.message);
  }
};