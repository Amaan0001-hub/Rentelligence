"use client";
import { useState ,useEffect} from "react";
import { fundDirectorTabs } from "@/app/constants/constant";
import SelfDeposit from "./self-deposit/page";
import FundRequest from "./fund-request/page";
import InstantTransfer from "./instant-transfer/page";
import UserTransfer from "./user-transfer/page";
import WithDrawal from "./with-drawal/page";
import { usePathname } from "next/navigation";
import { NftSection } from "../../components/NftSection";

export default function FundDirector() {
  const [activeTab, setActiveTab] = useState("deposit");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  function getPName(pathname) {
    if (!pathname) return "";

    const parts = pathname.split("/");
    let last = parts[parts.length - 1] || parts[parts.length - 2];

    return last
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const pathname = usePathname();
  const pageName = getPName(pathname);

  return (
    <>
      <NftSection pageName={pageName} />
      <div className="w-full px-4 pb-4 mx-auto bg-white rounded sm:px-4 md:px-8 dark:bg-gray-900 ">
        <div className="p-2 text-white dark:text-red-400 overflow-x-auto border-b-2 border-[#1b1b37] dark:border-[#ffffff] rounded-md transition-all duration-200 dashboard-text-name">
          <div className="flex gap-4 overflow-x-scroll sm:gap-8 md:gap-28 whitespace-nowrap scrollbar-hide">
            {fundDirectorTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold focus:outline-none transition-colors duration-200  text-gray-600 dark:text-gray-300 flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-white px-2 py-2 rounded-md transition-all  duration-200 dashboard-text-name text-active"
                    : "hover:bg-#000-100 dark:text-blue-400  hover:text-blue-600 dark:hover:bg-[#6633ff] rounded-md px-2 py-2 transition-all duration-200 dashboard-text-name"
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2">
          {activeTab === "deposit" && <SelfDeposit />}
          {activeTab === "fundRequest" && <FundRequest />}
          {activeTab === "instant" && <InstantTransfer />}
          {activeTab === "userTransfer" && <UserTransfer />}
          {activeTab === "withdraw" && <WithDrawal />}
        </div>
      </div>
    </>
  );
}
