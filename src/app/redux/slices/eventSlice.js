const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import { getRequestWithToken, postRequestWithToken } from "../../api/auth";

const API_ENDPOINTS = {
  GET_ALL_USER_EVENTS: "/Event/getAllUserEvent",
  GET_EVENT_BY_ID: "/Event/getAllUserEvent",
  GET_EVENT_SCHEDULE: "/Event/getScheduleByEID",
  ADD_USER_EVENT_BOOKING: "/Event/addUserEventbooking",
  GET_USER_EVENT_BOOKINGS: "/Event/getUserEventbookingbyURID",
  ADD_AI_UNLOCK_ACT_LOG: "/Settings/addAIUnlockActLog",
  CLOSE_EVENT_MASTER: "/Event/closeEventMaster",
  GET_EVENT_IMAGES_BY_EMID: "/Event/getEventImagesbyEMID",
  GET_AI_UNLOCK_USER_PLANS: "/Settings/getAIUnlockUserPlans",
  GET_AGENT_LEASE_CREDIT_BY_RID: "/Settings/getAgentLeaseCreditBYRID",
  GET_VERIFY_EVENT_USER: "/Event/getVerifyEventUser",
};

export const getAllUserEvents = createAsyncThunk(
  "event/getAllUserEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(API_ENDPOINTS.GET_ALL_USER_EVENTS);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user events"
      );
    }
  }
);

export const getEventById = createAsyncThunk(
  "event/getEventById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(`${API_ENDPOINTS.GET_EVENT_BY_ID}?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event"
      );
    }
  }
);

export const getEventSchedule = createAsyncThunk(
  "event/getEventSchedule",
  async (eventMasterID, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(`${API_ENDPOINTS.GET_EVENT_SCHEDULE}?EventMasterID=${eventMasterID}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event schedule"
      );
    }
  }
);

export const addUserEventbooking = createAsyncThunk(
  "event/addUserEventbooking",
  async (data, { rejectWithValue }) => {
    try {

      const response = await postRequestWithToken(API_ENDPOINTS.ADD_USER_EVENT_BOOKING, data);
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to book event"
      );
    }
  }
);

export const getUserEventBookings = createAsyncThunk(
  "event/getUserEventBookings",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(`${API_ENDPOINTS.GET_USER_EVENT_BOOKINGS}?URID=${userId}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user event bookings"
      );
    }
  }
);
export const addAIUnlockActLog = createAsyncThunk(
  "event/addAIUnlockActLog",
  async (logData, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.ADD_AI_UNLOCK_ACT_LOG, logData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add AI unlock activity log"
      );
    }
  }
);

export const closeEventMaster = createAsyncThunk(
  'event/closeEventMaster',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(API_ENDPOINTS.CLOSE_EVENT_MASTER);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to close event'
      );
    }
  }
);

export const getEventImagesByEMID = createAsyncThunk(
  'event/getEventImagesByEMID',
  async (EventMasterID, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.GET_EVENT_IMAGES_BY_EMID}?EventMasterID=${EventMasterID}`;
      const response = await getRequestWithToken(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch event images'
      );
    }
  }
);
export const getAIUnlockUserPlans = createAsyncThunk(
  "event/getAIUnlockUserPlans",
  async (urid, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_AI_UNLOCK_USER_PLANS}?URID=${urid}`
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
export const getAgentLeaseCreditByRID = createAsyncThunk(
  "event/getAgentLeaseCreditByRID",
  async (rechargeId, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.GET_AGENT_LEASE_CREDIT_BY_RID}?RechargeId=${rechargeId}`
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch agent lease credit"
      );
    }
  }
);


export const getVerifyEventUser = createAsyncThunk(
  "event/getVerifyEventUser",
  async (authLogin, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.GET_VERIFY_EVENT_USER}?AuthLogin=${authLogin}`;
      const response = await getRequestWithToken(endpoint);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify event user"
      );
    }
  }
);



const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    selectedEvent: null,
    AIUnlockUserPlans: [],
    schedule: [],
    bookingSuccess: null,
    aiUnlockLog: null,
    agentLeaseCredit: null,
    userBookings: [],
    eventImages: null,
    closeData: null,
    eventImages:null,
    closeData:null,
    verifyEventUserData: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUserEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(getAllUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
        state.error = null;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEventSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
        state.error = null;
      })
      .addCase(getEventSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUserEventbooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserEventbooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingSuccess = action.payload;
        state.error = null;
      })
      .addCase(addUserEventbooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserEventBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserEventBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
        state.error = null;
      })
      .addCase(getUserEventBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAIUnlockActLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAIUnlockActLog.fulfilled, (state, action) => {
        state.loading = false;
        state.aiUnlockLog = action.payload;
        state.error = null;
      })
      .addCase(addAIUnlockActLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(closeEventMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeEventMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.closeData = action.payload;
      })
      .addCase(closeEventMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getEventImagesByEMID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEventImagesByEMID.fulfilled, (state, action) => {
        state.loading = false;
        state.eventImages = action.payload || [];
      })
      .addCase(getEventImagesByEMID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAIUnlockUserPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAIUnlockUserPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.AIUnlockUserPlans = action.payload;
        state.error = null;
      })
      .addCase(getAIUnlockUserPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAgentLeaseCreditByRID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAgentLeaseCreditByRID.fulfilled, (state, action) => {
        state.loading = false;
        state.agentLeaseCredit = action.payload;
        state.error = null;
      })
      .addCase(getAgentLeaseCreditByRID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getVerifyEventUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVerifyEventUser.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyEventUserData = action.payload;
        state.error = null;
      })
      .addCase(getVerifyEventUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});


export default eventSlice.reducer;
