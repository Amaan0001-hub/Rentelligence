"use client";
import React, { useEffect } from "react";
import { RiTrophyLine } from "react-icons/ri";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { RiUserAddLine } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderShipbyURID } from "@/app/redux/slices/walletReportSlice";
import { getUserId } from "@/app/api/auth";
import {
  School,
  Handshake,
  Briefcase,
  Brain,
  Globe,
  Plane,
  BarChart2,
  Eye,
  Star,
  Trophy,
  Crown,
  Medal
} from "lucide-react";

const LeaderShipRank = () => {
  const dispatch = useDispatch();
  const { getLeaderShipData } = useSelector((state) => state.wallet);
  const currentRank = getLeaderShipData?.leaderShip[0]?.CurrentRank;
  const nextRank = getLeaderShipData?.leaderShip[0]?.NextRank;
  const shortDirectTeamFOrNextRank =
    getLeaderShipData?.leaderShip[0]?.ShortDirectTeamFOrNextRank;

  useEffect(() => {
    const data = getUserId();
    dispatch(getLeaderShipbyURID(data));
  }, [dispatch]);

  const exportToExcel = () => {
    const excelData = getLeaderShipData?.leaderShip?.map((rank, id) => ({
      "S.no": id,
      Rank: rank.uRank,
      Income: rank.Income,
      "Direct Team": rank.DirectTeam,
      "Direct Bussiness": rank.DirectPack,
      // Status: rank.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leadership Ranks");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Leadership_Rank_Report.xlsx");
  };

  const iconMap = {
    school: { icon: School, color: "#4F46E5" },       
    handshake: { icon: Handshake, color: "#16A34A" }, 
    briefcase: { icon: Briefcase, color: "#F59E0B" }, 
    brain: { icon: Brain, color: "#EC4899" },         
    globe: { icon: Globe, color: "#0EA5E9" },         
    airplane: { icon: Plane, color: "#6366F1" },      
    "chart-bar": { icon: BarChart2, color: "#10B981" }, 
    eye: { icon: Eye, color: "#F87171" },             
    star: { icon: Star, color: "#EAB308" },           
    trophy: { icon: Trophy, color: "#F59E0B" },       
    "ios-crown": { icon: Crown, color: "#CA8A04" },   
    medal: { icon: Medal, color: "#F43F5E" },         
  };


  return (
    <div className="flex-1 pt-6 ">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-xl font-semibold text-gray-600 dark:text-white">
            Leadership Rank Progression Overview
          </h1>

          <p className="text-gray-600 dark:text-white">
            Your Path to Higher Ranks and Greater Rewards.
          </p>
        </div>

        <button
          className="self-start px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700 whitespace-nowrap sm:self-auto"
          onClick={exportToExcel}
        >
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-white">
                Current Rank{" "}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                {currentRank}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <RiTrophyLine className="text-xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-white">
                Next Rank
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                {nextRank}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <HiOutlineTrendingUp className="text-xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-white">
                Required Achievers for Next Rank{" "}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                {shortDirectTeamFOrNextRank}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <RiUserAddLine className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-white">
            Leadership Rank
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 shadow-sm rounded-xl">
            <thead>
              <tr>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                  #
                </th>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                  RANK
                </th>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                  INCOME
                </th>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                  DIRECT TEAM
                </th>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                  Direct Bussiness
                </th>
                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {getLeaderShipData?.leaderShip?.map((rank, index) => (
                <tr key={index + 1} className="transition-colors ">
                  <td className="px-6 py-4 text-sm text-center text-gray-900 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {index + 1}
                  </td>
                  {/* <td className="px-6 py-4 text-sm font-bold text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank?.uRank}{rank?.RankIcon}
                  </td> */}
                  <td className="px-6 py-4 text-sm font-bold text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank?.uRank}
                    {(() => {
                      const entry = iconMap[rank?.RankIcon];
                      if (!entry) return null;
                      const IconComponent = entry.icon;
                      return <IconComponent color={entry.color} className="inline-block w-5 h-5 ml-2" />;
                    })()}
                  </td>


                  <td className="px-6 py-4 text-sm font-bold text-center text-green-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank.Income}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank.DirectTeam}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank.DirectPack}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center border-b border-gray-100 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
    ${rank.lbStatus === "Qualify " ? "bg-green-100 text-green-800" : ""}
    ${rank.lbStatus === "Running" ? "bg-yellow-100 text-yellow-800" : ""}
  `}
                    >
                      {rank.lbStatus}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderShipRank;
