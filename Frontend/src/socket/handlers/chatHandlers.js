const setupChatHandlers = (socket, dispatch) => {
  socket.on('newMessage', (msg) => {
    // dispatch something like: dispatch(addChatMessage(msg));
    console.log('📨 New message received:', msg);
  });

  return () => {
    socket.off('newMessage');
  };
};

export default setupChatHandlers;
