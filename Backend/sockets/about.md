# Sockets Documentation

This folder contains all the Socket.IO handlers for the Mardo Game backend. The sockets provide real-time communication for multiplayer gameplay, enabling instant updates for all players in a game session.

## Socket Architecture

### index.js
Main socket initialization and connection management.
- **Connection Handling**: Manages new client connections and disconnections
- **Handler Registration**: Initializes all socket event handlers
- **Cleanup**: Handles player disconnection and cleanup processes
- **Logging**: Connection status monitoring and debugging

## Core Game Sockets

### gameSocket.js
Handles game lifecycle and session management.
- **`createGame`**: Creates new game instances with board setup
- **`joinGame`**: Allows players to join existing games with validation
- **`startGame`**: Initiates gameplay when minimum players are present
- **Game Validation**: Ensures proper game states and player authorization
- **Room Management**: Organizes players into Socket.IO rooms for broadcasting

### playerSocket.js
Manages individual player actions and turn mechanics.
- **`rollDice`**: Handles dice rolling with position updates
- **`endTurn`**: Manages turn transitions between players
- **`leaveGame`**: Processes player disconnections and game cleanup
- **Turn Validation**: Ensures only current player can perform actions
- **Position Tracking**: Updates player positions on the board
- **Vacation Logic**: Handles special vacation tile mechanics

## Property Management Sockets

### propertySocket.js
Handles all property-related transactions and management.
- **`buyProperty`**: Processes property purchases with validation
- **`upgradeProperty`**: Manages property development and improvements
- **`mortgageProperty`**: Handles property mortgaging for emergency funds
- **`unmortgageProperty`**: Processes property unmortgaging with interest
- **Ownership Validation**: Ensures proper property ownership checks
- **Financial Validation**: Verifies sufficient funds for transactions
- **Real-time Updates**: Broadcasts property changes to all players

## Combat System Sockets

### attackSocket.js
Manages the unique combat mechanics with bombs and defense systems.
- **`useBomb`**: Processes bomb attacks on enemy properties
- **`assignDefense`**: Assigns defense items to protect properties
- **`repairDefense`**: Repairs damaged defense items
- **Combat Calculations**: Handles damage, defense absorption, and area effects
- **Inventory Management**: Updates bomb and defense inventories
- **Attack Logging**: Records detailed attack information for game history
- **Defense Status**: Manages defense item conditions (intact, damaged, destroyed)

## Store & Economy Sockets

### storeSocket.js
Handles in-game store transactions and inventory management.
- **`buyItem`**: Processes purchases of bombs and defense items
- **`getStoreItems`**: Retrieves available store inventory
- **Inventory Updates**: Manages player bomb and defense inventories
- **Transaction Logging**: Records all store purchases
- **Financial Validation**: Ensures sufficient funds for purchases
- **Item Validation**: Verifies item availability and types

## Communication Sockets

### chatSocket.js
Manages in-game chat and messaging features.
- **`sendMessage`**: Processes and broadcasts chat messages
- **`getChatHistory`**: Retrieves chat history for new players
- **Message Validation**: Ensures proper message formatting
- **Real-time Broadcasting**: Instant message delivery to all game participants
- **Player Identification**: Associates messages with player usernames

### tradeSocket.js
Handles player-to-player trading functionality.
- **`offerTrade`**: Sends trade offers between players
- **`acceptTrade`**: Processes trade acceptances
- **`declineTrade`**: Handles trade rejections
- **`getTrades`**: Retrieves pending trade offers for players
- **Trade Validation**: Ensures valid player participation
- **Status Management**: Tracks trade offer states (pending, accepted, declined)
- **Notification System**: Real-time trade offer notifications

## Utility Functions

### utils/broadcastUtils.js
Helper functions for broadcasting game events (currently empty - ready for implementation).
- **Broadcast Patterns**: Standardized message broadcasting
- **Player Filtering**: Targeted message delivery
- **Event Formatting**: Consistent event structure

### utils/gameUtils.js
Helper functions for game logic and calculations (currently empty - ready for implementation).
- **Game State Validation**: Common validation functions
- **Turn Logic**: Player turn management utilities
- **Board Calculations**: Position and movement helpers

## Socket Event Patterns

### Client-to-Server Events
Events sent from client to server:
- **Action Events**: `rollDice`, `buyProperty`, `useBomb`
- **Communication Events**: `sendMessage`, `offerTrade`
- **Game Management**: `createGame`, `joinGame`, `startGame`

### Server-to-Client Events
Events broadcast from server to clients:
- **Game Updates**: `gameStarted`, `turnChanged`, `playerJoined`
- **Property Changes**: `propertyBought`, `propertyUpgraded`, `propertyAttacked`
- **Communication**: `newMessage`, `newTradeOffer`
- **Notifications**: `tradeAccepted`, `tradeDeclined`

## Real-time Features

### Instant Updates
- **Game State Synchronization**: All players see changes immediately
- **Turn Management**: Real-time turn progression
- **Combat Results**: Instant attack and defense updates
- **Chat Messages**: Immediate message delivery

### Room-based Broadcasting
- **Game Isolation**: Each game operates in its own Socket.IO room
- **Targeted Updates**: Messages sent only to relevant players
- **Efficient Communication**: Minimizes unnecessary network traffic

### Error Handling
- **Validation**: Comprehensive input validation for all events
- **Error Callbacks**: Detailed error messages for failed operations
- **Graceful Degradation**: Proper handling of disconnections and errors
- **Logging**: Comprehensive error logging for debugging

## Security & Validation

### Player Authorization
- **Turn Validation**: Only current player can perform turn actions
- **Ownership Checks**: Players can only modify their own properties
- **Game State Validation**: Actions validated against current game state

### Data Integrity
- **Input Sanitization**: All inputs validated before processing
- **Database Consistency**: Atomic operations for critical updates
- **Race Condition Prevention**: Proper handling of concurrent actions

The socket system provides a robust, real-time multiplayer experience for the Mardo Game, supporting all unique features including combat mechanics, property management, trading, and communication while maintaining data integrity and security.