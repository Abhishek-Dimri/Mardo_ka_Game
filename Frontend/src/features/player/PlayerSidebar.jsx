import { useSelector } from 'react-redux';

const PlayerSidebar = () => {
  const players = useSelector(state => state.game.playerOrder || []);

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
};

export default PlayerSidebar;
