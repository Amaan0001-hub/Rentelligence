"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTempStorage } from "./useTempStorage";
import { addRechargeTransact } from "@/app/redux/slices/productSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  getTransferIncomeToDepositWalletReport,
  usernameByLoginId,
} from "../redux/slices/fundManagerSlice";
import { getUserId } from "../api/auth";
import { FaChevronDown } from "react-icons/fa";
import Loader from "./Loader";

export default function LeaseModal({
  agent,
  onClose,
  productId,
  price,
  month,
  unit,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(1);
  const [usernameInput, setUsernameInput] = useState("");
  const [searchedUsername, setSearchedUsername] = useState(null);
  const [searchedUrid, setSearchedUrid] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const [, setOrderData] = useTempStorage("orderData");

  const rate = price;
  const totalCost = duration * rate;
  const toatalEnergy = duration * unit;

  const getMonthlyROI = (totalCost) => {
    if (totalCost < 2000) return 8;
    else if (totalCost >= 2100 && totalCost <= 10000) return 9;
    else return 10;
  };

  const monthlyROI = getMonthlyROI(totalCost);
  const monthlyReturn = `${monthlyROI}%`;

  const getTotalReturnPercentage = (totalCost) => {
    if (totalCost < 2000) return 200;
    else if (totalCost >= 2100 && totalCost <= 10000) return 210;
    else return 220;
  };

  const totalReturnPercentage = getTotalReturnPercentage(totalCost);
  const expectedTotalReturn = (totalCost * totalReturnPercentage) / 100;

  const updatedDollarWeeklyReturn = (
    (totalCost * monthlyROI) /
    100 /
    4
  ).toFixed(2);

  const { getTransferIncomeToDepositWalletReportData } = useSelector(
    (state) => state?.fund
  );
  const { usernameData, loading, error } = useSelector((state) => state.fund);

  const depositWallet =
    getTransferIncomeToDepositWalletReportData?.walletBalance[0]?.depositWallet;

  useEffect(() => {
    const urid = getUserId();
    dispatch(getTransferIncomeToDepositWalletReport(urid));
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (usernameInput && usernameInput.length >= 3) {
        setIsSearching(true);
        setHasSearched(true);
        dispatch(usernameByLoginId(usernameInput)).finally(() =>
          setIsSearching(false)
        );
      } else {
        setSearchedUsername(null);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameInput, dispatch]);

  useEffect(() => {
    if (hasSearched && usernameData?.data) {
      setSearchedUsername(usernameData.data.name);
      setSearchedUrid(usernameData.data.urid);
    } else if (hasSearched) {
      setSearchedUsername(null);
      setSearchedUrid(null);
    }
  }, [usernameData, hasSearched]);

  if (!agent) return null;

  const handleConfirmLease = async() => {
    setShowConfirmation(false);
    setIsConfirming(true);

    if (depositWallet < totalCost) {
      toast.error("Insufficient Balance in your Deposit Wallet");
      setIsConfirming(false);
      return;
    }

    const data = {
      urid: searchedUrid,
      byURID: getUserId(),
      productId: productId,
      rkprice: price,
      leaseDuration: duration,
      createdBy: getUserId(),
      durationOnMonth: month.toString(),
    };

    try {
      const result = await dispatch(addRechargeTransact(data)).unwrap();

      if (result.statusCode === 200) {
        toast.success("Lease confirmed successfully!");
        const responseData = result.data[0];
        setOrderData({
          image: responseData.image,
          name: responseData.ProductName,
          Rkprice: responseData.Rkprice,
          usernameInput: usernameInput,
          searchedUsername: searchedUsername,
          month: month,
        });
        router.push("/pages/browser-agents/order-successfully");
      } else {
        toast.error("Lease confirmation failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during lease confirmation. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClick = () => {
    if (!searchedUrid) {
      toast.error("Please select a valid username");
      return;
    }
    setShowConfirmation(true);
  };

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center min-h-screen bg-black bg-opacity-60 backdrop-blur-sm">
      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-400">
            <h3 className="mb-4 text-xl font-bold dark:text-white">
              Confirm Lease
            </h3>
            <p className="mb-6 dark:text-white">
              Are you sure you want to Lease this Agent?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setShowConfirmation(false)}
                disabled={isConfirming}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-[#6446d7] rounded hover:bg-[#5439c0]"
                onClick={handleConfirmLease}
                disabled={isConfirming}
              >
                {isConfirming ? "Confirming..." : "Confirm"}
              </button>
            </div>
            {isConfirming && <Loader />}
          </div>
        </div>
      )}

      {/* Lease Form */}
    
      <div className="overflow-hidden card  px-3  new-card-browser-agents">
        <div className="p-5 position-div animate-fadeIn">
          <button
            className="absolute text-3xl font-extrabold text-gray-400 top-4 right-4 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2 className="browser-card-heading">
            Available Deposit ${Number(depositWallet).toFixed(2)}
          </h2>
          <p className="browser-card-sub-heading">
            Configure your lease duration and confirm the rental.
          </p>

          {/* Lease Duration */}
          <div className="flex flex-col items-center w-full mb-8">
            <label className="block mb-2 text-sm font-semibold tracking-wide text-white">
              Lease Duration
            </label>
            <div className="relative w-40">
              <div className="relative w-full">
                <select
                  className="block w-full px-4 py-2 text-base font-medium text-gray-800 transition-all bg-white border border-gray-300 rounded-md shadow-sm appearance-none cursor-pointer pr-14 focus:outline-none hover:border-blue-400"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Select duration
                  </option>
                  {[1, 2, 3, 6, 12].map((val) => (
                    <option key={val} value={val}>
                      {val} {val === 1 ? "hour" : "hours"}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 flex items-center text-gray-500 pointer-events-none right-4">
                  <FaChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Lease Details */}
          <div className="p-5 mb-8 space-y-2 text-sm border shadow-inner text-white-700 border-white-100 sm-card-bg rounded-xl">
            <div className="flex items-center justify-between gap-x-4">
              <span className="font-semibold text-white">Lease Period</span>
              <span className="font-bold text-white">{month} Month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Lease Price</span>
              <span className="font-bold text-white">${totalCost}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                Energy Consumption
              </span>
              <span className="font-bold text-white">
                {toatalEnergy} units/hour
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                Total Rental Yield
              </span>
              <span className="font-bold text-white">
                Up to {getTotalReturnPercentage(totalCost)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                Weekly Rental Yield
              </span>
              <span className="font-bold text-white">
                ${updatedDollarWeeklyReturn}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                Monthly ROY (Rate of Yield)
              </span>
              <span className="font-bold text-white">{monthlyReturn}</span>
            </div>
          </div>

          {/* Total Lease */}
          <div className="flex items-center justify-between p-3 mb-4 text-2xl font-bold text-gray-800 border-t card dark:text-white">
            <span>Total Lease Value:</span>
            <span className="font-extrabold text-gray-600 dark:text-white">
              ${totalCost}
            </span>
          </div>

          {/* Username Input */}
          <div className="w-full mb-4">
            <div className="flex items-center justify-between p-3 text-xl font-bold text-gray-800 border-t card dark:text-white">
              <div className="flex items-center w-full gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-2 py-1 text-base text-gray-800 bg-transparent focus:outline-none focus:border-blue-400 placeholder:font-sm placeholder:text-gray-500 dark:text-white"
                    placeholder="Enter Username"
                  />
                </div>

                {searchedUsername && (
                  <span className="font-extrabold text-gray-600 dark:text-white">
                    {searchedUsername}
                  </span>
                )}
              </div>
            </div>

            <div className="px-3">
              {isSearching && (
                <div className="text-sm text-gray-500">Searching...</div>
              )}
              {hasSearched && !searchedUsername && !isSearching && (
                <div className="text-sm text-red-400">Username Not Found</div>
              )}
              {error && (
                <div className="text-sm text-red-400">
                  Error: {error.message || "Search failed"}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-5">
            <button
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2.5 rounded-xl bg-[#6446d7] text-white font-bold shadow-lg cursor-pointer transition-all focus:outline-none"
              onClick={handleClick}
            >
              Confirm Lease
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
