import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { setQuery, setResults } from "../redux/searchSlice";
import { useDispatch, useSelector } from "react-redux";

const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
  const results = useSelector((state) => state.search.results); // Use Redux results

  useEffect(() => {
    dispatch(setQuery(""));
  }, [dispatch]);

  const handleInput = async (e) => {
    const value = e.target.value;
    setInput(value);
    dispatch(setQuery(value));

    if (value.trim() === "") {
      dispatch(setResults([])); // Clear results when input is empty
      setShowDropdown(false);
      return;
    }

    handleFetch(value);
  };

  const handleFetch = async (value) => {
    try {
      const response = await fetch(`${serverURL}/user/songs/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ value }),
      });

      const data = await response.json();
      dispatch(setResults(data.SongList || [])); // Update Redux state with the fetched results
      setShowDropdown(true); // Show dropdown if results are available
    } catch (error) {
      console.error("Search fetch error:", error);
      dispatch(setResults([])); // Clear results in case of error
      setShowDropdown(false); // Hide dropdown if error occurs
    }
  };

  const handleSelect = async (songTitle, songId) => {
    setInput(songTitle);
    setShowDropdown(false);

    try {
      const response = await fetch(`${serverURL}/user/songs/getById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ songId }),
      });

      const data = await response.json();
      console.log("Selected song details:", data);
    } catch (error) {
      console.error("Get by ID error:", error);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="flex items-center gap-5">
        <Link to="/" className="tooltip tooltip-bottom" data-tip="Home">
          <img
            className="size-9.5 md:size-11 bg-base-200 p-2 rounded-full cursor-pointer"
            src="./assets/frontend-assets/home.png"
            alt="Home"
          />
        </Link>

        <label className="input flex-1 rounded-full relative">
          <svg
            className="h-[1.5em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </g>
          </svg>
          <input
            type="search"
            value={input}
            onChange={handleInput}
            placeholder="Search for Songs"
            className="grow"
            autoComplete="off"
          />
        </label>
      </div>

      {/*showDropdown && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full ml-8 border bg-base-100 border-base-200 rounded-md shadow-md max-h-60 overflow-y-auto">
          {results.map((song) => (
            <li
              key={song._id}
              className="p-2 hover:bg-base-200 cursor-pointer px-5"
              onClick={() => handleSelect(song.title, song._id)}
            >
              {song.title} —{" "}
              <span className="text-sm text-gray-500">{song.artist}</span>
            </li>
          ))}
        </ul>
      )*/}
    </div>
  );
};

export default SearchBar;
