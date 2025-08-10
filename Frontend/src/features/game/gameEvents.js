// gameEvents.js (feature layer)
// Delegates to the canonical socket events implementation to avoid divergence.
// This removes the previously incorrect emitCreateGame signature.
export {
  emitCreateGame,
  emitJoinGame,
  emitRejoinGame,
  emitGetGameData,
  emitStartGame,
} from '../../socket/events/gameEvents';
