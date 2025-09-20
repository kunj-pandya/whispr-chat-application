import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";


export const getUser = createAsyncThunk("user/me", async (_, thunkAPI) => {
    try {
        const res = await axiosInstance.get("/user/me");
        connectSocket(res.data.user);
        return res.data.user;
    } catch (error) {
        console.log("Error fetching user:", error);
        return thunkAPI.rejectWithValue(
            error.response?.data || "Failed to fetch user"
        );
    }
});

export const logout = createAsyncThunk("user/sign-out", async (_, thunkAPI) => {
    try {
        await axiosInstance.get("/users/sign-out");
        disconnectSocket();
        return null;
    } catch (error) {
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState: {
        authUser: null,
        isSigningUp: false,
        isLogginIn: false,
        isUpdatingProfile: false,
        isCheckingAuth: true,
        onlineUsers: [],
    }, reducers: {
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
    }, extraReducers: (builder) => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.authUser = action.payload;
                state.isCheckingAuth = false;
            }).addCase(getUser.rejected, (state) => {
                state.authUser = null; state.isCheckingAuth = false;
            }).addCase(logout.fulfilled, (state) => {
                state.authUser = null;
            }).addCase(logout.rejected, (state) => [
                state.authUser
            ])
    },
});

export const { setOnlineUsers } = authSlice.actions;

export default authSlice.reducer;
