import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCollection } from "../../redux/songsCollectionSlice";
import { useNavigate } from "react-router-dom";
import { getHindiAlbums } from "../getCollection";
import { startAlbum } from "../../redux/playSlice";
const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

const hindiAlbums = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSongsByAlbums = async (albumId) => {
    try {
      const response = await fetch(`${serverURL}/user/albums/${albumId}`, {
        credentials: "include",
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setCollection(data));
      navigate("/songs");
    } catch (error) {
      console.error("Failed to fetch songs collection:", error);
    }
  };

  const allAlbums = useSelector((state) => state.totalAlbums.totalAlbums);
  const hindiAlbums = getHindiAlbums(allAlbums);

  return (
    <div>
      <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
        {hindiAlbums.map((album, index) => (
          <div
            key={album._id}
            onClick={() => fetchSongsByAlbums(album._id)}
            className="card shadow-sm flex-shrink-0 snap-start p-2 cursor-pointer relative group hover:bg-base-300"
          >
            {/* Album cover wrapper */}
            <div className="relative  w-30 h-30  md:w-40 md:h-40  overflow-hidden rounded-xl">
              <img
                src={album.imageUrl}
                alt={`album-${index}`}
                className="w-full h-full"
              />

              {/* Play Icon with slide-up & fade-in */}
              <img
                src="./assets/frontend-assets/play.png"
                onClick={() => {
                  fetchSongsByAlbums(album._id);
                  dispatch(startAlbum());
                }}
                alt="play icon"
                className="size-11 md:size-12 invert p-3 bg-pink-500 rounded-full absolute bottom-[-3rem] right-2 
                           opacity-0 transition-all duration-500 ease-in-out 
                           group-hover:bottom-4 group-hover:opacity-100"
              />
            </div>

            <h2 className="px-2 pt-3 card-title truncate  max-w-[120px]">
              {album.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default hindiAlbums;
