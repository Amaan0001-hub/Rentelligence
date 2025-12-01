"use client";
import { useState } from "react";
import IncomeWallet from "./performance-wallet/page";
import DepositFunds from "./deposit-wallet/page";
import { NftSection } from "@/app/components/NftSection";
import { usePathname } from 'next/navigation';
import { getPageName } from "@/app/utils/utils";
import HarvestWallet from "./harvest-wallet/page";
import Withdrawal from "./withdrawal/page";
import LeaderShipRank from "./leader-ship-rank/page";
import PerformanceIncome from "./performance-salary/page";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("income");
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <>
      <NftSection pageName={pageName}/>
      <div className="w-full px-4 mx-auto rounded-lg sm:px-6 md:px-8 lg:px-8 dark:bg-gray-900">
        <div className="p-2 flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 whitespace-nowrap text-white dark:text-red-400 overflow-x-auto border-b-2 scrollbar-hide dark:border-[#ffffff] rounded-md transition-all duration-200">
          <button
            className={`new-text px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
              activeTab === "income"
                ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("income")}
          >
            Deposit Wallet
          </button>
          <button
            className={`new-text px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
              activeTab === "topup"
                ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("topup")}
          >
            Performance Wallet
          </button>
          <button
            className={`new-text px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
              activeTab === "HarvestWallet"
                ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("HarvestWallet")}
          >
            Yield Wallet
          </button>
          <button 
            className={`new-text px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
              activeTab === "Withdrawal"
                ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("Withdrawal")}
          >
            Withdrawal
          </button>
          <button 
            className={`new-text px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
              activeTab === "leadershipRank"
                ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("leadershipRank")}
          >
            Leadership Rank
          </button>
          <button 
            className={`new-text px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
              activeTab === "performanceIncome"
                ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("performanceIncome")}
          >
           Performance Salary
          </button>
        </div>
        <div className="">
          {activeTab === "income" && <DepositFunds />}
          {activeTab === "topup" && <IncomeWallet />}
          {activeTab === "HarvestWallet" && <HarvestWallet/>}
          {activeTab === "Withdrawal" && <Withdrawal />}
          {activeTab === "leadershipRank" && <LeaderShipRank />}
          {activeTab === "performanceIncome" && <PerformanceIncome />}
        </div>
      </div>
    </>
  );
}