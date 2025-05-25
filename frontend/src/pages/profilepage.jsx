import React, { useState } from "react";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user.user);
  
  function formatDate(isoDateStr) {
    const date = new Date(isoDateStr);

    // Example format: "December 7, 2023"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-5 gap-6">
        {/* Profile Picture */}
        <img
          src="./assets/frontend-assets/img7.jpg"
          className="size-40 rounded-full border border-4 border-base-700"
          alt="profile"
        />

        {/* Basic Info */}
        <div className="w-full max-w-md flex flex-col gap-3 px-4">
          <div className="bg-base-100 shadow p-4 rounded-md">
            <h2 className="text-lg font-semibold">Username</h2>
            <p className="text-gray-600">{user?.username || "N/A"}</p>
          </div>
          <div className="bg-base-100 shadow p-4 rounded-md">
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-gray-600">{user?.email || "user@example.com"}</p>
          </div>
        </div>

        <div className="font-semibold">
          Since @{formatDate(user?.createdAt)}
        </div>
        </div>
    </div>
  );
};

export default ProfilePage;
