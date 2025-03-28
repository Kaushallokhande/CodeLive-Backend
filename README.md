# CodeLive Documentation

## Project Overview
CodeLive is a real-time collaborative coding and chat platform that allows users to join rooms, share code, and communicate seamlessly.

## File Structure
```
CodeLive/
│── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js       # Database connection
│   │   │   ├── socket.js   # WebSocket configuration
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # Authentication middleware
│   │   ├── models/
│   │   │   ├── User.js     # User model
│   │   │   ├── Room.js     # Room model
│   │   │   ├── Message.js  # Message model
│   │   ├── routes/
│   │   │   ├── userRoutes.js   # Authentication routes
│   │   │   ├── roomRoutes.js   # Room management routes
│   │   │   ├── chatRoutes.js   # Messaging routes
│   │   ├── controllers/
│   │   │   ├── userController.js   # User authentication logic
│   │   │   ├── roomController.js   # Room handling logic
│   │   │   ├── chatController.js   # Chat messaging logic
│   │   ├── server.js   # Main server file
```

## API Endpoints

### Authentication APIs
**Base URL: `/api/auth`**
| Method | Endpoint      | Description              |
|--------|-------------|--------------------------|
| POST   | /register   | Register a new user      |
| POST   | /login      | User login & token issue |

### Room APIs
**Base URL: `/api/rooms`**
| Method | Endpoint         | Description                           |
|--------|----------------|---------------------------------------|
| POST   | /create        | Create a new chat room               |
| POST   | /join          | Join a private/public room           |
| POST   | /leave         | Leave a room                         |
| GET    | /:id/users     | Get list of users in a room          |
### Chat APIs
**Base URL: `/api/chat`**
| Method | Endpoint         | Description                           |
|--------|----------------|---------------------------------------|
| POST   | /send          | Send a message in a room             |
| GET    | /:roomId       | Fetch chat history for a room        |

## Middleware
- **`authMiddleware.js`** - Protects private routes by validating JWT tokens.

## WebSocket Events
| Event Name       | Description                                  |
|----------------|------------------------------------------|
| `join-room`    | User joins a chat room                   |
| `send-message` | User sends a message                     |
| `receive-message` | Broadcasts received message to room   |
| `leave-room`   | User leaves a chat room                  |
| `user-joined`  | Notifies room when a user joins         |
| `user-left`    | Notifies room when a user leaves        |
| `code-change`  | Broadcasts real-time code changes       |
| `cursor-move`  | Tracks cursor position in live coding   |

## Main Features
✔️ **Real-time messaging** with Socket.io  
✔️ **Live code collaboration** within rooms  
✔️ **Private & public rooms** with access control  
✔️ **Persistent chat history** stored in MongoDB  
✔️ **User authentication** with JWT  
