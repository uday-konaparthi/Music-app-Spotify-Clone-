import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../redux/authSlice";

const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

const Loginpage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${serverURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      console.log(document.cookie);
      dispatch(login(data));
      toast.success("User Logged in Successfully");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-[#1db954]/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="./assets/frontend-assets/spotify_logo.png"
            alt="Spotify Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-[#1db954]">Spotify</h1>
        </div>

        <h2 className="text-xl font-semibold mb-4">Login to your account</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
            />
            <div
              className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-2 font-semibold rounded-md transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#1db954] text-black hover:bg-[#1ed760]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          New user?{" "}
          <Link to="/register" className="text-[#1db954] hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
