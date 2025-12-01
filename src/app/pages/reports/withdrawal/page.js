"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getIncomeWithdrawalHistory,
  getIncomeWalletReport,
  getHarvestWalletReport,
} from "@/app/redux/slices/walletReportSlice";
import { ChevronDown } from "lucide-react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { getUserId } from "@/app/api/auth";

export default function Withdrawal() {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedWallet, setSelectedWallet] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { IncomeWithdrawalHistoryData, getIncomeWalletReportdata } =
    useSelector((state) => state.wallet);
  const { harvestWalletData } = useSelector((state) => state.wallet);

  // Reset global filter when wallet changes
  useEffect(() => {
    setGlobalFilter("");
  }, [selectedWallet]);

  // Sync dropdown pageSize with pagination state
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize }));
  }, [pageSize]);

  // Main data fetching effect
  useEffect(() => {
    const urid = getUserId();
    if (!urid) return;

    if (selectedWallet === "") {
      dispatch(
        getIncomeWithdrawalHistory({ urid, transtype: "Fund Withdrawal" })
      );
      dispatch(getIncomeWalletReport({ urid, transtype: "Withdrawal" }));
      dispatch(getHarvestWalletReport({ urid, transtype: "Withdrawal" }));
    } else {
      if (selectedWallet === "Yield Wallet") {
        dispatch(getHarvestWalletReport({ urid, transtype: "Withdrawal" }));
      } else if (selectedWallet === "Performance Wallet") {
        dispatch(getIncomeWalletReport({ urid, transtype: "Withdrawal" }));
      }
    }

    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [dispatch, selectedWallet, isInitialLoad]);

  // Combine all data when showing "All Wallet"
  const data = useMemo(() => {
    if (selectedWallet === "") {
      const allData = [];

      if (
        IncomeWithdrawalHistoryData &&
        Array.isArray(IncomeWithdrawalHistoryData)
      ) {
        allData.push(
          ...IncomeWithdrawalHistoryData.map((item) => ({
            ...item,
            walletType: "General",
          }))
        );
      }

      if (
        getIncomeWalletReportdata &&
        Array.isArray(getIncomeWalletReportdata)
      ) {
        const performanceData = getIncomeWalletReportdata.map((item) => ({
          date: item.CreatedDate,
          Request: item.Request || item.debit || 0,
          Charges: item.Charges || 0,
          release: item.Release || item.credit || 0,
          status: item.trStatus || "Unknown",
          transHash: item.TransHash || "",
          Wallet: item.Wallet || "",
          walletType: "Performance",
        }));
        allData.push(...performanceData);
      }

      if (harvestWalletData && Array.isArray(harvestWalletData)) {
        const harvestData = harvestWalletData.map((item) => ({
          date: item.CreatedDate,
          Request: item.Request,
          Charges: item.Charges,
          release: item.Release || 0,
          status: item.trStatus || "Unknown",
          transHash: item.TransHash || "",
          Wallet: item.Wallet || "",
          walletType: "Yield",
        }));
        allData.push(...harvestData);
      }

      return allData;
    }

    if (
      selectedWallet === "Performance Wallet" &&
      Array.isArray(getIncomeWalletReportdata)
    ) {
      return getIncomeWalletReportdata.map((item) => ({
        date: item.CreatedDate,
        Request: item.Request || item.debit || 0,
        Charges: item.Charges || 0,
        release: item.Release || item.credit || 0,
        status: item.trStatus || "Unknown",
        transHash: item.TransHash || "",
        Wallet: item.Wallet || "",
        walletType: "Performance",
      }));
    }

    if (
      selectedWallet === "Yield Wallet" &&
      harvestWalletData &&
      Array.isArray(harvestWalletData)
    ) {
      return harvestWalletData.map((item) => ({
        date: item.CreatedDate,
        Request: item.Request || 0,
        Charges: item.Charges || 0,
        release: item.Release || 0,
        status: item.trStatus || "Unknown",
        transHash: item.TransHash || "",
        Wallet: item.Wallet || "",
        walletType: "Yield",
      }));
    }

    return [];
  }, [
    IncomeWithdrawalHistoryData,
    getIncomeWalletReportdata,
    harvestWalletData,
    selectedWallet,
  ]);

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper();

    return [
      {
        header: "#",
        cell: (info) => info.row.index + 1,
      },
      columnHelper.accessor("date", { header: "Date" }),
      columnHelper.accessor("walletType", { header: "Wallet Type" }),
      columnHelper.accessor("Request", {
        header: "Request",
        cell: (info) =>
          Number(info.getValue()) > 0 ? `$${info.getValue()}` : "",
      }),
      columnHelper.accessor("Charges", {
        header: "Charges",
        cell: (info) =>
          Number(info.getValue()) > 0 ? `$${info.getValue()}` : "",
      }),
      columnHelper.accessor("release", {
        header: "Release",
        cell: (info) =>
          Number(info.getValue()) > 0 ? `$${info.getValue()}` : "",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          if (value === "UnApproved") {
            return (
              <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded">
                {value}
              </span>
            );
          } else if (value === "Approved") {
            return (
              <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
                {value}
              </span>
            );
          } else {
            return value;
          }
        },
      }),

      columnHelper.accessor("Wallet", {
        header: "Wallet Address",
        cell: (info) => {
          const value = info.getValue();

          if (!value) return "";

          const handleCopy = () => {
            navigator.clipboard.writeText(value);
            toast.success("Wallet Adress Copied")
          };

          return (
            <div className="flex items-center justify-center gap-2">
              <span
                className="block max-w-[150px] text-sm truncate text-center"
                title={value}
              >
                {value}
              </span>
              <button
                onClick={handleCopy}
                className="text-gray-500 transition-colors hover:text-blue-600"
                title="Copy Address"
              >
                <FiCopy size={16} />
              </button>
            </div>
          );
        },
      }),

      columnHelper.accessor("transHash", {
        header: "Hash",
        cell: (info) => {
          const value = info.getValue();
          if (!value) return "";

          return (
            <div className="flex items-center justify-center gap-1">
              <a
                href={`https://bscscan.com/tx/${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                title="View on BSCScan"
              >
                <span className="max-w-[80px] truncate">{value}</span>
                <FaExternalLinkAlt size={12} />
              </a>
            </div>
          );
        },
      }),
    ];
  }, [selectedWallet]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination, // ✅ added
    getRowId: (row) =>
      row.ID?.toString() || row.id?.toString() || Math.random().toString(),
  });

  function TableFooter({ table }) {
    const rowCount = table.getFilteredRowModel().rows.length;
    const pageSize = table.getState().pagination.pageSize;
    const pageIndex = table.getState().pagination.pageIndex;

    return (
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-2 border-t rounded-b-lg sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-center text-gray-700 sm:text-sm dark:text-white">
            Showing {rowCount === 0 ? 0 : pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, rowCount)} of {rowCount}{" "}
            entries
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 text-gray-500 dark:text-white dark:bg-[#0d3b66] hover:text-black disabled:opacity-50 text-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            &laquo;
          </button>
          <button
            className="px-2 py-1 text-gray-500 hover:text-black dark:text-white dark:bg-[#0d3b66] disabled:opacity-50 text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            &lsaquo;
          </button>
          <span className="px-2 py-1 text-xs text-gray-600 sm:text-sm dark:text-white">
            {table.getPageCount() > 0
              ? `${pageIndex + 1}/${table.getPageCount()}`
              : "0/0"}
          </span>
          <button
            className="px-2 py-1 text-gray-500 dark:text-white dark:bg-[#0d3b66] hover:text-black disabled:opacity-50 text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            &rsaquo;
          </button>
          <button
            className="px-2 py-1 text-gray-500 dark:text-white dark:bg-[#0d3b66] hover:text-black disabled:opacity-50 text-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            &raquo;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0e1830] transition-colors duration-300">
      <div className="w-full mt-1">
        <div className="border rounded-lg mt-4 dark:border-[#ffffff] bg-white dark:bg-[#10192a] pb-4 sm:pb-16">
          <div className="my-4">
            <div className="w-full pt-4 rounded-lg">
              <div className="flex flex-col items-start justify-between gap-4 px-4 mb-8 sm:flex-row sm:items-center lg:gap-6">
                <div className="flex flex-col w-full gap-4 sm:flex-row sm:justify-between">
                  {/* Page Size Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-white whitespace-nowrap">
                      Show:
                    </span>
                    <select
                      className="border px-3 py-2 font-semibold text-sm rounded-md dark:text-white dark:bg-[#17316f] dark:border-gray-700 focus:outline-none focus:ring-0 min-w-[70px]"
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      {[5, 10, 20, 25].map((size) => (
                        <option
                          key={size}
                          value={size}
                          className="dark:text-white"
                        >
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Wallet Selection */}
                  <div className="flex justify-start sm:justify-end">
                    <div className="relative w-full sm:w-auto sm:min-w-[200px] lg:w-[220px]">
                      <select
                        className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-[#17316f] dark:border-gray-700 dark:text-white"
                        value={selectedWallet}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                      >
                        <option value="">-- All Wallet --</option>
                        <option value="Performance Wallet">
                          Performance Wallet
                        </option>
                        <option value="Yield Wallet">Yield Wallet</option>
                      </select>
                      <div className="absolute inset-y-0 flex items-center text-gray-500 pointer-events-none right-3">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="mx-4 border rounded-lg sm:mx-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full overflow-hidden text-xs rounded-t-lg sm:text-sm">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={headerGroup.id}
                          className="bg-gray-100 dark:bg-gray-900"
                        >
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="text-[#4f5862] font-bold geidt-font p-2 sm:p-3 dark:text-white border-b text-center border-[#ecedec] whitespace-nowrap"
                              colSpan={header.colSpan}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
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
                            className="text-gray-600 border-b dark:text-white border-[#ecedec] hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                className="p-2 sm:p-3 text-center align-middle border-[#ecedec] border-b last:border-b-0"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="p-4 text-center text-black dark:text-gray-300"
                          >
                            {isInitialLoad
                              ? "Loading..."
                              : "No data available in table"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <TableFooter table={table} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
