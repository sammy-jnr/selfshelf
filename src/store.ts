import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./Features/MainSlice";
import authReducer from "./Features/AuthSlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
