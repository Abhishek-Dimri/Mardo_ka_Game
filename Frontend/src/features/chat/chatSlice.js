// features/chat/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    setChatHistory: (state, action) => {
      state.messages = action.payload;
    },
    addChatMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setChatHistory, addChatMessage } = chatSlice.actions;
export default chatSlice.reducer;
