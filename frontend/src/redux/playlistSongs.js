import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const playlistSongsSlice = createSlice({
  name: 'playlistSongs',
  initialState: {
    playlistSongs: [], // array of { _id, name, songs: [] }
    currentPlaylist: null, // the selected playlist
  },
  reducers: {
    
  },
});

export const { setPlaylistSongs, setCurrentPlaylist, updatePlaylistName } = playlistSongsSlice.actions;
export default playlistSongsSlice.reducer;

