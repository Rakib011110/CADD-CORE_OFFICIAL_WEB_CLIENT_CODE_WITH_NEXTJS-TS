import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
