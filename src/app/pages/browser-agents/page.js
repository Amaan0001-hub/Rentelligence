"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LeaseModal from "../../components/LeaseModal";
import { useDispatch } from "react-redux";
import { getAllProduct } from "@/app/redux/slices/productSlice";
import { RiStarLine } from "react-icons/ri";
import Loader from "../../components/Loader";
import { sortOptions } from "@/app/constants/constant";
import { motion } from "framer-motion";
import { UserX } from "lucide-react";
import { NftSection } from "@/app/components/NftSection";
import { getPageName } from "@/app/utils/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { X } from "react-feather";

import {
  RiMailLine,
  RiStarFill,
  RiTrophyLine,
  RiSettings4Line,
  RiUserHeartLine,
  RiLineChartLine,
  RiRocket2Line,
  RiRobotLine,
  RiMapPinLine,
} from "react-icons/ri";

export default function BrowserAgents() {
  const pathname = usePathname();
  const route = useRouter()
  const pageName = getPageName(pathname);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [month, setMonth] = useState("");
  const [image, setImage] = useState("");

  const { allProductData, loading } = useSelector((state) => state.product);

  const handleLeaseClick = (e, agent) => {
    e.stopPropagation();
    e.preventDefault();
    setProductId(agent.productId);
    setPrice(agent.price);
    setMonth(agent.toatalmonth);
    setImage(agent.imageUrl);
    if (!agent.disabled) {
      setSelectedAgent(agent);
      setOpenDialog(true);
    }
  };

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAgent(null);
  };

  const getStatusColorClass = (status) => {
    const s = status;
    if (s === "Available") {
      return "bg-green-100 text-white-800 dark:bg-green-900 dark:text-white-300";
    }
    if (s === "Not available") {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    }
    return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const filteredAgents = allProductData
  ?.filter((agent) =>
    agent.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  ?.sort((a, b) => (a.price || 0) - (b.price || 0));

  const sortedAgents = () => {
    let agents = [...filteredAgents];
    if (sortBy === "entrepreneur") {
      agents = agents.filter(
        (agent) => agent.price >= 100 && agent.price <= 2000
      );
    } else if (sortBy === "businessPro") {
      agents = agents.filter(
        (agent) => agent.price > 2000 && agent.price <= 10000
      );
    } else if (sortBy === "industrial") {
      agents = agents.filter((agent) => agent.price > 10000);
    }
    return agents;
  };
  const handleBuyClick = (e, agent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBuyModal(true);
    setSelectedAgent(agent);
  };

  const handleCardClick = (agent) => {
    route.push(`/pages/browser-agents/agent-detail/${agent.productId}`)
  }

  return (
    <>
      <NftSection pageName={pageName} />
      <div className="px-5 mx-auto transition-colors duration-300 bg-white max-w-7xl sm:px-6 lg:px-8 dark:bg-gray-900">
        {loading && <Loader />}
        <div>
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100"></h1>
            <p className="text-gray-600 transition-colors duration-300 dark:text-gray-400"></p>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 mt-4 mb-4 sm:flex-row sm:mt-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 ">
              <span className="absolute inset-y-0 flex items-center pointer-events-none left-4">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </span>
              <input
                className="pl-12 pr-4 py-3 w-full rounded-full border border-gray-300 focus:border-[#6446d7] focus:ring-2 focus:ring-[#6446d7] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-white shadow-sm transition-all duration-200 outline-none"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            
            <div className="relative w-full sm:w-auto sm:ml-2">
              <button
                className="w-full sm:w-[280px] px-4 py-3 rounded-full border border-gray-300 focus:border-[#6446d7] focus:ring-2 focus:ring-[#6446d7] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 outline-none"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {sortBy === "all"
                  ? "Sort By : All Agents"
                  : sortOptions.find((option) => option.value === sortBy)
                    ?.label}
              </button>

              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full sm:w-[280px] bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="p-4 space-y-2 z-16 ">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value="all"
                        checked={sortBy === "all"}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          setShowDropdown(false);
                        }}
                        className="form-radio h-4 w-4 text-[#6446d7]"
                      />
                      <span className="text-gray-800 dark:text-gray-600 ">
                        All Agents
                      </span>
                    </label>

                    {sortOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer z-28"
                      >
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setShowDropdown(false);
                          }}
                          className="form-radio h-4 w-4 text-[#6446d7]"
                        />
                        <span className="text-gray-800 dark:text-gray-600">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 md:gap-6 lg:gap-8">
          {!loading && sortedAgents()?.length === 0 ? (
            <div className="col-span-full  flex items-center justify-center h-[60vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center p-10 text-center bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-white rounded-2xl"
              >
                <UserX className="w-12 h-12 mb-4 text-gray-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  No Agents Found
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or search criteria.
                </p>
              </motion.div>
            </div>
          ) : (
            sortedAgents()?.map((agent, index) => (
              <div
               onClick={()=>handleCardClick(agent)}
              
                key={index}
              >
                <div className="max-w-4xl cursor-pointer ">
                  <div className="max-w-3xl ">
                    {/* AI Agent Detailed Card */}
                    <div className="overflow-hidden border border-gray-100 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl">
                      {/* Card Header Image */}
                      <div className="relative h-64">
                        <img
                          src={agent.imageUrl}
                          alt={agent.name}
                          className="object-cover object-top w-full h-full"
                        />
                        <div
                          className={`absolute top-4 right-4 px-3 py-2 rounded-full text-sm font-medium ${getStatusColorClass(
                            agent.status
                          )}`}
                        >
                          {agent.status}
                        </div>
                        <a
                          href={agent.nfTurL}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-full top-4 left-4"
                        >
                          NFT Agent
                        </a>
                      </div>

                      {/* Card Content */}
                      <div className="p-8">
                        {/* Agent Header */}
                        <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                          {/* Left: Icon + Info */}
                          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                            {/* Icon */}
                            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shrink-0">
                              <RiMailLine className="text-xl text-white sm:text-2xl" />
                            </div>

                            {/* Info */}
                            <div className="text-left">
                              <h1 className="font-bold text-xl sm:text-2xl text-gray-900 mb-1 truncate max-w-[250px] sm:max-w-[300px]">
                                {agent.productName.length > 20
                                  ? `${agent.productName.substring(0, 20)}...`
                                  : agent.productName}
                              </h1>
                              <p className="text-blue-600 font-medium truncate max-w-[300px] sm:max-w-[350px]">
                                {agent.subName.length > 35
                                  ? `${agent.subName.substring(0, 35)}...`
                                  : agent.subName}
                              </p>

                              {/* Rating and tasks */}
                              <div className="flex flex-wrap items-center mt-2 space-x-2 sm:flex-nowrap">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) =>
                                    i < Math.round(agent.rating) ? (
                                      <RiStarFill
                                        key={i}
                                        className="text-sm text-yellow-400"
                                      />
                                    ) : (
                                      <RiStarLine
                                        key={i}
                                        className="text-sm text-yellow-400"
                                      />
                                    )
                                  )}
                                  <span className="ml-1 text-sm font-semibold text-gray-800 dark:text-gray-900">
                                    {agent.rating.toFixed(1)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({agent.noOfRating} reviews)
                                  </span>
                                </div>
                                <div className="ml-2 text-sm text-gray-600 whitespace-nowrap">
                                  {agent.task} Tasks/hr
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Price & Lease */}
                          <div className="text-left sm:text-center ">
                            <div className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                              ${agent.price}
                            </div>
                            <div className="font-medium text-blue-600 sm:text-lg">
                              ${agent.weeklyReturn}/Week
                            </div>
                          </div>
                        </div>

                        {/* NFT Details Section */}
                        <div className="p-6 mb-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
                          <h3 className="flex items-center mb-4 text-lg font-bold dark:text-gray-900">
                            <RiTrophyLine className="mr-2 text-purple-600 " />
                            NFT Collection Details
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-white rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-600">
                                  Token ID
                                </span>
                                <span className="px-2 py-1 font-mono text-sm bg-gray-100 rounded dark:text-gray-600">
                                  #{agent.tokenId}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-600">
                                   <a
                                      href={`https://polygonscan.com/nft/${agent.nfTurL.split('/token/')[1].split('#')[0]}/${agent.tokenId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-blue-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >Polygon</a>

                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-600">
                                  Contract
                                </span>
                                <span className="font-mono text-sm dark:text-gray-600">
                                {agent.nfTurL.split('/token/')[1].split('#')[0].slice(0, 6)}...{agent.nfTurL.split('/token/')[1].split('#')[0].slice(-6)}
                                </span>
                              </div>
                            </div>
                            <div className="p-4 bg-white rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-600">
                                  Owner
                                </span>
                                <span className="font-mono text-sm dark:text-gray-600">
                                  0x0Bec...41b1
                                </span>
                              </div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-600">
                                  Rarity Rank
                                </span>
                                <span className="font-bold text-purple-600">
                                   #{agent.tokenId}/${Number(agent.price * 1.10 || 0).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-600">
                                  Last Sale
                                </span>
                                <span className="font-medium text-green-600">
                                  ${Number(agent.price * 1.10 || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Agent Capabilities */}
                        <div className="mb-2">
                          <h3 className="flex items-center mb-4 text-lg font-bold dark:text-gray-900">
                            <RiSettings4Line className="mr-2 text-blue-600" />
                            Agent Capabilities
                          </h3>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50">
                              <RiUserHeartLine className="mb-2 text-2xl text-blue-600" />
                              <div className="text-sm font-medium">
                                AI Personalization
                              </div>
                              <div className="mt-1 text-xs text-center text-gray-600 ">
                                Dynamic content adaptation
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50">
                              <RiLineChartLine className="mb-2 text-2xl text-green-600" />
                              <div className="text-sm font-medium">
                                Advanced Analytics
                              </div>
                              <div className="mt-1 text-xs text-center text-gray-600">
                                Real-time performance tracking
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50">
                              <RiRocket2Line className="mb-2 text-2xl text-purple-600" />
                              <div className="text-sm font-medium">
                                Auto Scaling
                              </div>
                              <div className="mt-1 text-xs text-center text-gray-600">
                                Handle millions of emails
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Performance Stats */}
                        {(() => {
                          let energyEfficiency = "97.9%";
                          let totalRoi = "2.0x";
                          let avgResponse = "12h";

                          if (agent.price >= 100 && agent.price <= 2000) {
                            energyEfficiency = "97.9%";
                            totalRoi = "2.0x";
                            avgResponse = "12h";
                          } else if (
                            agent.price > 2000 &&
                            agent.price <= 10000
                          ) {
                            energyEfficiency = "98.9%";
                            totalRoi = "2.1x";
                            avgResponse = "24h";
                          } else if (agent.price > 10000) {
                            energyEfficiency = "99.9%";
                            totalRoi = "2.2x";
                            avgResponse = "36h";
                          }

                          return (
                            <div className="p-6 mb-2 bg-gray-50 rounded-2xl">
                              <h3 className="mb-4 text-lg font-bold dark:text-gray-900">
                                Performance Statistics
                              </h3>
                              <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-green-600">
                                    {energyEfficiency}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Agentic Efficiency
                                  </div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-blue-600">
                                    {totalRoi}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Rental
                                  </div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-purple-600">
                                    {avgResponse}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Avg. Response
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Action Buttons */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <button
                            className="flex items-center justify-center w-full cursor-pointer th-btn style2 whitespace-nowrap"
                            onClick={(e) => handleBuyClick(e, agent)}
                          >
                            <RiMapPinLine className="mr-2" />
                            Buy Agent
                          </button>
                          <button
                            className="flex items-center justify-center w-full cursor-pointer th-btn style2 whitespace-nowrap"
                            onClick={(e) => handleLeaseClick(e, agent)}
                          >
                            <RiRobotLine className="mr-2" />
                            Lease Agent
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Dialog */}
        {openDialog && selectedAgent && (
          <LeaseModal
            agent={selectedAgent}
            onClose={handleCloseDialog}
            productId={productId}
            price={price}
            name={selectedAgent.productName}
            month={month}
            image={image}
            totalReturn={selectedAgent.totalReturn}
            weeklyReturn={selectedAgent.weeklyReturn}
            task={selectedAgent.task}
            rating={selectedAgent.rating}
            subName={selectedAgent.subName}
            unit={selectedAgent.unit}
          />
        )}
      </div>
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 mx-4 bg-white dark:bg-gray-800 rounded-xl">
            {/* Cross button using React Icons */}
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute p-1 transition-colors rounded-full top-4 right-4 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-700 dark:text-white">
                {selectedAgent?.productName || "Product Not Available"}
              </h3>
            </div>

            {/* Availability Notice */}
            <div className="p-6 mb-6 border-l-4 border-red-400 rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-start space-x-3">
                <i className="ri-error-warning-line text-red-500 text-xl mt-0.5"></i>
                <div>
                  <h4 className="mb-2 font-bold text-red-800">
                    Currently Not Available for Purchase
                  </h4>
                  <p className="mb-3 text-red-700">
                    This AI agent is an exclusive NFT owned by a verified
                    collector. However, you can lease it for use in your region
                    through our secure leasing platform.
                  </p>
                  <div className="p-3 rounded-lg bg-white/70">
                    <div className="mb-1 text-sm font-medium text-gray-800">
                      Regional Lease Available:
                    </div>
                    <div className="text-sm text-gray-700">
                      • Full agent functionality access
                    </div>
                    <div className="text-sm text-gray-700">
                      • 24/7 technical support included
                    </div>
                    <div className="text-sm text-gray-700">
                      • Cancel anytime with 7-day notice
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={(e) => {
                  setShowBuyModal(false);
                  handleLeaseClick(e, selectedAgent);
                }}
                className="px-4 py-2 bg-[#63f] text-white rounded-lg hover:bg-[#52e] transition-colors"
              >
                Lease For your Region
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
