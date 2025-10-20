import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "./api";

interface UserState {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.error = null;
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.currentUser = null;
        state.role = null;
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setRole,
  setAuthenticated,
  updateUser,
  setLoading,
  setError,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
