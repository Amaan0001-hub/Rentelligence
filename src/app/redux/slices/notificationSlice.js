import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequestURId } from "../../api/auth";

const API_ENDPOINTS = {
  GET_USER_NOTIFICATIONS: "/Ticket/getUserNotificationListbyURID",
  UPDATE_NOTIFICATIONS_COUNT: "/Ticket/updateUserNotification",
};

export const getUserNotifications = createAsyncThunk(
  "notifications/getUserNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestURId(
        API_ENDPOINTS.GET_USER_NOTIFICATIONS
      );
      return response.data?.notificationList || [];
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Notification data"
      );
    }
  }
);

export const updateNotificationsCount = createAsyncThunk(
  "notifications/updateNotificationsCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestURId(
        API_ENDPOINTS.UPDATE_NOTIFICATIONS_COUNT
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to Upate Notification data"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    loading: false,
    error: null,
    notificationData: null,
    notificationCount: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationData = action.payload;
        state.error = null;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNotificationsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateNotificationsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
