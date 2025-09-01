# AI Chat Rate Limiter

This project implements an AI Chat Rate Limiter using Express.js and the Vercel AI SDK. It features fixed-window rate limiting based on user roles, allowing different request limits for guests, free users, and premium users. The application provides endpoints for chat interactions, user authentication, and status checks on rate limits.

## Features

- **Fixed Window Rate Limiting**: Limits requests based on a 1-hour fixed window.
- **User Role Management**: Different limits for guest (3 requests/hour), free (10 requests/hour), and premium users (50 requests/hour).
- **JWT Authentication**: Users can log in to receive a JWT for authenticated requests.
- **AI Integration**: Utilizes the Vercel AI SDK to handle chat requests and return AI-generated responses.

## Project Structure

```
ai-chat-rate-limiter
├── src
│   ├── server.js          # Main entry point of the application
│   ├── routes
│   │   ├── chat.js        # Handles /api/chat requests
│   │   ├── auth.js        # Handles /api/login requests
│   │   └── status.js      # Handles /api/status requests
│   ├── middleware
│   │   ├── auth.js        # Middleware for JWT authentication
│   │   └── rateLimit.js   # Middleware for rate limiting
│   └── services
│       └── ai.js         # Interacts with the Vercel AI SDK
├── package.json           # Project dependencies and scripts
├── .env.example           # Example environment variables
├── .gitignore             # Files to ignore in Git
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ai-chat-rate-limiter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy the example environment file and set your OpenAI API key:
   ```bash
   cp .env.example .env
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

## API Endpoints

- **POST /api/chat**: Send a chat message and receive a response from the AI. Rate-limited based on user role.
- **POST /api/login**: Authenticate a user and return a JWT for authorized access.
- **GET /api/status**: Check the remaining requests available for the authenticated user.

## Usage Examples

### Guest User (3 requests/hour)

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Say hi"}'
```

### Free User (10 requests/hour)

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","role":"free"}' | jq -r .token)

curl -s -X POST http://localhost:3000/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Give me a fun fact"}'
```

### Check Remaining Requests

```bash
curl -s http://localhost:3000/api/status \
  -H "Authorization: Bearer $TOKEN"
```

## Notes

- This project uses an in-memory store for rate limiting. For production, consider using a persistent store like Redis.
- The fixed window resets at the top of the next hour. For smoother distribution, consider implementing a sliding window or token bucket algorithm.