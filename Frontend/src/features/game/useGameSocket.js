// useGameSocket.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initGameSocket, cleanupGameSocket } from './gameSocket';

const useGameSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    initGameSocket(dispatch);
    return () => cleanupGameSocket();
  }, [dispatch]);
};

export default useGameSocket;
