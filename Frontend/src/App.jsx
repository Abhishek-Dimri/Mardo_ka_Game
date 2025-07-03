
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CreateGame from './pages/CreateGame';
import JoinGame from './pages/JoinGame';
import GameRoom from './pages/GameRoom';

import { useEffect } from 'react';
import socket from './socket/socket';

function App() {
  useEffect(() => {
    if (!socket.connected) socket.connect();
    return () => socket.disconnect();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateGame />} />
        <Route path="/join/:gameId" element={<JoinGame />} />
        <Route path="/game/:gameId" element={<GameRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
