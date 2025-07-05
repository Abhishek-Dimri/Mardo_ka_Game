import React, { use } from 'react';
import GameLayout from '../layouts/GameLayout';
import GameBoard from '../features/game/GameBoard';
import JoinRoom from '../features/lobby/JoinRoom';
import ChatPanel from '../features/chat/ChatPanel'; // Placeholder
import PlayerSidebar from '../features/player/PlayerSidebar'; // Placeholder
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setGameInfo, setLobbyPlayers, setGameStarted } from '../features/game/gameSlice';
import { useState, useEffect } from 'react';
import socket from '../socket/socket';
import StorePanel from '../features/store/StorePanel';
import { setPlayerInfo } from '../features/player/playerSlice';

const GameRoom = () => {

    const { gameId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const player = useSelector((state) => state.player);

    useEffect(() => {
        socket.emit('getGameData', gameId, (response) => {
            if (response.success) {
                dispatch(setGameInfo({
                    gameId,
                    boardId: response.board._id,
                    board: response.board,
                    status: response.status,
                }));
                response.players.forEach(p => {
                    dispatch(setLobbyPlayers(p));
                });
                setLoading(false);
            } else {
                alert(response.error);
            }
        });
    }, [gameId]);

    useEffect(() => {
        const handleGameStarted = (data) => {
            dispatch(setGameStarted({
                currentTurnPlayerId: data.currentTurnPlayerId,
                playerOrder: data.playerOrder,
            }));
        };

        socket.on('gameStarted', handleGameStarted);
        return () => socket.off('gameStarted', handleGameStarted);
    }, [dispatch]);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('playerData'));
        if (!savedData) return;

        const { gameId: savedGameId, playerId, username, color } = savedData;
        if (savedGameId !== gameId) return;

        socket.emit('rejoinGame', { gameId, playerId }, (response) => {
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
                localStorage.removeItem('playerData'); // Cleanup if invalid
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
