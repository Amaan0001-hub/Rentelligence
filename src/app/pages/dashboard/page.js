"use client";
import {
  Plus,
  Search,
  BarChart3,
  Handshake,
  AlertTriangle,
} from "lucide-react";
import { FaDollarSign } from "react-icons/fa";
import { cards } from "../../constants/constant";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NftSection } from "@/app/components/NftSection";
import { getPageName } from "@/app/utils/utils";
import { usePathname } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRechargeTransactBYTId } from "@/app/redux/slices/walletReportSlice";
import { getUserId } from "@/app/api/auth";
import {
  getUserDashboardDetails,
  getAllUserNotificationList,
} from "@/app/redux/slices/authSlice";
import OfferStrip from "../offer-strip/page";
// import EventPopup from "@/app/components/EventPopup";

export default function Dashboard() {
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const displayLimit = 8;
  const { walletData, loading } = useSelector((state) => state.wallet);
  const { getUserDashboardData, getUserNotificationsData } = useSelector(
    (state) => state.auth
  );

  const activeAgent = getUserDashboardData?.data[0]?.MyAgent;
  const performanceWallet = getUserDashboardData?.data[0]?.PerformanceWallet;
  const yieldWallet = getUserDashboardData?.data[0]?.YieldWallet;
  const depositWallet = getUserDashboardData?.data[0]?.DepositWallet;
  const totalTeam = getUserDashboardData?.data[0]?.TotalTeam;
  const notificationList =
    getUserNotificationsData?.data?.notificationList || [];

  useEffect(() => {
    try {
      dispatch(getRechargeTransactBYTId(getUserId() || ""));
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserDashboardDetails(getUserId() || ""));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllUserNotificationList(getUserId() || ""));
  }, [dispatch]);

  const handleViewMore = () => {
    setShowAll(!showAll);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <OfferStrip />
      <NftSection pageName={pageName} />
      {/* <EventPopup
        show={showPopup}
        onClose={handleClosePopup}
        imageUrl="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/7f02b14b-da8e-4b73-f004-bd733a16ce00/public"
      /> */}
      <div className="relative pb-8 pl-4 pr-4 overflow-hidden transition-colors duration-300 bg-white sm:pr-6 sm:pl-6 dark:bg-gray-900">
        <div className="mb-3 border hero-2 dark:border-white card card-body border-r-15">
          <div className="relative flex flex-col items-center justify-between p-6 text-white rounded-2xl md:flex-row nft-gradient">
            {/* Text Content */}
            <div className="max-w-lg position-z-index">
              <div className="p-2 mb-4 bg-white rounded-md w-fit">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6D30FB" />
                      <stop offset="100%" stopColor="#1C1B53" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="12" fill="url(#grad1)" />
                  <rect
                    x="12"
                    y="14"
                    width="16"
                    height="14"
                    rx="2"
                    fill="#fff"
                    fillOpacity="0.9"
                  />
                  <rect
                    x="36"
                    y="14"
                    width="16"
                    height="8"
                    rx="2"
                    fill="#fff"
                    fillOpacity="0.8"
                  />
                  <rect
                    x="12"
                    y="34"
                    width="16"
                    height="16"
                    rx="2"
                    fill="#fff"
                    fillOpacity="0.85"
                  />
                  <rect
                    x="36"
                    y="26"
                    width="16"
                    height="24"
                    rx="2"
                    fill="#fff"
                    fillOpacity="0.75"
                  />
                  <path
                    d="M4 4H60V60H4V4Z"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.1"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold">
                Explore a wide range of AI tools, lease them, and earn weekly
                rental profits.
              </h1>
              <p className="mb-4 text-sm">
                Immerse yourself in a world where digital creativity meets
                blockchain technology
              </p>
              <Link href="/pages/browser-agents" className="flex gap-3 flex-wrap-mb">
                <button className="th-btn style2 " style={{ width: "auto" }}>
                 Browse Agents {"  "}
                  <FiArrowRight className="ml-2 text-lg" />
                </button>
              </Link>
            </div>

            {/* Image */}
            <div className="mt-6 md:mt-0">
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/8f6de8c6-ab2c-4aee-5860-6d9c868ff800/public"
                alt="NFT Lion"
                width={300}
                height={300}
                className="rounded-xl big-card-right-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* <div className="relative z-10 grid grid-cols-1 gap-6 pt-3 md:grid-cols-2 lg:grid-cols-4"> */}
        <div className="relative z-10 grid grid-cols-1 gap-6 pt-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <div className="p-5 mb-3 border dark:border-white hero-2 card card-body border-r-15">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
            <div className="relative z-10">
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/9a117346-0717-462c-3fb2-e5276ec01300/public"
                loading="lazy"
                alt=""
                className="dashboard-card-img1"
              />
              <h2 className="font-medium text-white text-md">Active Agents</h2>
              <p className="text-xl font-bold text-white">{activeAgent}</p>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000 font-medium text-color1">
                  {getUserDashboardData?.data[0]?.PreviousAgent}
                </span>
                <span className="text-sm text-white/80">Previous Agent</span>
              </div>
            </div>
          </div>
          <div className="p-5 mb-3 border dark:border-white hero-2 card card-body border-r-15 hero-5">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
            <div className="relative z-10">
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/36b77a07-dd9b-44d3-58b4-d6b6dae1fc00/public"
                loading="lazy"
                alt=""
                className="dashboard-card-img1"
              />
              <h2 className="font-medium text-white text-md">Total Team</h2>
              <p className="text-xl font-bold text-white">{totalTeam}</p>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000 font-medium text-color4">
                  {getUserDashboardData?.data[0]?.ActiveTeam}
                </span>
                <span className="text-sm text-white/80">Active Team</span>
              </div>
            </div>
          </div>
          <div className="p-5 mb-3 border dark:border-white hero-2 card card-body border-r-15 hero-4">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
            <div className="relative z-10">
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/d551f7d4-3986-4bdf-dcd6-596f7de0b500/public"
                loading="lazy"
                alt=""
                className="dashboard-card-img1 two-img.one"
              />
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/4e5b0a05-3d58-49e5-117f-56c0c25bff00/public"
                loading="lazy"
                alt=""
                className="dashboard-card-img1 two-img.two"
              />
              <h2 className="font-medium text-white text-md">Yield Wallet</h2>
              <p className="text-xl font-bold text-white">
                ${Number(yieldWallet || 0).toFixed(2)}
              </p>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000 font-medium text-color3">
                  $
                  {Number(
                    getUserDashboardData?.data[0]?.YieldWithdrawal || 0
                  ).toFixed(2)}
                </span>
                <span className="text-sm text-white/80">Withdrawal</span>
              </div>
            </div>
          </div>
          <div className="p-5 mb-3 border dark:border-white hero-2 card card-body border-r-15 hero-3">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
            <div className="relative z-10">
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/f5b6cf86-1603-4985-f563-8e760e5e4f00/public"
                loading="lazy"
                alt=""
                className="dashboard-card-img1"
              />
              <h2 className="font-medium text-white text-md">
                Performance Wallet
              </h2>
              <p className="text-xl font-bold text-white">
                ${Number(performanceWallet || 0).toFixed(2)}
              </p>
              <div className="flex gap-2">
                <span className="text-sm text-[#000000 font-medium text-color2">
                  $
                  {Number(
                    getUserDashboardData?.data[0]?.PerformanceWithdrawal || 0
                  ).toFixed(2)}
                </span>
                <span className="text-sm text-white/80">Withdrwal</span>
              </div>
            </div>
          </div>
          <div className="p-5 mb-3 border dark:border-white hero-2 card card-body border-r-15 hero-5 deposit">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>
            <div className="relative z-10">
              <img
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/10ffb4a4-178a-424f-e3a3-d9f37240d900/public"
                loading="lazy"
                alt=""
                className="dashboard-card-img1"
              />
              <h2 className="font-medium text-white text-md">Deposit Wallet</h2>
              <p className="pt-3 text-xl font-bold text-white">
                ${Number(depositWallet || 0).toFixed(2)}
              </p>
              {/* <div className="flex gap-2">
                <span className="text-sm text-[#000000 font-medium text-color4">
                  {getUserDashboardData?.data[0]?.ActiveTeam}
                </span>
                <span className="text-sm text-white/80">funding wallet</span>
              </div> */}
            </div>
          </div>
        </div>

        <motion.div
          className="relative z-10 grid hidden grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.06, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <div
                className={`
                  p-6 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-500
                  flex items-center justify-between backdrop-blur-md bg-opacity-70 dark:bg-opacity-80
                `}
              >
                {/* Animated glow ring */}
                <motion.div
                  className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                ></motion.div>
                <div className="relative z-10">
                  <h2 className="text-sm font-medium text-white">
                    {card.title}
                  </h2>
                  <p className="text-4xl font-bold text-white">{card.value}</p>
                  <div className="flex gap-2 mt-3">
                    <span className={`text-sm ${card.changeColor} font-medium`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-white/80">
                      from last month
                    </span>
                  </div>
                </div>
                <span className="text-green-500 text-xs bg-green-100 px-2 py-0.5 rounded-full">
                  +$450
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 text-yellow-600 bg-yellow-100 rounded-full">
                  <svg
                    className="w-8 h-8 "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 108 8 8 8 0 00-8-8zm.93 12.36h-1.86v-1.86h1.86zm0-3.72h-1.86V5.64h1.86z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700 add-svg-card">
                    Agent <strong>&apos;CodeGenerator v2&apos;</strong> lease
                    expires in 3 days
                  </p>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="container mx-auto mt-3">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="p-6 bg-[#1f2937] border border-gray-200 shadow rounded-xl">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/pages/browser-agents"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="#fff"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Agents
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/pages/fund-director"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="#fff"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v3h2V5h10v2h2V5a2 2 0 00-2-2H5z" />
                      <path d="M3 9v6a2 2 0 002 2h10a2 2 0 002-2V9H3z" />
                    </svg>
                    Fund Director
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/pages/intelligent-tree-view"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2a6 6 0 00-5.657 3.999A5 5 0 005 11.5C5 13.985 7.015 16 9.5 16h1v4a1 1 0 001 1h2a1 1 0 001-1v-4h1c2.485 0 4.5-2.015 4.5-4.5a5 5 0 00-1.343-3.501A6 6 0 0012 2z" />
                    </svg>
                    Intelligent Tree View
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/pages/reports"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <img
                      src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/f13c779d-1591-41c4-ca52-9d51708fc100/public "
                      alt="Reports"
                      className="w-8 h-7"
                    />
                    Income Statistics
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/pages/analytics"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-pink-500"
                      fill="none"
                      stroke="#fff"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Agent Analytics
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>

                <Link
                  href="/pages/my-agents"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-pink-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    My Agents
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/pages/settings"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-pink-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A9 9 0 1119.07 6.929M15 15a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Profile
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/pages/support"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8a3 3 0 00-3 3h1.5a1.5 1.5 0 113 0c0 1.5-2.25 1.5-2.25 3v.75M12 17h.01"
                      />
                    </svg>
                    Support
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/pages/ai-tools"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    AI Tools Demo
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/pages/event-booking"
                  className="flex items-center justify-between p-2 transition rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 add-svg-card">
                    <svg
                      className="w-8 h-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                   Events
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>

            <div className="p-0 bg-[#1f2937] border border-gray-200 h-[620px] overflow-y-auto shadow rounded-xl">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-[#1f2937] px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  Recent Activity
                </h2>
              </div>

              {/* Scrollable Content */}
              <div className="px-6 pt-4 pb-6 space-y-5 text-sm ">
                {notificationList && notificationList.length > 0 ? (
                  <>
                    {notificationList
                      .slice(
                        0,
                        showAll ? notificationList.length : displayLimit
                      )
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 mb-4"
                        >
                          {/* Left side: icon + text */}

                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-blue-100 rounded-full">
                              <img
                                src={
                                  item?.image ||
                                  "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/91e96003-1124-41ea-277d-460f3b3c3600/public"
                                }
                                alt="Profile"
                                width={32}
                                height={32}
                                className="object-cover rounded-full"
                              />
                            </div>
                            <p className="text-white">
                              <strong>{item.AdminRemarks}</strong>
                            </p>
                          </div>

                          {/* Right side: Price */}
                          <p className="text-green-700 text-md bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                            ${item.Amount}
                          </p>
                        </div>
                      ))}
                    {notificationList.length > displayLimit && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleViewMore}
                          className="text-sm font-medium text-blue-400 hover:text-blue-300"
                        >
                          {showAll ? "View Less" : "View More"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-400 dark:text-white ">
                    No data Found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="relative grid hidden grid-cols-1 gap-8 px-8 py-8 overflow-hidden transition-colors duration-300 lg:grid-cols-3 bg-gray-50 dark:bg-gray-800"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        {/* Quick Actions */}
        <div className="relative z-10 lg:col-span-1">
          <h2 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Quick Actions
          </h2>
          <div className="p-6 space-y-4 bg-white border-2 border-gray-500 shadow-lg dark:border-gray-600 dark:bg-gray-700/60 rounded-2xl backdrop-blur-md">
            <ActionButton
              href="/pages/browser-agents"
              icon={
                <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              }
              label="Browse Agents"
              className="bg-emerald-100 dark:bg-emerald-900"
            />
            <ActionButton
              href="/pages/fund-director"
              icon={
                <FaDollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              }
              label="Fund Director"
            />
            <ActionButton
              href="/pages/affiliate"
              icon={
                <Handshake className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              }
              label="Affiliate"
            />
            <ActionButton
              href="/pages/analytics"
              icon={
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              }
              label="View Analytics"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative z-10 lg:col-span-2 ">
          <h2 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Recent Activity
          </h2>
          <div className="p-6 space-y-4 bg-white border-2 border-gray-500 shadow-lg dark:border-gray-600 dark:bg-gray-700/60 rounded-2xl backdrop-blur-md">
            <ActivityItem
              icon={
                <Handshake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              }
              text="Agent 'DataAnalyzer Pro' was leased to TechCorp"
              time="2 hours ago"
              badge="+$450"
            />
            <ActivityItem
              icon={
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              }
              text="Agent 'CodeGenerator v2' lease expires in 3 days"
              time="4 hours ago"
            />
            <ActivityItem
              icon={
                <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              }
              text="New agent 'ImageAI Pro' successfully verified and listed"
              time="6 hours ago"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

function ActionButton({ href, icon, label }) {
  return (
    <Link href={href}>
      <motion.button
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
        }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center justify-between w-full p-4 text-sm font-medium transition-all duration-300 border border-gray-200 rounded-xl dark:border-gray-600 bg-white/70 dark:bg-gray-700/50 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-3 font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        </div>
        <span className="text-gray-400 dark:text-gray-500">→</span>
      </motion.button>
    </Link>
  );
}

function ActivityItem({ icon, text, time, badge }) {
  return (
    <div className="flex items-start pb-4 space-x-4 border-b border-gray-200 last:border-b-0 dark:border-gray-600">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-700">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {text}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
      {badge && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}