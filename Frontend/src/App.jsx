import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import useSocketInit from './socket/useSocketInit';

// Code-split route pages (reduces initial bundle)
const CreateGame = lazy(() => import('./pages/CreateGame'));
const JoinGame = lazy(() => import('./pages/JoinGame'));
const GameRoom = lazy(() => import('./pages/GameRoom'));

function App() {
  useSocketInit(); // 💡 handles socket connection & listeners

  return (
    <Router>
      <Suspense fallback={<div style={{padding:'2rem'}}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<CreateGame />} />
          <Route path="/join/:gameId" element={<JoinGame />} />
          <Route path="/game/:gameId" element={<GameRoom />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
