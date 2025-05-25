import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  VolumeX,
  Volume2,
  Heart,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePlayPause,
  setCurrentTime,
  nextSong,
  prevSong,
  play,
  pause,
} from "../redux/playSlice";
import {
  fetchLikedSongs,
  likeSong,
  unlikeSong,
} from "../redux/likedSongsSlice";
import toast from "react-hot-toast";
const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;
import { addPlaylist, addSongToPlaylist } from "../redux/playlistSlice";
import { addRecentSong, setRecents } from "../redux/recentsSlice";

const MusicBar = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(new Audio());
  const debounceTimeout = useRef(null);

  const currentAlbum = useSelector((state) => state.music.playlist.length);
  const currentIndex = useSelector((state) => state.music.currentIndex);
  const playingSong = useSelector((state) => state.music.song);
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const coverImg = useSelector((state) => state.music.coverImg);
  const playlist = useSelector((state) => state.playlist?.playlists || []);
  const likedSongs = useSelector((state) => state.likedSongs.likedSongs || []);
  const recents = useSelector((state) => state.recents.recents);

  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDuration] = useState(0);

  const isLiked = likedSongs?.some((song) => song._id === playingSong?._id);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTimeState(seekTime);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      audioRef.current.muted = !prev;
      return !prev;
    });
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
    const mute = newVolume == 0;
    setIsMuted(mute);
    audioRef.current.muted = mute;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (!isPlaying) {
      audio
        .play()
        .then(() => dispatch(play())) // ✅ music is playing, so dispatch play
        .catch(() => toast.error("Autoplay was blocked. Try clicking again."));
    } else {
      audio.pause();
      dispatch(pause()); // ✅ music is paused, so dispatch pause
    }
  };

  const handleLike = async (song) => {
    if (!song?._id) return;

    try {
      const endpoint = `${serverURL}/user/songs/like`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ songId: song._id }),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(fetchLikedSongs());
        if (isLiked) {
          dispatch(unlikeSong({ songId: song }));
          toast.success("Removed from liked songs");
        } else {
          dispatch(likeSong({ songId: song }));
          toast.success("Added to liked songs");
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const updateTime = () => {
    setCurrentTimeState(audioRef.current.currentTime);
    dispatch(setCurrentTime(audioRef.current.currentTime));
  };

  const setMetaData = () => setDuration(audioRef.current.duration);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMetaData);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMetaData);
    };
  }, []);

  useEffect(() => {
    if (!playingSong) return;

    const audio = audioRef.current;
    audio.src = playingSong.audioUrl || "";
    audio.load();

    audio
      .play()
      .then(() => dispatch(togglePlayPause()))
      .catch(() => toast.error("Autoplay blocked."));

    dispatch(addRecentSong(playingSong));
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    /*debounceTimeout.current = setTimeout(() => {
      dispatch(setRecents(playingSong));
    }, 500);*/

    audio.onended = () => dispatch(nextSong());
  }, [playingSong]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (!isPlaying) {
      dispatch(togglePlayPause());
    }
  }, [progressPercent]);

  return (
    <div className="fixed bottom-0 w-full bg-zinc-900 px-1 py-1 sm:px-4 sm:py-3 text-white border-t border-zinc-800">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Song Info */}
        <div className="hidden sm:flex items-center gap-4 overflow-hidden">
          <img
            src={
              playingSong?.coverImageUrl ||
              coverImg ||
              "./assets/admin-assets/song_icon.png"
            }
            alt="Cover"
            className="w-12 h-12 rounded shadow-md object-cover"
          />
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold truncate max-w-[140px]">
              {playingSong?.title || "Album Title"}
            </h1>
            <p className="text-xs text-gray-400">
              {playingSong?.artist || "Unknown Artist"}
            </p>
          </div>
          <div
            className="cursor-pointer"
            title="Like"
            onClick={() => handleLike(playingSong)}
          >
            {isLiked ? (
              <Heart className="w-5 h-5 text-red-500 fill-red-500 transition" />
            ) : (
              <Heart className="w-5 h-5 hover:text-red-500 transition" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="hidden sm:flex flex-col justify-center items-center w-full px-2">
          <div className="flex items-center gap-6 justify-center">
            <SkipBack
              className={` w-5 h-5 sm:w-6 sm:h-6 hover:text-gray-400 transition ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                if (currentIndex !== 0) {
                  dispatch(prevSong());
                  setTimeout(() => dispatch(pause()), 0);
                }
              }}
            />
            <div
              className="cursor-pointer hover:text-gray-400 transition"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8" />
              )}
            </div>
            <SkipForward
              className={` w-5 h-5 sm:w-6 sm:h-6 hover:text-gray-400 transition ${
                currentIndex === currentAlbum - 1
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              onClick={() => {
                dispatch(nextSong());
                setTimeout(() => dispatch(pause()), 0);
              }}
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-2">
            <div className="flex justify-between text-[10px] text-gray-400 px-1 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="w-full h-1 bg-gray-700 rounded cursor-pointer relative group"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Volume and Playlist */}
        <div className="hidden sm:flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <div
              className="cursor-pointer"
              onClick={toggleMute}
              title="Mute/Unmute"
            >
              {isMuted || volume == 0 ? (
                <VolumeX className="w-5 h-5 hover:text-gray-400 transition" />
              ) : (
                <Volume2 className="w-5 h-5 hover:text-gray-400 transition" />
              )}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Music Bar for Small Screens */}

        <div className="flex flex-col py-1 sm:hidden">
          {/* Info */}
          <div className="flex justify-between items-center px-2 ">
            <div className="sm:hidden flex items-center gap-4 overflow-hidden">
              <img
                src={
                  playingSong?.coverImageUrl ||
                  coverImg ||
                  "./assets/admin-assets/song_icon.png"
                }
                alt="Cover"
                className="w-12 h-12 rounded shadow-md object-cover"
              />
              <div className="">
                <h1 className="text-sm font-semibold truncate max-w-[140px]">
                  {playingSong?.title || "Album Title"}
                </h1>
                <p className="text-xs text-gray-400">
                  {playingSong?.artist || "Unknown Artist"}
                </p>
              </div>
              <div
                className="cursor-pointer"
                title="Like"
                onClick={() => handleLike(playingSong)}
              >
                {isLiked ? (
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 transition" />
                ) : (
                  <Heart className="w-5 h-5 hover:text-red-500 transition" />
                )}
              </div>
              
            </div>

            <div
              className="cursor-pointer hover:text-gray-400 transition"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8" />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-2">
            <div
              className="w-full h-1 bg-gray-700 rounded cursor-pointer relative group"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicBar;
