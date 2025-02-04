# Oracl Backend

An AI-powered blockchain agent that can interact with the Solana blockchain. Built with OpenAI's Assistant API and solana-agent-kit.

## Features

- AI Assistant powered by OpenAI's Assistant API with advanced technical capabilities
- Interactive CLI chat interface for natural language interactions
- Core Solana blockchain capabilities through [solana-agent-kit](https://www.npmjs.com/package/solana-agent-kit):
  - Balance checking for SOL and SPL tokens
  - Transaction execution and monitoring
  - Tool-based architecture for easy extensibility
- Autonomous decision making with:
  - Proactive transaction execution
  - Smart defaults and assumptions
  - Contextual memory of past transactions
  - Technical error explanations

## Technical Stack

- Node.js & TypeScript
- Express.js for API endpoints
- WebSocket support for real-time updates
- OpenAI API for AI capabilities
- Solana Web3.js for blockchain interactions
- Jest for testing
- ESLint & Prettier for code quality

## Prerequisites

- Node.js (v18 or higher)
- TypeScript
- An OpenAI API key
- A wallet private key for the agent
- Helius API key for RPC access

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/OraclAI/OraclAI.git
cd oracl
```

2. Install dependencies:

```bash
yarn install
```

3. Create the `.env` file and add your configuration:

```bash
OPENAI_API_KEY=your_openai_api_key
PRIVATE_KEY=your_wallet_private_key
HELIUS_API_KEY=your_helius_api_key
PORT=5000
```

4. Run the development server:

```bash
yarn dev
```

## Project Structure

```
src/
├── agent/         # AI agent configuration
├── api/           # API routes and controllers
├── core/          # Core business logic
├── middleware/    # Express middleware
├── models/        # Data models
├── services/      # Business services
├── tools/         # Blockchain interaction tools
├── types/         # TypeScript type definitions
└── utils/         # Helper utilities
```

## API Endpoints

- `POST /api/chat` - Send messages to the AI agent
- `GET /api/tools` - List available blockchain tools
- `POST /api/execute` - Execute blockchain transactions
- `GET /api/status` - Check system status

## Development

```bash
# Run in development mode
yarn dev

# Run tests
yarn test

# Build for production
yarn build

# Run linter
yarn lint

# Type checking
yarn typecheck
```

## Error Handling

The backend implements comprehensive error handling:

- Custom error classes for different scenarios
- Detailed error messages with suggestions
- Automatic retry for transient failures
- Error logging and monitoring

## Testing

Tests are written using Jest:

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage

# Run specific test file
yarn test path/to/test
```

## Deployment

1. Build the application:
```bash
yarn build
```

2. Start in production mode:
```bash
yarn start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

Initial project structure inspired by [jarrodwatts/onchain-agent](https://github.com/jarrodwatts/onchain-agent). Built for the Solana AI Hackathon.

## License

MIT License
