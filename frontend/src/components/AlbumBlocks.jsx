import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCollection } from "../redux/songsCollectionSlice";
import { useNavigate } from "react-router-dom";
import { getNewReleases } from "../utils/getCollection";

const AlbumBlocks = () => {
  const albums = useSelector((state) => state.totalAlbums.totalAlbums);
  const AlbumCollection = getNewReleases(albums);
  const songsByAlbums = useSelector(
    (state) => state.songsByAlbumid.songsByAlbumid
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSongsByAlbums = async (albumId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/albums/${albumId}`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setCollection(data));
      navigate("/songs");
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch songs collection:", error);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
          {AlbumCollection?.map((album, index) => (
            <div
              key={album._id}
              onClick={() => fetchSongsByAlbums(album._id)}
              className="grid grid-cols-2 shadow-sm hover:bg-base-200 rounded-md snap-start p-1 cursor-pointer relative group bg-base-300 xl:flex justify-start flex-1 gap-2 items-start overflow-hidden"
            >
              {/* Album cover wrapper */}
              <div className="size-16 overflow-hidden">
                <img
                  src={album.imageUrl}
                  alt={`album-${index}`}
                  className="w-full h-full object-fill rounded-md"
                />
              </div>

              <div className="col-span-2">
                <h2 className="px-1 font-semibold truncate mt-2 text-lg">
                  {album.title}
                </h2>
              </div>

              <img
                src="./assets/frontend-assets/play.png"
                alt="play icon"
                className="size-12 invert p-3 bg-pink-500 rounded-full absolute bottom-[-0.5rem] right-2 
                             opacity-0 transition-all duration-300 ease-in-out 
                             group-hover:bottom-3 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumBlocks;
