"use client"

import { useEffect } from "react"
import { TopUpWallet } from "../deposit-wallet/page.js"
import { getIncomeWalletReport } from "@/app/redux/slices/walletReportSlice.js"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import { getUserId } from "@/app/api/auth.js"

export default function IncomeWallet() {
    const dispatch = useDispatch()
    const { getIncomeWalletReportdata } = useSelector((state) => state.wallet);
    const walletData = useSelector((state) => state.wallet.walletData);

    useEffect(() => {
        const userId = getUserId();
        const data = {
            urid: userId,
            transtype: "" 
        };
        dispatch(getIncomeWalletReport(data));
    }, [dispatch]);

    const handleTransTypeChange = (selectedValue) => {

        if (selectedValue === "all") {
            return; 
        }
        
        const userId = getUserId();
        const data = {
            urid: userId,
            transtype: selectedValue
        };
        dispatch(getIncomeWalletReport(data));
    };

    return (
        <TopUpWallet
            transTypes={walletData?.incomeTransTypes || []}
            data={getIncomeWalletReportdata}
            onTransTypeChange={handleTransTypeChange}
            tableTitle="Performance Wallet Records"
            balanaceTitle="Performance Wallet Balance"
            walletType="performance"
        />
    )
}