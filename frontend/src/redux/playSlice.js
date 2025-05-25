import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlist: [],           // List of all songs
  currentIndex: null,     // Index of currently playing song
  song: null,             // Current song object
  isPlaying: false,
  startAlbum: false,
  volume: 50,
  currentTime: 0,
  coverImg: null
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setSong: (state, action) => {
      state.song = action.payload.song;
      state.currentIndex = action.payload.index;
      state.isPlaying = true; // Automatically start playing when a new song is set
    },
    togglePlayPause: (state) => {
      if (state.song && state.currentIndex !== null) {
        state.isPlaying = !state.isPlaying;
      }
    },
    play: (state) => {
      if (state.song && state.currentIndex !== null) {
        state.isPlaying = true;
      }
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    nextSong: (state) => {
      if (state.currentIndex !== null) {
        if (state.currentIndex < state.playlist.length - 1) {
          state.currentIndex += 1;
        } else {
          // Loop back to the first song
          state.currentIndex = 0;
        }
        state.song = state.playlist[state.currentIndex];
      }
      state.isPlaying = false;
    },
    prevSong: (state) => {
      if (state.currentIndex !== null && state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.song = state.playlist[state.currentIndex];
      }
    },
    setCoverimg: (state, action) => {
      state.coverImg = action.payload.coverImg;
    },
    resetPlay: (state, action) => {
      state.playlist = [],
      state.currentIndex = null,     // Index of currently playing song
      state.song = null,             // Current song object
      state.isPlaying = false,
      state.volume = 50,
      state.currentTime = 0,
      state.coverImg = null
    },
    startAlbum: (state, action) => {
      state.startAlbum = !state.startAlbum;
    }
  },
});

export const {
  setPlaylist,
  setSong,
  togglePlayPause,
  setVolume,
  setCurrentTime,
  nextSong,
  prevSong,
  setCoverimg,
  play,
  pause,
  resetPlay,
  startAlbum
} = musicSlice.actions;

export default musicSlice.reducer;
