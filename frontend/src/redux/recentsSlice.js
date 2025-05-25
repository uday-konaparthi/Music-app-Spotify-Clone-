import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

const recentsSlice = createSlice({
  name: 'recents',
  initialState: {
    recents: [], // array of recently played songs
  },
  reducers: {
    setRecents: (state, action) => {
      state.recents = Array.isArray(action.payload) ? action.payload : [];
    },
    addRecentSong: (state, action) => {
      const newSong = action.payload;
      if (!newSong || !newSong._id) return;

      // SAFETY CHECK
      if (!Array.isArray(state.recents)) {
        state.recents = [];
      }

      // Remove if already exists
      state.recents = state.recents.filter(song => song._id !== newSong._id);

      // Add at top
      state.recents.unshift(newSong);

      // Keep only latest 20
      if (state.recents.length > 10) {
        state.recents.pop();
      }
    },
    resetRecents: (state, action) => {
      state.recents = []
    }
  }
});

// Thunk function to fetch recents from the server
export const fetchRecents = () => async (dispatch) => {
  try {
    const response = await fetch(`${serverURL}/user/songs/recents/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log("FETCHED RECENTS FROM SERVER:", data);

    if (response.ok) {
      const recentSongs = Array.isArray(data.recents) ? data.recents : [];
      
      // Only update if not empty
      if (recentSongs.length > 0) {
        dispatch(setRecents(recentSongs));
      } else {
        console.warn("Empty recents received from server – skipping update.");
      }

    } else {
      toast.error(data?.message || "Failed to fetch recents");
    }
  } catch (error) {
    console.error("Network error while fetching recents:", error);
    toast.error(error.message || "Failed to fetch recents");
  }
};

export const { setRecents, addRecentSong, resetRecents } = recentsSlice.actions;

export default recentsSlice.reducer;
