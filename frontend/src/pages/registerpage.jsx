import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../redux/authSlice";

const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

const Registerpage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      toast.error("All fields are required");
      return;
    }
    handleRegister();
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success("User Registered Successfully");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error.message);
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

        <h2 className="text-xl font-semibold mb-4">Create your account</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <label className="text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              placeholder="Enter your username"
              pattern="^[A-Za-z][A-Za-z0-9-]{2,29}$"
              title="3–30 characters. Letters, numbers, or dashes. Must start with a letter."
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              3–30 characters. Letters, numbers, or dashes. Must start with a letter.
            </p>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
            />
            <div
              className="absolute right-3 top-[38px] cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              At least 8 characters with a number, lowercase and uppercase letter
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-2 font-semibold rounded-md transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#1db954] text-black hover:bg-[#1ed760]"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1db954] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registerpage;
