import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../redux/sidebarSlice";
import toast from "react-hot-toast";
import {
  fetchPlaylists,
  playlistIndex,
  selectPlaylist,
  setplaylist,
  fetchPlaylistsSongs,
} from "../redux/playlistSlice";
import { fetchLikedSongs, setLikedSongs } from "../redux/likedSongsSlice";
import { useNavigate } from "react-router-dom";
import { setPlaylist, setSong, togglePlayPause } from "../redux/playSlice";
import { fetchRecents, setRecents } from "../redux/recentsSlice";
import { PanelLeftClose } from "lucide-react";

const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

const OpenSidebar = () => {
  const dispatch = useDispatch();
  const playlist = useSelector((state) => state.playlist.playlists);
  const liked = useSelector((state) => state.likedSongs.likedSongs);
  const recents = useSelector((state) => state.recents.recents);

  const [activeTab, setActiveTab] = useState("playlist"); // Set initial active tab to 'playlist'
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPlaylists());
    dispatch(fetchLikedSongs());
  }, []);

  const handlePlaylist = (playlist, index) => {
    dispatch(fetchPlaylistsSongs(playlist._id));
    dispatch(playlistIndex(index));
    navigate("/playlist");
  };

  const handleRecents = (song, index) => {
    dispatch(setPlaylist(recents));
    dispatch(setSong({ song, index }));
    dispatch(togglePlayPause());
  };

  const handleLiiked = (song, index) => {
    dispatch(setPlaylist(liked));
    dispatch(setSong({ song, index }));
    dispatch(togglePlayPause());
  };

  // Logic to render playlists, recents, or liked
  const renderTabContent = () => {
    if (activeTab === "playlist") {
      return playlist.length > 0 ? (
        playlist.map((item, index) => (
          <li
            key={item.id || index}
            onClick={() => handlePlaylist(item, index)}
            className="flex overflow-hidden items-center gap-3 cursor-pointer border-b border-gray-700 hover:bg-base-300 transition rounded-md p-2"
          >
            <img
              className="size-12 p-2 rounded-box invert"
              src={"./assets/frontend-assets/playlist-svgrepo-com.svg"}
              alt={item.name}
            />
            <div>
              <div className="font-medium truncate">{item.name}</div>
              <div className="text-xs uppercase font-semibold opacity-60 truncate">
                {item.songs?.length || 0} Songs
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="flex items-center justify-center text-sm text-gray-400 py-4">
          No playlists available
        </li>
      );
    } else if (activeTab === "liked") {
      return liked.length > 0 ? (
        liked.map((song, index) => (
          <li
            onClick={() => {
              handleLiiked(song, index);
            }}
            key={song.id || index}
            className="flex overflow-hidden items-center gap-3 cursor-pointer border-b border-gray-700 hover:bg-base-300 transition rounded-md p-2"
          >
            <img
              className={`size-12 p-0 rounded-box ${
                song.coverImageUrl ? null : "invert"
              }`}
              src={song.coverImageUrl || `./assets/admin-assets/song_icon.png`}
              alt={song.title}
            />
            <div>
              <div className="font-medium truncate">{song.title}</div>
              <div className="text-xs uppercase font-semibold opacity-60 truncate">
                {song.artist}
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="flex items-center justify-center text-sm text-gray-400 py-4">
          No liked songs available
        </li>
      );
    } else if (activeTab === "recents") {
      return recents ? (
        recents?.map((song, index) => (
          <li
            key={song._id || index}
            onClick={() => {
              handleRecents(song, index);
            }}
            className="flex overflow-hidden items-center gap-3 cursor-pointer border-b border-gray-700 hover:bg-base-300 transition rounded-md p-2"
          >
            <img
              className="size-12 p-0 rounded-box"
              src={song.coverImageUrl}
              alt={song.title}
            />
            <div>
              <div className="font-medium truncate">{song.title}</div>
              <div className="text-xs uppercase font-semibold opacity-60 truncate">
                {song.artist}
              </div>
            </div>
          </li>
        ))
      ) : (
        <li className="flex items-center justify-center text-sm text-gray-400 py-4">
          No Recents yet!
        </li>
      );
    }
  };

  return (
    <div className="bg-base-100 my-3 mx-1 sm:flex flex-col gap-3 w-full py-4 px-6 rounded-lg shadow-xl hover:overflow-y-hidden transition-all max-h-[78vh] min-h-[78vh] sm:max-h-[76vh] sm:min-h-[76vh]">
      <div className="space-y-4">
        {/* Top Toggle */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => dispatch(toggle())}
        >
          {/* Always visible image */}
          <img
            className="w-5 group-hover:hidden"
            src="/assets/frontend-assets/stack.png"
            alt="Toggle Sidebar "
          />

          {/* Only visible on hover */}
          <div>
            <PanelLeftClose className="hidden group-hover:block w-5  tooltip tooltip-top" />
          </div>

          <h1 className="text-lg font-semibold">Your Library</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-scroll snap-x snap-mandatory scrollbar-hide">
          <button
            className={`btn btn-soft text-xs h-7 rounded-full px-3 ${
              activeTab === "playlist"
                ? "bg-gray-700 text-white"
                : "bg-base-300"
            }`}
            onClick={() => setActiveTab("playlist")}
          >
            Playlists
          </button>
          <button
            className={`btn btn-soft text-xs h-7 rounded-full px-3 ${
              activeTab === "recents" ? "bg-gray-700 text-white" : "bg-base-300"
            }`}
            onClick={() => setActiveTab("recents")}
          >
            Recents
          </button>
          <button
            className={`btn btn-soft text-xs h-7 rounded-full px-3 ${
              activeTab === "liked" ? "bg-gray-700 text-white" : "bg-base-300"
            }`}
            onClick={() => setActiveTab("liked")}
          >
            Liked
          </button>
        </div>
      </div>

      {/* Render Tab Content */}
      <ul className="bg-base-100 rounded-box space-y-1 py-2 overflow-y-auto scrollbar-hover-hide">
        {renderTabContent()}
      </ul>
    </div>
  );
};

export default OpenSidebar;
