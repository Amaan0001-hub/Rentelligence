import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, getRequestWithToken, postRequest, postRequestWithToken } from "../../api/auth";

const API_ENDPOINTS = {
    AUTO_DEPOSIT: "/FundManager/autoDeposit",
    ADD_FUND_REQUEST:"/FundManager/addFundRequest",
    GET_FUND_REQUEST_REPORT:"/FundManager/getFundRequestReport",
    GET_PAY_MODE_MASTER:"/FundManager/getPayModeMaster",
    USERNAME_BY_LOGINID:"/AdminMaster/userNameByLoginId",
    ADD_USER_WITHDRWAL_REQUEST: "/FundManager/addUserWithdrawalRequest",
    FUND_TRANSFER_DEPOSIT_TO_DEPOSIT:"/FundManager/fundTransferDepositToDeposit",
    GET_INCOME_TO_DEPOSIT_WALLET_REPORT:"/FundManager/getIncomeToDepositWalletReport",
    ADD_TRANSFER_INCOME_TO_DEPOSIT_WALLET:"/FundManager/addTransferIncomeToDepositWallet",
    GET_TRANSFER_INCOME_TO_DEPOSIT_WALLET_REPORT:"/FundManager/getTransferIncomeToDepositWalletReport",
    GET_FUND_TRANSFER_DEPOSIT_TO_DEPOSIT_REPORT:"/FundManager/getfundTransferDepositToDepositReport"
};

export const autoDeposit = createAsyncThunk(
    "fund/autoDeposit",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequest(API_ENDPOINTS.AUTO_DEPOSIT);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch auto deposit data");
        }
    }
);

export const getTransferIncomeToDepositWalletReport = createAsyncThunk(
    "fund/getTransferIncomeToDepositWalletReport",
    async (urid, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.GET_TRANSFER_INCOME_TO_DEPOSIT_WALLET_REPORT}?URID=${urid}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch auto deposit data");
        }
    }
);

export const usernameByLoginId = createAsyncThunk(
    'fund/usernameLoginId',
    async (authLogin, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.USERNAME_BY_LOGINID}?authLogin=${authLogin}`);
            if (!response) {
                throw new Error('Invalid user wallet details data received');
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching user wallet details');
        }
    }
);

export const getPayModeMaster = createAsyncThunk(
    "fund/getPayModeMaster",
    async (_, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.GET_PAY_MODE_MASTER);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch pay mode master data");
        }
    }
);

export const fundTransferDepositToDeposit = createAsyncThunk(
    "fund/fundTransferDepositToDeposit",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.FUND_TRANSFER_DEPOSIT_TO_DEPOSIT, data);
            return response;
            
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const addFundRequest = createAsyncThunk(
    "fund/addFundRequest",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.ADD_FUND_REQUEST, data);
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const getFundRequestReport = createAsyncThunk(
    "fund/getFundRequestReport",
    async (urid, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.GET_FUND_REQUEST_REPORT}?URID=${urid}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch auto deposit data");
        }
    }
);


export const addUserWithdrawalRequest= createAsyncThunk(
    "fund/addUserWithdrawalRequest",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.ADD_USER_WITHDRWAL_REQUEST, data);
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);


export const transferFund = createAsyncThunk(
    "fund/transferFund",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.TRANSFER_FUND, data);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);

export const getfundTransferDepositToDepositReport = createAsyncThunk(
    "fund/getfundTransferDepositToDepositReport",
    async (urid , { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(`${API_ENDPOINTS.GET_FUND_TRANSFER_DEPOSIT_TO_DEPOSIT_REPORT}?URID=${urid}`);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch income to deposit wallet report");
        }
    }
);

export const addTransferIncomeToDepositWallet = createAsyncThunk(
    "fund/addTransferIncomeToDepositWallet",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.ADD_TRANSFER_INCOME_TO_DEPOSIT_WALLET, data);
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to add withdrawal request");
        }
    }
);


const fundManagerSlice = createSlice({
    name: "Fund",
    initialState: {
        loading: false,
        error: null,
        autoDepositData: null,
        addUserWithdrawalRequestData: null,
        getPayModeMasterData:null,
        usernameData:null,
        fundTransferDepositToDepositData :null,
        getIncomeToDepositWalletReportData:null,
        addFundRequestData:null,
        getFundRequestReportData:null,
        getTransferIncomeToDepositWalletReportData:null
    },

    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(autoDeposit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(autoDeposit.fulfilled, (state, action) => {
                state.loading = false;
                state.autoDepositData = action.payload;
                state.error = null;
            })
            .addCase(autoDeposit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPayModeMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPayModeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.getPayModeMasterData = action.payload;
                state.error = null;
            })
            .addCase(getPayModeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(usernameByLoginId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usernameByLoginId.fulfilled, (state, action) => {
                state.usernameData = action.payload;
                state.loading = false;
            })
            .addCase(usernameByLoginId.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(transferFund.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(transferFund.fulfilled, (state, action) => {
                state.loading = false;
                state.addUserRequestWithdrawalCoinData = action.payload;
                state.error = null;
            })
            .addCase(transferFund.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUserWithdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( addUserWithdrawalRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.addUserWithdrawalRequestData = action.payload;
                state.error = null;
            })
            .addCase( addUserWithdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fundTransferDepositToDeposit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( fundTransferDepositToDeposit.fulfilled, (state, action) => {
                state.loading = false;
                state.fundTransferDepositToDepositData = action.payload;
                state.error = null;
            })
            .addCase(fundTransferDepositToDeposit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getfundTransferDepositToDepositReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getfundTransferDepositToDepositReport.fulfilled, (state, action) => {
                state.loading = false;
                state.getIncomeToDepositWalletReportData = action.payload;
                state.error = null;
            })
            .addCase(getfundTransferDepositToDepositReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addFundRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFundRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.addFundRequestData = action.payload;
                state.error = null;
            })
            .addCase(getFundRequestReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFundRequestReport.fulfilled, (state, action) => {
                state.loading = false;  
                state.getFundRequestReportData = action.payload;
                state.error = null;
            })
            .addCase(getFundRequestReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addTransferIncomeToDepositWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTransferIncomeToDepositWallet.fulfilled, (state, action) => {
                state.loading = false;  
                state.getFundRequestReportData = action.payload;
                state.error = null;
            })
            .addCase(addTransferIncomeToDepositWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase( getTransferIncomeToDepositWalletReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( getTransferIncomeToDepositWalletReport.fulfilled, (state, action) => {
                state.loading = false;  
                state.getTransferIncomeToDepositWalletReportData = action.payload;
                state.error = null;
            })
            .addCase( getTransferIncomeToDepositWalletReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
    }
});

export default fundManagerSlice.reducer;
