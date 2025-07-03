# Models Documentation

This folder contains all the Mongoose models for the Mardo Game backend. The game is a Monopoly-inspired board game with unique features like bombs, defense items, and airbase attacks.

## Core Game Models

### Game.js
The main game entity that manages game state and coordination.
- **Status**: Tracks game phases (waiting, active, ended)
- **Player Management**: Maintains turn order and current player
- **Game Control**: Owner management and board reference
- **Timestamps**: Automatic creation and update tracking

### Player.js
Represents individual players in the game.
- **Identity**: Username and unique color for UI representation
- **Economy**: Money management (default: 1500)
- **Position**: Current board position and movement tracking
- **Status**: Jail status and vacation state for turn skipping
- **Connection**: Socket ID for real-time communication
- **Owned Properties**: References to properties owned by the player

### Board.js
Defines the game board layout and structure.
- **Configuration**: Board name and description
- **Tile Management**: Array of tile references for board layout
- **Extensibility**: Support for different board configurations

### Tile.js
Individual board positions with various types and behaviors.
- **Position**: Unique index for board placement
- **Types**: Property, start, jail, vacation, tax, surprise, airbase
- **Special Properties**: Tax amounts, surprise card types
- **Property Link**: Reference to associated property data

## Property System

### Property.js
Base property definitions and characteristics.
- **Identity**: Name, color group, and board position
- **Economics**: Base price, rent, and upgrade costs
- **Special Features**: Airbase capability for bomb usage
- **Location**: Country-based theming

### PlayerProperty.js
Tracks player ownership and property development.
- **Ownership**: Player and property relationship
- **Development**: Level upgrades (0-4) and hotel status
- **Financial**: Mortgage capabilities
- **Defense**: Associated defense items and status

## Combat System

### Bomb.js
Offensive weapons for property attacks.
- **Specifications**: Name, intensity (damage power)
- **Area Effect**: Blast radius for multi-tile damage
- **Economics**: Purchase price for store transactions

### DefenseItem.js
Protective items for property defense.
- **Protection**: Strength rating for damage absorption
- **Economics**: Purchase price and cost management
- **Durability**: Damage resistance capabilities

### PlayerBombInventory.js
Tracks bomb ownership and quantities.
- **Inventory**: Player-specific bomb storage
- **Quantities**: Available bomb counts per type
- **Management**: Purchase and usage tracking

### PlayerDefenseInventory.js
Manages defense item ownership and condition.
- **Inventory**: Player-specific defense storage
- **Condition**: Defense item status (intact, damaged, destroyed)
- **Quantities**: Available defense counts per type

## Transaction & Logging Models

### StoreTransaction.js
Records all store purchases and transactions.
- **Player Tracking**: Who made the purchase
- **Item Details**: Type (bomb/defense), item reference, quantity
- **Financial**: Total cost and transaction timing

### AttackLog.js
Comprehensive attack event logging.
- **Participants**: Attacker, target player, and property
- **Combat Details**: Bomb used, defense deployed, damage calculations
- **Area Effect**: Blast targets and collateral damage
- **Outcomes**: Levels destroyed, defense status changes

### PropertyUpgradeLog.js
Tracks property development and improvements.
- **Development**: Level changes and hotel construction
- **Financial**: Upgrade costs and investment tracking
- **History**: Previous and new development states

### RepairLog.js
Records defense item repairs and maintenance.
- **Repair Details**: Defense item and associated property
- **Status Changes**: Repair progression (damaged → intact)
- **Economics**: Repair costs and financial impact

### GameActionLog.js
General game action tracking and history.
- **Action Types**: Roll, buy, attack, and other game actions
- **Flexible Details**: Extensible action data storage
- **Timeline**: Complete game history for replay and analysis

## Communication Models

### ChatMessage.js
In-game chat and communication system.
- **Messaging**: Player-to-player communication
- **Game Context**: Game-specific chat rooms
- **Timestamps**: Message ordering and history

### Auction.js
Property auction management and bidding.
- **Auction State**: Active auctions and participation
- **Bidding**: Highest bidder tracking and bid history
- **Participants**: Player involvement and competition

## Model Relationships

The models form a complex web of relationships:
- **Game** → **Players** → **Properties** → **Tiles**
- **Players** → **Inventories** (Bombs, Defense)
- **Actions** → **Logs** (Attack, Upgrade, Repair, Transaction)
- **Communication** → **Chat**, **Auctions**

All models use MongoDB ObjectId references for relationships and include automatic timestamps for audit trails. The system supports real-time gameplay through socket connections and comprehensive logging for game state management and replay capabilities.