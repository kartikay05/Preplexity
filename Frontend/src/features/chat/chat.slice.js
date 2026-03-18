import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],
        messages: [],
        currentChat: null,
        loading: false,
        error: null,
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        updateChatTitle: (state, action) => {
            const { chatId, title } = action.payload;
            const chat = state.chats.find(c => c._id === chatId);
            if (chat) chat.title = title;
        }
    },
});

export const { 
    setChats, 
    setMessages, 
    setCurrentChat, 
    setLoading, 
    setError, 
    addMessage,
    updateChatTitle 
} = chatSlice.actions;

export default chatSlice.reducer;
