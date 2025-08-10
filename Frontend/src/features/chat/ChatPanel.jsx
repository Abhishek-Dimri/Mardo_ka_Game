import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../../socket/socket';
import { setChatHistory, addChatMessage } from './chatSlice';
import styles from './ChatPanel.module.css'; // Optional: style later

const ChatPanel = React.memo(({ gameId }) => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chat.messages);
  const player = useSelector(state => state.player);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch chat history
    socket.emit('getChatHistory', { gameId }, (response) => {
      if (response.success) {
        dispatch(setChatHistory(response.messages));
      } else {
        console.error('Failed to load chat:', response.error);
      }
    });

    // Listen for new messages
    const handleNewMessage = (data) => {
      dispatch(addChatMessage(data));
    };
    socket.on('newMessage', handleNewMessage);

    return () => socket.off('newMessage', handleNewMessage);
  }, [gameId, dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;

    socket.emit('sendMessage', {
      gameId,
      playerId: player.playerId,
      message: message.trim()
    }, (response) => {
      if (!response.success) {
        alert(response.error);
      }
    });

    setMessage('');
  }, [message, gameId, player.playerId, dispatch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') sendMessage();
  }, [sendMessage]);

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHistory}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.chatMessage}>
            <strong style={{ color: msg.color || '#fff' }}>{msg.username}:</strong> {msg.message}
            <span className={styles.timestamp}>{new Date(msg.sentAt || msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
});

export default ChatPanel;
