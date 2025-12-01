"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRechargeTransactBYTId } from "@/app/redux/slices/walletReportSlice";
import { getAllAnalyticsDataByURID } from "@/app/redux/slices/productSlice";
import { FiClock } from "react-icons/fi";
import { FaDollarSign } from 'react-icons/fa';
import { RiMoneyDollarCircleFill, RiFlashlightFill, RiCpuFill, RiDatabase2Fill, RiRobot2Fill, RiPieChartFill, RiPieChart2Fill, RiCodeLine, } from 'react-icons/ri';
import { NftSection } from "@/app/components/NftSection";
import { getPageName } from "@/app/utils/utils";
import { usePathname } from "next/navigation";
import { getUserId } from "@/app/api/auth";
import * as d3 from "d3-geo";
import countryCoordinates from "@/app/components/countryCoordinates";
import WorldMap from "@/app/components/countryCoordinates";
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat";
import minMax from 'dayjs/plugin/minMax';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie, Scatter } from "react-chartjs-2";
import { RiRobot2Line, RiArrowUpLine, RiMoneyDollarCircleLine, RiPercentLine, RiUserUnfollowLine } from 'react-icons/ri';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

dayjs.extend(customParseFormat);
dayjs.extend(minMax);

const REVENUE_PER_UNIT = 2;

const CITY_OPTIONS = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Los Angeles",
  "Shanghai",
  "Hong Kong",
  "Sydney",
  "India",
];

