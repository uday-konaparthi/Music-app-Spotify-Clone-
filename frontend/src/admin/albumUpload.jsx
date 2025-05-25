import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const serverURL = import.meta.env.VITE_BASIC_SERVER_URL;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("song");
  const [songFile, setSongFile] = useState(null);
  const [albumCover, setAlbumCover] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("No Album (Single)");
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [duration, setDuration] = useState(null);
  const [mood, setMood] = useState(null);

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumArtist, setAlbumArtist] = useState("");
  const [language, setLanguage] = useState("");
  const [releasedOn, setReleasedOn] = useState("");
  const [songCover, setSongCover] = useState(null);
  const [genre, setGenre] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const allAlbums = useSelector((state) => state.totalAlbums.totalAlbums);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.user.isAdmin) {
      setIsAdmin(true);
    } else {
      toast.error("Access Denied!..");
      navigate("/");
    }
  }, [user, navigate]);

  const handleSongUpload = async () => {
    if (!songTitle || !artistName || !songFile) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", songTitle);
      formData.append("artist", artistName);
      formData.append("mood", mood);
      formData.append("genre", genre);
      formData.append("audioFile", songFile);
      if (selectedAlbum && selectedAlbum !== "No Album (Single)") {
        formData.append("albumId", selectedAlbum);
      }

      const res = await fetch(`${serverURL}/admin/songs`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Song uploaded successfully!");
        setSongTitle("");
        setArtistName("");
        setDuration("");
        setSelectedAlbum("No Album (Single)");
        setSongFile(null);
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlbumUpload = async () => {
    console.log(albumTitle, albumArtist, albumCover);
    if (!albumTitle || !albumArtist || !albumCover) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", albumTitle);
      formData.append("artist", albumArtist);
      formData.append("genre", genre);
      formData.append("language", language);
      formData.append("releasedOn", releasedOn);
      formData.append("imageFile", albumCover); // must match backend's expected field name

      console.log("formData: ", formData);

      const res = await fetch(`${serverURL}/admin/albums`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Album uploaded successfully!");
        setAlbumTitle("");
        setAlbumArtist("");
        setReleasedOn("");
        setSongCover(null);
        setLanguage("");
        setGenre("");
      } else {
        toast.error(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-25">
      {isAdmin && (
        <div className="flex">
          <main className="flex-1 p-6 space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div role="tablist" className="tabs tabs-boxed w-fit">
              <a
                role="tab"
                className={`tab ${activeTab === "song" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("song")}
              >
                Upload Song
              </a>
              <a
                role="tab"
                className={`tab ${activeTab === "album" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("album")}
              >
                Upload Album
              </a>
            </div>

            {activeTab === "song" && (
              <div className="card bg-base-100 shadow-md p-6 space-y-4">
                <h2 className="text-xl font-semibold">Upload New Song</h2>
                <input
                  type="text"
                  placeholder="Song Title"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Artist Name"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="input input-bordered w-full"
                />
                <div className="flex gap-2">
                  <select
                    className="select select-bordered w-full"
                    value={selectedAlbum}
                    onChange={(e) => setSelectedAlbum(e.target.value)}
                  >
                    <option value="No Album (Single)">No Album (Single)</option>
                    {allAlbums.map((album) => (
                      <option key={album._id} value={album._id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Mood"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="text"
                    placeholder="Song Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <label className="text-sm text-gray-500 my-0">
                  Choose Audio files
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setSongFile(e.target.files[0])}
                />
                <button
                  className={`btn btn-primary w-fit rounded-md ${isLoading ? "m-0 p-0": null }`}
                  onClick={handleSongUpload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={`flex bg-primary w-fit m-0 px-1 py-2 rounded-md text-white items-center`}>
                      <Loader className="animate-spin mr-1" />
                      Uploading...
                    </div>
                  ) : (
                    "Upload Song"
                  )}
                </button>
              </div>
            )}

            {activeTab === "album" && (
              <div className="card bg-base-100 shadow-md p-6 space-y-4">
                <h2 className="text-xl font-semibold">Upload New Album</h2>
                <input
                  type="text"
                  placeholder="Album Title"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Artist Name"
                  value={albumArtist}
                  onChange={(e) => setAlbumArtist(e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Album Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input input-bordered w-full"
                />
                <label className="text-sm text-gray-500 m-0">releasedOn</label>
                <div className="flex gap-5">
                  <input
                    type="date"
                    placeholder="Released On"
                    value={releasedOn}
                    onChange={(e) => setReleasedOn(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="text"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <label className="text-sm text-gray-500 m-0">
                  Choose cover image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setAlbumCover(e.target.files[0])}
                />
                <button
                  className={`btn btn-primary w-fit rounded-md ${isLoading ? "m-0 p-0": null }`}
                  onClick={handleAlbumUpload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={`flex bg-primary w-fit m-0 px-1 py-2 rounded-md text-white items-center`}>
                      <Loader className="animate-spin mr-1" />
                      Uploading...
                    </div>
                  ) : (
                    "Upload Album"
                  )}
                </button>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
