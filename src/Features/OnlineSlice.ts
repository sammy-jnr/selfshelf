import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface InitialState {
}

const initialState:InitialState = {
}
const onlineSlice = createSlice({
  name: "online",
  initialState,
  reducers:{
    
  }
})

export const {
} = onlineSlice.actions

export default onlineSlice.reducer