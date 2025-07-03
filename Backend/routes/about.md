# Routes Documentation

This folder contains all the Express.js route handlers for the Mardo Game backend API. The routes are organized by functionality and provide RESTful endpoints for game interactions.

## Route Structure

### index.js
Main route dispatcher that organizes all route modules.
- **Central Router**: Acts as the main entry point for all API routes
- **Modular Organization**: Routes grouped by functionality (game, player, property, etc.)
- **Scalable Structure**: Easy to add new route modules

## Core Game Routes

### gameRoutes.js
Handles game creation, management, and lifecycle operations.
- **POST `/create`**: Create a new game instance
- **POST `/join`**: Allow players to join an existing game
- **POST `/start`**: Start the game when all players are ready
- **GET `/status/:gameId`**: Retrieve current game status and player list
- **POST `/end`**: End the game session and declare results

### playerRoutes.js
Manages individual player actions and status during gameplay.
- **POST `/roll`**: Roll dice for player movement
- **POST `/end-turn`**: End current player's turn
- **POST `/jail/pay`**: Pay fine to get out of jail
- **POST `/jail/roll`**: Attempt to roll doubles to escape jail
- **GET `/status/:playerId`**: Retrieve current player status and information

## Property Management Routes

### propertyRoutes.js
Handles all property-related transactions and management.
- **POST `/buy`**: Purchase available properties
- **POST `/auction/start`**: Initiate property auction
- **POST `/auction/bid`**: Place bids in property auctions
- **POST `/auction/end`**: Conclude property auctions
- **POST `/upgrade`**: Upgrade properties with buildings
- **POST `/mortgage`**: Mortgage properties for cash
- **POST `/unmortgage`**: Unmortgage properties by paying fees
- **GET `/list/:gameId`**: List all properties in a game

## Combat System Routes

### attackRoutes.js
Manages the unique combat mechanics with bombs and defense items.
- **POST `/use-bomb`**: Launch bomb attacks on properties
- **POST `/repair`**: Repair damaged defense items
- **POST `/assign-defense`**: Assign defense items to protect properties
- **GET `/inventory/bombs/:playerId`**: Retrieve player's bomb inventory
- **GET `/inventory/defense/:playerId`**: Retrieve player's defense inventory

## Store & Economy Routes

### storeRoutes.js
Handles in-game store transactions for bombs and defense items.
- **GET `/items`**: Retrieve available store items and prices
- **POST `/buy`**: Purchase bombs or defense items from store

## Communication Routes

### chatRoutes.js
Manages in-game chat and communication features.
- **POST `/send`**: Send chat messages to game participants
- **GET `/history/:gameId`**: Retrieve chat history for a game

### tradeRoutes.js
Handles player-to-player trading functionality.
- **POST `/offer`**: Send trade offers to other players
- **POST `/accept`**: Accept incoming trade offers
- **POST `/decline`**: Decline trade offers
- **GET `/list/:playerId`**: Get all trade offers for a player

## Logging & Analytics Routes

### logRoutes.js
Provides access to game logs and historical data.
- **GET `/game/:gameId`**: Retrieve comprehensive game action logs
- **GET `/player/:playerId`**: Get player-specific action history
- **GET `/attacks/:gameId`**: Retrieve attack logs and combat history

## API Design Patterns

### RESTful Structure
- **GET**: Retrieve data (status, lists, history)
- **POST**: Create or modify data (actions, purchases, attacks)
- **Consistent Parameters**: ID-based routing for resources

### Controller Integration
All routes delegate business logic to dedicated controllers:
- `gameController` - Game state management
- `playerController` - Player actions and status
- `propertyController` - Property transactions
- `attackController` - Combat mechanics
- `storeController` - Store transactions
- `chatController` - Communication features
- `tradeController` - Player trading
- `logController` - Data logging and retrieval

### Modular Architecture
Each route file handles a specific domain:
- **Separation of Concerns**: Clear boundaries between functionalities
- **Maintainability**: Easy to locate and modify specific features
- **Scalability**: Simple to add new routes or modify existing ones

## Security & Validation
Routes implement proper:
- **Parameter Validation**: ID validation for database queries
- **Error Handling**: Consistent error responses
- **Authentication**: Player identification through session/token management
- **Game State Validation**: Ensuring valid game states for actions

The routing system provides a comprehensive API for the Mardo Game, supporting all core gameplay mechanics including movement, property management, combat, trading, and communication features unique to this Monopoly-inspired game.