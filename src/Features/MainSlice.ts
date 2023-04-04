import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookInterface, ProcessedBookInterface } from '../Interface'


const categoryList = ["Comedy", "Entertainment", "Wealth"]


interface InitialState {
  username: string,
  email: string,
  booksArray: ProcessedBookInterface[],
  categories: string[]
}



const initialState:InitialState = {
  booksArray: [],
  categories: categoryList,
  username: "",
  email: ""
}

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers:{
    setBooksArray: (state, actions:PayloadAction<ProcessedBookInterface[]>) => {
      state.booksArray = actions.payload
    },
    setCategoriesArray: (state, actions:PayloadAction<string[]>) => {
      state.categories = actions.payload
    },
    setUsername: (state, actions:PayloadAction<string>) => {
      state.username = actions.payload
    },
    setUserEmail: (state, actions:PayloadAction<string>) => {
      state.email = actions.payload
    }
  }
})

export const {
  setBooksArray,
  setCategoriesArray,
  setUsername,
  setUserEmail
} = mainSlice.actions

export default mainSlice.reducer