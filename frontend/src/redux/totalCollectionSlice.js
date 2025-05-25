import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalAlbums: [],
  totalSongs: [],
  loveAlbums: [],
  loveSongs: [],
  sadSongs: [],
  dramaAlbums: [],
  dramaSongs: [],
  actionAlbums: [],
  actionSongs: [],
  popAlbums: [],
  popSongs: [],
};

const totalAlbumsSlice = createSlice({
  name: 'totalAlbums',
  initialState,
  reducers: {
    
    setAlbums: (state, action) => {
      // Replace the entire totalAlbums array immutably
      state.totalAlbums = action.payload;
    },

    resetAlbum: (state) => {
      // Clear the entire totalAlbums array while User Logs out
      state.totalAlbums = [];
    },

    setSongs:  (state, action) => {
      // Replace the entire totalAlbums array immutably
      state.totalSongs = action.payload;
    },
  },
});

export const {
  setAlbums,
  resetAlbum,
  setSongs
} = totalAlbumsSlice.actions;

export default totalAlbumsSlice.reducer;
