import { Play } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MusicWave from "../utils/musicWave";
import {
  setCoverimg,
  setPlaylist,
  setSong,
  togglePlayPause,
} from "../redux/playSlice";

const SearchPage = () => {

  const queryStatus = useSelector((state) => state.search.query);
  const searchResults = useSelector((state) => state.search.results);
  const playingSong = useSelector((state) => state.music.song);
  const dispatch = useDispatch();

  const handleClick = (song, index) => {
    dispatch(setSong({ song, index }));
    dispatch(togglePlayPause());
    dispatch(setCoverimg({ coverImg: song.imageUrl }));
  };

  const formatAlbumDuration = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!searchResults || searchResults.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No songs found</p>;
  }

  return (
    <div className="md:grid grid-cols-3 my-5 mx-10 gap-6">
      {/* Left: First Song Highlight */}
      <div className="hidden md:block relative group max-h-fit hover:bg-base-200 shadow-sm p-4 rounded-xl cursor-pointer overflow-hidden">
        <h1 className="text-2xl font-semibold mb-5">Top Results</h1>
        <img
          src={
            searchResults[0].coverImageUrl ||
            "./assets/frontend-assets/img1.jpg"
          }
          alt={searchResults[0].title}
          className="rounded-xl w-[60%] object-cover"
        />
        <h1 className="text-2xl font-semibold mt-3">
          {searchResults[0].title}
        </h1>
        <h3 className="text-gray-600">{searchResults[0].artist}</h3>

        {/* Play Icon with slide-up & fade-in */}
        <img
          src="./assets/frontend-assets/play.png"
          onClick={() => handleClick(searchResults[0], 0)}
          alt="play icon"
          className="size-12 invert p-3 bg-pink-500 rounded-full absolute bottom-[-3rem] right-2 
               opacity-0 transition-all duration-500 ease-in-out 
               group-hover:bottom-4 group-hover:opacity-100"
        />
      </div>

      {/* Right: Top 5 Songs List */}
      <div className="col-span-2">
        <h1 className="text-2xl font-semibold mb-5 hidden md:block">Songs</h1>
        {searchResults.slice(0, 5).map((song, index) => (
          <div
            key={index}
            onClick={() => handleClick(song, index)}
            className="border-b py-3 group hover:bg-base-200 flex justify-between px-5 items-center w-full"
          >
            <div className="flex items-center">
              <img
                src={song.coverImageUrl || "./assets/frontend-assets/img1.jpg"}
                alt={song.title}
                className="w-16 h-16 rounded-lg mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{song.title}</h3>
                <p className="text-gray-500">{song.artist}</p>
              </div>
            </div>
            <div className="flex justify-center items-center cursor-pointer">
              {/*playingSong?._id === song._id ? (
                <MusicWave className="text-red-500" />
              ) : (
                <Play
                  size={21}
                  className="text-green-500 transform transition-all duration-300 ease-in-out hover:text-green-600 hover:scale-110 active:scale-95"
                  onClick={() => handleClick(song, index)}
                />
              )*/}
              {formatAlbumDuration(song.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
