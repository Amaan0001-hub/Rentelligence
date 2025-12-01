const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import { encryptData } from "../../utils/encryption";
import toast from "react-hot-toast";
import {
  doLogin,
  getRequest,
  getRequestWithToken,
  postRequestWithToken,
  setToken,
  postRequestWithLoginId,
  postRequestWithData,
  postImageWithParams,
} from "../../api/auth";

const API_ENDPOINTS = {
  APP_LOGIN: "/Authentication/appLogin",
  USER_REGISTRATION: "/Authentication/userRegistration",
  GET_BY_REFREAL_ID: "/Authentication/getByReferralId",
  FORGOT_PASSWORD: "/Authentication/forgotPassword",
  UPDATE_USER_PROFILE: "/Authentication/updateUserProfile",
  SEND_OTP: "/Authentication/sendOtp",
  SEND_OTP_EVENT: "/Authentication/sendOtpEvent",
  GET_USER_KYC_BY_LOGIN_ID: "/Authentication/GetUserKycByLoginId",
  UPDATE_PASSWORD: "/Authentication/changePassword",
  SEND_OTP_REQUEST: "/Authentication/sendOtpFundRequest",
  SENT_WITHDRAWAL_OTP_REQUEST: "/Authentication/sendOtpWithdrawalRequest",
  VALIDATE_OTP: "/Authentication/validateOtp",
  GET_ALL_COUNTRY: "/Geography/getAllCountry",
  User_Dashboard_Details: "/Authentication/userDashboardDetails",
  UPDATE_USER_PROFILE_IMAGE:"/Authentication/updateUserProfileImage",
  GET_ALL_USER_NOTIFICATIONS: "/Ticket/getAllUserNotificationList",
  GET_NEWS: "/AdminMaster/getNews"
};

export const appLogin = createAsyncThunk(
  "auth/appLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.APP_LOGIN,
        data
      );

      const token = response.token || response.data?.token;
      localStorage.setItem("FName", encryptData(response.data?.FName));
      localStorage.setItem("AuthLogin", encryptData(response.data?.AuthLogin));

      setToken(token);
      if (response.statusCode === 409) {
        toast.error(
          response.message || "An unexpected error occurred. Please try again."
        );
      }else if(response.statusCode === 400){
        toast.error(response.message);
      }
      
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auth data"
      );
    }
  }
);

export const userRegistration = createAsyncThunk(
  "auth/userRegistration",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithData(
        API_ENDPOINTS.USER_REGISTRATION,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getRefreralIdByUserEmail = createAsyncThunk(
  "auth/getRefreralIdByUserEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getRequest(
        `${API_ENDPOINTS.GET_BY_REFREAL_ID}?loginId=${data}`
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.FORGOT_PASSWORD,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ data, image }, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.UPDATE_USER_PROFILE,
        data,
      );
      return { data, response };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

export const updateUserProfileImage = createAsyncThunk(
  "auth/updateUserProfileImage",
  async ({ data, image }, { rejectWithValue }) => {
    try {
      const response = await postImageWithParams(
        API_ENDPOINTS.UPDATE_USER_PROFILE_IMAGE,
        data,
        image
      );
      return { data, response };
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.UPDATE_PASSWORD,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to UPDATE password"
      );
    }
  }
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.SEND_OTP, data);
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const sendOtpEvent = createAsyncThunk(
  "auth/sendOtpEvent",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.SEND_OTP_EVENT, data);
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const getUserKycByLoginId = createAsyncThunk(
  "auth/getUserKycByLoginId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithLoginId(
        `${API_ENDPOINTS.GET_USER_KYC_BY_LOGIN_ID}?loginId=${data}`
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendOtpRequest = createAsyncThunk(
  "auth/sendOtpRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.SEND_OTP_REQUEST,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);
export const sendWithdrawalOtpRequest = createAsyncThunk(
  "auth/sendWithdrawalOtpRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.SENT_WITHDRAWAL_OTP_REQUEST,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const validateOtp = createAsyncThunk(
  "auth/validateOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.VALIDATE_OTP,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to validate OTP"
      );
    }
  }
);

export const getAllCountry = createAsyncThunk(
  "auth/getAllCountry",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_COUNTRY);
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

export const getUserDashboardDetails = createAsyncThunk(
  "auth/getUserDashboardDetails",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(
        `${API_ENDPOINTS.User_Dashboard_Details}?URID=${urid}`
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

export const getAllUserNotificationList = createAsyncThunk(
  "auth/getAllUserNotificationList",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_ALL_USER_NOTIFICATIONS}?URID=${urid}`
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user notifications"
      );
    }
  }
);

export const getNews = createAsyncThunk(
  "auth/getNews",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.GET_NEWS, data);
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news data"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authData: null,
    status: null,
    loading: false,
    error: null,
    userData: null,
    getUserDashboardData: null,
    getAllCountryData: null,
    getUserNotificationsData:null,
    newsData: null
  },

  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(appLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(appLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        doLogin(action.payload);
        state.error = null;
      })

      .addCase(appLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(userRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })

      .addCase(userRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRefreralIdByUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefreralIdByUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })

      .addCase(getRefreralIdByUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
        if (action.payload) {
          const { FName, LName } = action.payload.data;
          if (FName) {
            localStorage.setItem("FName", encryptData(FName));
          }
          if (LName) {
            localStorage.setItem("LName", encryptData(LName));
          }
          // Dispatch storage event to notify other components
          window.dispatchEvent(new Event("storage"));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendOtpEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(sendOtpEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendOtpRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(sendOtpRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendWithdrawalOtpRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendWithdrawalOtpRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(sendWithdrawalOtpRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserKycByLoginId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserKycByLoginId.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })

      .addCase(getUserKycByLoginId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(validateOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(validateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.getAllCountryData = action.payload;
        state.error = null;
      })
      .addCase(getAllCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserDashboardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDashboardDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.getUserDashboardData = action.payload;
        state.error = null;
      })
      .addCase(getUserDashboardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getAllUserNotificationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserNotificationList.fulfilled, (state, action) => {
        state.loading = false;
        state.getUserNotificationsData = action.payload;
        state.error = null;
      })
      .addCase(getAllUserNotificationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsData = action.payload;
        state.error = null;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
