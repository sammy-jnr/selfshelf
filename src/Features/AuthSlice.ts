import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeCookie } from "../utils/cookies";

interface InitialState {
  isLoggedIn: boolean
  initialLoading: boolean
}


const initialState:InitialState = {
  isLoggedIn: false,
  initialLoading: true
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    setIsLoggedIn: (state, actions:PayloadAction<boolean>)=>{
      state.isLoggedIn = actions.payload
    },
    logOut: (state) => {
      state.isLoggedIn = false
      removeCookie("accessToken")
      removeCookie("refreshToken")
    },
    setInitialLoading: (state, action:PayloadAction<boolean>)=> {
      state.initialLoading = action.payload
    }
  }
})

export const {
  setIsLoggedIn,
  logOut,
  setInitialLoading
} = authSlice.actions


export default authSlice.reducer