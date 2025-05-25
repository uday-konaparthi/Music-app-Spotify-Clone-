import { setAlbums, setSongs } from "../redux/totalCollectionSlice";
const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

// Helper to fetch albums by genre
export const fetchAlbums = async (dispatch, genre) => {
  try {
    const response = await fetch(
      `${serverURL}/user/albums/genre?language=telugu&genre=${genre}`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch albums collection:", error);
  }
};

// Helper to fetch songs by genre
export const fetchSong = async (dispatch, genre) => {
  try {
    const response = await fetch(
      `${serverURL}/user/songs/genre?genre=${genre}`,
      {
        credentials: "include",
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch songs collection:", error);
  }
};

// Fetch all albums
export const fetchAllAlbums = async (dispatch) => {
  try {
    const response = await fetch(`${serverURL}/user/albums/`, {
      credentials: "include",
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    dispatch(setAlbums(data));
  } catch (error) {
    console.error("Failed to fetch albums collection:", error);
  }
};


// Fetch all albums
export const fetchAllSongs = async (dispatch) => {
  try {
    const response = await fetch(`${serverURL}/user/songs/`, {//user/songs/liked/
      credentials: "include",
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    dispatch(setSongs(data));
  } catch (error) {
    console.error("Failed to fetch albums collection:", error);
  }
};

// Helper to get featured albums (pass albums from component or selector)
export const featuredAlbums = (allAlbums) => {
  return getRandomSubset(allAlbums, 8);
};

// Helper to pick a random subset of albums
export const getRandomSubset = (arr, count) => {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getNewReleases = (allAlbums) => {
  return [...allAlbums]
    .sort((a, b) => new Date(b.releasedOn) - new Date(a.releasedOn))
    .slice(0, 8);
};

export const getPopSongs = (SongsList) => {
  const filteredSongs = SongsList.filter(
    song => ["pop"].includes(song.genre?.toLowerCase())
  );

  // Shuffle using Fisher-Yates algorithm
  for (let i = filteredSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredSongs[i], filteredSongs[j]] = [filteredSongs[j], filteredSongs[i]];
  }

  return filteredSongs.slice(0, 8);
};

export const getHindiAlbums = (allAlbums) => {
  return [...allAlbums] // copy before filter + sort
    .filter(album => ["hindi"].includes(album.language?.toLowerCase()))
    .sort((a, b) => new Date(b.releasedOn) - new Date(a.releasedOn))
    .slice(0, 8);
};


