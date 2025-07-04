// features/game/gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameId: null,
  boardId: null,
  board: null, // ⬅️ added full board object
  playerOrder: [],
  status: 'waiting',
  currentTurnPlayerId: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameInfo: (state, action) => {
      const { gameId, boardId, board, status = 'waiting' } = action.payload;
      state.gameId = gameId;
      state.boardId = boardId;
      state.board = board || null;
      state.status = status;
    },
    setLobbyPlayers: (state, action) => {
      const newPlayer = action.payload;
      const exists = state.playerOrder.some(p => p.playerId === newPlayer.playerId);
      if (!exists) {
        state.playerOrder.push(newPlayer); // push full player object
      }
    },

    setGameStarted: (state, action) => {
      state.status = 'active';
      state.playerOrder = action.payload.playerOrder;
      state.currentTurnPlayerId = action.payload.currentTurnPlayerId;
    },
  },
});

export const { setGameInfo, setGameStarted ,setLobbyPlayers } = gameSlice.actions;
export default gameSlice.reducer;