
"use client";
import { useState } from "react";
import { NftSection } from "@/app/components/NftSection";
import { usePathname } from 'next/navigation';
import { getPageName } from "@/app/utils/utils";
import TransactionData from "./transaction-data/page";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Agentic Cascade Commission"); // Set default tab
  const pathname = usePathname();
  const pageName = getPageName(pathname);

 
  const getTransactionType = (tabName) => {
    const map = {
      "Agentic Cascade Commission": "Agentic Cascade Commission",
      "Weekly Rental Yield": "Weekly Rental Yield",
      "Booster Profit Protocol": "Booster Profit Protocol",
      "Dynamic Referral Yield": "Dynamic Referral Yield",
      "Leadership Bonus": "Leadership Bonus",
      "Unity Revenue Club": "Unity Revenue Club"
    };
    return map[tabName] || "ALL";
  };

  return (
    <>
      <NftSection pageName={pageName}/>
      <div className="w-full px-4 mx-auto rounded-lg sm:px-6 md:px-8 lg:px-8 dark:bg-gray-900">
        <div className="p-2 flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 whitespace-nowrap text-white dark:text-red-400 overflow-x-auto border-b-2 scrollbar-hide dark:border-[#ffffff] rounded-md transition-all duration-200">
          {[
            "Agentic Cascade Commission",
            "Weekly Rental Yield", 
            "Booster Profit Protocol",
            "Dynamic Referral Yield",
            "Leadership Bonus",
            "Unity Revenue Club"
          ].map((tab) => (
            <button
              key={tab}
              className={`new-text px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200 ${
                activeTab === tab
                  ? "btn-active btn-new-active text-white px-1 sm:px-2 py-1 sm:py-2 rounded-md transition-all duration-200 dashboard-text-name text-active"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="">
          <TransactionData transType={getTransactionType(activeTab)} />
        </div>
      </div>
    </>
  );
}