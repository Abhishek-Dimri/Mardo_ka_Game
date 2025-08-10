import { useSelector, shallowEqual } from 'react-redux';
import React from 'react';

const PlayerSidebar = React.memo(() => {
  const players = useSelector(state => state.game.playerOrder, shallowEqual) || [];

  return (
    <div>
      <h3>Players</h3>
      <ul>
        {players.map(p => (
          <li key={p.playerId} style={{ color: p.color }}>
            {p.username}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PlayerSidebar;
