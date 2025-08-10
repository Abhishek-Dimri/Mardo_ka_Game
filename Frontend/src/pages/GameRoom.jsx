import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GameLayout from '../layouts/GameLayout';
import GameBoard from '../features/game/GameBoard';
import JoinRoom from '../features/lobby/JoinRoom';
import ChatPanel from '../features/chat/ChatPanel';
import PlayerSidebar from '../features/player/PlayerSidebar';
import StorePanel from '../features/store/StorePanel';

import { emitGetGameData, emitRejoinGame } from '../features/game/gameEvents';

import { setGameInfo, setLobbyPlayers, setGameStarted } from '../features/game/gameSlice';
import { setPlayerInfo } from '../features/player/playerSlice';

const GameRoom = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const player = useSelector((state) => state.player);

  useEffect(() => {
    emitGetGameData(gameId, (response) => {
      if (response.success) {
        dispatch(setGameInfo({
          gameId,
          boardId: response.board._id,
          board: response.board,
          status: response.status,
        }));
        // response.playerOrder now contains ordered player objects (backend change)
        if (Array.isArray(response.playerOrder) && response.playerOrder.length) {
          // setGameStarted ensures we store the ordered list if already active
          if (response.status === 'active') {
            dispatch(setGameStarted({
              currentTurnPlayerId: response.currentTurnPlayerId,
              playerOrder: response.playerOrder,
            }));
          } else {
            response.playerOrder.forEach(p => dispatch(setLobbyPlayers(p)));
          }
        } else if (Array.isArray(response.players)) {
          response.players.forEach(p => dispatch(setLobbyPlayers(p)));
        }
        setLoading(false);
      } else {
        alert(response.error);
      }
    });
  }, [gameId]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('playerData'));
    if (!savedData || savedData.gameId !== gameId) return;

    const { playerId, username, color } = savedData;

    emitRejoinGame({ gameId, playerId }, (response) => {
      if (response.success) {
        dispatch(setPlayerInfo({
          playerId,
          username,
          color,
          gameOwner: response.gameOwner === playerId,
        }));

        dispatch(setLobbyPlayers({
          playerId,
          username,
          color,
          gameId,
        }));
      } else {
        console.warn('Rejoin failed:', response.error);
        localStorage.removeItem('playerData');
      }
    });
  }, [gameId, dispatch]);

  if (loading) return <div>Loading game...</div>;

  return (
    <>
      {!player.playerId && <JoinRoom gameId={gameId} />}
      <GameLayout
        left={<ChatPanel gameId={gameId} />}
        center={<GameBoard />}
        right={<><PlayerSidebar /> <StorePanel /></>}
      />
    </>
  );
};

export default GameRoom;
