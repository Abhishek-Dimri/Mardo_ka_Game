import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../features/game/gameSlice';
import playerReducer from '../features/player/playerSlice';
import chatReducer from '../features/chat/chatSlice';
import storeReducer from '../features/store/storeSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    player: playerReducer,
    chat: chatReducer,
    store: storeReducer,
  },
});
