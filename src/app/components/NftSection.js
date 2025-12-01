"use client";
import { FiUserPlus } from "react-icons/fi";
import { RiBrainLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import RefferalLink from "./RefferalLink";
import { usePathname, useRouter } from "next/navigation";
import { getEncryptedLocalData } from "../api/auth";

export const NftSection = ({ pageName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [authLogin , setAuthLogin] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const fullName = `${fname || ""} ${lname || ""}`.trim();

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    return names.map((name) => name[0]).join("");
  };

  const initials = getInitials(fullName);

  useEffect(() => {
    const fName = getEncryptedLocalData("FName");
    const lName = getEncryptedLocalData("LName");
    const authLogin = getEncryptedLocalData("AuthLogin");
    setFname(fName);
    setLname(lName);
    setAuthLogin(authLogin);
  }, []);

  const pathContent = {
    "/pages/browser-agents": {
      title: "Explore Smart AI Agents",
      line1: "Discover powerful AI agents built to simplify your daily tasks.",
      onlyTitle: true,
    },
    
    "/pages/ai-business-hub": {
      title: "AI Business Hub Overview",
      line1: "Track your AI Business Hub performance and network growth in real-time",
      onlyTitle: true,
    },
    "/pages/fund-director": {
      title: "Fund Management Dashboard",
      line1: "Seamlessly manage all fund-related operations from one place",
      onlyTitle: true, 
    },
    "/pages/reports": {
      title: "Wallet Reports Dashboard",
      line1: "Get a comprehensive overview of all your wallet activities.",
      onlyTitle: true
    },
    "/pages/Agents": {
      title: "Your Leased Agents",
      line1: "all in one view with real-time data.",
      onlyTitle: true, 
    },
    "/pages/analytics": {
      title: "Smart Business Analytics Tool",
      line1: "Track business performance with real-time, data-driven insights",
      onlyTitle: true,
    },
     "/pages/my-direct-network": {
      title: "My Direct Network",
      line1: "View and manage your direct referrals and their details.",
      onlyTitle: true,
    },
     "/pages/team-growth-matrix": {
      title: "Team Growth Matrix",
      line1: "Analyze your team's growth and performance metrics.",
      onlyTitle: true,
    },
    "/pages/intelligent-tree-view": {
      title: "Intelligent Tree View",
      line1: "Explore your network structure in an interactive tree format.",
      onlyTitle: true,
    },
  };

  const content = pathContent[pathname] || {
    title: "",
    line1: "",
  };

  return (
    <div className="relative px-4 overflow-hidden transition-colors duration-300 bg-white sm:px-6 lg:px- dark:bg-gray-900">
      <div className="mt-2 mb-5 border card dark:border-white">
        <div className="p-2 sm:p-2">
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            <div>
              <h1 className="mb-1 font-semibold text-gray-600 dark:text-white sm:text-md lg:text-md" style={{fontFamily: "Geist"}}>
                {content.onlyTitle
                  ? content.title
                  : `${content.title} Welcome back, ${fname} ${lname} - [${authLogin}] 👋`}
              </h1>
              {Object.entries(content).map(([key, value]) =>
                key?.startsWith("line") ? (
                  <p
                    key={key}
                    className="text-sm text-gray-500 geidt-font dark:text-gray-300"
                  >
                    {value}
                  </p>
                ) : null
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {pathname === "/pages/browser-agents" ? (
                <button
                  onClick={() => router.push('/pages/ai-tools')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white transition rounded sm:px-4 sm:py-2 sm:text-base th-btn style2"
                >
                  <RiBrainLine size={18} />
                  Ai Tools Demo
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white transition rounded sm:px-4 sm:py-2 sm:text-base th-btn style2"
                >
                  <FiUserPlus size={18} />
                  Invite Friends
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 bg-white border-gray-600 shadow-xl dark:bg-gray-600 sm:p-8 rounded-2xl animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute text-lg text-gray-500 top-3 right-3 hover:text-gray-700 dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <RefferalLink />
          </div>
        </div>
      )}
    </div>
  );
};