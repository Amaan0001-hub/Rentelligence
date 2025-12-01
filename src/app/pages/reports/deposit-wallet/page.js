"use client";

import React, { useMemo, useState, useEffect } from "react";
import { getIncomeAndDepositTransType } from "@/app/redux/slices/walletReportSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ChevronDown,} from "lucide-react";
import { MdAccountBalanceWallet } from "react-icons/md";
import { getTransferIncomeToDepositWalletReport } from "@/app/redux/slices/fundManagerSlice";
import { getUserId } from "@/app/api/auth";
import { getDepositWalletReport } from "@/app/redux/slices/walletReportSlice";

const columnHelper = createColumnHelper();

export const TopUpWallet = ({
  transTypes,
  data: propData,
  onTransTypeChange,
  walletType = "deposit",
  balanaceTitle,
}) => {
  const dispatch = useDispatch();
  const [selectedTransType, setSelectedTransType] = useState("all"); // Changed default to "all"
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { DepositWalletReportData } = useSelector((state) => state.wallet);
  const getTransferIncomeToDepositWalletReportData = useSelector(
    (state) => state.fund
  );

  // Show all data initially, then filter based on transaction type
  const data = useMemo(() => {
    const baseData = propData !== undefined ? propData || [] : DepositWalletReportData || [];
    
    // If "all" is selected or no filter is selected, return all data
    if (selectedTransType === "all" || selectedTransType === "") {
      return baseData;
    }
    
    // Filter data based on selected transaction type
    return baseData.filter(item => 
      item.transType && item.transType.toLowerCase() === selectedTransType.toLowerCase()
    );
  }, [selectedTransType, propData, DepositWalletReportData]);

  useEffect(() => {
    const URID = getUserId();
    dispatch(getIncomeAndDepositTransType(URID));
    dispatch(getTransferIncomeToDepositWalletReport(URID));
    
    // Load all data initially
    const requestData = {
      urid: URID,
      transtype: "", // Empty string to get all data
    };
    dispatch(getDepositWalletReport(requestData));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      columnHelper.accessor((_, idx) => idx + 1, {
        id: "sno",
        header: "#",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("transType", {
        header: "Trans Type",
        cell: (info) => (
          <span className="px-2 py-1 text-blue-600 bg-blue-100 rounded text-xs">
            {info.getValue() || "N/A"}
          </span>
        ),
      }),
      columnHelper.accessor("CreatedDate", {
        header: "Date",
      }),
      columnHelper.accessor("credit", {
        header: "Credit",
        cell: (info) => (
          <span className="px-2 py-1 text-green-600 bg-green-100 rounded">
            ${info.getValue() || 0}
          </span>
        ),
      }),
      columnHelper.accessor("debit", {
        header: "Debit",
        cell: (info) => (
          <span className="px-2 py-1 text-red-600 bg-red-100 rounded">
            ${info.getValue() || 0}
          </span>
        ),
      }),
      columnHelper.accessor("Remark", {
        header: "Remark",
        cell: (info) => info.getValue() || "No remark",
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else if (
        updater &&
        (updater.pageSize !== undefined || updater.pageIndex !== undefined)
      ) {
        if (updater.pageIndex !== undefined) setPageIndex(updater.pageIndex);
        if (updater.pageSize !== undefined) setPageSize(updater.pageSize);
      }
    },
  });

  const getWalletBalance = () => {
    if (
      !getTransferIncomeToDepositWalletReportData
        ?.getTransferIncomeToDepositWalletReportData?.walletBalance[0]
    ) {
      return 0;
    }

    const walletData =
      getTransferIncomeToDepositWalletReportData
        .getTransferIncomeToDepositWalletReportData.walletBalance[0];

    switch (walletType) {
      case "performance":
        return walletData.incomeWallet || 0;
      case "harvest":
        return walletData.rentWallet || 0;
      case "deposit":
        return walletData.depositWallet || 0;
      default:
        return 0;
    }
  };

  const getWalletTitle = () => {
    switch (walletType) {
      case "performance":
        return "Performance Wallet";
      case "harvest":
        return "Harvest Wallet";
      case "deposit":
      default:
        return "Deposit Wallet";
    }
  };

  return (
    <div className="pt-4 transition-colors duration-300 sm:pt-5 md:pt-6">
      <div className="w-full mt-1">
        {/* Header Card */}
        <div className="bg-white dark:bg-[#0e1830] shadow-md rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-600 transition">
          <div className="gap-3 lg:flex align-items-center">
            <p className="font-semibold text text-black-600 dark:text-white">
              {balanaceTitle}:
            </p>
            <p
              className="font-bold text-green-600 text lg:relative"
              style={{ top: "-2px" }}
            >
              ${(getWalletBalance() || 0).toFixed(2)}
            </p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 p-2 bg-green-100 rounded-full">
            <MdAccountBalanceWallet size={30} className="text-green-600" />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-4 ">
          <div className="flex flex-col flex-wrap gap-2  bg-white p-5  border border-b-0 rounded-lg mt-4 dark:border-[#ffffff] dark:bg-[#10192a]">
            {/* Title */}
            <h1 className="font-semibold text-gray-600 rounded-t-lg text-md dark:text-white geidt-font">
              Transaction History
             
            </h1>
            <div className="flex items-center justify-between gap-6">
              <select
                className="p-1 text-sm text-black border rounded dark:text-black dark:border-gray-700 focus:outline-none focus:ring-0"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 25, 50].map((pageSize) => (
                  <option
                    key={pageSize}
                    value={pageSize}
                    className="text-black dark:text-black"
                  >
                    {pageSize}
                  </option>
                ))}
              </select>

              {/* Dropdown aligned to right */}
              <div className="relative w-full sm:w-auto sm:min-w-[200px] lg:w-[220px]">
                <select
                  className={`block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50
        ${
          selectedTransType === "all"
            ? "text-gray-600 dark:text-black"
            : "text-gray-600 dark:text-black"
        }`}
                  id="transType"
                  name="transType"
                  value={selectedTransType}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setSelectedTransType(selectedValue);
                    setPageIndex(0); // Reset to first page when filtering
                    
                    if (onTransTypeChange) {
                      onTransTypeChange(selectedValue);
                    }
                    // Note: We're handling filtering in the useMemo above instead of dispatching here
                  }}
                >
                  <option value="all">All Transactions</option>
                  {transTypes?.map((type, index) => (
                    <option key={index} value={type.transtype}>
                      {type.transtype}
                    </option>
                  ))}
                </select>

                {/* Custom icon */}
                <div className="absolute inset-y-0 flex items-center text-gray-500 pointer-events-none right-3">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-white pb-10 shadow-md border border-t-0 rounded-lg  dark:border-[#ffffff] dark:bg-[#10192a]">
            <div className="w-full overflow-x-auto transition-colors rounded-lg">
              {/* Table */}
              <table className="min-w-full text-sm ">
                <thead className="text-[#4f5862]  border-b text-center border-[#ecedec] dark:bg-[#172b4d]  dark:text-white">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-2 text-xs sm:p-3 sm:text-sm "
                          colSpan={header.colSpan}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex justify-center geidt-font">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                
                <tbody>
                  {table.getPaginationRowModel().rows.length > 0 ? (
                    table.getPaginationRowModel().rows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`text-gray-700 border-b dark:text-white  border-[#ecedec] geidt-font ${
                          idx % 2 === 0 ? "" : " "
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="p-2 text-center align-middle"
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
                        className="p-4 text-center text-black dark:text-gray-300 geidt-font"
                      >
                        {selectedTransType && selectedTransType !== "all" 
                          ? `No data available for transaction type: ${selectedTransType}`
                          : "No data available in table"
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-4 pb-4 mt-4">
                <div className="gap-4 lg:flex ">
                  <div className="text-sm text-black dark:text-gray-300">
                    Showing {table.getPaginationRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} entries
                    {selectedTransType && selectedTransType !== "all" && (
                      <span className="ml-1 text-blue-600">
                        (filtered)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded text-black dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb] disabled:opacity-50"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    «
                  </button>
                  <button
                    className="px-2 py-1 rounded text-black dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb] disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    ‹
                  </button>
                  <span className="px-2 py-1 text-sm text-black dark:text-white">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>
                  <button
                    className="px-2 py-1 rounded text-black dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb] disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    ›
                  </button>
                  <button
                    className="px-2 py-1 rounded text-black dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb] disabled:opacity-50"
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
    </div>
  );
};

const DepositFunds = () => {
  const response = useSelector((state) => state.wallet.walletData);
  return (
    <TopUpWallet
      transTypes={response?.depositTransTypes || []}
      walletType="deposit"
      balanaceTitle="Deposit Wallet Balance"
    />
  );
};

export default DepositFunds;