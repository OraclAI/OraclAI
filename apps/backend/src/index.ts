import "dotenv/config";
import OpenAI from "openai";
import express, { Application, Request, Response, NextFunction, Router, RequestHandler } from "express";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createAssistant } from "./core/createAssistant.js";
import { createThread } from "./core/createThread.js";
import { startTerminalChat } from "./terminal/terminalChat.js";
import { setupChatRoutes } from "./api/chatRoutes.js";
import { setupToolRoutes } from "./api/toolsRoutes.js";

class ServerApplication {
  private readonly app: Application;
  private readonly openAIClient: OpenAI;
  private readonly serverPort: number;
  private readonly dbUri: string;

  constructor() {
    this.app = express();
    this.openAIClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.serverPort = parseInt(process.env.PORT || "5000", 10);
    this.dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/solana-ai-chat";
    this.initializeMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(helmet() as unknown as RequestHandler);
    
    const allowedOrigins = process.env.NODE_ENV === "production" 
      ? process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []
      : ["http://localhost:3000", "http://localhost:5000"];

    const corsOptions: CorsOptions = {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    };

    this.app.use(cors(corsOptions));

    const requestLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Request limit exceeded for this IP address. Please try again later.",
    });
    this.app.use(requestLimiter as unknown as RequestHandler);

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  private async setupRoutes(): Promise<void> {
    const assistant = await createAssistant(this.openAIClient);
    
    const chatRouter = Router();
    const toolsRouter = Router();
    
    setupChatRoutes(chatRouter, this.openAIClient, assistant);
    const toolRoutes = setupToolRoutes();
    
    this.app.use("/api/chat", chatRouter);
    this.app.use("/api/tools", toolRoutes);
  }

  private setupErrorHandling(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("Server error:", err);
      res.status(500).json({
        status: "error",
        message: "Internal server error occurred",
        details: process.env.NODE_ENV === "development" ? err.message : undefined
      });
    });

    // Add 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: "error",
        message: "Resource not found",
        path: req.path,
        method: req.method,
      });
    });
  }

  public async initialize(): Promise<void> {
    try {
      await mongoose.connect(this.dbUri);
      console.info("📦 Database connection established");
      
      this.app.listen(this.serverPort, () => {
        console.info(`🚀 Server running on port ${this.serverPort}`);
        console.info(`📝 API Documentation: http://localhost:${this.serverPort}/api-docs`);
        console.info(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
      });

      // Handle CLI mode
      if (process.env.CLI_MODE === "true") {
        const thread = await createThread(this.openAIClient);
        const assistant = await createAssistant(this.openAIClient);
        console.info('Terminal chat started! Type "exit" to end the conversation.');
        await startTerminalChat(thread, assistant, this.openAIClient);
      }
    } catch (error) {
      console.error("Failed to initialize server:", error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.info("Database connection closed");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  }
}

const serverInstance = new ServerApplication();

// Handle graceful shutdown
process.on("SIGINT", () => {
  serverInstance.shutdown().catch(console.error);
});

serverInstance.initialize().catch(console.error);
