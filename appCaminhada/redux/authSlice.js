import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: true,
  name: null,
  email: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
