// features/game/gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameId: null,
  boardId: null,
  board: null, // ⬅️ added full board object
  playerOrder: [],
  status: 'waiting',
  currentTurnPlayerId: null,
  logs: [], // simple client-side log list
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
      if (action.payload.playerOrder && action.payload.playerOrder.length) {
        state.playerOrder = action.payload.playerOrder;
      }
      if (action.payload.currentTurnPlayerId) {
        state.currentTurnPlayerId = action.payload.currentTurnPlayerId;
      }
    },
    addLog: (state, action) => {
      // Expect payload { message, type?, timestamp?, ...rest }
      const entry = {
        id: Date.now() + Math.random().toString(36).slice(2),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.logs.unshift(entry); // newest first
      if (state.logs.length > 200) state.logs.length = 200; // cap
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { setGameInfo, setGameStarted ,setLobbyPlayers, addLog, clearLogs } = gameSlice.actions;
export default gameSlice.reducer;