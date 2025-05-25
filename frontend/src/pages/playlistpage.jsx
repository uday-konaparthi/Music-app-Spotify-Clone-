import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, SquarePen } from "lucide-react";
import { setPlaylist, setSong, togglePlayPause } from "../redux/playSlice";
import MusicWave from "../utils/musicWave";
import SearchPage from "./searchPage";
import { changePlaylistName } from "../redux/playlistSlice";

const PlayListPage = () => {
  const dispatch = useDispatch();
  const playlist = useSelector((state) => state.playlist.playlistSongs);
  const ind = useSelector((state) => state.playlist.playlistIndex);
  const playingSong = useSelector((state) => state.music.song);
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const queryStatus = useSelector((state) => state.search.query);

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
    return `${mins < 10 ? "0" : ""}${mins} mins ${secs < 10 ? "0" : ""}${secs} secs`;
  };

  const albumDuration = useMemo(() => {
    if (!playlist?.songs || playlist.songs.length === 0) return "00:00";
    const totalSeconds = playlist.songs.reduce(
      (acc, curr) => acc + (curr.duration || 0),
      0
    );
    return formatAlbumDuration(totalSeconds);
  }, [playlist?.songs]);

  const handleClick = (song, index) => {
    const isSameSong = playingSong?._id === song._id;
    const wasPlaying = isPlaying;

    dispatch(setPlaylist(playlist?.songs));
    dispatch(setSong({ song, index }));

    if (!isSameSong || !wasPlaying) {
      dispatch(togglePlayPause());
    }
  };

  const editPlayListName = (ind) => {
    const updatedName = prompt("Enter new playlist name:");
    if (updatedName && updatedName.trim() !== "") {
      dispatch(changePlaylistName(ind, updatedName));
    }
  };

  return (
    <div className="max-h-[78vh] min-h-[78vh] sm:max-h-[76vh] sm:min-h-[76vh] overflow-auto my-3 rounded-xl py-6 px-3 md:px-6 text-white bg-base-100 shadow-lg space-y-4">
      {queryStatus ? (
        <SearchPage />
      ) : (
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start md:items-end">
              <img
                className="rounded-xl w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-cover shadow-md"
                src={playlist?.songs?.[0]?.coverImageUrl || "/assets/frontend-assets/playlist-svgrepo-com.svg"}
                alt="Album Cover"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-4xl font-bold truncate max-w-xs md:max-w-full">
                    {playlist?.name || "Playlist"}
                  </h1>
                  <SquarePen
                    className="size-6 md:size-8 cursor-pointer hover:text-pink-500 transition-colors"
                    onClick={() => editPlayListName(ind)}
                  />
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {playlist?.songs?.length || 0} Songs
                  <span className="mx-1 text-white font-semibold">•</span>
                  {albumDuration}
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div
              onClick={() =>
                playingSong?._id === playlist?.songs?.[0]?._id
                  ? dispatch(setSong(null))
                  : handleClick(playlist?.songs?.[0], 0)
              }
              className="cursor-pointer"
            >
              <img
                src="/assets/frontend-assets/play.png"
                alt="Play"
                className="invert size-10 md:size-12 p-3 rounded-full bg-pink-500 hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 text-gray-400 text-xs md:text-sm font-medium border-b border-gray-700 pb-2 px-2 md:px-4 uppercase tracking-wide">
            <span className="col-span-1">#</span>
            <span className="col-span-5">Title</span>
            <span className="col-span-4">Artist</span>
            <span className="col-span-2 text-right">
              <img
                className="size-4 inline-block mr-1"
                src="/assets/frontend-assets/clock_icon.png"
                alt="Duration"
              />
            </span>
          </div>

          {/* Songs List */}
          {playlist?.songs?.map((song, index) => (
            <div
              key={song._id || index}
              onClick={() => handleClick(song, index)}
              className={`grid grid-cols-12 items-center gap-2 px-2 md:px-4 py-3 rounded-lg cursor-pointer transition-all group hover:bg-base-300 ${
                playingSong?._id === song._id ? "bg-base-300" : ""
              }`}
            >
              <div className="col-span-1 text-center text-sm text-gray-400 group-hover:hidden">
                {index + 1}
              </div>
              <div className="col-span-1 hidden group-hover:flex justify-center">
                {playingSong?._id === song._id ? (
                  <MusicWave />
                ) : (
                  <Play size={18} className="text-green-500" />
                )}
              </div>
              <div className="col-span-5 truncate">
                <p className="text-white text-sm md:text-base font-medium truncate">{song.title}</p>
              </div>
              <div className="col-span-4 text-gray-300 text-sm md:text-base truncate">
                {song.artist}
              </div>
              <div className="col-span-2 text-right text-gray-400 text-sm md:text-base truncate">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PlayListPage;
