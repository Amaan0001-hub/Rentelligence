import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import communityReducer from "./slices/communitySlice";
import productReducer from "./slices/productSlice";
import fundReducer from "./slices/fundManagerSlice";
import walletReportReducer from "./slices/walletReportSlice";
import ticketReducer from "./slices/ticketSlice";
import notificationReducer from "./slices/notificationSlice";
import selfReducer from "./slices/selfSlice";
import eventReducer from "./slices/eventSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    community:communityReducer,
    product:productReducer,
    fund:fundReducer,
    wallet:walletReportReducer,
    ticket:ticketReducer,
    notification:notificationReducer,
    self:selfReducer,
    event:eventReducer
  },
});
