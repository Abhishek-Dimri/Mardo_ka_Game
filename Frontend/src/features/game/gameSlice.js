import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameId: null,
  playerOrder: [],
  status: 'waiting',
  currentTurnPlayerId: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameId: (state, action) => {
      state.gameId = action.payload;
    },
    setGameStarted: (state, action) => {
      state.status = 'active';
      state.playerOrder = action.payload.playerOrder;
      state.currentTurnPlayerId = action.payload.currentTurnPlayerId;
    },
  },
});

export const { setGameId, setGameStarted } = gameSlice.actions;
export default gameSlice.reducer;
