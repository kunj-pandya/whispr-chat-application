import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        message: [],
        users: [],
        selecteUser: null,
        isUsersLoading: false,
        isMessagesLoading: false
    },
    reducers: {
        setSelecteUser(state, action) {
            state.users = action.payload;
        },
        pushNewMssage(state, action) {
            state.message.push = action.payload;
        }
    },
});

export const { setSelecteUser, pushNewMssage } = chatSlice.actions;

export default chatSlice.reducer;
