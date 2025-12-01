"use client";

import { useEffect } from "react";
import { TopUpWallet } from "../deposit-wallet/page.js";
import {
  getIncomeWalletReport,
  getRentWalletByURID,
  getHarvestWalletReport,
} from "@/app/redux/slices/walletReportSlice.js";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { getUserId } from "@/app/api/auth.js";

export default function HarvestWallet() {
  const dispatch = useDispatch();
  const walletData = useSelector((state) => state.wallet.walletData);
  const { harvestWalletData } = useSelector((state) => state.wallet);

  // Load all data when component mounts
  useEffect(() => {
    const userId = getUserId();
    
    // Load all harvest wallet data initially
    const loadAllData = async () => {
      const data = {
        urid: userId,
        transtype: "" // Empty string to get all data initially
      };
      
      try {
        await dispatch(getHarvestWalletReport(data));
        await dispatch(getRentWalletByURID(userId));
      } catch (error) {
        console.error("Error loading harvest wallet data:", error);
      }
    };

    loadAllData();
  }, [dispatch]);

  const handleTransTypeChange = async (selectedValue) => {
    if (selectedValue === "all") {
      return; 
    }

    const userId = getUserId();
    const data = {
      urid: userId,
      transtype: selectedValue,
    };

    try {
      await dispatch(getHarvestWalletReport(data));
      await dispatch(getRentWalletByURID(userId));
    } catch (error) {
      console.error("Error filtering harvest wallet data:", error);
    }
  };

  return (
    <TopUpWallet
      transTypes={walletData?.rentTransTypes || []}
      data={harvestWalletData}
      onTransTypeChange={handleTransTypeChange}
      tableTitle="Harvest Wallet Records"
      balanaceTitle="Harvest Wallet Balance"
      walletType="harvest"
    />
  );
}