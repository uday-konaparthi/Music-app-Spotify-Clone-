import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import SearchPage from "./searchPage";
import FeaturedCards from "../utils/featured/getFeaturedAlbums";
import NewReleases from "../utils/albums/newReleases";
import PopAlbums from "../utils/songs/popSongs";
import HindiAlbums from "../utils/albums/hindiAlbums";
import AlbumBlocks from '../components/AlbumBlocks'

const Dashboard = () => {
  const queryStatus = useSelector((state) => state.search.query);

  return (
    <div className="bg-base-100 overflow-auto overflow-y-auto py-5 sm:px-3 my-3 rounded-md md:max-h-[76vh] md:min-h-[76vh] max-h-[78vh] min-h-[78vh] scrollbar-opacity-50">
      {queryStatus ? (
        <SearchPage />
      ) : (
        <div>

          <div>
            <h2 className="text-xl text-gray-500 mb-2 mx-2">Featured Albums</h2>
            <FeaturedCards />
          </div>

          <div>
            <h2 className="text-xl text-gray-500 mb-2 mx-2">New Releases</h2>
            <NewReleases />
          </div>

          <div>
            <h2 className="text-xl text-gray-500 mb-2 mx-2">Pop Albums</h2>
            <PopAlbums />
          </div>

          <div>
            <h2 className="text-xl text-gray-500 mb-2 mx-2">Hindi Albums</h2>
            <HindiAlbums />
          </div>

          <div>
            <h2 className="text-xl text-gray-500 mb-2 mx-2">Made For You</h2>
            <FeaturedCards />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
