"use client";
import { getEncryptedLocalData } from "../api/auth";
import {
  FaLifeRing,
  FaKey,
  FaSignOutAlt,
  FaUserCircle,
  FaTimes,
  FaHeadset,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doLogout } from "../api/auth";
import { useState, useEffect } from "react";

export default function ProfileMenu({ onClose, user }) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");

  const handleLogout = () => {
    doLogout();
    router.replace("/");
  };

  useEffect(() => {
    const AuthLogin = getEncryptedLocalData("AuthLogin");
    const FName = getEncryptedLocalData("FName");
    const LName = getEncryptedLocalData("LName");

    setLogin(AuthLogin || "");
    setName(`${FName || ""} ${LName || ""}`.trim()); // Combine names with a space
  }, []);

  return (
    <div className=" absolute w-64 p-5 mt-3 text-white bg-gray-900 shadow-2xl rounded-xl">
      {/* Close Button */}
      <button
        className="absolute text-gray-400 transition top-3 right-3 hover:text-white"
        onClick={onClose}
        aria-label="Close menu"
      >
        <FaTimes size={18} />
      </button>

      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-4 " onClick={onClose}>
        <div className="p-2 bg-gray-700 rounded-full">
          <FaUserCircle size={25} />
        </div>
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-xs text-gray-400">{login}</div>
        </div>
      </div>
      <hr className="mb-3 border-gray-700" />

      {/* Menu Items */}
      <Link
        href="/pages/settings"
        className="flex items-center gap-3 px-2 py-2 mb-1 transition rounded-lg cursor-pointer hover:bg-gray-800"
        onClick={onClose}
      >
        <FaLifeRing />
        <span>Settings</span>
      </Link>

      <Link
        href="/pages/support"
        className="flex items-center gap-3 px-2 py-2 mb-1 transition rounded-lg cursor-pointer hover:bg-gray-800"
        onClick={onClose}
      >
        <FaHeadset />
        <span>Support</span>
      </Link>

      <hr className="my-3 border-gray-700" />

      <div
        className="flex items-center gap-3 px-2 py-2 transition rounded-lg cursor-pointer hover:bg-red-600 hover:text-white"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        <span>Log Out</span>
      </div>
    </div>
  );
}
