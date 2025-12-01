"use client";

import { useState, useMemo, useEffect } from "react";
import Loader from "@/app/components/Loader";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { getUsdtBalance, getSelfDepsiteDetailsByURID, sendUSDTDepositRequest } from "@/app/redux/slices/selfSlice";
import { getUserId } from "@/app/api/auth";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-qr-code";

export default function SelfDeposit() {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [theme, setTheme] = useState("light");
  const { usdtBalanceData, selfDepsiteDetailsData } = useSelector((state) => state.self);
  const usdtBalance = usdtBalanceData?.data?.usdtBalance || 0.0;
  const walletAddress = usdtBalanceData?.data?.walletAddress || "";
  const [copiedRowId, setCopiedRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = (value, rowId) => {
    try {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          toast.success("Copied to clipboard!");
          setCopiedRowId(rowId);
          setTimeout(() => setCopiedRowId(null), 1000);
        })
        .catch(() => {
          toast.error("Failed to copy!");
        });
    } catch (err) {
      toast.error("Copy not supported!");
    }
  };

  useEffect(() => {
    dispatch(getUsdtBalance({ urid: getUserId() || "" }));
    dispatch(getSelfDepsiteDetailsByURID(getUserId()));
  }, [dispatch]);

  useEffect(() => {
    if (selfDepsiteDetailsData && Array.isArray(selfDepsiteDetailsData)) {
      const formattedData = selfDepsiteDetailsData.map((item, index) => ({
        sno: index + 1,
        amount: item.usdAmount,
        status: item.status,
        date: item.creadtedDate,
        hash: item.transHash,
      }));
      setData(formattedData);
    }
  }, [selfDepsiteDetailsData]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const fnCopy = () => {
    toast.success("Wallet address copied to clipboard!");
    navigator.clipboard.writeText(walletAddress);
  };

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const urid = getUserId();
      if (!urid) {
        toast.error("User ID is missing. Please log in and try again.");
        return;
      }

      if (usdtBalance < 10) {
        toast.error("Sorry, the minimum required deposit is $10. Please adjust your amount to continue.");
        return;
      }

      const result = await dispatch(
        sendUSDTDepositRequest({ urid })
      ).unwrap();

      if (result.statusCode === 200) {
        toast.success(result.message || "Deposit request sent successfully!");
      } else {
        toast.error(result.message || "An error occurred while processing your deposit request.");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error(error.message || "An error occurred while processing your deposit request.");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "sno", header: "#" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "amount", header: "Amount($)" },
      { accessorKey: "hash", header: "TransHash" },
      { accessorKey: "status", header: "Status" },
    ],
    []
  );

  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 rounded";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 rounded";
      case "UnApproved":
        return "bg-red-100 text-red-700 rounded";
      default:
        return "";
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination: { pageSize, pageIndex: 0 } },
    onPaginationChange: () => {},
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="mt-2 mb-5 border rounded-md">
        <div className="relative z-10 flex flex-col items-center justify-around w-full gap-6 p-4 shadow-lg sm:p-6 lg:flex-row rounded-xl lg:gap-0">
          <div className="flex-shrink-0 w-full max-w-xs pt-24">
            <div className="flex flex-col items-center mt-5">
              <QRCode
                value={walletAddress}
                size={120}
                className="sm:size-[180px] mt-2 border dark:text-white rounded"
              />
              <p className="mt-2 text-sm text-center text-gray-600 dark:text-white">
                Scan QR code to get wallet address
              </p>
            </div>
            <div className="flex flex-col items-center mt-5">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                Deposit Balance: ${Number(usdtBalance || 0).toFixed(2)}
              </p>
            </div>
            <div className="mt-4 text-center">
            
              <button
                className="relative z-10 flex items-center justify-center w-full py-1 th-btn style2 sm:w-auto"
                onClick={handleClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2" />
                    Processing
                  </>
                ) : (
                  "Deposit"
                )}
              </button>
            </div>
          </div>
          <div className="w-full mb-4 space-y-8 text-white lg:w-1/2 text-start">
            <div>
              <h1 className="pb-2 text-sm font-semibold text-gray-600 dark:text-white">
                Network
              </h1>
              <div className="bg-[#f8fafd] p-2 rounded-md">
                <span className="px-2 py-1 text-sm text-green-700 bg-green-100 rounded">
                  Binance Smart Chain
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="mb-2 text-sm font-semibold text-gray-600 dark:text-white">
                Wallet Address
              </p>
              <div className="bg-[#f8fafd] p-2 rounded-md">
                <div className="relative flex flex-col items-start gap-1 mt-1 group">
                  <span className="text-sm text-gray-600 break-all cursor-pointer">
                    {walletAddress}
                  </span>
                  <div className="absolute right-0 z-20 hidden px-2 py-1 text-xs text-white bg-black rounded shadow-lg -top-8 group-hover:block whitespace-nowrap">
                    {walletAddress}
                  </div>
                  <button
                    type="button"
                    onClick={fnCopy}
                    className="rounded text-[#506ec3] z-10 relative flex items-center justify-center mt-2 sm:mt-0"
                  >
                    Copy Address
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-[#fefbe8] p-4 rounded-md text-sm">
              <p className="text-[#7f551d] font-semibold">Important Notes:</p>
              <ul className="mt-1 list-disc list-inside">
                <li className="text-[#8a6528]">
                  Only send USDT to this address
                </li>
                <li className="text-[#8a6528]">
                  Make sure you are using the correct network
                </li>
                <li className="text-[#8a6528]">
                  Minimum deposit: $10 USD equivalent
                </li>
                <li className="text-[#8a6528]">
                  Deposits will be credited after network confirmation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Table remains unchanged */}
      <div className="mt-3 border rounded-md shadow-lg dark:border-white">
        <div className="pl-2 mt-3 rounded-lg border-1 dark:border-gray-700 position-div">
          <h1 className="mb-4 font-semibold text-gray-600 text-md dark:text-white">
            Fund Deposit Records
          </h1>
          <div className="my-4">
            <div className="mb-2 space-y-3">
              <div className="flex flex-row items-center justify-between gap-2 px-2 mb-4 sm:px-4">
                <div className="flex items-center gap-2 lg:w-full sm:w-auto">
                  <select
                    id="pageSize"
                    className="border p-1 text-sm rounded text-black dark:text-black dark:bg-[#f5f5f5] dark:border-gray-700 w-full sm:w-auto"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      table.setPageSize(Number(e.target.value));
                    }}
                  >
                    {[10, 25, 50, 100].map((size) => (
                      <option key={size} value={size} className="text-black dark:text-black">
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center w-full gap-2 sm:w-auto">
                  <label htmlFor="search" className="text-sm text-gray-600 dark:text-white">
                    Search:
                  </label>
                  <input
                    id="search"
                    type="search"
                    className="w-full p-1 text-sm text-black border rounded dark:text-black focus:outline-none sm:w-auto"
                    placeholder="Search..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-[#4f5862] border-b dark:text-white text-center border-[#ecedec]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} className="p-2 text-start pl-5 min-w-[100px]">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className={`text-gray-600 text-start dark:text-white border-b border-[#ecedec] ${row.index % 2 === 0 ? "" : ""}`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="p-2 pl-5">
                              {cell.column.id === "status" ? (
                                <span
                                  className={`text-xs px-2 py-1 rounded inline-block ${getStatusClasses(cell.getValue())}`}
                                >
                                  {cell.getValue()}
                                </span>
                              ) : cell.column.id === "hash" ? (
                                <div className="relative group w-fit">
                                  <span className="cursor-pointer">
                                    {cell.getValue().slice(0, 10) + "..."}
                                  </span>
                                  <Copy
                                    size={14}
                                    className="inline-block ml-1 text-gray-400 align-middle cursor-pointer hover:text-black"
                                    onClick={() => handleCopy(cell.getValue(), row.id)}
                                    title={copiedRowId === row.id ? "Copied!" : "Copy"}
                                  />
                                  <span className="absolute z-10 px-2 py-1 mb-1 text-xs text-white transition-opacity duration-200 -translate-x-1/2 bg-gray-800 rounded opacity-0 left-1/2 bottom-full w-max group-hover:opacity-100 whitespace-nowrap">
                                    {copiedRowId === row.id ? "Copied!" : cell.getValue()}
                                  </span>
                                </div>
                              ) : cell.column.id === "amount" ? (
                                `$${cell.getValue()}`
                              ) : (
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="p-4 pt-10 text-center text-gray-600 dark:text-white"
                        >
                          No data available in table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col items-center justify-between gap-2 px-2 pb-4 mt-4 sm:flex-row sm:px-4">
                <div className="text-sm text-gray-600 dark:text-white">
                  Showing {table.getRowModel().rows.length} of {data.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    «
                  </button>
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    ‹
                  </button>
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    ›
                  </button>
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}