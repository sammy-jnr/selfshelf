import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./Features/MainSlice";
import authReducer from "./Features/AuthSlice";
import onlineReducer from "./Features/OnlineSlice"

export const store = configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer,
    online: onlineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
