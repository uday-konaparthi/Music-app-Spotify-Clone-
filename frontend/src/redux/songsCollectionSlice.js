// src/redux/slices/totalCollectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  songsByAlbumid: [],
};

const songsByAlbumidSlice = createSlice({
  name: 'songsByAlbumid',
  initialState,
  reducers: {
    setCollection: (state, action) => {
      state.songsByAlbumid = action.payload;
    },
    addToCollection: (state, action) => {
      state.songsByAlbumid.push(action.payload);
    },
    clearCollection: (state) => {
      state.songsByAlbumid = [];
    },
  },
});

export const { setCollection, addToCollection, clearCollection } = songsByAlbumidSlice.actions;
export default songsByAlbumidSlice.reducer;
