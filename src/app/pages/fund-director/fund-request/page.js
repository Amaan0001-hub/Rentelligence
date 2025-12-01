"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { FundRequestColumns } from "@/app/constants/constant";
import { Copy } from "lucide-react";
import { IoMdArrowBack } from "react-icons/io";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import {
  addFundRequest,
  getFundRequestReport,
} from "@/app/redux/slices/fundManagerSlice";
import toast from "react-hot-toast";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { currencies } from "@/app/constants/constant";
import { getUserId } from "@/app/api/auth";
import QRCode from "react-qr-code";

export default function FundRequest() {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [urid, setUrid] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const { getFundRequestReportData } = useSelector((state) => state.fund);
  // define once in parent/table component
  const [copiedRowId, setCopiedRowId] = useState(null);

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

  const data = useMemo(() => {
    if (!getFundRequestReportData?.fundRequests) return [];
    return getFundRequestReportData.fundRequests.map((item, idx) => ({
      id: idx + 1,
      rf_Status: item.Rf_Status,
      amount: `$${item.Amount}`,
      date: item.PaymentDate,
      adminRemark: item.AdminRemark,
      transactionHash: item.RefrenceNo,
      mode: currencies.find((c) => c.name === item.PaymentMode)?.name || "",
    }));
  }, [getFundRequestReportData]);



  // Memoize the columns
  const columns = useMemo(() => FundRequestColumns, []);

  // Formik initial values
  const initialValues = {
    paymentMode: "",
    amount: "",
    transactionHash: "",
    remark: "",
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    paymentMode: Yup.string().required("Payment mode is required"),

    amount: Yup.string()
      .required("Amount is required")
      .matches(
        /^(?:\d{1,7})(?:\.\d{1,4})?$/,
        "Please enter a valid amount. Only up to 7 digits before and 4 digits after decimal are allowed."
      ),

    transactionHash: Yup.string()
      .required("Transaction hash is required")
      .test(
        "hashcode-length",
        "Please Enter a Valid Hash Code",
        function (value) {
          return value && value.length >= 38 && value.length <= 70;
        }
      ),
    // .matches(
    //   /^[a-f0-9]{64}$/i,
    //   "Invalid hashcode. Please enter a valid hashcode."
    // ),

    remark: Yup.string(),
  });

  useEffect(() => {
    const urid = getUserId();
    setUrid(urid);
    dispatch(getFundRequestReport(urid));
  }, [dispatch]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handlePaymentModeChange = (setFieldValue, value) => {
    setFieldValue("paymentMode", value);
  };

  const handleFormikSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    if (!selectedCurrency) {
      toast.error("Please select a payment mode");
      setSubmitting(false);
      return;
    }

    const data = {
      urid: urid,
      paymentMode: selectedCurrency.name,
      amount: values.amount,
      refrenceNo: values.transactionHash,
      depositDetails: selectedCurrency.walletAddress || walletAddress,
      remark: values.remark,
    };

    try {
      const result = await dispatch(addFundRequest(data)).unwrap();
      if (result.statusCode === 200) {
        toast.success("Fund Request Added Successfully");
        dispatch(getFundRequestReport(urid));
        resetForm();
        setFormStep(1);
        setSelectedCurrency(null);
      }  else if (result.statusCode === 417) {
      toast.error(result.message || "Minimum fund request amount is 10 dollar")}
      else {
        setErrors({
          transactionHash: result?.message || "Unexpected error occurred.",
        });
      }
    } catch (error) {
      toast.error("Failed to add fund request");
    }

    setSubmitting(false);
  };

  const fnCopy = () => {
    if (selectedCurrency && selectedCurrency.walletAddress) {
      navigator.clipboard.writeText(selectedCurrency.walletAddress);
      toast.success("Wallet Address Copied to clipboard");
    } else {
      toast.error("No wallet address to copy");
    }
  };

  const handleSearchChange = useCallback((e) => {
    setGlobalFilter(String(e.target.value));
  }, []);

  const handlePageSizeChange = useCallback(
    (e) => {
      table.setPageSize(Number(e.target.value));
    },
    [table]
  );

  const getStatusClasses = (rf_Status) => {
    switch (rf_Status) {
      case "Approved":
        return "bg-green-100 text-green-700 rounded px-2 py-1 text-xs";
      case "Reject":
      case "UnApproved":
        return "bg-red-100 text-red-700 rounded px-2 py-1 text-xs";
      case "Rejected":
        return "bg-yellow-100 text-yellow-700 rounded px-2 py-1 text-xs";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full mt-2">
        <div className=" rounded-lg shadow-md overflow-hidden dark:from-[#10192a] border dark:border-[#ffffff]  dark:border ">
          <div className="p-6">
            {showForm ? (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFormikSubmit}
              >
                {({
                  values,
                  setFieldValue,
                  isSubmitting,
                  isValid,
                  handleChange,
                  errors,
                  touched,
                }) => (
                  <Form>
                    {formStep === 1 ? (
                      <div className="flex flex-col ">
                        {selectedCurrency ? (
                          <div>
                            <div className="relative z-10 flex flex-col items-center justify-around w-full gap-6 pb-6 pl-2 pr-2 md:flex-row md:pl-6 md:pr-6 rounded-xl md:gap-0">
                              {/* QR Code */}
                              <div className="flex flex-col items-center justify-center w-full mb-4 md:w-auto md:mb-0">
                                <QRCode
                                  value={selectedCurrency?.walletAddress || walletAddress}
                                  size={120}
                                  className="sm:size-[180px] border dark:text-white rounded"
                                />
                                <p className="mt-3 text-xs text-center text-gray-600 sm:mt-5 sm:text-sm dark:text-white">
                                  Scan QR code to get wallet address
                                </p>
                              </div>
                              {/* Wallet Info */}
                              <div className="relative top-0 w-full space-y-4 text-white md:space-y-8 text-start md:top-12 md:w-auto">
                                <div>
                                  <h1 className="pb-2 text-xs font-semibold text-gray-600 sm:text-sm dark:text-white">
                                    Selected Payment Mode
                                  </h1>
                                  <div className="bg-[#f8fafd] p-2 rounded-md">
                                    <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded sm:text-sm">
                                      {selectedCurrency.name}
                                    </span>
                                  </div>
                                  <div className="mt-3">
                                    <h1 className="pb-2 text-xs font-semibold text-gray-600 sm:text-sm dark:text-white">
                                      Network
                                    </h1>
                                    <div className="bg-[#f8fafd] p-2 rounded-md">
                                      <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded sm:text-sm">
                                        {selectedCurrency.network}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-full max-w-md ">
                                  <p className="mb-4 text-xs font-semibold text-gray-600 sm:text-sm dark:text-white">
                                    Wallet Address
                                  </p>
                                  <div className="bg-[#f8fafd] p-3 rounded-md flex flex-col sm:flex-col sm:items-start sm:justify-between  w-full">
                                    <p className="text-xs text-gray-600 break-all sm:text-sm">
                                      {/* {walletAddress} */}
                                      {currencies.find(
                                        (currency) =>
                                          currency.name ===
                                          selectedCurrency.name
                                      )?.walletAddress ||
                                        "Wallet address not found"}
                                    </p>
                                    <div className="w-full sm:w-auto">
                                      <button
                                        type="button"
                                        onClick={fnCopy}
                                        className=" sm:mt-0 w-full sm:w-auto rounded text-[#506ec3] text-md sm:text-sm py-1   transition"
                                      >
                                        Copy Address
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-6 bg-[#fefbe8] p-4 rounded-md text-sm">
                                  <p className="text-[#7f551d] font-semibold">
                                    Important Notes:
                                  </p>
                                  <ul className="mt-1 list-disc list-inside">
                                    <li className="text-[#8a6528]">
                                      Only send USDT to this address
                                    </li>
                                    <li className="text-[#8a6528]">
                                      Make sure you are using the correct
                                      network
                                    </li>
                                    <li className="text-[#8a6528]">
                                      Minimum deposit: $10 USD equivalent
                                    </li>
                                    <li className="text-[#8a6528]">
                                      Deposits will be credited after network
                                      confirmation
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedCurrency(null)}
                                className="absolute flex gap-2 px-2 py-1 text-xs text-gray-600 transition-colors rounded-md top-2 right-2 md:top-0 md:right-0 md:px-4 md:py-2 dark:text-white sm:text-sm"
                              >
                                <IoMdArrowBack className="mt-1" />
                                Back
                              </button>
                            </div>
                            {/* Deposit Button */}
                            <div className="mt-4 text-center sm:mt-6 ">
                              <button
                                className="relative z-10 py-1 th-btn style2 w-full sm:w-[250px]"
                                onClick={() => {
                                  setFormStep(2);
                                }}
                              >
                                I&apos;ve Made the Transfer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-[250px]  z-10">
                            <label
                              className="block mb-4 text-base font-semibold text-gray-600 dark:text-gray-200"
                              htmlFor="PaymentMode"
                            >
                              Payment Mode
                            </label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {currencies.map((currency, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setSelectedCurrency(currency);
                                    handlePaymentModeChange(
                                      setFieldValue,
                                      currency.name
                                    );
                                  }}
                                  className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-blue-500 transition ${
                                    selectedCurrency === currency.name
                                      ? "border-[#6633ff] shadow"
                                      : ""
                                  }`}
                                >
                                  {currency.icon}
                                  <div>
                                    <p className="font-semibold text-gray-600 dark:text-white">
                                      {currency.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                      {currency.network}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block mb-2 font-medium text-gray-600 dark:text-white">
                                Selected Currency
                              </label>
                              <div className="inline-block px-3 py-1 font-semibold text-green-700 bg-green-100 rounded-md">
                                {selectedCurrency.name}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormStep(1)}
                              className="flex gap-2 px-4 py-2 text-gray-600 transition-colors rounded-md dark:text-white"
                            >
                              <IoMdArrowBack className="mt-1" />
                              Back
                            </button>
                          </div>

                          <div>
                            <label className="block mb-2 font-medium text-gray-600 dark:text-white">
                              Amount Sent *
                            </label>
                            <input
                              type="number"
                              name="amount"
                              value={values.amount}
                              min={0}
                              step="0.0001"
                              // onChange={handleChange}
                              onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const input = e.target.value;
                                if (input === "") {
                                  setFieldValue("amount", "");
                                  return;
                                }
                                const regex = /^\d{0,7}(\.\d{0,4})?$/;

                                if (regex.test(input)) {
                                  setFieldValue("amount", input);
                                }
                              }}
                              placeholder="Enter the amount you sent"
                              className="w-full px-4 py-3 border border-gray-300 dark:text-white dark:bg-[#111827] rounded-md f focus:outline-none"
                            />
                            {errors.amount && touched.amount && (
                              <div className="mt-1 text-xs text-red-500">
                                {errors.amount}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block mb-2 font-medium text-gray-600 dark:text-white">
                              Transaction Hash *
                            </label>
                            <input
                              type="text"
                              name="transactionHash"
                              value={values.transactionHash}
                              onChange={handleChange}
                              maxLength={70}
                              placeholder="Enter your transaction hash/ID"
                              className="w-full px-4 py-3 border border-gray-300 dark:text-white dark:bg-[#111827] rounded-md focus:outline-none"
                            />
                            {errors.transactionHash &&
                              touched.transactionHash && (
                                <div className="mt-1 text-xs text-red-500">
                                  {errors.transactionHash}
                                </div>
                              )}
                            <p className="mt-1 text-sm text-gray-600 dark:text-white">
                              You can find the transaction hash in your
                              wallet&apos;s transaction history
                            </p>
                          </div>

                          <div className="bg-blue-50 border border-[#eff6ff] rounded-md p-4 text-sm text-blue-800 space-y-2">
                            <h1 className="font-bold">Next Steps:</h1>
                            <p>
                              • We will verify your transaction on the
                              blockchain
                            </p>
                            <p>
                              • Your funds will be credited within 1–24 hours
                            </p>
                            <p>
                              • You&apos;ll receive a confirmation email once
                              processed
                            </p>
                            <p>• Contact support if you need assistance</p>
                          </div>

                          <button
                            className="py-3 font-semibold text-white rounded-md th-btn style2"
                            style={{ width: "250px" }}
                            type="submit"
                          >
                            Submit Deposit
                          </button>
                        </div>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  onClick={() => {
                    setShowForm(true);
                    setFormStep(1);
                  }}
                >
                  Add Fund Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rest of the table code remains the same */}
      <div className="w-full mt-3 shadow-lg">
        <div className="rounded-lg mt-4 dark:border-[#ffffff] border position-div p-3">
          <h1 className="mb-4 font-semibold text-gray-600 text-md dark:text-white ">
            Fund Request List
          </h1>
          <div className="my-4 ">
            <div className="w-full">
              {/* Top Controls */}
              <div className="flex items-center justify-between px-8 mb-4">
                <div className="flex items-center gap-2 mr-2">
                  <select
                    className="border p-1 text-sm rounded text-black dark:text-black dark:bg-[#ffffff] dark:border-gray-700 focus:outline-none focus:ring-0"
                    value={table.getState().pagination.pageSize}
                    onChange={handlePageSizeChange}
                  >
                    {[10, 25, 50, 100].map((pageSize) => (
                      <option
                        key={pageSize}
                        value={pageSize}
                        className="text-black"
                      >
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
                    className="border p-1 text-sm rounded text-black dark:text-black dark:bg-[#ffffff] dark:border-gray-700 focus:outline-none "
                    value={globalFilter ?? ""}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                  />
                </div>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="min-w-[600px] w-full text-xs sm:text-sm ">
                  <thead className="text-[#4f5862] dark:text-white border-b text-center border-[#ecedec]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="p-2 text-xs sm:p-3 sm:text-sm"
                            colSpan={header.colSpan}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex justify-center ">
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
                          className={`text-gray-600 border-b dark:text-white border-[#ecedec] ${
                            idx % 2 === 0 ? "" : ""
                          }`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="p-2 pl-2 text-xs text-center sm:p-3 sm:pl-5 sm:text-sm"
                            >
                              {cell.column.id === "rf_Status" ? (
                                <span
                                  className={`text-xs py-1 px-2 rounded inline-block ${getStatusClasses(
                                    cell.getValue()
                                  )}`}
                                >
                                  {cell.getValue()}
                                  {/* {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )} */}
                                </span>
                              ) : cell.column.id === "transactionHash" ? (
                                <span className="relative cursor-pointer group">
                                  <span className="inline-block max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap align-middle">
                                    {cell.getValue()?.slice(0, 10)}...
                                  </span>
                                  <Copy
                                    size={14}
                                    className="inline-block ml-1 text-gray-400 align-middle cursor-pointer hover:text-black"
                                    onClick={() =>
                                      handleCopy(cell.getValue(), row.id)
                                    }
                                    title={
                                      copiedRowId === row.id
                                        ? "Copied!"
                                        : "Copy"
                                    }
                                  />
                                  <span className="absolute z-10 px-2 py-1 mb-1 text-xs text-white transition-opacity duration-200 -translate-x-1/2 bg-gray-800 rounded opacity-0 left-1/2 bottom-full w-max group-hover:opacity-100 whitespace-nowrap">
                                    {/* {cell.getValue()} */}
                                    {copiedRowId === row.id
                                      ? "Copied!"
                                      : cell.getValue()}
                                  </span>
                                </span>
                              ) : (
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="p-4 pt-10 text-center text-white dark:text-gray-300"
                        >
                          No data available in table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 pb-4 mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {table.getRowModel().rows.length} of {data.length}{" "}
                  entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb]"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    «
                  </button>
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb]"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    ‹
                  </button>
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb]"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    ›
                  </button>
                  <button
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform dark:hover:bg-[#2563eb]"
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
}
