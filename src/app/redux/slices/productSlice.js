import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  getRequestWithToken,  postRequestWithToken } from "../../api/auth";

const API_ENDPOINTS = {
    GET_ALL_PRODUCT: "/Product/getAllActiveProduct",
    GET_BY_ID_PRODUCT: "/Product/getByIdProduct",
    ADD_RECHARGE_TRANSACT:"/WalletReport/addRechargeTransact",
    GET_ALL_PRODUCT_IMAGE_FOR_USER:"/Product/getAllProductImageForUser",
    GET_ALL_COMMON_CHART_DATA_BY_URID:"/AdminMaster/getAllCommonChartDataByURID",
    GET_AGENT_ANALYTICS_USER:"/Authentication/getAgentAnalyticsUser"
};

export const getAllProduct = createAsyncThunk(
    "product/getAllProduct",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(
                API_ENDPOINTS.GET_ALL_PRODUCT,
            );
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const addRechargeTransact = createAsyncThunk(
    "product/addRechargeTransact",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(API_ENDPOINTS.ADD_RECHARGE_TRANSACT, data);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);


export const getByIdProduct = createAsyncThunk(
    "product/getByIdProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await postRequestWithToken(
                API_ENDPOINTS.GET_BY_ID_PRODUCT,
                productId
            );
            if (!response || !response.data) {
                throw new Error("Invalid color data received");
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching colors");
        }
    }
);

export const getAllProductImageForUser = createAsyncThunk(
    "product/getAllProductImageForUser",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getRequestWithToken(
                `${API_ENDPOINTS.GET_ALL_PRODUCT_IMAGE_FOR_USER}?productId=${id}`
            );
            if (!response || !response.data) {
                throw new Error("Invalid color data received");
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching colors");
        }
    }
);


export const getAllCommonChartDataByURID = createAsyncThunk(
  "product/getAllCommonChartDataByURID",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(
        `${API_ENDPOINTS.GET_ALL_COMMON_CHART_DATA_BY_URID}?URID=${urid}`
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto deposit data"
      );
    }
  }
);

export const getAllAnalyticsDataByURID = createAsyncThunk(
  "product/getAllAnalyticsDataByURID",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(
        `${API_ENDPOINTS.GET_AGENT_ANALYTICS_USER}?URID=${urid}`
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto deposit data"
      );
    }
  }
);
const productSlice = createSlice({
    name: "product",
    initialState: {
        allProductData: [],
        getByIdProductData: { productDetail: null, similarProduct: [] },
        singleProduct: null,
        getAllProductImageForUserData: null,
         getAllCommonChartData:null,
        loading: false,
        error: null,
       analyticsData:null
    },
    reducers: {
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.allProductData = action.payload.data;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getByIdProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(getByIdProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.getByIdProductData = action.payload;
            })
            .addCase(getByIdProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addRechargeTransact.pending, (state) => {
                state.loading = true;
            })
            .addCase(addRechargeTransact.fulfilled, (state, action) => {
                state.loading = false;
                state.getByIdProductData = action.payload;
            })
            .addCase(addRechargeTransact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(getAllProductImageForUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProductImageForUser.fulfilled, (state, action) => {
                state.getAllProductImageForUserData = action.payload || [];
                state.loading = false;
            })
            .addCase(getAllProductImageForUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
             .addCase(getAllCommonChartDataByURID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCommonChartDataByURID.fulfilled, (state, action) => {
                state.getAllCommonChartData = action.payload || [];
                state.loading = false;
            })
            .addCase(getAllCommonChartDataByURID.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
                .addCase(getAllAnalyticsDataByURID.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getAllAnalyticsDataByURID.fulfilled, (state, action) => {
                    state.analyticsData = action.payload;
                    state.loading = false;
                })
                .addCase(getAllAnalyticsDataByURID.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
                });
    }
});

export default productSlice.reducer;
