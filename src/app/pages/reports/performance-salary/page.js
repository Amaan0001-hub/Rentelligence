"use client";
import React, { useEffect } from "react";
import { RiCheckLine } from "react-icons/ri";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { getPerformanceRewardListByURID } from "@/app/redux/slices/walletReportSlice";
import { getUserId } from "@/app/api/auth";
import { RiFlashlightLine } from "react-icons/ri";
import { Briefcase } from "lucide-react";
import { BsBullseye } from "react-icons/bs";
import { MdTrendingUp } from "react-icons/md";
import { RiBatteryChargeLine } from "react-icons/ri";

const PerformanceIncome = () => {
  const dispatch = useDispatch();
  const { PerformanceRewardListData } = useSelector((state) => state.wallet);

  const salaryStrongLeg =
    PerformanceRewardListData?.performanceReward?.[0]?.SalaryStrongLeg || "";
  const salarystrongLegBusines =
    PerformanceRewardListData?.performanceReward?.[0]?.SalarystrongLegBusines ||
    "";
  const salaryweakerLegBusines =
    PerformanceRewardListData?.performanceReward?.[0]?.SalaryweakerLegBusines ||
    "";
  const legwisefreshbus =
    PerformanceRewardListData?.performanceReward?.[0]?.legwisefreshbus || "";
  const remainingDirectBus =
    PerformanceRewardListData?.performanceReward?.[0]?.RemainingDirectBus || "";
  const NextReleaseDate =
    PerformanceRewardListData?.performanceReward?.[0]?.NextReleaseDate || "";

  useEffect(() => {
    const data = getUserId();
    dispatch(getPerformanceRewardListByURID(data));
  }, [dispatch]);

  const exportToExcel = () => {
    if (!PerformanceRewardListData?.performanceReward) return;

    const excelData = PerformanceRewardListData.performanceReward.map(
      (rank, id) => ({
        "S.no": id,
        Rank: rank.rRank,
        PowerLeg: rank.PowerLeg,
        WeakerLeg: rank.WeakerLeg,
        Rewards: rank.Rewards,
        Status: rank.Statusx,
      })
    );
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performance Income");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Performance_Income_Report.xlsx");
  };

  return (
    <div>
      <div className="flex-1 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="mb-2 text-lg sm:text-xl font-semibold text-gray-600 dark:text-white">
              Performance-Based Salary Tracker
            </h1>
            <p className="text-gray-600 dark:text-white">
              Analyze Power Leg vs. Weaker Leg for performance-based earnings.
            </p>
          </div>

          <button
            className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700 whitespace-nowrap self-start sm:self-auto"
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
                  Power Leg ID
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {salaryStrongLeg}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <RiFlashlightLine className="text-xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-white">
                  Power Business
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {salarystrongLegBusines}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg">
                <RiBatteryChargeLine className="text-xl text-pink-600" />
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-white">
                  Other Leg Business
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {salaryweakerLegBusines}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Briefcase className="text-xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between font-semibold">
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-white">
                  Monthly Direct Sales Target
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {legwisefreshbus}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                <BsBullseye className="text-xl text-red-600" />
              </div>
            </div>
          </div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-white">
                  Remaining Monthly Direct Sales
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {remainingDirectBus}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                <MdTrendingUp className="text-xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-white">
                  Next Salary Release Date
                </p>
                <p className="text-sm text-gray-600 dark:text-white">
                  {NextReleaseDate}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100">
                <RiMoneyDollarCircleLine className="text-xl text-voilet-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" overflow-x-auto rounded">
        <table className="min-w-full border border-gray-200 shadow-sm rounded-xl">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                #
              </th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                Rank
              </th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                Power Leg
              </th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                Weaker Leg
              </th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                Rewards
              </th>
              <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PerformanceRewardListData?.performanceReward?.length > 0 ? (
              PerformanceRewardListData.performanceReward.map((rank, index) => (
                <tr key={index + 1} className="transition-colors">
                  <td className="px-6 py-4 text-sm text-center text-gray-900 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank.rRank}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank.PowerLeg}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank.WeakerLeg}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                    {rank.Rewards}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center border-b border-gray-100 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${
                          rank.Statusx === "Qualify "
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          rank.Statusx === "Running"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                      `}
                    >
                      {rank.Statusx}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  No performance reward data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceIncome;
