import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { resetPlaylists } from "../redux/playlistSlice";
import { resetLikedSongs } from "../redux/likedSongsSlice";
import { resetPlay } from "../redux/playSlice";
import SearchBar from "./searchBar";
const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;
import { LogOut, Menu } from "lucide-react";
import { toggle } from "../redux/sidebarSlice";
import { resetRecents } from "../redux/recentsSlice";
import { clearCollection } from "../redux/songsCollectionSlice";
import { resetAlbum } from "../redux/totalCollectionSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${serverURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
        toast.success("Logged Out successfully");
        dispatch(logout(null));
        localStorage.clear;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-5 py-3 flex justify-between items-center gap-4 sm:gap-0">
      {/* Logo */}
      <div className="hidden sm:flex flex-1 justify-center sm:justify-start">
        <img
          src="./assets/admin-assets/logo.png"
          alt="Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      <div
        className="flex group sm:hidden tooltip tooltip-right"
        data-tip="Open Library"
      >
        <div className="group-hover:hidden">
          <Menu className="size-5" />
        </div>
        <img
          className="size-5 hidden group-hover:block"
          src="assets/frontend-assets/stack.png"
          alt="stack"
          onClick={() => {
            dispatch(toggle());
            navigate("/");
          }}
        />
      </div>

      {/*Search bar*/}
      <div className=" flex flex-2 items-center gap-5">
        <SearchBar />
      </div>

      {/* Auth Buttons */}
      <div className="flex flex-1 justify-end gap-4 hidden md:flex">
        <div
          className="btn btn-outline btn-success font-bold text-white"
          onClick={() => {
            handleLogout();
            dispatch(resetPlaylists(null));
            dispatch(resetLikedSongs(null));
            dispatch(resetPlay(null));
            dispatch(resetRecents());
            dispatch(clearCollection());
            dispatch(resetAlbum());
            localStorage.clear("token");
          }}
        >
          Log Out
          <LogOut className="ml-1 size-5" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
