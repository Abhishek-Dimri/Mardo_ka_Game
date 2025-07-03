import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playerId: null,
  username: '',
  color: '',
  gameOwner: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerInfo: (state, action) => {
      state.playerId = action.payload.playerId;
      state.username = action.payload.username;
      state.color = action.payload.color;
      state.gameOwner = action.payload.gameOwner;
    },
  },
});

export const { setPlayerInfo } = playerSlice.actions;
export default playerSlice.reducer;
