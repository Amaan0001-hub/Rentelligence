"use client";
import { useState } from "react";
import EditProfile from "./edit-profile/page";
import UpdateProfileImage from "./update-profile-image/page"
import ChangePassword from "./change-password/page";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("editProfile");

  return (
<div className="max-w-xl p-6 mx-auto mt-10 bg-white border rounded-lg shadow dark:bg-gray-800">
  <div className="border-b border-gray-200 dark:border-white">
    <div className="relative">
      <div className="flex gap-12 pb-2 mb-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
        <button
          className={`flex-shrink-0 px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
            activeTab === "editProfile"
              ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("editProfile")}
        >
          Edit Profile
        </button>
        <button
          className={`flex-shrink-0 px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
            activeTab === "resetPassword"
              ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("resetPassword")}
        >
          Reset Password
        </button>
        <button
          className={`flex-shrink-0 px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
            activeTab === "updateimage"
              ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("updateimage")}
        >
          Upload Profile Photo
        </button>
      </div>
    </div>
  </div>
  
  {activeTab === "editProfile" && <EditProfile />}
  {activeTab === "resetPassword" && <ChangePassword />}
  {activeTab === "updateimage" && <UpdateProfileImage/>}
</div>
);
}