const TIME_ZONE_MAP = {
  "New York": "America/New_York",
  "London": "Europe/London",
  "Tokyo": "Asia/Tokyo",
  "Paris": "Europe/Paris",
  "Los Angeles": "America/Los_Angeles",
  "Shanghai": "Asia/Shanghai",
  "Hong Kong": "Asia/Hong_Kong",
  "Sydney": "Australia/Sydney",
  "India": "Asia/Kolkata",
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAgentData(currentLocation) {
  const interaction = getRandomInt(0, 20);
  return {
    energy: getRandomInt(5, 20),
    time: new Date().toLocaleTimeString(),
    interaction,
    location: currentLocation,
    cpu: interaction > 0 ? getRandomInt(5, 95) : 0,
    memory: getRandomInt(100, 2048),
  };
}

// Reusable Components
const AgentCard = ({ title, value, change, icon, gradient }) => (
  <div className={`flex-1 min-w-[100%] sm:min-w-[220px] max-w-[100%] sm:max-w-[260px] ${gradient} p-4 sm:p-5 rounded-2xl shadow-md relative`}>
    <div className="absolute flex items-center justify-center w-8 h-8 rounded-lg top-4 left-4 bg-white/20">
      {icon}
    </div>
    <h3 className="mt-10 text-sm font-medium text-white sm:text-base opacity-90 whitespace-nowrap">{title}</h3>
    <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">{value}</p>
  </div>
);


const AgentPerformanceCard = ({ agent, status, location, units, energy, memory, profit, roi, uptime, efficiency, CreatedDate, LeaseDate, MemoryUsage, apiResponse }) => {
  const [showDetails, setShowDetails] = useState(false);

  const generateChartData = (apiResponse, agent, createdDate) => {
    if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
      return { labels: [], data: [] };
    }

    // Filter current agent ka data
    const agentData = apiResponse.filter(item => item.Agent === agent);
    if (agentData.length === 0) return { labels: [], data: [] };

    // ✅ Agent ka createdDate (props se)
    const startDate = dayjs(createdDate);

    // Map date -> MemoryUsage
    const dataMap = {};
    agentData.forEach(item => {
      const date = dayjs(item.CreatedDate).format("DD/MM");
      const value =
        parseFloat(String(item.MemoryUsage).replace(/[^0-9.]/g, "")) || 0;
      dataMap[date] = value;
    });

    // ✅ Labels: CreatedDate se start + aage ke 6 din
    const labels = [];
    const data = [];
    for (let i = 0; i < 7; i++) {
      const date = startDate.add(i, "day").format("DD/MM");
      labels.push(date);
      data.push(dataMap[date] || 0);
    }

    return { labels, data };
  };











  const chartData = useMemo(() => {
    const { labels, data } = generateChartData(apiResponse, agent, CreatedDate);

    return {
      labels,
      datasets: [
        {
          label: "Memory Usage (GB)",
          data,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#FFFFFF",
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [apiResponse, agent, CreatedDate]);



  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1F2937",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: 12 },
        },
      },
      y: {
        min: 0,
        max: 3.0,
        ticks: {
          stepSize: 1.0,
          color: "#6B7280",
          font: { size: 12 },
          callback: (value) => value.toFixed(1),
        },
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
      },
    },
  };




  return (
    <div className="overflow-hidden transition-shadow border border-gray-200 rounded-xl hover:shadow-md">
      <div
        className="transition-colors cursor-pointer hover:bg-gray-50"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex flex-col items-start justify-between p-3 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
            <div>


              <div className="flex flex-col items-start mb-1 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <h3 className="text-base font-bold text-gray-900 sm:text-lg">{agent}</h3>
                {/* Country + Badge horizontal flex for mobile */}
                <div className="flex items-center justify-between w-[100] sm:w-auto">
                  <p className="p-1 text-sm bg-gray-200 rounded-md sm:text-base dark:text-gray-500">{location}</p>
                  {/* Mobile badge: country ke right */}
                  <span
                    className={`inline-flex items-center px-3 py-1
         text-xs sm:text-sm font-medium rounded-full sm:hidden phone-margin-left
        ${status === "Active"
                        ? "text-green-800 bg-green-100"
                        : status === "Needs Upgrade"
                          ? "text-yellow-800 bg-yellow-100"
                          : "text-gray-800 bg-gray-100"
                      }`}
                  >
                    {status}
                  </span>
                </div>
                {/* Desktop badge: waise hi */}

              </div>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium rounded-full hidden sm:inline-flex
      ${status === "Active"
                    ? "text-green-800 bg-green-100"
                    : status === "Needs Upgrade"
                      ? "text-yellow-800 bg-yellow-100"
                      : "text-gray-800 bg-gray-100"
                  }`}
              >
                {status}
              </span>


            </div>
          </div>
          <div className="flex flex-wrap items-start w-full gap-4 mt-3 sm:flex-row sm:items-center sm:mt-0">
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 sm:text-sm">Units Used/Day</p>
              <p className="text-sm font-bold text-gray-900 sm:text-base">{units}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 sm:text-sm">Energy Consumed</p>
              <p className="text-sm font-bold text-gray-900 sm:text-base">{energy}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 sm:text-sm">Memory Usage</p>
              <p className="text-sm font-bold text-gray-900 sm:text-base">{memory}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="text-xs text-gray-500 sm:text-sm">Task Completed</p>
              <p className="mt-1 text-sm font-bold text-green-600 sm:text-base">{profit || "247"}</p> {/* Larger text as requested */}
            </div>
            <div className="text-center w-[47%]">
              <p className="ml-2 text-xs text-gray-500 sm:text-sm">Daily </p>
              <p className="ml-1 text-sm font-bold text-blue-600 sm:text-base">{roi}</p>
            </div>
            <div className="text-center w-[47%]">
              <p className="ml-2 text-xs text-gray-500 sm:text-sm">Created Date</p>
              <p className="ml-1 text-sm font-bold text-blue-600 sm:text-base">{CreatedDate ? CreatedDate.split("T")[0].split("-").reverse().join("-") : "N/A"}</p>
            </div>
            <div className="flex items-center justify-center w-[47%]">
              <i className="text-lg text-gray-400 sm:text-xl ri-arrow-down-s-line" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        {showDetails && (
          <div className="px-3 py-4 bg-gray-100 sm:py-8">
            <div className="flex flex-col gap-6">
              {/* Metrics Cards Section */}
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Detailed Metrics</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 sm:text-sm">Tasks Completed</p>
                    <p className="mt-1 text-base font-bold text-gray-900 sm:text-lg">{profit || "247"}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 sm:text-sm">Uptime</p>
                    <p className="mt-1 text-base font-bold text-green-600 sm:text-lg">{parseFloat(uptime || 0).toFixed(2)}%</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 sm:text-sm">Efficiency</p>
                    <p className="mt-1 text-xl font-bold text-blue-600 sm:text-lg">
                      {efficiency ? `${parseFloat(efficiency).toFixed(2)}%` : "0.00%"}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 sm:text-sm">Peak Hours</p>
                    <p className="mt-1 text-base font-bold text-gray-900 sm:text-lg">9 AM - 6 PM</p>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <h4 className="p-4 mb-4 text-lg font-semibold text-gray-900 sm:text-xl">7-Day Memory Usage Trend</h4>
                <div className="p-4">
                  <div className="h-32 sm:h-48 lg:h-64">
                    <Line data={chartData} options={options} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const MyAgentPage = () => {
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  const [product, setProduct] = useState([]);
  const [agents, setAgents] = useState([]);
  const [fullApiResponse, setFullApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const { walletData } = useSelector((state) => state.wallet);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { analyticsData } = useSelector((state) => state.product);

  const userId = useMemo(() => getUserId(), []);

  const statsHistory = useRef([]);
  const cityStats = useRef([]);
  const hourStats = useRef([]);
  const [selectedCity, setSelectedCity] = useState(CITY_OPTIONS[0]);
  const [dailyEarnings, setDailyEarnings] = useState({});


  // Chart Data
  const lineData = useMemo(
    () => ({
      labels: ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],
      datasets: [
        {
          label: "CodeCrafter",
          data: [0.8, 1.2, 2.1, 2.8, 2.6, 2.1, 1.5],
          borderColor: "#3B82F6",
          tension: 0.4,
          fill: false,
        },
        {
          label: "DataWhiz",
          data: [0.4, 0.6, 0.8, 1.1, 1.0, 0.7, 0.5],
          borderColor: "#F87171",
          tension: 0.4,
          fill: false,
        },
        {
          label: "DevSmith",
          data: [0.6, 1.0, 1.5, 1.9, 1.8, 1.4, 1.0],
          borderColor: "#FACC15",
          tension: 0.4,
          fill: false,
        },
        {
          label: "NeuralNet",
          data: [0.5, 0.8, 1.2, 1.6, 1.5, 1.2, 0.9],
          borderColor: "#8B5CF6",
          tension: 0.4,
          fill: false,
        },
        {
          label: "SkySurveyor",
          data: [0.9, 1.5, 2.5, 3.2, 3.0, 2.6, 2.0],
          borderColor: "#F97316",
          tension: 0.4,
          fill: false,
        },

      ],
    }),
    []
  );

  const PLATFORM_FEE = 10;
  const platformFee = PLATFORM_FEE;

  const { totalProfitContribution, totalLeaseAmount } = useMemo(() => {
    if (!analyticsData?.data) return { totalProfitContribution: 0, totalLeaseAmount: 0 };

    const totalProfitContribution = analyticsData.data
      .reduce((sum, item) => sum + (item?.ProfitContribution || 0), 0)
      .toFixed(2);

    const totalLeaseAmount = analyticsData.data.reduce(
      (sum, item) => sum + (item?.LeaseAmount || 0),
      0).toFixed(2);

    return { totalProfitContribution, totalLeaseAmount };
  }, [analyticsData]);

  const pieData = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return {
        labels: [
          "Agentic Cascade Commision",
          "Weekly Yield",
          "Booster Profit Protocal(BPP)",
          "Dynamic Referral Yield(DRY)",
          "Leadership Bonus",
          "Unity Revenue Club",
        ],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
              "#3B82F6",
              "#10B981",
              "#8B5CF6",
              "#F59E0B",
              "#EF4444",
              "#6366F1",
            ],
            hoverOffset: 20,
          },
        ],
        total: 0, // empty case me bhi total 0
      };
    }

    // Latest record (pehla hi latest hai)
    const latestAgent = analyticsData.data[0] || {};

    const values = [
      latestAgent.AgenticCascadeIncome || 0,
      latestAgent.WeeklyRentalIncome || 0,
      latestAgent.BoosterProfitIncome || 0,
      latestAgent.DynamicReferral || 0,
      latestAgent.LeadershipBonus || 0,
      latestAgent.UnityRevenueClub || 0,
    ];

    const total = values.reduce((sum, val) => sum + val, 0);

    return {
      labels: [
        "Agentic Cascade Commision",
        "Weekly  Yield",
        "Booster Profit Protocal(BPP)",
        "Dynamic Referral Yield(DRY)",
        "Leadership Bonus",
        "Unity Revenue Club",
      ],
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#8B5CF6",
            "#F59E0B",
            "#EF4444",
            "#6366F1",
          ],
          hoverOffset: 20,
        },
      ],
      total, // yaha total add ho gaya
    };
  }, [analyticsData]);


  const { labels, weeklyProfit, dailyYield, metrics } = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return {
        labels: [],
        weeklyProfit: [],
        dailyYield: [],
        metrics: {
          cumulativeProfit: 0,
          todayProfit: 0,
          profitChange: 0,
          averageROI: 0,
          roiChange: 0,
          bestPerformer: { name: 'N/A', roi: 0 },
          leaseProfit: 0,
          leaseProfitToday: 0,
          dailyROI: 0,
          roiWeeklyChange: 0,
          activeInvestors: 0,
          newInvestors: 0,
          profitDistribution: {
            agentOwners: { value: 0, percent: 0 },
            leasers: { value: 0, percent: 0 },
            platform: { value: 0, percent: 0 }
          }
        }
      };
    }

    // Parse and filter valid leases
    const validLeases = analyticsData.data
      .filter(item => item.LeaseAmount && item.LeaseDate)
      .map(item => {
        const leaseDate = dayjs(item.LeaseDate, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
        return {
          date: leaseDate,
          amount: parseFloat(item.LeaseAmount),
          agent: item.Agent,
          avgROI: parseFloat(item.AvgROI) || 0,
          profitContribution: parseFloat(item.ProfitContribution) || 0,
          isValid: leaseDate.isValid()
        };
      })
      .filter(lease => lease.isValid);

    if (validLeases.length === 0) {
      return { labels: [], weeklyProfit: [], dailyYield: [], metrics: {} };
    }

    // Find earliest and latest lease dates
    let earliestDate = validLeases[0].date.startOf("day");
    let latestDate = validLeases[0].date.endOf("day");
    validLeases.forEach(lease => {
      if (lease.date.isBefore(earliestDate)) earliestDate = lease.date.startOf("day");
      if (lease.date.isAfter(latestDate)) latestDate = lease.date.endOf("day");
    });

    // Calculate total days
    const totalDays = latestDate.diff(earliestDate, "day") + 1;

    // Initialize daily arrays
    const dailyProfitArr = Array(totalDays).fill(0);
    const dailyYieldArr = Array(totalDays).fill(0);

    // Map leases into days
    validLeases.forEach(lease => {
      const dayIndex = lease.date.startOf("day").diff(earliestDate, "day");
      if (dayIndex >= 0 && dayIndex < totalDays) {
        dailyProfitArr[dayIndex] += lease.amount;
        dailyYieldArr[dayIndex] += lease.profitContribution;
      }
    });

    // Generate day labels (Mon, Tue, ...)
    const dayLabels = [];
    for (let i = 0; i < totalDays; i++) {
      dayLabels.push(earliestDate.add(i, "day").format("ddd"));
    }

    // Cumulative profit
    let runningTotal = 0;
    const cumulativeProfitArr = dailyProfitArr.map(amount => {
      runningTotal += amount;
      return runningTotal;
    });

    // Slice last 7 days
    const sliceStart = totalDays > 7 ? totalDays - 7 : 0;

    // Calculate metrics
    const lastDayIndex = totalDays - 1;
    const prevDayIndex = totalDays - 2;

    const cumulativeProfitValue = cumulativeProfitArr[lastDayIndex] || 0;
    const todayProfitValue = dailyProfitArr[lastDayIndex] || 0;
    const yesterdayProfitValue = dailyProfitArr[prevDayIndex] || 0;
    const profitChange = todayProfitValue - yesterdayProfitValue;

    // Average ROI weighted by LeaseAmount
    const totalLeaseAmount = validLeases.reduce((sum, l) => sum + l.amount, 0);
    const weightedROI = validLeases.reduce((sum, l) => sum + (l.avgROI * l.amount), 0);
    const averageROI = totalLeaseAmount > 0 ? (weightedROI / totalLeaseAmount).toFixed(2) : 0;

    // Best performer by highest ROI
    const bestPerformer = analyticsData.data.reduce((best, current) => {
      const currentROI = parseFloat(current.AvgROI) || 0;
      return currentROI > best.roi ? { name: current.Agent, roi: currentROI } : best;
    }, { name: 'N/A', roi: 0 });

    // Profit distribution
    const agentOwnersProfit = analyticsData.data
      .filter(a => a.AgentStatus === 'Active')
      .reduce((sum, a) => sum + (parseFloat(a.ProfitContribution) || 0), 0);

    const leasersProfit = analyticsData.data
      .filter(a => a.AgentStatus !== 'Active')
      .reduce((sum, a) => sum + (parseFloat(a.ProfitContribution) || 0), 0);

    const totalProfitContribution = agentOwnersProfit + leasersProfit;
    const platformProfit = cumulativeProfitValue - totalProfitContribution;

    const profitDistribution = {
      agentOwners: {
        value: agentOwnersProfit,
        percent: cumulativeProfitValue > 0 ? ((agentOwnersProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
      },
      leasers: {
        value: leasersProfit,
        percent: cumulativeProfitValue > 0 ? ((leasersProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
      },
      platform: {
        value: platformProfit > 0 ? platformProfit : 0,
        percent: cumulativeProfitValue > 0 ? ((platformProfit / cumulativeProfitValue) * 100).toFixed(0) : 0
      }
    };

    const metrics = {
      cumulativeProfit: cumulativeProfitValue,
      todayProfit: todayProfitValue,
      profitChange,
      averageROI,
      roiChange: 0,
      bestPerformer,
      leaseProfit: cumulativeProfitValue,
      leaseProfitToday: todayProfitValue,
      dailyROI: averageROI,
      roiWeeklyChange: 0,
      activeInvestors: analyticsData.data.length,
      newInvestors: 0,
      profitDistribution
    };

    return {
      labels: dayLabels.slice(sliceStart),           // 7 din ke labels
      weeklyProfit: cumulativeProfitArr.slice(sliceStart), // line data
      dailyYield: dailyYieldArr.slice(sliceStart),  // yield data
      metrics
    };
  }, [analyticsData]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };


  const groupedData = useMemo(() => {
    const result = {};

    analyticsData?.data?.forEach((point) => {
      if (!result[point.Country]) {
        result[point.Country] = {
          Country: point.Country,
          AgentStatus: point.AgentStatus,
          agents: [],
          lat: countryCoordinates[point.Country]?.lat || 0,
          lng: countryCoordinates[point.Country]?.lng || 0,
        };
      }
      result[point.Country].agents.push(point);
    });

    return Object.values(result);
  }, [analyticsData]);

  const totalLocations = groupedData.length;
  const totalAgents = groupedData.reduce((sum, c) => sum + c.agents.length, 0);







  const Agent = useMemo(() => {
    if (Array.isArray(analyticsData)) return analyticsData;
    if (Array.isArray(analyticsData?.data)) return analyticsData.data;
    if (Array.isArray(analyticsData?.Data)) return analyticsData.Data;
    return [];
  }, [analyticsData]);

  // ✅ Totals (safe-number conversion)


  const totals = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) {
      return {
        values: [0, 0, 0, 0],
        total: 0,
      };
    }

    // Latest record (pehla hi latest hai)
    const latestAgent = analyticsData.data[0] || {};

    const values = [
      Number(latestAgent?.TotalInvestment || 0),
      Number(latestAgent?.TotalEarning || 0),
      Number(latestAgent?.TotalLimit || 0),
      Number(latestAgent?.PendingLimit || 0),
    ].map(v => Number(v.toFixed(2)));

    const total = values.reduce((s, v) => s + v, 0);

    return { values, total };
  }, [analyticsData]);

  const pieData2 = useMemo(() => {
    if (!totals?.values?.length) {
      return {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
        total: 0,
      };
    }

    return {
      labels: ["Total Earning", "Earning Limit"],
      datasets: [
        {
          data: [totals.values[1], totals.values[2]], // sirf earning aur limit
          backgroundColor: ["#10B981", "#DC2626"], // earning = green, limit = red
          hoverOffset: 20,
        },
      ],
      total: totals.values[1] + totals.values[2],
    };
  }, [totals]);
  const allLabels = ["Total Investment", "Total Earning", "Earning Limit", "Remaining Limit"];
  const allColors = ["#F59E0B", "#10B981", "#DC2626", "#6366F1"];


  const scatterData = useMemo(
    () => ({
      datasets: [
        {
          label: "CPU vs Yield",
          data: [
            { x: 45, y: 700 },
            { x: 38, y: 600 },
            { x: 72, y: 200 },
            { x: 15, y: 800 },
            { x: 55, y: 450 },
            { x: 62, y: 400 },
          ],
          backgroundColor: "#8B5CF6",
          pointRadius: 6,
        },
      ],
    }),
    []
  );

  const memoryStats = useMemo(() => {
    if (!analyticsData?.data || analyticsData.data.length === 0) return {
      highestUsageAgent: null,
      mostEfficientAgent: null,
      totalUsage: 0,
      chartLabels: [],
      currentData: [],
      peakData: [],
      averageData: [],
    };

    // Group by agent
    const agentMap = {};

    analyticsData?.data?.forEach(item => {
      if (!agentMap[item.Agent]) {
        agentMap[item.Agent] = {
          memoryUsages: [],
          efficiencies: [],
        };
      }
      agentMap[item.Agent].memoryUsages.push(item.MemoryUsage || 0);
      agentMap[item.Agent].efficiencies.push(item.Efficiency || 0);
    });

    const agentsStats = Object.entries(agentMap).map(([agent, stats]) => {
      const current = stats.memoryUsages[stats.memoryUsages.length - 1] || 0;
      const peak = Math.max(...stats.memoryUsages);
      const average = stats.memoryUsages.reduce((a, b) => a + b, 0) / stats.memoryUsages.length;
      const avgEfficiency = stats.efficiencies.reduce((a, b) => a + b, 0) / stats.efficiencies.length;
      return {
        agent,
        current,
        peak,
        average,
        avgEfficiency,
      };
    });

    // Highest usage agent (peak)
    const highestUsageAgent = agentsStats.reduce((prev, curr) => (curr.peak > prev.peak ? curr : prev), { peak: 0 });

    // Most efficient agent (avgEfficiency)
    const mostEfficientAgent = agentsStats.reduce((prev, curr) => (curr.avgEfficiency > prev.avgEfficiency ? curr : prev), { avgEfficiency: 0 });

    // Total current usage sum
    const totalUsage = agentsStats.reduce((sum, a) => sum + a.current, 0);

    // Chart data
    const chartLabels = agentsStats.map(a => a.agent);
    const currentData = agentsStats.map(a => a.current);
    const peakData = agentsStats.map(a => a.peak);
    const averageData = agentsStats.map(a => a.average);

    return {
      highestUsageAgent,
      mostEfficientAgent,
      totalUsage,
      chartLabels,
      currentData,
      peakData,
      averageData,
    };
  }, [analyticsData]);

  useEffect(() => {
    dispatch(getAllAnalyticsDataByURID(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (analyticsData?.data) {
      setAgents(analyticsData.data);
      setFullApiResponse(analyticsData.data); // Full API response yahan set karo
    }
  }, [analyticsData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        await dispatch(getRechargeTransactBYTId(userId)).unwrap();
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeZone = TIME_ZONE_MAP[selectedCity] || "UTC";
      const cityTime = new Date(now.toLocaleString("en-US", { timeZone }));
      setCurrentTime(cityTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  useEffect(() => {
    if (walletData?.incomeTransTypes) {
      setProduct(walletData.incomeTransTypes);
    }
  }, [walletData]);


  useEffect(() => {
    if (agents.length === 0) return;
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent, idx) => {
          let newLocation = agent.location;
          let lastLocationUpdate = agent.lastLocationUpdate;
          if (Date.now() - agent.lastLocationUpdate >= 60000) {
            newLocation = CITY_OPTIONS[getRandomInt(0, CITY_OPTIONS.length - 1)];
            lastLocationUpdate = Date.now();
          }
          const newData = getRandomAgentData(newLocation);
          const history = statsHistory.current[idx];
          if (history) {
            history.push({
              interaction: newData.interaction,
              memory: newData.memory,
              location: newLocation,
              cpu: newData.interaction > 0 ? newData.cpu : 0,
              energy: newData.energy,
              revenue: newData.energy * REVENUE_PER_UNIT,
              time: new Date(),
            });
            if (history.length > 60) history.shift();
          }

          const hourMap = hourStats.current[idx];
          if (hourMap) {
            if (!hourMap[newLocation]) {
              hourMap[newLocation] = { units: 0, revenue: 0, lastActive: null };
            }
            hourMap[newLocation].units += newData.energy;
            const config = getProductConfig(agent.name);
            hourMap[newLocation].revenue =
              (hourMap[newLocation].units / config.unitPerHour) * config.unitValue;
            hourMap[newLocation].lastActive = new Date();
            Object.keys(hourMap).forEach((city) => {
              if (
                city !== newLocation &&
                hourMap[city].lastActive &&
                Date.now() - hourMap[city].lastActive.getTime() > 3600000
              ) {
                hourMap[city] = { units: 0, revenue: 0, lastActive: null };
              }
            });
          }

          const cityMap = cityStats.current[idx];
          if (cityMap) {
            if (!cityMap[newLocation]) {
              cityMap[newLocation] = {
                cpu: 0,
                memory: 0,
                count: 0,
                energy: 0,
                revenue: 0,
              };
            }
            cityMap[newLocation].cpu += newData.interaction > 0 ? newData.cpu : 0;
            cityMap[newLocation].memory += newData.memory;
            cityMap[newLocation].count += 1;
            cityMap[newLocation].energy += newData.energy;
            cityMap[newLocation].revenue += newData.energy * REVENUE_PER_UNIT;

            Object.keys(cityMap).forEach((city) => {
              if (city !== newLocation && cityMap[city].count > 60) {
                cityMap[city] = {
                  cpu: 0,
                  memory: 0,
                  count: 0,
                  energy: 0,
                  revenue: 0,
                };
              }
            });
          }
          return {
            ...agent,
            ...newData,
            cpu: newData.interaction > 0 ? newData.cpu : 0,
            location: newLocation,
            lastLocationUpdate,
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [agents.length]);

  const getProductConfig = useMemo(
    () => (productName) => ({
      price: 500,
      unitPerHour: 200,
      unitValue: 2,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }),
    []
  );

  const calculateWeeklyReturnSum = () => {
    if (!walletData?.incomeTransTypes) return 0;
    return walletData.incomeTransTypes.reduce((sum, product) => {
      const weeklyReturn = parseFloat(product?.WeeklyReturn) || 0;
      return sum + weeklyReturn;
    }, 0);
  };

  const getCityAgentStatus = (city, agentIdx) => {
    const stats = hourStats.current[agentIdx]?.[city] || {
      units: 0,
      revenue: 0,
      lastActive: null,
    };
    let isActive =
      stats.lastActive && Date.now() - stats.lastActive.getTime() < 3600000;
    if (agentIdx === 0 && city === selectedCity) {
      isActive = true;
    }
    return { ...stats, isActive };
  };

  const getProductPrice = (productName) => {
    if (!product || !Array.isArray(product)) return 500;
    const foundProduct = product.find((prod) => prod.ProductName === productName);
    return foundProduct?.Rkprice || 500;
  };

  if (loading) {
    return <div className="p-4 text-center sm:p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 sm:p-8">{error}</div>;
  }

  const firstDataItem = analyticsData?.data?.[0] || {};

  const cards = [
    {
      label: 'Active Agents',
      value: firstDataItem.activeagent || 0,
      icon: <RiRobot2Line className="text-xl sm:text-2xl" />,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Idle Agent',
      value: firstDataItem.idleagent || 0,
      icon: <RiUserUnfollowLine className="text-xl sm:text-2xl" />,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Total Revenue',
      value: firstDataItem.TotalEarning
        ? `$${firstDataItem.TotalEarning.toLocaleString()}`
        : '$0',
      icon: <RiMoneyDollarCircleLine className="text-xl sm:text-2xl" />,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Avg ',
      value: firstDataItem.AvgROI ? `${firstDataItem.AvgROI}%` : '0%',
      icon: <RiPercentLine className="text-xl sm:text-2xl" />,
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  const getCountryCode = (countryName) => {
    const countryCodes = {
      // North America
      'USA': 'US',
      'United States': 'US',
      'United States of America': 'US',
      'Canada': 'CA',

      // Europe
      'UK': 'GB',
      'United Kingdom': 'GB',
      'Great Britain': 'GB',
      'Italy': 'IT',
      'France': 'FR',
      'Germany': 'DE',
      'Spain': 'ES',
      'Portugal': 'PT',
      'Netherlands': 'NL',
      'Holland': 'NL',
      'Belgium': 'BE',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Luxembourg': 'LU',
      'Malta': 'MT',
      'Hungary': 'HU',
      'Bulgaria': 'BG',
      'Ireland': 'IE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Poland': 'PL',
      'Czech Republic': 'CZ',
      'Slovakia': 'SK',
      'Slovenia': 'SI',
      'Croatia': 'HR',
      'Romania': 'RO',
      'Greece': 'GR',
      'Cyprus': 'CY',
      'Estonia': 'EE',
      'Latvia': 'LV',
      'Lithuania': 'LT',
      'Iceland': 'IS',
      'Ukraine': 'UA',
      'Belarus': 'BY',
      'Serbia': 'RS',
      'Bosnia and Herzegovina': 'BA',
      'Albania': 'AL',
      'North Macedonia': 'MK',
      'Montenegro': 'ME',

      // Asia
      'India': 'IN',
      'Japan': 'JP',
      'China': 'CN',
      'South Korea': 'KR',
      'Korea': 'KR',
      'North Korea': 'KP',
      'Singapore': 'SG',
      'Malaysia': 'MY',
      'Thailand': 'TH',
      'Vietnam': 'VN',
      'Indonesia': 'ID',
      'Philippines': 'PH',
      'Pakistan': 'PK',
      'Bangladesh': 'BD',
      'Sri Lanka': 'LK',
      'Nepal': 'NP',
      'Bhutan': 'BT',
      'Maldives': 'MV',
      'Myanmar': 'MM',
      'Burma': 'MM',
      'Cambodia': 'KH',
      'Laos': 'LA',
      'Mongolia': 'MN',
      'Taiwan': 'TW',
      'Hong Kong': 'HK',
      'Macau': 'MO',
      'Brunei': 'BN',
      'Timor-Leste': 'TL',
      'East Timor': 'TL',

      // Middle East
      'Saudi Arabia': 'SA',
      'United Arab Emirates': 'AE',
      'UAE': 'AE',
      'Qatar': 'QA',
      'Kuwait': 'KW',
      'Oman': 'OM',
      'Bahrain': 'BH',
      'Israel': 'IL',
      'Jordan': 'JO',
      'Lebanon': 'LB',
      'Syria': 'SY',
      'Iraq': 'IQ',
      'Iran': 'IR',
      'Turkey': 'TR',
      'Yemen': 'YE',

      // Africa
      'South Africa': 'ZA',
      'Egypt': 'EG',
      'Nigeria': 'NG',
      'Kenya': 'KE',
      'Ethiopia': 'ET',
      'Ghana': 'GH',
      'Morocco': 'MA',
      'Algeria': 'DZ',
      'Tunisia': 'TN',
      'Uganda': 'UG',
      'Tanzania': 'TZ',
      'Rwanda': 'RW',
      'Senegal': 'SN',
      'Ivory Coast': 'CI',
      "Côte d'Ivoire": 'CI',
      'Cameroon': 'CM',
      'Zambia': 'ZM',
      'Zimbabwe': 'ZW',
      'Botswana': 'BW',
      'Namibia': 'NA',
      'Mozambique': 'MZ',
      'Madagascar': 'MG',
      'Mauritius': 'MU',
      'Seychelles': 'SC',

      // South America
      'Brazil': 'BR',
      'Argentina': 'AR',
      'Chile': 'CL',
      'Colombia': 'CO',
      'Peru': 'PE',
      'Venezuela': 'VE',
      'Uruguay': 'UY',
      'Paraguay': 'PY',
      'Bolivia': 'BO',
      'Ecuador': 'EC',
      'Guyana': 'GY',
      'Suriname': 'SR',

      // Oceania
      'Australia': 'AU',
      'New Zealand': 'NZ',
      'Fiji': 'FJ',
      'Papua New Guinea': 'PG',
      'Samoa': 'WS',
      'Tonga': 'TO',
      'Vanuatu': 'VU',
      'Solomon Islands': 'SB',
      'Kiribati': 'KI',
      'Micronesia': 'FM',
      'Palau': 'PW',
      'Marshall Islands': 'MH',

      // Caribbean
      'Jamaica': 'JM',
      'Bahamas': 'BS',
      'Barbados': 'BB',
      'Trinidad and Tobago': 'TT',
      'Dominican Republic': 'DO',
      'Haiti': 'HT',
      'Cuba': 'CU',
      'Puerto Rico': 'PR'
    };

    return countryCodes[countryName] || 'US';
  };

  // New function to get flag image
  const getFlagUrl = (countryName) => {
    const code = getCountryCode(countryName);
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  };

  const width = 800;
  const height = 500;



  const projection = d3.geoMercator()
    .center([0, 20])              // map ko thoda center pe laata hai (long, lat)
    .scale(140)                   // zoom level adjust
    .translate([width / 2, height / 2]);

  function convertToXY(lat, lng, mapWidth, mapHeight) {
    // Longitude: -180 → +180  => 0 → mapWidth
    const x = ((lng + 180) / 360) * mapWidth;

    // Latitude: -90 → +90  =>  mapHeight → 0 (invert kyunki screen pe top = 0 hota hai)
    const y = ((90 - lat) / 180) * mapHeight;

    return { x, y };
  }


  return (
    <>
      <NftSection pageName={pageName} />
      <div className="bg-white min-h-screen p-4 sm:p-5 lg:p-5 dark:bg-[#111827] overflow-x-hidden">
        <div className="w-full mx-auto">
          <div className="p-4 mb-5 bg-white border border-blue-100 shadow-lg sm:p-5 rounded-2xl">
            <div className="flex flex-col items-start justify-between p-3 sm:flex-row sm:items-center">
              {/* Left Section */}
              <div>
                <h1 className="text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-pacifico">
                  Rentelligence
                </h1>
                <p className="mt-2 text-base text-gray-600 sm:text-lg">The Marketplace of Intelligent Agents</p>
                <p className="mt-1 text-sm text-gray-500 sm:text-base">AI Agent Leasing &amp; Profit Sharing Analytics</p>
              </div>

              {/* Right Section - Stats */}
              <div className="flex flex-wrap items-start gap-4 mt-4 sm:flex-row sm:items-center sm:gap-8 sm:mt-0">
                {/* Active Agents */}
                {cards.map((card, index) => (
                  <div key={index} className="flex flex-col items-center justify-center gap-1">
                    <div
                      className={`flex items-center justify-center w-12 h-12 sm:mb-2 text-white rounded-full sm:w-16 sm:h-16 bg-gradient-to-r ${card.gradient}`}
                    >
                      {card.icon}
                    </div>
                    <p className="text-xs text-gray-500 sm:text-sm">{card.label}</p>
                    <p className="text-base font-bold text-gray-900 sm:text-2xl">{card.value}</p>
                  </div>
                ))}


              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row">

            <div className="p-6 text-white transition-all duration-300 shadow-lg cursor-pointer bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl hover:shadow-xl hover:scale-105 w-[100%]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                  <RiMoneyDollarCircleFill className="text-2xl" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium opacity-90 whitespace-nowrap">Daily Yield</h3>
                <div className="mt-1 text-2xl font-bold">${Number(analyticsData?.data?.[0]?.DailyYield || 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="p-6 text-white transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                  <RiFlashlightFill className="text-2xl" />
                </div>

              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium opacity-90 whitespace-nowrap">Daily Energy Used</h3>
                <div className="mt-1 text-2xl font-bold">{analyticsData?.data?.[0]?.DailyEnergyUsed || 0} kWh</div>
              </div>

            </div>
            <div className="p-6 text-white transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                  <RiCpuFill className="text-2xl" />
                </div>

              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium opacity-90 whitespace-nowrap">Daily CPU Usage</h3>
                <div className="mt-1 text-2xl font-bold">{analyticsData?.data?.[0]?.DailyCPUUsage || 0}%</div>
              </div>

            </div>


            <div className="p-6 text-white transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                  <RiDatabase2Fill className="text-2xl" />
                </div>

              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium opacity-90 whitespace-nowrap">Daily Memory Consumption</h3>
                <div className="mt-1 text-2xl font-bold">{analyticsData?.data?.[0]?.DailyMemoryConsumption || 0} GB</div>
              </div>

            </div>

            <div className="p-6 text-white transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                  <RiPieChartFill className="text-2xl" />
                </div>
              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium opacity-90 whitespace-nowrap">Task Completed</h3>
                <div className="mt-1 text-2xl font-bold">{analyticsData?.data?.[0]?.DailyTasksCompleted || 0}</div>
              </div>

            </div>

            <div className="p-6 text-white transition-all duration-300 shadow-lg cursor-pointer w-[100%] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                  <RiRobot2Fill className="text-2xl" />
                </div>

              </div>
              <div className="mb-2">
                <h3 className="text-sm font-medium opacity-90 whitespace-nowrap">Agents Active</h3>
                <div className="mt-1 text-2xl font-bold">{analyticsData?.data?.[0]?.AgentsActive || 0}</div>
              </div>

            </div>

            
          </div>

          {/* Global Agent Deployment */}


          {/* Agent Performance Metrics */}
          <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-4">
            <div className="space-y-6 xl:col-span-2">
              <div className="p-4 bg-white border border-gray-100 shadow-lg sm:p-6 lg:p-8 rounded-2xl">
                <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
                  <h2 className="text-sm font-bold text-gray-900 sm:text-2xl">Agent Performance Metrics</h2>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs sm:flex-row sm:gap-6 sm:text-sm sm:mt-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full "></div>
                      <span className=" dark:text-gray-500">Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="dark:text-gray-500">Needs Upgrade</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="dark:text-gray-500">Idle</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 max-h-[960px] overflow-y-auto pr-2">
                  {agents.map((agent, idx) => (
                    <AgentPerformanceCard
                      key={idx}
                      agent={agent.Agent}
                      status={agent.AgentStatus}
                      location={`${agent.Country}`}
                      units={`${agent.UnitsUsed} kWh`}
                      energy={`${agent.EnergyConsumed} kWh`}
                      memory={`${agent.MemoryUsage} GB`}
                      profit={`${agent.TasksCompleted}`}
                      roi={`${agent.DailyROI}%`}
                      tasks={agent.TasksCompleted}
                      uptime={`${agent.Uptime}%`}
                      efficiency={`${agent.Efficiency}%`}
                      CreatedDate={`${agent.CreatedDate}`}
                      peakHours={agent.PeakHourFlag === "Yes" ? "Peak Hours Active" : "No Peak Hours"}
                      memoryTrend={[]}
                      apiResponse={fullApiResponse}


                    />
                  ))}

                </div>
              </div>
            </div>
            <div className="space-y-6 xl:col-span-2">
              <div className="p-4 bg-white border border-gray-100 shadow-lg sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">Income Distribution</h3>
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <RiPieChart2Fill className="text-blue-600" />
                  </div>
                </div>
                <div className="h-60 mb-6 sm:h-60 w-full min-h-[240px] flex items-center justify-center">
                  {/* Pie Chart */}
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "Income Distribution" },
                      },
                    }}
                    style={{ width: "100%", height: "100%" }} // Chart ko parent ke hisaab se stretch karo
                  />
                </div>
                <div className="space-y-3">
                  {pieData.labels.map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pieData.datasets[0].backgroundColor[idx] }}></div>
                        <span className="text-sm font-medium text-gray-700 sm:text-base">{label}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 sm:text-base">${Number(pieData.datasets[0].data[idx] || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 sm:text-base">Total Income:</span>
                    <span className="text-xl font-bold text-gray-900 sm:text-2xl">${Number(pieData.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-100 shadow-lg sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">Earnings Progress Tracker</h3>
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <RiPieChart2Fill className="text-yellow-600" />
                  </div>
                </div>
                <div className="h-40 mb-6 sm:h-48">
                  <Pie
                    data={pieData2}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "top" }, title: { display: true, text: "Earnings Progress Distribution" } },
                    }}
                  />
                </div>
                <div className="space-y-3">
                  {allLabels.map((label, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: allColors[idx] }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 sm:text-base">
                          {label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 sm:text-base">
                          ${totals.values[idx]?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          <div className="p-4 mt-6 bg-white border border-gray-100 shadow-lg sm:p-6 lg:p-8 rounded-2xl">
            <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Global Agent Deployment</h2>
                <p className="mt-1 text-sm text-gray-600 sm:text-base">AI Agents deployed across developed countries</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 sm:flex-row sm:gap-6 sm:mt-0">
                <div className="text-center">
                  <p className="text-xs text-gray-500 sm:text-sm">Total Locations</p>
                  <p className="text-lg font-bold text-blue-600 sm:text-2xl">{totalLocations}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 sm:text-sm">Active Agents</p>
                  <p className="text-lg font-bold text-green-600 sm:text-2xl">{firstDataItem.activeagent}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Map & Dots */}
              <div className="lg:col-span-2">
                <div className="relative w-full h-[500px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg">
                  <WorldMap analyticsData={analyticsData} />
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs sm:flex-row sm:gap-6 sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 dark:text-gray-600">Active Deployment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-600">Maintenance Mode</span>
                  </div>
                </div>

              </div>

              {/* Country List */}
              <div
                className={`space-y-2 overflow-y-auto h-[500px]`}
              >
                {analyticsData?.data?.map((location, idx) => (
                  <div
                    key={idx}
                    className="p-4 transition-all border border-gray-200 cursor-pointer rounded-xl hover:shadow-md hover:border-gray-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getFlagUrl(location.Country)}
                          alt={`${location.Country} flag`}
                          className="object-cover w-8 h-8 border border-gray-200 rounded-full"

                        />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 sm:text-base">
                            {location.Country}
                          </h4>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${location.AgentStatus === "Active"
                          ? "text-green-800 bg-green-100"
                          : "text-yellow-800 bg-yellow-100"
                          }`}
                      >
                        {location.AgentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Agents</p>
                        <p className="text-base font-bold text-gray-900 sm:text-lg">
                          {idx + 1}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Task Completed</p>
                        <p className="text-base font-bold text-green-600 sm:text-lg">
                          {location.TasksCompleted}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Energy</p>
                        <p className="text-base font-bold text-orange-600 sm:text-lg">
                          {location.UnitsUsed} kWh
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
          {/* Memory Usage Analytics and Activity Timeline */}
          <div className="grid grid-cols-1 gap-6 mt-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="p-4 bg-white border border-gray-100 shadow-lg sm:p-6 lg:p-8 rounded-2xl">
                <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
                  <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">Memory Usage Analytics</h3>
                  <div className="flex flex-wrap gap-4 mt-4 sm:flex-row sm:gap-6 sm:mt-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-xs text-gray-600 sm:text-sm">Current</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-xs text-gray-600 sm:text-sm">Peak</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-xs text-gray-600 sm:text-sm">Average</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-red-900 sm:text-base">Highest Usage</h4>
                      <i className="text-lg text-red-600 sm:text-xl ri-alert-line" aria-hidden="true"></i>
                    </div>
                    <p className="text-xl font-bold text-red-900 sm:text-2xl">
                      {memoryStats.highestUsageAgent?.agent || "N/A"}
                    </p>
                    <p className="text-xs text-red-600 sm:text-sm">
                      {memoryStats.highestUsageAgent ? `${memoryStats.highestUsageAgent.peak.toFixed(2)} GB (needs upgrade)` : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-green-900 sm:text-base">Most Efficient</h4>
                      <i className="text-lg text-green-600 sm:text-xl ri-check-line" aria-hidden="true"></i>
                    </div>
                    <p className="text-xl font-bold text-green-900 sm:text-2xl">
                      {memoryStats.mostEfficientAgent?.agent || "N/A"}
                    </p>
                    <p className="text-xs text-green-600 sm:text-sm">
                      {memoryStats.mostEfficientAgent ? `${memoryStats.mostEfficientAgent.avgEfficiency.toFixed(2)}% efficiency` : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-blue-900 sm:text-base">Total Usage</h4>
                      <i className="text-lg text-blue-600 sm:text-xl ri-database-2-line" aria-hidden="true"></i>
                    </div>
                    <p className="text-xl font-bold text-blue-900 sm:text-2xl">
                      {memoryStats.totalUsage.toFixed(2)} GB
                    </p>
                    <p className="text-xs text-blue-600 sm:text-sm">Across all agents</p>
                  </div>
                </div>

                <div className="h-64 sm:h-80">
                  <Line
                    data={{
                      labels: memoryStats.chartLabels,
                      datasets: [
                        {
                          label: "Current",
                          data: memoryStats.currentData,
                          borderColor: "#3B82F6",
                          tension: 0.4,
                          fill: false,
                        },
                        {
                          label: "Peak",
                          data: memoryStats.peakData,
                          borderColor: "#EF4444",
                          tension: 0.4,
                          fill: false,
                        },
                        {
                          label: "Average",
                          data: memoryStats.averageData,
                          borderColor: "#10B981",
                          tension: 0.4,
                          fill: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "Memory Usage Analytics" },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="h-full p-4 bg-white border border-gray-100 shadow-lg sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">Activity Timeline & Alerts</h3>
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    <i className="text-gray-600 ri-time-line" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-gray-900 sm:text-base">Today&apos;s Peak Activity Hours</h4>
                  <div className="space-y-2">
                    {[
                      { time: "9 AM - 11 AM", requests: "1,247", color: "blue-500" },
                      { time: "1 PM - 3 PM", requests: "1,895", color: "green-500" },
                      { time: "7 PM - 9 PM", requests: "967", color: "purple-500" },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 bg-${activity.color} rounded-full`}></div>
                          <span className="text-sm font-medium text-gray-700 sm:text-base">{activity.time}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 sm:text-base">{activity.requests} req</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-96">
                  <h4 className="sticky top-0 mb-3 text-sm font-semibold text-gray-900 bg-white sm:text-base">Recent Activity</h4>
                  {analyticsData?.data?.slice(0, 8).map((agent, idx) => {
                    const createdDate = new Date(agent.CreatedDate);
                    const time = createdDate.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata"
                    });

                    const colorSchemes = [
                      { text: "text-blue-600", bgLight: "bg-blue-100", bgLighter: "bg-blue-50", border: "border-l-blue-500", icon: RiRobot2Fill },
                      { text: "text-green-600", bgLight: "bg-green-100", bgLighter: "bg-green-50", border: "border-l-green-500", icon: RiRobot2Fill },
                      { text: "text-purple-600", bgLight: "bg-purple-100", bgLighter: "bg-purple-50", border: "border-l-purple-500", icon: RiRobot2Fill },
                      { text: "text-orange-600", bgLight: "bg-orange-100", bgLighter: "bg-orange-50", border: "border-l-orange-500", icon: RiRobot2Fill },
                      { text: "text-teal-600", bgLight: "bg-teal-100", bgLighter: "bg-teal-50", border: "border-l-teal-500", icon: RiRobot2Fill },
                      { text: "text-indigo-600", bgLight: "bg-indigo-100", bgLighter: "bg-indigo-50", border: "border-l-indigo-500", icon: RiRobot2Fill },
                      { text: "text-amber-600", bgLight: "bg-amber-100", bgLighter: "bg-amber-50", border: "border-l-amber-500", icon: RiRobot2Fill },
                      { text: "text-rose-600", bgLight: "bg-rose-100", bgLighter: "bg-rose-50", border: "border-l-rose-500", icon: RiRobot2Fill }
                    ];

                    // Agent name se consistent color assign karne ke liye
                    const getColorIndex = (agentName) => {
                      let hash = 0;
                      for (let i = 0; i < agentName.length; i++) {
                        hash = agentName.charCodeAt(i) + ((hash << 5) - hash);
                      }
                      return Math.abs(hash) % colorSchemes.length;
                    };

                    const colorIndex = idx % colorSchemes.length;

                    const colorScheme = colorSchemes[colorIndex];

                    // Agent type ke hisaab se icon select karo
                    const getAgentIcon = (agentDetails) => {
                      const details = agentDetails.toLowerCase();

                      if (details.includes('code') || details.includes('developer') || details.includes('program')) {
                        return RiRobot2Fill;
                      } else if (details.includes('ai') || details.includes('neural') || details.includes('brain') || details.includes('learning')) {
                        return RiRobot2Fill;
                      } else if (details.includes('cloud') || details.includes('server') || details.includes('host')) {
                        return RiRobot2Fill;
                      } else if (details.includes('data') || details.includes('database') || details.includes('analytics')) {
                        return RiRobot2Fill;
                      } else if (details.includes('drone') || details.includes('survey') || details.includes('camera') || details.includes('map')) {
                        return RiRobot2Fill; // Drone alternative
                      } else if (details.includes('cpu') || details.includes('processing') || details.includes('compute')) {
                        return RiRobot2Fill;
                      } else if (details.includes('scan') || details.includes('detect') || details.includes('sensor')) {
                        return RiRobot2Fill;
                      } else {
                        // Default icons based on index
                        const defaultIcons = [
                          RiRobot2Fill,
                          RiRobot2Fill,
                          RiRobot2Fill,
                          RiRobot2Fill,
                          RiRobot2Fill,
                          RiRobot2Fill,
                          RiRobot2Fill,
                          RiRobot2Fill
                        ];
                        return defaultIcons[idx % defaultIcons.length];
                      }
                    };

                    const AgentIconComponent = getAgentIcon(agent.AgentDetails);

                    return (
                      <div
                        key={idx}
                        className={`p-4 ${colorScheme.text} border-l-4 ${colorScheme.bgLight} rounded-xl ${colorScheme.border}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${colorScheme.bgLighter}`}>
                              <AgentIconComponent className={`${colorScheme.text} w-5 h-5`} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 sm:text-base">{agent.Agent}</p>
                              <p className="mt-1 text-xs text-gray-700 sm:text-sm">{agent.AgentDetails}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-gray-500">{time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAgentPage;