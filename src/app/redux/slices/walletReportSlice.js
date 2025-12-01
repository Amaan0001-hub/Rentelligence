import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  postRequest,
  postRequestWithData,
  postRequestWithToken,
} from "../../api/auth";

const API_ENDPOINTS = {
  GET_INCOME_AND_DEPOSIT_TRANSTYPE:
    "/WalletReport/getIncomeAndDepositTransType",
  GET_DEPOSIT_WALLET_REPORT: "/WalletReport/getDepositWalletReport",
  GET_INCOME_WALLET_REPORT: "/WalletReport/getIncomeWalletReport",
  GET_INCOME_WITHDRAWAL_HISTORY: "/WalletReport/getIncomeWithdrawalHistory",
  GET_RECHRGE_TRANSACT_BY_ID: "/WalletReport/getRechargeTransactBYTId",
  GET_RENTWALLET_BY_URID: "/WalletReport/getRentWalletByURID",
  GET_HARVESTWALLET_REPORT: "/WalletReport/getRentWalletWallerReport",
  GET_LEADERSHIP_BY_URID: "/WalletReport/getLeaderShipbyURID",
  GET_PERFORMANCE_REWARD_LIST_BY_URID:"/WalletReport/getPerformanceRewardListByURID",
  GET_TRANSACTION_HISTORY:"/WalletReport/getTransactionHistory"
};

export const getIncomeAndDepositTransType = createAsyncThunk(
  "wallet/getIncomeAndDepositTransType",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_INCOME_AND_DEPOSIT_TRANSTYPE}?URID=${urid}`
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto deposit data"
      );
    }
  }
);

export const getRechargeTransactBYTId = createAsyncThunk(
  "wallet/getRechargeTransactBYTId",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_RECHRGE_TRANSACT_BY_ID}?URID=${urid}`
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto deposit data"
      );
    }
  }
);

export const getIncomeWalletReport = createAsyncThunk(
  "wallet/getIncomeWalletReport",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GET_INCOME_WALLET_REPORT,
        data
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add withdrawal request"
      );
    }
  }
);
export const getHarvestWalletReport = createAsyncThunk(
  "wallet/getHarvestWalletReport",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GET_HARVESTWALLET_REPORT,
        data
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add withdrawal request"
      );
    }
  }
);
export const getRentWalletByURID = createAsyncThunk(
  "wallet/getRentWalletByURID",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_RENTWALLET_BY_URID}?URID=${urid}`
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto deposit data"
      );
    }
  }
);

export const getDepositWalletReport = createAsyncThunk(
  "wallet/getDepositWalletReport",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GET_DEPOSIT_WALLET_REPORT,
        data
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add withdrawal request"
      );
    }
  }
);

export const getIncomeWithdrawalHistory = createAsyncThunk(
  "wallet/getIncomeWithdrawalHistory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GET_INCOME_WITHDRAWAL_HISTORY,
        data
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add withdrawal request"
      );
    }
  }
);

export const getLeaderShipbyURID = createAsyncThunk(
  "wallet/getLeaderShipbyURID",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_LEADERSHIP_BY_URID}?URID=${urid}`
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto deposit data"
      );
    }
  }
);

export const getPerformanceRewardListByURID= createAsyncThunk(
  "wallet/getPerformanceRewardListByURID",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_PERFORMANCE_REWARD_LIST_BY_URID}?URID=${urid}`
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto deposit data"
      );
    }
  }
);


export const gettransactionhistory = createAsyncThunk(
  "wallet/gettransactionhistory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.GET_TRANSACTION_HISTORY,
        data
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add transaction history "
      );
    }
  }
);


const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    loading: false,
    error: null,
    walletData: null,
    DepositWalletReportData: null,
    getIncomeWalletReportdata: null,
    IncomeWithdrawalHistoryData: null,
    getRentWalletByURIDdata: null,
    harvestWalletData: null,
    getLeaderShipData : null,
    PerformanceRewardListData:null,
    transactionhistorydata:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIncomeAndDepositTransType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomeAndDepositTransType.fulfilled, (state, action) => {
        state.loading = false;
        state.walletData = action.payload;
        state.error = null;
      })
      .addCase(getIncomeAndDepositTransType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRechargeTransactBYTId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRechargeTransactBYTId.fulfilled, (state, action) => {
        state.loading = false;
        state.walletData = action.payload;
        state.error = null;
      })
      .addCase(getRechargeTransactBYTId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDepositWalletReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDepositWalletReport.fulfilled, (state, action) => {
        state.loading = false;
        state.DepositWalletReportData = action.payload;
        state.error = null;
      })
      .addCase(getDepositWalletReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getIncomeWalletReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomeWalletReport.fulfilled, (state, action) => {
        state.loading = false;
        state.getIncomeWalletReportdata = action.payload;
        state.error = null;
      })
      .addCase(getIncomeWalletReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getIncomeWithdrawalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomeWithdrawalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.IncomeWithdrawalHistoryData = action.payload;
        state.error = null;
      })
      .addCase(getIncomeWithdrawalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRentWalletByURID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRentWalletByURID.fulfilled, (state, action) => {
        state.loading = false;
        state.getRentWalletByURIDdata = action.payload;
        state.error = null;
      })
      .addCase(getRentWalletByURID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHarvestWalletReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHarvestWalletReport.fulfilled, (state, action) => {
        state.loading = false;
        state.harvestWalletData = action.payload;
        state.error = null;
      })
      .addCase(getHarvestWalletReport.rejected, (state, action) => { 
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeaderShipbyURID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaderShipbyURID.fulfilled, (state, action) => {
        state.loading = false;
        state.getLeaderShipData  = action.payload;
        state.error = null;
      })
      .addCase(getLeaderShipbyURID.rejected, (state, action) => { 
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(getPerformanceRewardListByURID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPerformanceRewardListByURID.fulfilled, (state, action) => {
        state.loading = false;
        state.PerformanceRewardListData  = action.payload;
        state.error = null;
      })
      .addCase(getPerformanceRewardListByURID.rejected, (state, action) => { 
        state.loading = false;
        state.error = action.payload;
      })
 
       .addCase(gettransactionhistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gettransactionhistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionhistorydata = action.payload;
        state.error = null;
      })
      .addCase(gettransactionhistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      
  },
});

export default walletSlice.reducer;
