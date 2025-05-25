import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { setPlaylist } from './playSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlists: [], // array of { _id, name, songs: [] }
    currentPlaylist: null, // the selected playlist
    playlistIndex: null,
    playlistSongs: [], // array of { _id, name, songs: [] }
  },
  reducers: {
    addPlaylist: (state, action) => {
      state.playlists.push({
        _id: action.payload._id, // Use _id consistently
        name: action.payload.name,
        songs: [],
      });
    },
    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(p => p._id !== action.payload); // Use _id
      if (state.currentPlaylist?._id === action.payload) {
        state.currentPlaylist = null;
      }
    },
    selectPlaylist: (state, action) => {
      state.currentPlaylist = state.playlists.find(p => p._id === action.payload) || null; // Use _id
    },
    addSongToPlaylist: (state, action) => {
      if (!Array.isArray(state.playlists)) {
        state.playlists = [];  // Reset to an empty array if it's not
      }

      const { playlistId, song } = action.payload;
      const playlist = state.playlists.find((p) => p._id === playlistId);
      if (playlist) {
        playlist.songs.push(song);
      } else {
        console.log('Playlist not found for ID:', playlistId);
      }
    },
    removeSongFromPlaylist: (state, action) => {
      const { playlistId, songId } = action.payload;
      const playlist = state.playlists.find(p => p._id === playlistId); // Use _id
      if (playlist) {
        playlist.songs = playlist.songs.filter(s => s._id !== songId); // Ensure songId is _id
      }
    },
    resetPlaylists: (state, action) => {
      state.playlists = [];
      state.currentPlaylist = null; // Reset current playlist as well
    },
    setplaylist: (state, action) => {
      state.playlists = action.payload;
    },
    playlistIndex: (state, action) => {
      state.playlistIndex = action.payload;
    },
    setPlaylistSongs: (state, action) => {
      state.playlistSongs = action.payload;
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    updatePlaylistName: (state, action) => {
      const { updatedName } = action.payload;
      console.log("currentPlaylist before update:", state.currentPlaylist);
      if (state.currentPlaylist) {
        state.currentPlaylist.name = updatedName;
      }
    },
  },
});

export const {
  addPlaylist,
  deletePlaylist,
  selectPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  resetPlaylists,
  setplaylist,
  playlistIndex,
  setPlaylistSongs,
  setCurrentPlaylist,
  updatePlaylistName
} = playlistSlice.actions;

export default playlistSlice.reducer;

export const fetchPlaylists = () => async (dispatch) => {
  try {
    const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

    const response = await fetch(`${serverURL}/user/songs/playlists/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      dispatch(setplaylist(data.playlists));
    }
  } catch (error) {
    toast.error(error.message || "Failed to fetch playlists");
  }
};

export const fetchPlaylistsSongs = (playlistId) => async (dispatch) => {
  try {
    const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

    const response = await fetch(`${serverURL}/user/songs/playlists/songs/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ playlistId: playlistId })
    });

    const data = await response.json();

    if (response.ok) {
      // if data is a single playlist object, do this:
      //dispatch(setCurrentPlaylist(data));
      dispatch(setPlaylistSongs(data))
      // If you want to keep playlistSongs in sync, 
      // either fetch all playlists separately or update playlistSongs accordingly.
    }
  } catch (error) {
    toast.error(error.message || "Failed to fetch songs in playlists");
    console.log(error);
  }
}

export const changePlaylistName = (ind, updatedName) => async (dispatch) => {
  try {
    const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;
    console.log(ind, updatedName)
    const response = await fetch(`${serverURL}/user/songs/playlists/name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ind,
        updatedName
      })
    });

    const data = await response.json();
    console.log(data)
    if (response.ok) {
      dispatch(fetchPlaylists())
      dispatch(fetchPlaylistsSongs(data.playlist._id))
    }
  } catch (error) {
    toast.error(error.message || "Failed to change playlist name");
    console.log(error)
  }
}
