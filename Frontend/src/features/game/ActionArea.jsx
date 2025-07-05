import React from 'react'
import StartGameBar from './StartGameBar'
import { useSelector } from 'react-redux'


function ActionArea() {
    const gameStatus = useSelector((state) => state.game.status)

  return (
    gameStatus === 'waiting' ? (
        <StartGameBar />
    ) : (
        gameStatus === 'active' ? (
            <div style={{ padding: '1rem', backgroundColor: '#fefefe', borderBottom: '1px solid #ddd' }}>
                <p>Game is in progress...</p>   
            </div>
        ) : (
            <div style={{ padding: '1rem', backgroundColor: '#fefefe', borderBottom: '1px solid #ddd' }}>
                <p>Game has ended.</p>
            </div>  

    )
  )
  )
}


export default ActionArea