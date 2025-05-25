import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../redux/sidebarSlice";
import { setSong, togglePlayPause } from "../redux/playSlice";
import { useNavigate } from "react-router-dom";
import { PanelRightClose } from "lucide-react";

const ClosedSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const liked = useSelector((state) => state.likedSongs.likedSongs);
  const isPlaying = useSelector((state) => state.music.isPlaying);

  const handleClick = (song, index) => {
    dispatch(setSong({ song, index }));
    dispatch(togglePlayPause());
  };

  return (
    <div
      className={` bg-base-100 flex flex-col items-center gap-3 w-[0px] hidden sm:flex sm:w-[40px] md:w-[45px] lg:w-[60px] xl:w-[70px] xl:w-[85px] rounded-lg shadow-lg transition-all max-h-[78vh] min-h-[78vh] sm:max-h-[76vh] sm:min-h-[76vh]`}
    >
      <div
        className="group cursor-pointer mt-3 tooltip tooltip-right"
        data-tip="Open Library"
        onClick={() => dispatch(toggle())}
      >
        {/* Image (visible normally, hidden on hover) */}
        <img
          className="size-5 my-1 transition-transform duration-300 group-hover:hidden"
          src="./assets/frontend-assets/stack.png"
          alt="Toggle Sidebar"
        />

        {/* Icon (hidden normally, visible on hover) */}
        <div className="hidden group-hover:block size-5 my-1 transition-transform duration-300 scale-110">
          <PanelRightClose />
        </div>
      </div>

      <ul className=" rounded-xl flex flex-col items-center gap-4 w-full">
        {liked.length > 0 &&
          liked.map((song, index) => (
            <li key={song.id || index}>
              <img
                onClick={() => handleClick(song)}
                className={`size-12 p-0 rounded-box hover:scale-110 transition-transform duration-300 cursor-pointer ${
                  song.coverImageUrl ? null : "invert"
                }`}
                src={
                  song.coverImageUrl || `./assets/admin-assets/song_icon.png`
                }
                alt={song.title}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ClosedSidebar;
