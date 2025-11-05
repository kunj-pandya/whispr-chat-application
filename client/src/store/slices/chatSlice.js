import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";


export const getUsers = createAsyncThunk("chat/getUsers", async (_, thunkAPI) => {

    try {
        const res = await axiosInstance.get("/message/users");
        return res.data.users;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
});

export const getMessages = createAsyncThunk("chat/getMessages", async (userId, thunkAPI) => {
    try {
        const res = await axiosInstance.get(`/message/${userId}`);
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async (messageData, thunkAPI) => {
    try {
        const { chat } = thunkAPI.getState();
        const res = await axiosInstance.post(`/message/send/${chat.selectedUser._id}`, messageData);
        return res.data;

    } catch (error) {
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        message: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false
    },
    reducers: {
        setSelectedUser(state, action) {
            state.selectedUser = action.payload;
        },
        pushNewMessage(state, action) {
            state.message.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUsers.pending, (state) => {
            state.isUsersLoading = true;
        }).addCase(getUsers.fulfilled, (state, action) => {
            state.users = action.payload;
            state.isUsersLoading = false;
        }).addCase(getUsers.rejected, (state) => {
            state.isUsersLoading = false;
        }).addCase(getMessages.pending, (state) => {
            state.isMessagesLoading = true;
        }).addCase(getMessages.fulfilled, (state, action) => {
            state.message = action.payload.messages;
            state.isMessagesLoading = false;
        }).addCase(getMessages.rejected, (state) => {
            state.isMessagesLoading = false;
        }).addCase(sendMessage.fulfilled, (state, action) => {
            state.message.push(action.payload);
        });
    }
});

export const { setSelectedUser, pushNewMessage } = chatSlice.actions;

export default chatSlice.reducer;
