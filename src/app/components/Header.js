
"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MdAccountBalanceWallet } from "react-icons/md";
import { menuItems, menuItemsForMobile } from "../constants/constant";
import { usePathname } from "next/navigation";
import ProfileMenu from "./ProfileMenu";
import { useMediaQuery } from "../utils/utils";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { usernameByLoginId } from "@/app/redux/slices/fundManagerSlice";
import { getTransferIncomeToDepositWalletReport } from "../redux/slices/fundManagerSlice";
import { getEncryptedLocalData } from "../api/auth";
import { getUserId } from "../api/auth";
import {
  getUserNotifications,
  updateNotificationsCount,
} from "../redux/slices/notificationSlice";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { RiWallet3Line, RiPieChartLine, RiTeamLine} from "react-icons/ri";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [Login, setLogin] = useState("");
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [notificationsDropDown, setNotificationsDropDown] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [seenNotifications, setSeenNotifications] = useState(new Set());
  const pathname = usePathname();
  const profileRef = useRef(null);
  const walletRef = useRef(null);
  const notifyRef = useRef(null);
  const dispatch = useDispatch();
  const mobileMenuRef = useRef(null);
  const notificationPollingRef = useRef(null);

  const { usernameData, loading, error } = useSelector((state) => state.fund);
  const profileImage = usernameData?.data?.profileImage;
  const { notificationData } = useSelector((state) => state.notification);
  const isBelow1236px = useMediaQuery("(max-width: 1236px)");
  const isBelow768px = useMediaQuery("(max-width: 767px)");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const { getTransferIncomeToDepositWalletReportData } = useSelector(
    (state) => state?.fund
  );

  const depositWallet =
    getTransferIncomeToDepositWalletReportData?.walletBalance[0]?.depositWallet;
  const incomeWallet =
    getTransferIncomeToDepositWalletReportData?.walletBalance[0]?.incomeWallet;
  const rentWallet =
    getTransferIncomeToDepositWalletReportData?.walletBalance[0]?.rentWallet;

  useEffect(() => {
    const savedSeenNotifications = localStorage.getItem("seenNotifications");
    if (savedSeenNotifications) {
      setSeenNotifications(new Set(JSON.parse(savedSeenNotifications)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "seenNotifications",
      JSON.stringify([...seenNotifications])
    );
  }, [seenNotifications]);

  useEffect(() => {
    const pollNotifications = () => {
      dispatch(getUserNotifications());
    };

    pollNotifications();
    notificationPollingRef.current = setInterval(pollNotifications, 30000);

    return () => {
      if (notificationPollingRef.current) {
        clearInterval(notificationPollingRef.current);
      }
    };
  }, [dispatch]);

  const count = notificationData?.[0];
  const unseenNotifications = notificationData?.filter(
    (n) => !seenNotifications.has(n.URID) && !n.Seen
  );

  const actualUnseenCount = unseenNotifications?.length;

  useEffect(() => {
    const AuthId = getEncryptedLocalData("AuthLogin");
    if (AuthId) {
      dispatch(usernameByLoginId(AuthId));
    }
  }, [dispatch]);

  useEffect(() => {
    const urid = getUserId();
    dispatch(getTransferIncomeToDepositWalletReport(urid));
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setShowWalletMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotificationsDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const AuthLogin = getEncryptedLocalData("AuthLogin");
    setLogin(AuthLogin || "");
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setShowWalletMenu(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotificationsDropDown(false);
      }
      if (
        isBelow1236px &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBelow1236px]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setNotificationsDropDown((prev) => !prev);
  };

  const handleCloseNotifications = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(updateNotificationsCount());
      await dispatch(getUserNotifications());
    } catch (error) {
      console.error("Error updating notification count:", error);
    }
    setNotificationsDropDown(false);
  };

  const handleIndividualNotificationClick = (notification) => {
    const notificationId = notification.id || notification.NotificationId;
    setSeenNotifications((prev) => new Set([...prev, notificationId]));
  };

  const handleClick = () => {
    setOpenDropdowns({});
  };

  useEffect(() => {
    const resetInterval = setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const savedTime = localStorage.getItem("seenNotificationsTime");

      if (!savedTime || parseInt(savedTime) < oneDayAgo) {
        setSeenNotifications(new Set());
        localStorage.setItem("seenNotificationsTime", Date.now().toString());
      }
    }, 60000);

    return () => clearInterval(resetInterval);
  }, []);

  if (isLoading) {
    return (
      <header className="relative top-0 z-50 flex items-center justify-between h-20 px-1 py-5 transition-colors duration-300 bg-white border-b border-gray-200 md:px-1 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center space-x-8 md:space-x-20">
          <div className="flex items-center">
            <div className="w-[200px] h-[150px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded hidden"></div>
          </div>
        </div>
        <div className="flex items-center space-x-8 md:space-x-8">
          <div className="bg-gray-200 rounded-full w-9 h-9 dark:bg-gray-700 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-20 px-4 py-5 transition-all duration-300 ease-in-out bg-white border-b border-gray-200 md:px-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center space-x-3">
        <Link
          href="/pages/dashboard"
          className="flex items-center cursor-pointer"
        >
          {isBelow768px ? (
            <Image
              src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/aa30588b-497e-4ee2-c571-c266ac0d7600/public"
              alt="Mobile Logo"
              width={40}
              height={40}
              className="w-10 h-10 ml-3"
            />
          ) : (
            <img
              src={isDark ? "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/90518ab2-fa82-41f3-6c64-b4deb895b400/public" : "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/fe1ca51e-89c0-42d6-6bac-1c2af84c4500/public"}
              alt="Logo"
              className="h-8 transition-opacity duration-300 logo-img"
            />
          )}
        </Link>

        {!isBelow1236px && (
          <nav className="flex gap-2 text-sm font-semibold leading-5 text-gray-600 transition-colors duration-300 dark:text-gray-300">
            {menuItems.map((item) =>
              item.isDropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdowns(prev => ({ ...prev, [item.label]: true }))}
                  onMouseLeave={() => setOpenDropdowns(prev => ({ ...prev, [item.label]: false }))}
                >
                  <button className="flex items-center gap-1 px-2 py-2 transition-all duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dashboard-text-name">
                  {item.icon ? item.icon : <Image
                    src={item.img}
                    width={15}
                    height={15}
                    className="dark:invert"
                    alt=""
                  />}
                    {item.label}
                    <svg
                      className="w-2.5 h-2.5 ms-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>

                  {openDropdowns[item.label] && (
                    <div className="absolute left-0 z-50 bg-white border divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {item.dropdownItems.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              onClick={() => setOpenDropdowns(prev => ({ ...prev, [item.label]: false }))}
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    pathname === item.href
                      ? "text-white px-2 py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 transition-all duration-200 dashboard-text-name"
                  }
                >
                  {item.icon ? item.icon : <Image
                    src={item.img}
                    width={15}
                    height={15}
                    className="dark:invert"
                    alt=""
                  />}
                  {item.label}
                </Link>
              )
            )}
          </nav>
        )}
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button
          onClick={toggleDarkMode}
          className="relative p-2 transition-all duration-300 ease-in-out bg-gray-100 rounded-full cursor-pointer dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 group"
          aria-label="Toggle dark mode"
        >
          <div className="flex items-center justify-center w-5 h-5">
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" />
            )}
          </div>
          <div className="absolute inset-0 transition-transform duration-200 scale-0 rounded-full bg-blue-500/20 group-active:scale-100"></div>
        </button>

        <div ref={walletRef} className="relative">
          <div
            className="relative p-2 transition-all duration-300 ease-in-out bg-gray-100 rounded-full cursor-pointer dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 group"
            onClick={(e) => {
              e.stopPropagation();
              setShowWalletMenu(!showWalletMenu);
            }}
          >
            <div className="flex items-center justify-center w-5 h-5">
              <MdAccountBalanceWallet className="w-5 h-5 text-gray-700 transition-colors duration-200 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
            </div>
            <div className="absolute inset-0 transition-transform duration-200 scale-0 rounded-full bg-blue-500/20 group-active:scale-100"></div>
          </div>

          {showWalletMenu && (
            <div
              className={`fixed md:absolute right-4 md:right-0 z-50 w-[calc(100%-2rem)] md:w-64 mt-2 md:mt-5 origin-top-right bg-gray-900 rounded-md shadow-lg ring-1 ring-gray-700`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative py-1">
                <h1 className="px-4 mt-3 text-base font-semibold text-white">
                  Wallet Balance
                </h1>
                <hr className="mt-2 border-gray-700" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWalletMenu(false);
                  }}
                  className="absolute text-gray-400 top-3 right-3 hover:text-white focus:outline-none"
                >
                  <FaTimes size={18} />
                </button>
                <div className="flex justify-between px-4 py-3 text-sm font-medium text-gray-300 rounded md:text-base hover:bg-gray-800">
                  <span>Deposit Wallet:</span>
                  <span className="text-white">
                    ${depositWallet?.toFixed(4) || "0.0000"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3 text-sm font-medium text-gray-300 rounded md:text-base hover:bg-gray-800">
                  <span>Performance Wallet:</span>
                  <span className="text-white">
                    ${incomeWallet?.toFixed(4) || "0.0000"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3 text-sm font-medium text-gray-300 rounded md:text-base hover:bg-gray-800">
                  <span>Yield Wallet:</span>
                  <span className="text-white">
                    ${rentWallet?.toFixed(4) || "0.0000"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={notifyRef} className="relative">
          <div
            onClick={handleNotificationClick}
            className="relative p-2 transition-all duration-300 ease-in-out bg-gray-100 rounded-full cursor-pointer dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 group"
          >
            <div className="flex items-center justify-center w-5 h-5">
              <Bell className="w-5 h-5 text-gray-700 transition-colors duration-200 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <div className="absolute inset-0 transition-transform duration-200 scale-0 rounded-full bg-blue-500/20 group-active:scale-100"></div>
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1 animate-pulse">
              {count?.unseenCount > 99 ? "99+" : count?.unseenCount ?? 0}
            </span>
          </div>

          {notificationsDropDown && (
            <div
              className={`fixed md:absolute right-4 md:right-0 z-50 w-[calc(100%-2rem)] md:w-64 mt-8 md:mt-8 origin-top-right bg-gray-900 rounded-md shadow-lg ring-1 ring-gray-700`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative overflow-y-auto scrollbar-hide hover:scrollbar-default ${
                  notificationData?.length > 0
                    ? notificationData.length > 3
                      ? "h-96"
                      : "h-auto max-h-48"
                    : "h-auto max-h-32"
                }`}
              >
                <div className="sticky top-0 z-10 bg-gray-900 rounded-md">
                  <h1 className="px-4 pt-3 text-base font-semibold text-white">
                    Notifications ({actualUnseenCount})
                  </h1>
                  <hr className="mt-2 border-gray-700" />
                  <button
                    onClick={handleCloseNotifications}
                    className="absolute text-gray-400 top-3 right-3 hover:text-white focus:outline-none"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                {notificationData && notificationData.length > 0 ? (
                  notificationData.map((msg, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-between px-4 py-3 text-sm font-medium text-gray-300 rounded cursor-pointer md:text-base hover:bg-gray-800"
                      onClick={() => handleIndividualNotificationClick(msg)}
                    >
                      <span className="text-white">{msg?.AdminRemarks}</span>
                      <hr className="mt-2 border-gray-700" />
                    </div>
                  ))
                ) : (
                  <span className="block px-4 py-3 text-white">
                    No new notifications
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className="flex items-center"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{ cursor: "pointer" }}
        >
          <div
            ref={profileRef}
            className="relative flex items-center justify-between p-2 rounded-md text-active-new md:rounded-full lg:bg-blue-400 lg:flex lg:justify-between lg:rounded-full lg:items-center"
          >
            <span className="mr-1 text-white text-md">{Login}</span>
            <div className="flex flex-col items-center space-y-1 cursor-pointer">
              <div className="flex items-center space-x-2">
                {profileImage ? (
                  <div className="hidden overflow-hidden border-2 border-gray-200 rounded-full w-7 h-7 dark:border-gray-600 sm:block">
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="hidden overflow-hidden border-2 border-gray-200 rounded-full w-7 h-7 dark:border-gray-600 sm:block">
                    <Image
                      src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/91e96003-1124-41ea-277d-460f3b3c3600/public"
                      alt="Profile"
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
            {showProfileMenu && (
              <div
                className={`relative lg:right-60 right-52 lg:top-6 z-50 mt-2 ${
                  isBelow768px ? "mr-2" : ""
                }`}
              >
                <ProfileMenu onClose={() => setShowProfileMenu(false)} />
              </div>
            )}
          </div>
        </div>

        {isBelow1236px && (
          <button
            onClick={toggleMobileMenu}
            className="p-2 ml-2 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        )}
      </div>

      {isBelow1236px && isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute left-0 right-0 z-50 transition-all duration-300 bg-white border-t border-gray-200 shadow-lg top-full dark:bg-gray-900 dark:border-gray-700"
        >
          <nav className="flex flex-col px-6 py-6 space-y-1">
            {menuItemsForMobile.map((item) =>
              item.isDropdown ? (
                <div key={item.label} className="relative">
                  <div className="flex items-center">
                    <Link
                      href="#"
                      className={`flex items-center w-full px-2 py-2 rounded-md transition-all duration-200 text-left text-[30px] ${
                        pathname?.startsWith("/pages/reports") ||
                        pathname?.startsWith("/pages/transaction-history") ||
                        pathname?.startsWith("/pages/analytics") ||
                        pathname?.startsWith("/pages/Agents")
                          ? "text-white dark:text-white dashboard-text-name text-active"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white text-gray-500 dark-mode-img dashboard-text-name"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdowns(prev => ({ ...prev, [item.label]: !prev[item.label] }));
                      }}
                    >
                      {item.icon ? item.icon : <Image
                        src={item.img}
                        width={15}
                        height={15}
                        alt=""
                        className={
                          pathname?.startsWith("/pages/reports")
                            ? "text-white"
                            : "dark:invert"
                        }
                      />}
                      <span className="flex-grow ml-2 text-left text-[15px]">
                        {item.label}
                      </span>
                      <span
                        className={`transition-transform ${
                          openDropdowns[item.label] ? "rotate-90" : ""
                        }`}
                      >
                        ›
                      </span>
                    </Link>
                  </div>

                  {openDropdowns[item.label] && (
                    <div className="pl-6 mt-1 space-y-1">
                      {item.dropdownItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="flex items-center gap-3 px-2 py-2 text-[15px] text-gray-600 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setOpenDropdowns(prev => ({ ...prev, [item.label]: false }));
                          }}
                        >
                          {subItem.label === "Income Report" && (
                            <FaFileInvoiceDollar className="text-[14px] dark:text-gray-300" />
                          )}
                          {subItem.label === "Wallet Manager" && (
                            <RiWallet3Line className="text-[14px] dark:text-gray-300" />
                          )}
                          {subItem.label === "Analytics" && (
                            <RiPieChartLine className="text-[14px] dark:text-gray-300" />
                          )}
                          {subItem.label === "My Agents" && (
                            <RiTeamLine className="text-[14px] dark:text-gray-300" />
                          )}
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-[16px] px-2 py-2 rounded-md transition-all duration-200 ${
                    pathname === item.href
                      ? "text-white dark:text-white dashboard-text-name text-active"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white text-gray-600 dark-mode-img dashboard-text-name"
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center justify-start gap-4">
                    {item.icon ? item.icon : <Image
                      src={item.img}
                      width={15}
                      height={15}
                      alt=""
                      className={
                        pathname === item.href ? "text-white" : "dark:invert"
                      }
                    />}
                    {item.label}
                  </div>
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
