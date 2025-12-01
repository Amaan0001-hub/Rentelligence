"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEncryptedLocalData } from "@/app/api/auth";
import {
  getdirectMember,
  userAffiliateDashboard,
} from "@/app/redux/slices/communitySlice";
import { NftSection } from "@/app/components/NftSection";
import { usePathname } from "next/navigation";
import { getPageName } from "@/app/utils/utils";
import { getUserId } from "@/app/api/auth";

// Import icons
import {
  FaCalendarAlt,
} from "react-icons/fa";

import {
  RiTimerLine,
  RiLineChartLine,
  RiFlowChart,
  RiRocketLine,
  RiShareLine,
  RiAwardLine,
  RiGroupLine,
  RiBankCardLine,
  RiMoneyDollarCircleLine,
  RiUserStarLine,
  RiTeamLine,
  RiKeyLine,
  RiBarChartLine,
  RiBriefcaseLine,
} from "react-icons/ri";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AIBUSINESSHUB() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const { directMemberData, affiliate } = useSelector(
    (state) => state.community
  );
  const [statusFilter, setStatusFilter] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Team Status");
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const AuthLogin = getEncryptedLocalData("AuthLogin");
    const data = {
      urid: getUserId(),
      statusId: "",
      loginid: AuthLogin,
    };
    dispatch(getdirectMember(data));
    dispatch(userAffiliateDashboard());
  }, []);

  useEffect(() => {
    if (!affiliate?.BoosterRemDateTime) return;
    const target = new Date(affiliate.BoosterRemDateTime);
    const updateTimer = () => {
      const now = new Date();
      const diff = target - now;
      if (diff > 0) {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setHours(h);
        setMinutes(m);
        setSeconds(s);
      } else {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [affiliate?.BoosterRemDateTime]);


  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setStatusFilter(option === "Active" ? "1" : "5");
  };

  const filteredMembers = directMemberData?.filter((member) => {
    if (statusFilter === "1") {
      return member.topupDate === "Activated";
    } else if (statusFilter === "5") {
      return member.topupDate === "Id not Activated";
    }
    return true;
  });

  return (
    <>
      <NftSection pageName={pageName} />
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Top Stats Cards */}
        <div className="relative z-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Earning Card */}
          <div className="relative p-4 overflow-hidden text-white border dark:text-white rounded-lg sm:p-6 bg-gradient-to-r from-green-500 to-green-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xs font-medium sm:text-sm text-white/80">
                  Total Investment
                </h3>
                <p className="text-xl font-bold sm:text-2xl lg:text-3xl">
                  ${Number(affiliate?.TotalInvestment || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full sm:w-12 sm:h-12">
                <RiLineChartLine className="text-lg text-white sm:text-xl" />
              </div>
            </div>
            <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -top-3 sm:-top-4 bg-white/10"></div>
            <div className="absolute w-20 h-20 rounded-full sm:w-24 sm:h-24 -right-6 sm:-right-8 -bottom-6 sm:-bottom-8 bg-white/5"></div>
          </div>
          {/* Total Direct Team Card */}

          <div className="relative p-4 overflow-hidden text-white dark:text-white border rounded-lg sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xs font-medium sm:text-sm text-white/80">
                  Total Earning
                </h3>
                <p className="text-xl font-bold sm:text-2xl lg:text-3xl">
                  ${Number(affiliate?.TotalEarning || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full sm:w-12 sm:h-12">
                <RiLineChartLine className="text-lg text-white sm:text-xl" />
              </div>
            </div>
            <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -top-3 sm:-top-4 bg-white/10"></div>
            <div className="absolute w-20 h-20 rounded-full sm:w-24 sm:h-24 -right-6 sm:-right-8 -bottom-6 sm:-bottom-8 bg-white/5"></div>
          </div>

          {/* Total Pending Earning Card */}
          <div className="relative p-4 overflow-hidden text-white border dark:text-white rounded-lg sm:p-6 bg-gradient-to-br from-purple-500 to-purple-500 ">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xs font-medium sm:text-sm text-white/80">
                  Earning Limit
                </h3>
                <p className="text-xl font-bold sm:text-2xl lg:text-3xl">
                  ${Number(affiliate?.EarningLimit || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#b285de] rounded-full">
                <RiLineChartLine className="text-lg text-white sm:text-xl" />
              </div>
            </div>
            <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -top-3 sm:-top-4 bg-white/10"></div>
            <div className="absolute w-20 h-20 rounded-full sm:w-24 sm:h-24 -right-6 sm:-right-8 -bottom-6 sm:-bottom-8 bg-white/5"></div>
          </div>

          {/* Total Team Business Card */}
          <div className="relative p-4 sm:p-6 overflow-hidden text-white dark:text-white border rounded-lg bg-gradient-to-r from-[#f97316] to-[#ea580c]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xs font-medium sm:text-sm text-white/80">
                  Remaining Limit
                </h3>
                <p className="text-xl font-bold sm:text-2xl lg:text-3xl">
                  ${Number(affiliate?.RemainingLimit || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#f97316] rounded-full">
                <RiLineChartLine className="text-lg text-white sm:text-xl" />
              </div>
            </div>
            <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -top-3 sm:-top-4 bg-white/10"></div>
            <div className="absolute w-20 h-20 rounded-full sm:w-24 sm:h-24 -right-6 sm:-right-8 -bottom-6 sm:-bottom-8 bg-white/5"></div>
          </div>
        </div>

        {/* Booster Timer */}
        <div className="p-4 mt-4 mb-6 bg-white rounded-lg shadow-lg dark:bg-gray-900 dark:border dark:border-white sm:p-6 sm:mt-5">
          <div className="flex items-center mb-4 space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500">
              <RiTimerLine className="text-lg text-white sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                Booster Timer
              </h3>
              <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400 ">
                Time remaining for next boost
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1" style={{ width: "100%", sm: "70%" }}>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="text-center">
                  <div className="p-3 text-white rounded-lg sm:p-4 bg-gradient-to-r from-orange-500 to-red-500">
                    <div className="text-lg font-bold sm:text-2xl">
                      {hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm opacity-80">Hours</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-3 text-white rounded-lg sm:p-4 bg-gradient-to-r from-orange-500 to-red-500">
                    <div className="text-lg font-bold sm:text-2xl">
                      {minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm opacity-80">Minutes</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-3 text-white rounded-lg sm:p-4 bg-gradient-to-r from-orange-500 to-red-500">
                    <div className="text-lg font-bold sm:text-2xl">
                      {seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm opacity-80">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex-1 mt-4 sm:mt-0"
              style={{ width: "100%", sm: "30%" }}
            >
              <div className="flex flex-col justify-center h-full p-3 text-center border-2 border-green-500 rounded-lg sm:p-4 bg-gradient-to-r from-green-100 to-green-200">
                <div className="mb-1 text-base font-bold text-green-800 sm:text-lg">
                  {affiliate?.BoosterRemark}
                </div>
                <div className="text-xs text-green-700 sm:text-sm">
                  Booster Status
                </div>
              </div>
            </div>
          </div>
          <div className="h-2 mt-4 bg-gray-200 rounded-full">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>

        {/* Incomes & Withdrawals */}
        <div className="p-4 mb-6 bg-white rounded-lg shadow-lg dark:bg-gray-900 dark:border dark:border-white sm:p-6 sm:mb-8">
          <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900 dark:text-gray-200 sm:mb-6 sm:text-2xl">
            <RiMoneyDollarCircleLine className="mr-2 text-xl text-green-600 sm:mr-3 sm:text-2xl" />
            Incomes
          </h2>
          <div className="grid grid-cols-1 gap-3 mb-4 sm:gap-4 sm:mb-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                    Agentic Cascade Commission
                  </h4>
                  <p className="text-lg font-bold sm:text-xl">
                    ${Number(affiliate?.AgenticCascadeIncome || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                  <RiFlowChart className="text-sm text-white sm:text-lg" />
                </div>
              </div>
              <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
              <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
            </div>

            <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-green-500 to-green-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                    Weekly Rental Yield
                  </h4>
                  <p className="text-lg font-bold sm:text-xl">
                    ${Number(affiliate?.WeeklyRentalIncome || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                  <FaCalendarAlt className="text-sm text-white sm:text-lg" />
                </div>
              </div>
              <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
              <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
            </div>

            <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                    Booster Profit Protocol (BPP)
                  </h4>
                  <p className="text-lg font-bold sm:text-xl">
                    ${Number(affiliate?.BoosterProfitIncome || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                  <RiRocketLine className="text-sm text-white sm:text-lg" />
                </div>
              </div>
              <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
              <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
            </div>

            <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-teal-500 to-teal-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                    Dynamic Referral Yield (DRY)
                  </h4>
                  <p className="text-lg font-bold sm:text-xl">
                    ${Number(affiliate?.DynamicReferral || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                  <RiShareLine className="text-sm text-white sm:text-lg" />
                </div>
              </div>
              <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
              <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
            </div>

            <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-yellow-500 to-yellow-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                    Leadership Bonus
                  </h4>
                  <p className="text-lg font-bold sm:text-xl">
                    ${Number(affiliate?.LeadershipBonus || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                  <RiAwardLine className="text-sm text-white sm:text-lg" />
                </div>
              </div>
              <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
              <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
            </div>

            <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-indigo-500 to-indigo-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                    Performance Income
                  </h4>
                  <p className="text-lg font-bold sm:text-xl">
                    ${Number(affiliate?.PerformanceIncome || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                  <RiLineChartLine className="text-sm text-white sm:text-lg" />
                </div>
              </div>
              <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
              <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
            </div>

            <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-pink-500 to-pink-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                    Unity Revenue Club
                  </h4>
                  <p className="text-lg font-bold sm:text-xl">
                    ${Number(affiliate?.UnityRevenueClub || 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                  <RiGroupLine className="text-sm text-white sm:text-lg" />
                </div>
              </div>
              <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
              <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
            </div>
          </div>

          <div className="pt-4 border-t sm:pt-6">
            <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-200 sm:mb-4 sm:text-lg">
              Withdrawals
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-red-500 to-red-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                      Performance Withdrawal
                    </h4>
                    <p className="text-lg font-bold sm:text-xl">
                      $
                      {Number(affiliate?.PerformanceWithdrawal || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                    <RiBankCardLine className="text-sm text-white sm:text-lg" />
                  </div>
                </div>
                <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
                <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
              </div>

              <div className="relative p-3 overflow-hidden text-white rounded-lg sm:p-4 bg-gradient-to-r from-orange-500 to-orange-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1 text-xs font-medium sm:text-sm text-white/90">
                      Yield Withdrawal
                    </h4>
                    <p className="text-lg font-bold sm:text-xl">
                      ${Number(affiliate?.YieldWithdrawal || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/20">
                    <RiMoneyDollarCircleLine className="text-sm text-white sm:text-lg" />
                  </div>
                </div>
                <div className="absolute w-12 h-12 rounded-full sm:w-16 sm:h-16 -right-1 sm:-right-2 -top-1 sm:-top-2 bg-white/10"></div>
                <div className="absolute w-16 h-16 rounded-full sm:w-20 sm:h-20 -right-3 sm:-right-4 -bottom-3 sm:-bottom-4 bg-white/5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-900 dark:border dark:border-white sm:p-6">
          <div className="flex items-center mb-4 space-x-3 sm:mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500">
              <RiBriefcaseLine className="text-lg text-white sm:text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
                Business Information
              </h3>
              <p className="text-sm text-gray-600 sm:text-base dark:text-gray-100">
                Your network performance overview
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4 sm:gap-6 sm:mb-6 sm:grid-cols-2">
            <div className="p-4 border-l-4 border-green-500 rounded-lg sm:p-6 bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex items-center mb-3 space-x-3">
                <RiUserStarLine className="text-lg text-green-600 sm:text-xl" />
                <h4 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Active Direct Members
                </h4>
              </div>
              <div className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {affiliate?.ActiveDirectMembers}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Business:{" "}
                <span className="font-semibold text-green-600">
                  ${Number(affiliate?.DirectBusiness || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-4 border-l-4 border-blue-500 rounded-lg sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center mb-3 space-x-3">
                <RiTeamLine className="text-lg text-blue-600 sm:text-xl" />
                <h4 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Total Downline
                </h4>
              </div>
              <div className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {affiliate?.TeamDownline}
              </div>
              <div className="text-xs text-gray-600 sm:text-sm">
                Business:{" "}
                <span className="font-semibold text-blue-600">
                  ${Number(affiliate?.TeamBusiness || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4 sm:gap-4 sm:mb-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-3 rounded-lg sm:p-4 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center mb-2 space-x-2">
                <RiKeyLine className="text-indigo-600" />
                <span className="text-xs font-medium text-gray-700 sm:text-sm">
                  Power Leg ID
                </span>
              </div>
              <div className="text-base font-semibold text-gray-900 sm:text-lg">
                {affiliate?.StrongLegID}
              </div>
            </div>

            <div className="p-3 rounded-lg sm:p-4 bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex items-center mb-2 space-x-2">
                <RiMoneyDollarCircleLine className="text-green-600" />
                <span className="text-xs font-medium text-gray-700 sm:text-sm">
                  Power Leg Business
                </span>
              </div>
              <div className="text-base font-semibold text-gray-900 sm:text-lg">
                ${Number(affiliate?.StrongLegBus || 0).toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-lg sm:p-4 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center mb-2 space-x-2">
                <RiBarChartLine className="text-orange-600" />
                <span className="text-xs font-medium text-gray-700 sm:text-sm">
                  Weaker Leg Business
                </span>
              </div>
              <div className="text-base font-semibold text-gray-900 sm:text-lg">
                ${Number(affiliate?.OtherLegBus || 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
            <div className="p-4 border-l-4 border-yellow-500 rounded-lg sm:p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center mb-3 space-x-3">
                <RiAwardLine className="text-lg text-yellow-600 sm:text-xl" />
                <h4 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Leadership Rank
                </h4>
              </div>
              <div className="text-xl font-bold text-gray-900 sm:text-2xl">
                {affiliate?.LeadershipRank}
              </div>
              <div className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                {affiliate?.LBPerCentage}
              </div>
            </div>

            <div className="p-4 border-l-4 border-purple-500 rounded-lg sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center mb-3 space-x-3">
                <RiFlowChart className="text-lg text-purple-600 sm:text-xl" />
                <h4 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Agentic Cascade Commission
                </h4>
              </div>
              <div className="mb-2 text-xs text-gray-600 sm:text-sm">
                Qualified Level
              </div>
              <div className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {affiliate?.AgenticCascadeCommission}
              </div>
            </div>
          </div>
        </div>

      </div>
    
    </>
  );
}
