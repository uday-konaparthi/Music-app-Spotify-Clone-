import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import Homepage from "./pages/homepage";
import Registerpage from "./pages/registerpage";
import Loginpage from "./pages/loginpage";
import AdminPage from "./admin/albumUpload";
import SongsPage from "./pages/songsPage";
import Navbar from "./components/navbar";
import Sidebar from "./pages/sidebar";
import MusicBar from "./components/musicBar";
import PlayListPage from "./pages/playlistpage";
import SearchPage from "./pages/searchPage";
import ProfilePage from "./pages/profilepage";

import { login } from "./redux/authSlice";
import { fetchAllAlbums, fetchAllSongs } from "./utils/getCollection";

const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarOpened = useSelector((state) => state.sidebar.sidebar);
  const user = useSelector((state) => state.auth.user);

  const isLoggedIn = user !== null;

  const hideFullLayout = ["/login", "/register"].includes(location.pathname);
  const hideSidebar = ["/profile"].includes(location.pathname);

  useEffect(() => {
    const loadAlbums = async () => {
      if (isLoggedIn) {
        await fetchAllAlbums(dispatch);
        await fetchAllSongs(dispatch);
      }
    };
    loadAlbums();
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (location.pathname === "/login" || location.pathname === "/register") {
      // Do nothing, allow unauthenticated users to see login/register page
      return;
    }
    if (!user && token) {
      handleAutoLogin();
    } else if (!user && !token) {
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  const handleAutoLogin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${serverURL}/auth/autologin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(login(data));
      } else {
        toast.error(data.message || "Login failed");
        navigate("/login");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("Something went wrong. Please try again.");
      navigate("/login");
    }
  };

  return (
    <div className="bg-base-300 min-h-screen max-h-screen overflow-hidden relative">
      <Toaster position="top-right" />

      {hideFullLayout ? (
        <Routes>
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div
            className={`grid overflow-hidden
              ${
                hideSidebar
                  ? "grid-cols-1"
                  : sidebarOpened
                  ? "sm:grid-cols-[25%_75%] grid-cols-1"
                  : "sm:grid-cols-[7%_93%] grid-cols-1"
              }`}
          >
            {!hideSidebar && (
              <div className="hidden sm:block">
                <Sidebar />
              </div>
            )}
            <div className="overflow-y-auto h-[calc(100vh-4rem)] px-1 sm:pr-4 custom-scrollbar">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/songs" element={<SongsPage />} />
                <Route path="/playlist" element={<PlayListPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>
          </div>
          <MusicBar />
        </>
      )}
    </div>
  );
};

export default App;
