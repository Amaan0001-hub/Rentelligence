"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEncryptedLocalData } from "@/app/api/auth";
import {
  sendWithdrawalOtpRequest,
  validateOtp,
} from "@/app/redux/slices/authSlice";
import { addUserWithdrawalRequest } from "../../../redux/slices/fundManagerSlice";
import { getTransferIncomeToDepositWalletReport } from "../../../redux/slices/fundManagerSlice";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getEmailId, getUserId } from "@/app/api/auth";
import { usernameByLoginId } from "../../../redux/slices/fundManagerSlice";
import Link from "next/link";
import { data } from "autoprefixer";
import { FaExternalLinkAlt } from "react-icons/fa";


const WithdrawalRequest = () => {
  const dispatch = useDispatch();
  const [urid, setUrid] = useState("");
  const [email, setEmail] = useState("");
  const [walletStatus, setWalletStatus] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const { getTransferIncomeToDepositWalletReportData } = useSelector(
    (state) => state.fund
  );

  const data = useSelector((state) => state.fund?.usernameData?.data);
  const incomeWallet =
    getTransferIncomeToDepositWalletReportData?.walletBalance[0]?.incomeWallet;

  const limitInputLength = (input, maxLength) => {
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  };

  const [walletType, setWalletType] = useState("Select Wallet");
  // Get balances for both wallets
  const performanceWalletBalance =
    getTransferIncomeToDepositWalletReportData?.walletBalance?.[0]
      ?.incomeWallet || 0;
  const yieldWalletBalance =
    getTransferIncomeToDepositWalletReportData?.walletBalance?.[0]
      ?.rentWallet || 0;
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

  const validationSchema = useMemo(() => Yup.object({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .min(10, "Minimum withdrawal is $10")
      .required("Amount is required")
      .test(
        "multiple-of-10",
        "Withdrawal amount must be in multiples of $10",
        function (value) {
          return value % 10 === 0;
        }
      )
      .test(
        "wallet-selected",
        "Please select a wallet first",
        function (value) {
          return walletType !== "Select Wallet";
        }
      ),
    walletAddress: Yup.string()
      .required("Wallet address is required")
      .test(
        "hashcode-length",
        "Please Enter a Valid Wallet Address",
        function (value) {
          return value && value.length >= 38 && value.length <= 44;
        }
      )
      .test(
        "wallet-from-profile",
        "Please set wallet from edit profile",
        function (value) {
          return value !== "walletBep20" && value !== "";
        }
      ),
    otp: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
  }), [walletType]);

  const calculateTokenToTRX = () => {
    // Implementation for token calculation
  };

  const fnGetPayDetails = () => {
    // Implementation for payment details
  };

  useEffect(() => {
    const AuthId = getEncryptedLocalData("AuthLogin");
    if (AuthId) {
      dispatch(usernameByLoginId(AuthId));
    }
  }, [dispatch]);

  // Listen for storage events to refresh user data when profile is updated
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "AuthLogin" || e.key === "FName" || e.key === "LName" || e.key === "walletBep20") {
        const AuthId = getEncryptedLocalData("AuthLogin");
        if (AuthId) {
          dispatch(usernameByLoginId(AuthId));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  useEffect(() => {
    const urid = getUserId();
    const emailId = getEmailId();
    setUrid(urid);
    setEmail(emailId);
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch(() => setIpAddress(""));
    dispatch(getTransferIncomeToDepositWalletReport(getUserId()));
  }, [dispatch]);

  const fnSendWithdrawalRequest = async (values) => {
    const data = {
      urid: urid,
      secureCode: "RIX#4343%ReliGence#22023",
      ipAddress: ipAddress,
      amount: values.amount,
      emailid: email,
      walletAddress: values.walletAddress,
      payMode: 1,
      walletType:
        walletType === "performance" ? 1 : walletType === "yield" ? 2 : 0,
    };

    try {
      const result = await dispatch(addUserWithdrawalRequest(data)).unwrap();
      if (result.statusCode === 200) {
        toast.success(result.message);
        setIsOtpSent(false);
        await dispatch(getTransferIncomeToDepositWalletReport(getUserId()));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fnSendOTP = async () => {
    formik.setTouched({
      amount: true,
      walletAddress: true,
    });

    const errors = await formik.validateForm();
    if (errors.amount || errors.walletAddress) {
      return;
    }
    if (isOtpSent) return;
    const otpData = {
      emailId: email,
      walletAddress: formik.values.walletAddress
    };

    try {
      const result = await dispatch(sendWithdrawalOtpRequest(otpData)).unwrap();
      if (result.statusCode === 200) {
        setIsOtpSent(true);
        toast.success(result.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fnValidateOtp = async (otp) => {
    const urid = getUserId();
    const data = { urid, otp };
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

  const formik = useFormik({
    initialValues: {
      amount: "",
      walletAddress: data?.walletBep20 || "",
      otp: "",
    },
    validationSchema,
    validate: (values) => {
      const errors = {};
      if (walletType === "Select Wallet" && values.amount) {
        errors.amount = "Please select a wallet first";
      }
      if (values.amount) {
        const amountNum = parseFloat(values.amount);
        if (amountNum > selectedWalletBalance) {
          errors.amount = `Amount Cannot Exceed ${selectedWalletName}`;
        }
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Validate OTP first
      const isOtpValid = await fnValidateOtp(values.otp);
      if (!isOtpValid) {
        setSubmitting(false);
        return;
      }
      await fnSendWithdrawalRequest(values);
      setSubmitting(false);
      resetForm();
    },
  });

  // Update formik walletAddress when data changes
  useEffect(() => {
    if (data?.walletBep20) {
      formik.setFieldValue("walletAddress", data.walletBep20);
    }
  }, [data?.walletBep20]);

  return (
    <div className="flex flex-wrap">
      <div className="w-full mt-2">
        <div className="rounded-lg shadow-md overflow-hidden dark:from-[#10192a] border dark:border-[#ffffff] dark:border ">
          <div className="p-6 px-8">
            {/* Wallet Type Dropdown and Balance */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <select
                id="wallet-type"
                name="walletType"
                className="border rounded px-2 py-2 text-gray-900 dark:text-black dark:bg-[#ffffff] dark:border-gray-700 focus:outline-none"
                value={walletType}
                onChange={(e) => setWalletType(e.target.value)}
              >
                <option value="Select Wallet" className="text-gray-400">
                  Select Wallet
                </option>
                <option value="performance">Performance Wallet</option>
                <option value="yield">Yield Wallet</option>
              </select>
              {walletType === "performance" && (
                <h2 className="relative z-10 font-semibold text-right text-gray-600 dark:text-white">
                  Balance: ${(performanceWalletBalance || 0).toFixed(2)}
                </h2>
              )}
              {walletType === "yield" && (
                <h2 className="relative z-10 font-semibold text-right text-gray-600 dark:text-white">
                  Balance: ${(yieldWalletBalance || 0).toFixed(2)}
                </h2>
              )}
            </div>

            <form className="mb-4 profile-form" onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="z-10 flex-1">
                    <label
                      className="font-semibold text-gray-600 form-label dark:text-white"
                      htmlFor="amount"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      className="w-full px-4 py-2 border dark:bg-[#1f2937] border-gray-300 dark:text-white rounded-md focus:outline-none mt-1"
                      placeholder={
                        walletType === "Select Wallet"
                          ? "Select Wallet First"
                          : "Enter Amount"
                      }
                      value={formik.values.amount}
                      min={0}
                      step="0.0001"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onInput={(e) => limitInputLength(e.target, 8)}
                      onKeyUp={calculateTokenToTRX}
                      onKeyDown={(e) => {
                        if (
                          ["e", "E", "+", "-"].includes(e.key) ||
                          walletType === "Select Wallet"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      disabled={walletType === "Select Wallet"}
                    />
                    {formik.errors.amount && (
                      <div className="mt-1 text-sm text-red-500">
                        {formik.errors.amount}
                      </div>
                    )}
                  </div>
                  <div className="z-10 flex-1">
                    <label
                      className="font-semibold text-gray-600 form-label dark:text-white"
                      htmlFor="walletAddress"
                    >
                      Enter BEP20 USDT Wallet
                    </label>
                    <input
                      id="walletAddress"
                      name="walletAddress"
                      className="w-full px-4 py-2 border border-gray-300 dark:bg-[#1f2937] rounded-md dark:text-[#000000] focus:outline-none mt-1"
                      placeholder="BEP20 USDT Wallet Address"
                      value={formik.values.walletAddress}
                      maxLength={44}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      readOnly
                    />
                    {formik.touched.walletAddress &&
                      formik.errors.walletAddress && (
                        <div className="mt-1 text-sm text-red-500">
                          {formik.errors.walletAddress}
                        </div>
                      )}
                    <label style={{ color: "#000" }} id="lblWalletStatus">
                      {walletStatus}
                    </label>
                    {(!formik.values.walletAddress) && (
                      <div className="mt-2">
                        <Link
                          href="/pages/settings"
                          className="text-[#CD5C5C] hover:underline flex px-3 py-1 rounded text-sm transition-colors space-x-1"
                        >
                          <span>Add your BEP20 wallet address in your profile before requesting a withdrawal. </span>    <FaExternalLinkAlt  />

                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 ">
                    <input
                      type="button"
                      id="lnkresend"
                      onClick={fnSendOTP}
                      className={` bg-[#6446d7] px-4 py-2 rounded text-white transition-colors duration-200 font-medium ${
                        isOtpSent || walletType === "Select Wallet"
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      value={
                        walletType === "Select Wallet"
                          ? "Select Wallet First"
                          : "Send OTP"
                      }
                      disabled={isOtpSent || walletType === "Select Wallet"}
                    />
                  </div>
                </div>
                {isOtpSent && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="z-10 flex flex-col">
                      <label
                        className="form-label mb-1 font-bold text-gray-600 dark:text-[#ffffff]"
                        htmlFor="otp"
                      >
                        Enter OTP (Sent to Email)
                      </label>
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-2 border border-gray-300 dark:bg-[#1f2937] rounded-md focus:outline-none"
                        value={formik.values.otp}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                      {formik.touched.otp && formik.errors.otp && (
                        <div className="mt-1 text-sm text-red-500">
                          {formik.errors.otp}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-[#6446d7] text-white h-11 w-28 z-10 rounded shadow mt-6 transition-colors duration-200"
                      disabled={formik.isSubmitting}
                    >
                      Withdraw
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequest;
