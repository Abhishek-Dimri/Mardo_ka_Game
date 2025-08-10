import { useEffect } from 'react';
import socket from './socket';
import setupGameHandlers from './handlers/gameHandlers';
import setupChatHandlers from './handlers/chatHandlers';
// import setupDiceHandlers from './handlers/diceHandlers'; // future

import { useDispatch } from 'react-redux';

const useSocketInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) socket.connect();

    // ✅ Register all feature listeners
    setupGameHandlers(socket, dispatch);
    setupChatHandlers(socket, dispatch);
    // setupDiceHandlers(socket, dispatch); // ready for future

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};

export default useSocketInit;
