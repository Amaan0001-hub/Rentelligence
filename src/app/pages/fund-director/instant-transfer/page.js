"use client";

import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import { sendOtpRequest, validateOtp } from "@/app/redux/slices/authSlice";
import {
  addTransferIncomeToDepositWallet,
  getTransferIncomeToDepositWalletReport,
} from "@/app/redux/slices/fundManagerSlice";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getUserId, getEmailId } from "@/app/api/auth";

export default function InstantTransfer() {
  const dispatch = useDispatch();
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { getTransferIncomeToDepositWalletReportData } = useSelector(
    (state) => state.fund
  );

  useEffect(() => {
    const urid = getUserId();
    const emailId = getEmailId();
    setEmail(emailId);
    dispatch(getTransferIncomeToDepositWalletReport(getUserId()));
  }, [dispatch]);

  useEffect(() => {
    if (
      getTransferIncomeToDepositWalletReportData &&
      getTransferIncomeToDepositWalletReportData.walletBalance &&
      getTransferIncomeToDepositWalletReportData.walletBalance.length > 0
    ) {
      setWalletBalance(
        getTransferIncomeToDepositWalletReportData.walletBalance[0].incomeWallet || 0
      );
    }
  }, [getTransferIncomeToDepositWalletReportData]);

  const [otpError, setOtpError] = useState("");
  const [walletType, setWalletType] = useState("Select Wallet");
  const performanceWalletBalance = getTransferIncomeToDepositWalletReportData?.walletBalance?.[0]?.incomeWallet || 0;
  const yieldWalletBalance = getTransferIncomeToDepositWalletReportData?.walletBalance?.[0]?.rentWallet || 0;

  // Dynamically get selected wallet balance
  const selectedWalletBalance =
    walletType === "performance"
      ? performanceWalletBalance
      : walletType === "yield"
        ? yieldWalletBalance
        : 0;

  // Get display name for selected wallet
  const selectedWalletName =
    walletType === "performance"
      ? "Performance Wallet Balance"
      : walletType === "yield"
        ? "Yield Wallet Balance"
        : "Selected Wallet";

  const handleSendOTP = async (formik) => {
    setOtpError("");
    formik.setTouched({ amount: true });
    const errors = await formik.validateForm();
    if (errors.amount) {
      return;
    }
    if (isOtpSent) return;
    const data = { emailId: email };
    try {
      const result = await dispatch(sendOtpRequest(data)).unwrap();
      if (result.statusCode === 200) {
        setIsOtpSent(true);
        toast.success(result.message);
      }
    } catch (e) {
      setOtpError("Failed to send OTP. Please try again.");
      setIsOtpSent(false);
    }
  };

  const fnValidateOtp = async (otp) => {
    const data = {
      urid: getUserId(),
      otp: String(otp)
    };
    try {
      const result = await dispatch(validateOtp(data)).unwrap();
      if (result.statusCode === 200) {
        return true;
      } else {
        toast.error(result.message || "Invalid OTP");
        return false;
      }
    } catch (e) {
      toast.error(e?.message || "OTP validation failed");
      return false;
    }
  };

  const handleTransfer = async (values, { setStatus, resetForm, setSubmitting }) => {
    setOtpError("");
    const isOtpValid = await fnValidateOtp(values.otp);
    if (!isOtpValid) {
      setSubmitting(false);
      return;
    }
    const data = {
      urid: getUserId(),
      trnsamount: values.amount,
      walletType: walletType === "performance" ? 1 : 2,
    };
    try {
      const result = await dispatch(
        addTransferIncomeToDepositWallet(data)
      ).unwrap();
      if (result.statusCode === 200) {
        toast.success(result.message);
        resetForm();
        setStatus({ transferSuccess: true, error: null });
        setIsOtpSent(false);
      }
    } catch (error) {
      setStatus({ transferSuccess: false, error: "Transfer failed" });
    }
    await dispatch(getTransferIncomeToDepositWalletReport(getUserId()));
    setSubmitting(false);
  };

  const apiRows =
    getTransferIncomeToDepositWalletReportData?.depositWalletReport || [];

  const data = useMemo(
    () =>
      apiRows.map((row, idx) => ({
        id: idx + 1,
        date: row.createdDate,
        credit: row.Credit,
        debit: row.Debit,
        remark: row.Remark,
      })),
    [apiRows]
  );

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "#",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.accessor("credit", {
        header: "Credit",
        cell: (info) => (
          <span className="px-2 py-1 text-green-700 bg-green-100 rounded">
            ${info.getValue()}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("debit", {
        header: "Debit",
        cell: (info) => (
          <span className="px-2 py-1 text-red-700 bg-red-100 rounded">
            ${info.getValue()}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("remark", {
        header: "Remark",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const validationSchema = Yup.object({
    amount: Yup.string()
      .required("Amount is required")
      .matches(
        /^(?:\d{1,7})(?:\.\d{1,4})?$/,
        "Please enter a valid amount. Only up to 7 digits before and 4 digits after decimal are allowed."
      )
      .test(
        'min-amount',
        'Amount must be at least 1',
        function(value) {
          if (!value) return true; // Let required validation handle empty values
          const amountNum = parseFloat(value);
          return !isNaN(amountNum) && amountNum >= 1;
        }
      )
      .test(
        'wallet-selected',
        'Please select a wallet first',
        function(value) {
          return walletType !== "Select Wallet";
        }
      ),
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  return (
    <div className="flex flex-wrap">
      <div className="w-full mt-2">
        <div className="rounded-lg shadow-md overflow-hidden dark:from-[#10192a] border dark:border-[#ffffff] dark:border ">
          <div className="p-6">
            <h2 className="relative z-10 font-semibold text-gray-600 dark:text-white">
                Transfer To Deposit Wallet
              </h2>
            {/* Wallet Form */}
            <div className="mb-4">
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <select
                    id="wallet-type"
                    name="walletType"
                    className="px-2 py-2 text-gray-900 border rounded dark:text-black dark:border-gray-700 focus:outline-none"
                    value={walletType}
                    onChange={e => setWalletType(e.target.value)}
                  >
                    <option value="Select Wallet">Select Wallet</option>
                    <option value="performance">Performance Wallet</option>
                    <option value="yield">Yield Wallet</option>
                  </select>
                </div>
                {walletType === 'performance' && (
                  <h2 className="relative z-10 font-semibold text-right text-gray-600 dark:text-white">
                    Balance: ${(performanceWalletBalance || 0).toFixed(2)}
                  </h2>
                )}
                {walletType === 'yield' && (
                  <h2 className="relative z-10 font-semibold text-right text-gray-600 dark:text-white">
                    Balance: ${(yieldWalletBalance || 0).toFixed(2)}
                  </h2>
                )}
              </div>
              <Formik
                initialValues={{ amount: "", otp: "" }}
                validationSchema={validationSchema}
                validate={values => {
                  const errors = {};
                  if (walletType === "Select Wallet" && values.amount) {
                    errors.amount = "Please select a wallet first";
                  }
                  if (walletType !== "Select Wallet" && values.amount) {
                    const amountNum = parseFloat(values.amount);
                    if (amountNum < 1) {
                      errors.amount = "Amount must be at least 1";
                    } else if (amountNum > selectedWalletBalance) {
                      errors.amount = `Amount Cannot Exceed ${selectedWalletName}`;
                    }
                  }
                  return errors;
                }}
                onSubmit={handleTransfer}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-6 mt-3">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="z-10">
                          <label className="block mb-2 font-medium text-gray-600 dark:text-white">
                            Amount
                          </label>
                          <input
                            type="text"
                            name="amount"
                            value={formik.values.amount}
                            min={1}
                            step="0.0001"
                            onChange={(e) => {
                              const input = e.target.value;
                              formik.setFieldTouched("amount", true);
                              const regex = /^\d{0,7}(\.\d{0,4})?$/;
                              if (input === "") {
                                formik.setFieldValue("amount", "");
                                formik.setFieldError("amount", undefined);
                                return;
                              }
                              if (regex.test(input)) {
                                if (walletType !== "Select Wallet") {
                                  const amountNum = parseFloat(input);
                                  if (!isNaN(amountNum)) {
                                    if (amountNum < 1) {
                                      formik.setFieldError("amount", "Amount must be at least 1");
                                    } else if (amountNum > selectedWalletBalance) {
                                      formik.setFieldError("amount", `Amount Cannot Exceed ${selectedWalletName}`);
                                    } else {
                                      formik.setFieldError("amount", undefined);
                                    }
                                  }
                                }
                                formik.setFieldValue("amount", input);
                              }
                            }}
                            onBlur={formik.handleBlur}
                            placeholder={walletType === "Select Wallet" ? "Select Wallet First" : "Enter the amount"}
                            className="w-full px-4 py-3 border border-gray-300 dark:text-white dark:bg-[#111827] rounded-md focus:outline-none"
                            disabled={walletType === "Select Wallet"}
                          />
                          {formik.errors.amount && formik.touched.amount && (
                            <div className="mt-1 text-xs text-red-500">
                              {formik.errors.amount}
                            </div>
                          )}
                        </div>
                        <div className="sm:pt-5 md:pt-8 lg:pt-8">
                          <button
                          type="button"
                          onClick={() => handleSendOTP(formik)}
                          className={`th-btn style2 text-white h-12 max-w-[150px]  text-center whitespace-nowrap z-10 rounded shadow transition-colors duration-200 ${
                            isOtpSent || walletType === "Select Wallet"
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          disabled={isOtpSent || walletType === "Select Wallet"}
                        >
                          {walletType === "Select Wallet" ? "Select Wallet First" : "Send OTP"}
                        </button>
                        </div>
                        
                      </div>
                      {otpError && (
                        <div className="mt-2 text-sm font-semibold text-red-500 transition-colors duration-300 dark:text-red-400">
                          {otpError}
                        </div>
                      )}
                      {isOtpSent && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="z-10">
                            <label className="block mb-1 font-semibold text-gray-600 transition-colors duration-300 dark:text-gray-200">
                              OTP
                            </label>
                            <Field
                              type="text"
                              name="otp"
                              maxLength={6}
                              inputMode="numeric"
                              pattern="[0-9]{6}"
                              placeholder="Enter OTP"
                              className="w-full border px-3 py-2.5 rounded focus:outline-none bg-white dark:bg-[#0e1830] text-gray-900 dark:text-white border-gray-300 transition-colors duration-300"
                              onInput={e => {
                                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                              }}
                              onKeyDown={e => {
                                if (
                                  e.key === '-' ||
                                  e.key === 'e' ||
                                  (e.key.length === 1 && !/[0-9]/.test(e.key))
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                            <ErrorMessage
                              name="otp"
                              component="div"
                              className="mt-1 text-xs text-red-500"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            className="z-10 h-12 mt-6 text-white transition-colors duration-200 rounded shadow th-btn style2 max-w-28"
                            disabled={formik.isSubmitting}
                          >
                            Transfer
                          </button>
              
                        </div>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        {/* Table Section */}
        <div className="w-full mt-3 shadow-lg">
          <div className="rounded-lg mt-4 dark:border-[#ffffff] border position-div p-3">
            <h1 className="mb-4 font-semibold text-gray-600 text-md dark:text-white">
              Funds Transfer Summary
            </h1>
            <div className="my-4">
              <div className="w-full">
                <div className="flex flex-row justify-between gap-4 px-4 mb-4 sm:px-8">
                  <div className="flex items-center gap-2">
                    <select
                      className="border p-1 text-sm rounded text-black dark:text-black dark:bg-[#ffffff] dark:border-gray-700 focus:outline-none focus:ring-0"
                      value={table.getState().pagination.pageSize}
                      onChange={e => table.setPageSize(Number(e.target.value))}
                    >
                      {[10, 25, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize} className="text-black ">
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-white">
                      Search:
                    </label>
                    <input
                      type="search"
                      className="border p-1 text-sm rounded text-black dark:text-black dark:bg-[#ffffff] dark:border-gray-700 focus:outline-none w-full sm:w-auto"
                      value={globalFilter ?? ""}
                      onChange={e => setGlobalFilter(String(e.target.value))}
                      placeholder="Search..."
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-[#4f5862] dark:text-white border-b text-center border-[#ecedec]">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="p-2 whitespace-nowrap"
                              colSpan={header.colSpan}
                            >
                              {header.isPlaceholder ? null : (
                                <div className="flex justify-center">
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
                      {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row, idx) => (
                          <tr
                            key={row.id}
                            className={`text-gray-600 border-b dark:text-white border-[#ecedec] ${idx % 2 === 0 ? "" : ""}`}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className="p-2 text-center sm:pl-5 whitespace-nowrap">
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
                          <td colSpan={columns.length} className="p-4 pt-10 text-center text-gray-500 dark:text-white">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 mt-4 sm:px-8">
                  {/* Pagination controls */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}