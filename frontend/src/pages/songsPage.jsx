import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight, EllipsisVertical, Play } from "lucide-react";
import {
  setPlaylist,
  setSong,
  togglePlayPause,
  setCoverimg,
} from "../redux/playSlice";
import MusicWave from "../utils/musicWave";
import SearchPage from "./searchPage";
import { addPlaylist, addSongToPlaylist } from "../redux/playlistSlice";
import toast from "react-hot-toast";
const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;
import { startAlbum } from "../redux/playSlice";

const SongsPage = () => {
  const songs = useSelector((state) => state.songsByAlbumid.songsByAlbumid);
  const playingSong = useSelector((state) => state.music.song);
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const queryStatus = useSelector((state) => state.search.query);
  const start_album = useSelector((state) => state.music.startAlbum);
  const playlist = useSelector((state) => state.playlist?.playlists || []);

  const isLoading =
    !songs || (Array.isArray(songs?.songs) && songs.songs.length === 0);

  const dispatch = useDispatch();

  const songList = useMemo(() => {
    if (Array.isArray(songs)) return songs;
    if (songs && Array.isArray(songs.songs)) return songs.songs;
    if (songs && typeof songs === "object") return [songs];
    return [];
  }, [songs]);

  const formatDuration = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatAlbumDuration = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins} mins ${
      secs < 10 ? "0" : ""
    }${secs} secs`;
  };

  const albumDuration = useMemo(() => {
    let totalSeconds = songList.reduce(
      (acc, curr) => acc + (curr.duration || 0),
      0
    );
    return formatAlbumDuration(totalSeconds);
  }, [songList]);

  const handleClick = (song, index) => {
    const isSameSong = playingSong?._id === song._id;
    dispatch(setPlaylist(songList));
    dispatch(setSong({ song, index }));
    if (!isSameSong || !isPlaying) {
      dispatch(togglePlayPause());
    }
    dispatch(setCoverimg({ coverImg: songs?.imageUrl }));
  };

  const handlePlaylist = async (playlistId, playlistName, song) => {
    if (!song) return;
    console.log(playlistId, playlistName, song)
    try {
      const res = await fetch(
        `${serverURL}/user/songs/playlist/add/${playlistId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ playlistName, song }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(addSongToPlaylist({ playlistId, song }));
        toast.success("Added to playlist");
      } else {
        toast.error(data.message || "Failed to add to playlist");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleCreatePlaylist = async (song) => {
    try {
      const res = await fetch(`${serverURL}/user/songs/playlist/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ playlistName: "playlist", song: song }),
      });

      const data = await res.json();
      if (res.ok) {
        const newPlaylist = data.playlists.at(-1);
        dispatch(addPlaylist({ name: newPlaylist.name, _id: newPlaylist._id }));
        toast.success("Playlist created");
      } else {
        toast.error(data.message || "Failed to create playlist.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating playlist:", error);
    }
  };

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const options = { year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  if (queryStatus) return <SearchPage />;

  const albumTitle = songs?.title || songs?.song?.title || "Album";
  let albumYear = formatDate(songs?.releasedOn) || "";
  const albumArtist = songs?.artist || "";
  const albumImage = songs?.imageUrl || songs?.coverImageUrl;

  if (albumYear === "Invalid Date") {
    albumYear = "";
  }

  useEffect(() => {
    if (start_album && songList.length > 0) {
      handleClick(songList[0], 0);
      dispatch(startAlbum());
    }
  }, [start_album, songList]);

  return (
    <div className="sm:max-h-[76vh] sm:min-h-[76vh] max-h-[78vh] min-h-[78vh] overflow-auto my-3 rounded-md py-6 px-3 md:px-6 text-white bg-base-100 space-y-4">
      {/* Album Header */}
      {isLoading ? (
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 animate-pulse mx-5 mb-6">
          <div className="rounded-md w-44 h-44 bg-base-300" />
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <div className="h-6 w-64 bg-base-300 rounded mx-auto sm:mx-0" />
            <div className="h-4 w-40 bg-base-300 rounded mx-auto sm:mx-0" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between md:items-end my-3 mx-3 gap-3 mb-8 group relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <img
              className="rounded-md w-40 h-40 sm:w-44 sm:h-44 object-fill"
              src={albumImage}
              alt="album image"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 text-white">
                {albumTitle} {albumYear ? "-" : ""} {albumYear}
              </h1>
              <div className="text-gray-400 text-xs sm:text-sm">
                <span className="text-lg sm:text-xl text-white font-semibold text-center">
                  {albumArtist} •{" "}
                </span>
                {songList.length} {songList.length > 1 ? "Songs" : "Song"}{" "}
                <span className="text-lg sm:text-xl text-white font-semibold">
                  •
                </span>{" "}
                {albumDuration}
              </div>
            </div>
          </div>

          {songList.length > 0 && (
            <div
              onClick={() => handleClick(songList[0], 0)}
              className="cursor-pointer mt-4 md:mt-0 mx-auto md:mx-0 absolute bottom-1 right-5 opacity-100 transition-all duration-500 ease-in-out group-hover:bottom-5 group-hover:opacity-100 lg:opacity-100 lg:static"
            >
              <img
                src="./assets/frontend-assets/play.png"
                alt="play icon"
                className="size-12 invert p-3 bg-pink-500 rounded-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-12 text-gray-400 text-sm border-b border-gray-700 pb-2 mb-4 pl-5 sm:pl-10 mx-4">
        <span className="col-span-1">#</span>
        <span className="col-span-5">Title</span>
        <span className="col-span-4">Artist</span>
        <span className="col-span-2 text-right">
          <img
            className="size-4"
            src="./assets/frontend-assets/clock_icon.png"
            alt="duration"
          />
        </span>
      </div>

      {/* Song Rows */}
      {isLoading
        ? [...Array(5)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center gap-2 py-3 px-2 mr-4 sm:mr-8 mx-2 sm:mx-4 animate-pulse"
            >
              <div className="col-span-1 bg-base-300 rounded h-4 w-4 mx-auto" />
              <div className="col-span-5 bg-base-300 h-4 rounded w-3/4" />
              <div className="col-span-4 bg-base-300 h-4 rounded w-2/3" />
              <div className="col-span-2 flex justify-end">
                <div className="bg-base-300 h-4 w-10 rounded" />
              </div>
            </div>
          ))
        : songList.map((song, index) => (
            <div
              key={song._id}
              onClick={() => handleClick(song, index)}
              className={`grid grid-cols-12 items-center gap-2 py-3 px-2 mr-4 sm:mr-8 hover:bg-base-300 group rounded-md transition-all cursor-pointer mx-2 sm:mx-4 ${
                playingSong?._id === song._id ? "bg-base-300" : ""
              }`}
            >
              <div className="col-span-1 text-center text-gray-400 group-hover:hidden">
                {index + 1}
              </div>
              <div className="col-span-1 hidden group-hover:flex justify-center items-center">
                {playingSong?._id === song._id ? (
                  <MusicWave className="text-red-500" />
                ) : (
                  <Play size={18} className="text-green-500" />
                )}
              </div>
              <div className="col-span-5">
                <p className="text-white font-medium text-sm sm:text-base">
                  {song.title}
                </p>
              </div>
              <div className="col-span-4 text-gray-300 text-xs sm:text-base">
                {song.artist}
              </div>

              <div className="col-span-1 text-right text-gray-400 flex gap-[80%] items-center text-xs sm:text-base">
                <div className="flex items-center gap-2 md:gap-4 dropdown dropdown-bottom group">
                  {formatDuration(song.duration || song.song?.duration)}

                  <img
                    src="assets/frontend-assets/playlist-svgrepo-com.svg"
                    tabIndex={0}
                    role="button"
                    className="hidden group-hover:flex sm:size-6 size-4 invert rounded-full"
                  />

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <li onClick={() => handleCreatePlaylist(song)}>
                      <a>
                        Create New Playlist <ChevronRight className="size-4" />{" "}
                      </a>
                    </li>
                    {playlist?.map((playlistName, index) => (
                      <li
                        key={index || playlistName._id}
                        onClick={() =>
                          handlePlaylist(playlistName._id, playlistName.name, song)
                        }
                      >
                        <a>{playlistName.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

      {/* Footer */}
      {!isLoading && (
        <div className="px-4 sm:px-8 mt-10 text-center sm:text-left text-gray-400">
          {albumYear !== "" ? `${albumTitle} @ ${albumYear}` : ``}
        </div>
      )}
    </div>
  );
};

export default SongsPage; 