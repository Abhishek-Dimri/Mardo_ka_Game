import React, { use } from 'react';
import GameLayout from '../layouts/GameLayout';
import GameBoard from '../features/game/GameBoard';
import JoinRoom from '../features/lobby/JoinRoom';
import ChatPanel from '../features/chat/ChatPanel'; // Placeholder
import PlayerSidebar from '../features/player/PlayerSidebar'; // Placeholder
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setGameInfo, setLobbyPlayers } from '../features/game/gameSlice';
import { useState, useEffect } from 'react';
import socket from '../socket/socket';
import StorePanel from '../features/store/StorePanel';


const GameRoom = () => {

    const { gameId } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div>Loading game...</div>;

    return (
        <>
            <JoinRoom gameId={gameId} />
            <GameLayout
                left={<ChatPanel gameId={gameId} />}
                center={<GameBoard />}
                right={<><PlayerSidebar /> <StorePanel/></>}
            />
        </>
    );
};

export default GameRoom;
