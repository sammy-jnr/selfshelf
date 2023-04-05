import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProcessedBookInterface } from '../Interface'


const categoryList = ["Comedy", "Entertainment", "Wealth"]


interface InitialState {
  username: string,
  email: string,
  booksArray: ProcessedBookInterface[],
  categories: string[],
  dashboardScrollPosition: number
  selectedCategory: string
}



const initialState:InitialState = {
  booksArray: [],
  categories: categoryList,
  username: "",
  email: "",
  dashboardScrollPosition: 0,
  selectedCategory: "All"
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
    },
    setDashboardScrollPosition: (state, actions:PayloadAction<number>) => {
      state.dashboardScrollPosition = actions.payload
    },
    setSelectedCategory: (state, actions:PayloadAction<string>) => {
      state.selectedCategory = actions.payload
    }
  }
})

export const {
  setBooksArray,
  setCategoriesArray,
  setUsername,
  setUserEmail,
  setDashboardScrollPosition,
  setSelectedCategory
} = mainSlice.actions

export default mainSlice.reducer