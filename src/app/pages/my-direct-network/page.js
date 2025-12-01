"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEncryptedLocalData } from "@/app/api/auth";
import {
  getdirectMember,
} from "@/app/redux/slices/communitySlice";
import { NftSection } from "@/app/components/NftSection";
import { usePathname } from "next/navigation";
import { getPageName } from "@/app/utils/utils";
import { getUserId } from "@/app/api/auth";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaFileInvoiceDollar,
  FaLock,
} from "react-icons/fa";
import { RiCheckLine } from "react-icons/ri";
import { FaRankingStar } from "react-icons/fa6";

import {
  RiPercentLine,
} from "react-icons/ri";

export default function MyDirectNetwork() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pageName = getPageName(pathname);


  const { directMemberData } = useSelector(
    (state) => state.community
  );
  const [statusFilter, setStatusFilter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Team Status");
  const dropdownRef = useRef(null);
  const options = ["Active", "Inactive"];

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
  }, [dispatch]);


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
      <div className="px-4 sm:px-6 lg:px-8 ">
        {/* Main Content Area */}
        <main className="pb-6 md:px-0 flex flex-col justify-start pt-4 sm:pt-5 gap-6 sm:gap-10 lg:flex-row md:flex-col font-[family-name:var(--font-geist-sans)]">
            <section className="w-full ">
              <div className="bg-white border rounded-xl shadow-xl dark:bg-[#111827]">
                <div
                  style={{
                    borderTopLeftRadius: "inherit",
                    borderTopRightRadius: "inherit",
                  }}
                  className="flex items-center justify-between pt-3 pb-3 pl-3 pr-3 text-base font-bold text-white sm:pl-5 sm:pr-5 sm:text-lg affiliate-card-header affiliate-card-text"
                >
                  <span className="mb-2 text-base font-bold text-white sm:text-lg sm:mb-0">
                    My Direct Network
                  </span>

                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="relative flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 min-w-[120px] sm:min-w-[140px]"
                      style={{ width: "150px" }}
                      onClick={toggleDropdown}
                    >
                      <span
                        className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${
                          selectedOption === "Team Status"
                            ? "text-gray-400"
                            : "text-purple-700"
                        }`}
                      >
                        {selectedOption}
                      </span>
                      <div
                        className={`ml-1 sm:ml-2 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <svg
                          className="w-3 h-3 text-purple-500 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 hover:opacity-20"></div>
                    </div>

                    {isOpen && (
                      <div className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border-2 border-purple-200 shadow-xl sm:mt-2 top-full rounded-xl max-h-60 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
                        {options.map((option) => (
                          <div
                            key={option}
                            className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-purple-700 font-medium cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-800 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleOptionClick(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-6 pb-8 pl-2 pr-2 mb-8 space-y-3 overflow-y-auto sm:pt-8 sm:pb-10 sm:mb-12 sm:space-y-4 h-80 sm:h-96">
                  {filteredMembers?.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between px-2 pt-3 pb-3 transition-colors border-t rounded-lg sm:px-3 sm:pt-4 sm:pb-4 first:border-t-0 first:pt-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Left: Avatar + Info */}
                      <div className="flex items-start w-full gap-2 sm:gap-4">
                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-0">
                          <div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-9">
                              <div className="flex items-center">
                                <div className="flex items-center justify-center w-10 h-10 bg-purple-500 rounded-full sm:w-12 sm:h-12">
                                  <span className="text-base font-bold text-white sm:text-lg">
                                    {member.name
                                      .split(" ")
                                      .map((word) => word.charAt(0))
                                      .slice(0, 2)
                                      .join("")}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-blue-600 bg-blue-100 rounded-full sm:w-6 sm:h-6 dark:bg-blue-900/50 dark:text-blue-300">
                                    <FaUser className="text-xs" />
                                  </div>
                                  <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                    {member.loginid}
                                  </span>
                                </div>

                                <div className="flex items-center mt-1 sm:mt-2">
                                  <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-purple-600 bg-purple-100 rounded-full sm:w-6 sm:h-6 dark:bg-purple-900/50 dark:text-purple-300">
                                    <FaPhone className="text-xs" />
                                  </div>
                                  <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                    {member.mobile}
                                  </span>
                                </div>
                                <div className="flex items-center mt-1 sm:mt-2">
                                  <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-yellow-600 bg-yellow-100 rounded-full sm:w-6 sm:h-6 dark:bg-yellow-900/50 dark:text-yellow-300">
                                    <FaCalendarAlt className="text-xs" />
                                  </div>
                                  <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                    {member.regDate}
                                  </span>
                                </div>
                                <div className="flex items-center mt-1 sm:mt-2">
                                  <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-pink-600 bg-pink-100 rounded-full sm:w-6 sm:h-6 dark:bg-pink-900/50 dark:text-pink-300">
                                    <FaFileInvoiceDollar className="text-xs" />
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                      Lease Amount :
                                    </span>
                                    <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                      {Number(member?.leaseAmount) > 0
                                        ? `$${Number(
                                            member.leaseAmount
                                          ).toFixed(2)}`
                                        : "$0"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center mt-1 sm:mt-2">
                                  <div className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full text-emerald-600 bg-emerald-100 sm:w-6 sm:h-6 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <FaRankingStar className="text-xs" />
                                  </div>
                                  <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                    {member.urank}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="sm:ml-4">
                            <div className="flex items-center">
                              <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-blue-600 bg-blue-100 rounded-full sm:w-6 sm:h-6 dark:bg-blue-900/50 dark:text-blue-300">
                                <FaUser className="text-xs" />
                              </div>
                              <span className="text-xs font-semibold text-gray-800 sm:text-sm dark:text-white">
                                {member.name}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 sm:mt-2">
                              <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-green-600 bg-green-100 rounded-full sm:w-6 sm:h-6 dark:bg-green-900/50 dark:text-green-300">
                                <FaEnvelope className="text-xs" />
                              </div>
                              <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                {member.email}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 sm:mt-2">
                              {member.topupDate === "Id not Activated" ? (
                                <span className="inline-flex items-center justify-center w-4 h-4 mr-2 text-red-600 bg-red-100 rounded-full sm:w-5 sm:h-5 dark:bg-red-900/30 dark:text-red-300">
                                  <FaLock className="text-xs" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-4 h-4 mr-2 text-green-600 bg-green-100 rounded-full sm:w-5 sm:h-5 dark:bg-green-900/30 dark:text-green-300">
                                  <RiCheckLine className="text-xs" />
                                </span>
                              )}
                              <span
                                className={`text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ml-1 ${
                                  member.topupDate === "Id not Activated"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                } font-medium`}
                              >
                                {member.topupDate}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 sm:mt-2">
                              <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-indigo-600 bg-indigo-100 rounded-full sm:w-6 sm:h-6 dark:bg-indigo-900/50 dark:text-indigo-300">
                                <FaUsers className="text-xs" />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                  Team Buss. :
                                </span>

                                <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                  {Number(member?.teamBusiness) > 0
                                    ? `$${Number(member.teamBusiness).toFixed(
                                        2
                                      )}`
                                    : "$0"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center mt-1 sm:mt-2">
                              <div className="inline-flex items-center justify-center w-5 h-5 mr-2 text-indigo-600 bg-indigo-100 rounded-full sm:w-6 sm:h-6 dark:bg-indigo-900/50 dark:text-indigo-300">
                                <RiPercentLine className="text-xs" />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                  DYR :
                                </span>
                                <span className="text-xs text-gray-800 sm:text-sm dark:text-white">
                                  {member.DYRPercentage || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
        </main>
      </div>
    </>
  );
}
