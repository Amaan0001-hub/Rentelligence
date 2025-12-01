"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { usernameByLoginId } from "@/app/redux/slices/fundManagerSlice";
import Cookies from "js-cookie";
import { sendOtpRequest, validateOtp } from "@/app/redux/slices/authSlice";
import { fundTransferDepositToDeposit } from "@/app/redux/slices/fundManagerSlice";
import { getfundTransferDepositToDepositReport } from "@/app/redux/slices/fundManagerSlice";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getUserId, getEmailId, AuthLogin } from "@/app/api/auth";

const UserTransfer = () => {
  const dispatch = useDispatch();
  const { usernameData } = useSelector((state) => state.fund);
  const [name, setName] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [tableData, setTableData] = useState([]);
  const [email, setEmail] = useState("");
  const [urid, setUrid] = useState("");
  const { getIncomeToDepositWalletReportData } = useSelector(
    (state) => state.fund
  );
  const depositWallet =
    getIncomeToDepositWalletReportData?.walletBalance[0]?.DepositWallet;
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (usernameData) {
      setName(usernameData.name);
    }
    const urid = getUserId();
    const emailId = getEmailId();
    setUrid(urid);
    setEmail(emailId);
  }, [usernameData]);

  useEffect(() => {
    (async () => {
      try {
        const result = await dispatch(
          getfundTransferDepositToDepositReport(getUserId())
        ).unwrap();
        // if(result.statusCode === 200) {
        //     setAmount(result)
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (
      getIncomeToDepositWalletReportData?.depositWalletReport &&
      Array.isArray(getIncomeToDepositWalletReportData.depositWalletReport)
    ) {
      const mappedData =
        getIncomeToDepositWalletReportData?.depositWalletReport?.map(
          (item, idx) => ({
            id: idx + 1,
            transDate: item.CreatedDate,
            credit: item.Credit,
            debit: item.Debit,
            status: item.TrStatus,
            remark: item.Remark,
          })
        );
      setTableData(mappedData);
    }
  }, [getIncomeToDepositWalletReportData]);

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "id" },
      { header: "Date", accessorKey: "transDate" },
      {
        header: "Credit",
        accessorKey: "credit",
        cell: (info) => (
          <span
            style={{
              color: "green",
              backgroundColor: "rgba(0,128,0,0.1)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            ${info.getValue()}
          </span>
        ),
      },
      {
        header: "Debit",
        accessorKey: "debit",
        cell: (info) => (
          <span
            style={{
              color: "red",
              backgroundColor: "rgba(255,0,0,0.1)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            ${info.getValue()}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const value = info.getValue();
          const isApproved = value === "Approve";
          return (
            <span
              style={{
                color: isApproved ? "green" : "red",
                backgroundColor: isApproved
                  ? "rgba(0, 128, 0, 0.1)"
                  : "rgba(255, 0, 0, 0.1)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              {value}
            </span>
          );
        },
      },
      { header: "Remark", accessorKey: "remark" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const limitInputLength = useCallback((input, maxLength) => {
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }, []);

  const validatenumerics = useCallback((event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
    return true;
  }, []);

  const fnSendOTP = async (formik) => {
    formik.setTouched({
      userId: true,
      amount: true,
    });
    const errors = await formik.validateForm();
    if (errors.userId || errors.amount) {
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
      console.error(e);
    }
  };

  const fnValidateOtp = async (otp) => {
    const data = { urid, otp: String(otp) };
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

  const validationSchema = Yup.object({
    userId: Yup.string()
      .required("Username is required")
      .test("not-self-transfer", "Cannot transfer to your own account", function(value) {
        const authLogin = AuthLogin();
        return value !== authLogin;
      }),
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
          if (!value) return true;
          const amountNum = parseFloat(value);
          return !isNaN(amountNum) && amountNum >= 1;
        }
      ),
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const initialValues = {
    userId: "",
    amount: "",
    otp: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setOtpError("");
    const isOtpValid = await fnValidateOtp(values.otp);
    if (!isOtpValid) {
      setSubmitting(false);
      return;
    }
    const data = {
      urid: urid,
      authLoginReciver: values.userId,
      trnsamount: values.amount,
    };
    try {
      const result = await dispatch(
        fundTransferDepositToDeposit(data)
      ).unwrap();
      if (result.statusCode === 200) {
        toast.success(result.message);
        await dispatch(getfundTransferDepositToDepositReport(getUserId()));
        resetForm();
        setName("");
        setIsOtpSent(false);
      }
    } catch (e) {
      console.error("Transfer failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full mt-2">
        <div className="rounded-lg shadow-md overflow-hidden dark:from-[#10192a] border dark:border-[#ffffff] dark:border ">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="relative z-10 font-semibold text-gray-600 dark:text-white">
                Deposit Wallet Transfer
              </h2>
              <h2 className="relative z-10 font-semibold text-right text-gray-600 dark:text-white">
                Balance: ${(depositWallet || 0).toFixed(2)}
              </h2>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validate={(values) => {
                const errors = {};
                // Only validate if amount is not empty
                if (values.amount) {
                  const amountNum = parseFloat(values.amount);
                  if (amountNum < 1) {
                    errors.amount = `Amount must be at least 1`;
                  } else 
                  if (amountNum > depositWallet) {
                    errors.amount = `Amount Cannot Exceed Deposit Wallet Balance`;
                  }
                }
                return errors;
              }}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {(formik) => {
                const { values, handleChange, setFieldValue, handleBlur } =
                  formik;
                return (
                  <Form className="space-y-4">
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="z-10">
                          <label className="block mb-1 font-semibold text-gray-600 transition-colors duration-300 dark:text-white">
                            Username
                          </label>
                          <Field
                            name="userId"
                            className="w-full border px-3 py-2 rounded focus:outline-none  bg-white dark:bg-[#111827] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 transition-colors duration-300"
                            placeholder="Enter Username"
                            type="text"
                            value={values.userId}
                            onChange={async (e) => {
                              handleChange(e);
                              const newUserId = e.target.value;
                              setFieldValue("userId", newUserId);
                              const result = await dispatch(
                                usernameByLoginId(newUserId)
                              ).unwrap();
                              if (
                                result &&
                                result.statusCode === 200 &&
                                result.data
                              ) {
                                setName(result.data.name);
                              } else if (result.statusCode === 409) {
                                setName(result.message);
                              }
                            }}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="userId"
                            component="div"
                            className="mt-1 text-xs text-red-500"
                          />
                        </div>
                        <div className="z-10">
                          <label className="block mb-1 font-semibold text-gray-600 transition-colors duration-300 dark:text-gray-200">
                            Name
                          </label>
                          <input
                            name="Name"
                            placeholder="Name"
                            type="text"
                            readOnly
                            className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors duration-300 bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-700 focus:outline-none dark:placeholder-gray-500"
                            value={name || ""}
                          />
                        </div>
                        <div className="z-10">
                          <label className="block mb-1 font-semibold text-gray-600 transition-colors duration-300 dark:text-white">
                            Amount
                          </label>
                          <input
                            type="text"
                            name="amount"
                            value={values.amount}
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
                                if (depositWallet !== "Select Wallet") {
                                  const amountNum = parseFloat(input);
                                  if (
                                    !isNaN(amountNum) &&
                                    amountNum > depositWallet
                                  ) {
                                    formik.setFieldError(
                                      "amount",
                                      `Amount Cannot Exceed Deposit Wallet Balance ($${depositWallet})`
                                    );
                                  } else {
                                    formik.setFieldError("amount", undefined);
                                  }
                                }
                                formik.setFieldValue("amount", input);
                              }
                            }}
                            placeholder="Enter Amount"
                            className="w-full border px-3 py-2 rounded focus:outline-none bg-white dark:bg-[#111827] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 transition-colors duration-300"
                          />
                          {formik.errors.amount && formik.touched.amount && (
                            <div className="mt-1 text-xs text-red-500">
                              {formik.errors.amount}
                            </div>
                          )}
                        </div>
                        <div className="sm:pt-6">
                        <button
                          type="button"
                          onClick={() => fnSendOTP(formik)}
                          className={`th-btn style2 text-white h-12  max-w-28 z-10 rounded shadow  transition-colors duration-200 ${
                            isOtpSent
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          disabled={isOtpSent}
                        >
                          Send OTP
                        </button>
                        </div>
                      </div>
                      {isOtpSent && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="z-10">
                            <label className="block mb-1 font-semibold text-gray-600 transition-colors duration-300 dark:text-white">
                              OTP
                            </label>
                            <Field
                              type="text"
                              name="otp"
                              maxLength={6}
                              inputMode="numeric"
                              pattern="[0-9]{6}"
                              placeholder="Enter OTP"
                              className="w-full border px-3 py-2 rounded focus:outline-none bg-white dark:bg-[#111827] text-gray-900 dark:text-white border-gray-300 transition-colors duration-300"
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6);
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "-" ||
                                  e.key === "e" ||
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
                            className="bg-[#6446d7] text-white h-11 w-28 z-10 rounded shadow mt-6 transition-colors duration-200"
                            disabled={formik.isSubmitting}
                          >
                            Transfer
                          </button>
                        </div>
                      )}
                    </div>
                    {otpError && (
                      <div className="mt-2 text-sm font-semibold text-red-500 transition-colors duration-300 dark:text-red-400">
                        {otpError}
                      </div>
                    )}
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
      {/* Table Section */}
      <div className="w-full mt-3 shadow-lg">
        <div className="rounded-lg mt-4 dark:border-[#ffffff] border position-div p-3">
          <h1 className="mb-4 font-semibold text-gray-600 text-md dark:text-white ">
            P2P Transfer Report
          </h1>
          <div className="my-4 ">
            <div className="w-full">
              {/* Top Controls */}
              <div className="flex items-center justify-between px-8 mb-4">
                <div className="flex items-center gap-2">
                  <select
                    className="border p-1 text-sm rounded text-black dark:text-black dark:bg-[#ffffff] dark:border-gray-700 focus:outline-none focus:ring-0"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
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
                    onChange={(e) => setGlobalFilter(String(e.target.value))}
                    placeholder="Search..."
                  />
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm ">
                  <thead className="text-[#4f5862] dark:text-white border-b text-center border-[#ecedec]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="p-2 "
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
                            <td key={cell.id} className="p-2 pl-5 text-center">
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
                          className="p-4 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTransfer;