import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isVisible: false, // Controls the visibility of the mega menu
  activeItem: null, // Tracks the currently active (hovered or selected) item
  data: null,
  loading: false,
};

const menu = createSlice({
  name: "menu",
  initialState,
  reducers: {
    openMenu: (state) => {
      state.isVisible = true;
    },
    toggleMenu: (state) => {
      state.isVisible = !state.isVisible;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
    clearActiveItem: (state) => {
      state.activeItem = null;
    },
  },
});

export const { toggleMenu, setActiveItem, clearActiveItem, openMenu } =
  menu.actions;

export default menu.reducer;
