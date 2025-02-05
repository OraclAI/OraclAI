import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";
import { tools } from "../tools/allTools.js";
import { assistantPrompt } from "../const/prompt.js";

type AssistantModel = "gpt-4-1106-preview" | "gpt-4" | "gpt-3.5-turbo-1106";

interface AssistantOptions {
  model?: AssistantModel;
  name?: string;
  customInstructions?: string;
  maxRetries?: number;
}

const DEFAULT_OPTIONS: Required<AssistantOptions> = {
  model: "gpt-4-1106-preview",
  name: "SolanaAI",
  customInstructions: assistantPrompt,
  maxRetries: 3,
};

type FunctionParameters = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
};

type ToolFunction = {
  name: string;
  description: string;
  parameters: FunctionParameters;
};

type FunctionTool = {
  type: "function";
  function: ToolFunction;
};

interface ToolConfig {
  definition: FunctionTool;
}

/**
 * Creates an OpenAI assistant with Solana blockchain capabilities
 * @param client OpenAI client instance
 * @param options Configuration options for the assistant
 * @returns Promise resolving to the created Assistant
 * @throws Error if assistant creation fails after retries
 */
export async function createAssistant(
  client: OpenAI,
  options: AssistantOptions = {}
): Promise<Assistant> {
  const config: Required<AssistantOptions> = { ...DEFAULT_OPTIONS, ...options };
  
  const assistantConfig = {
    model: config.model,
    name: config.name,
    instructions: config.customInstructions,
    tools: validateAndTransformTools(Object.values(tools)),
  };

  console.log(`🤖 Initializing AI assistant with ${assistantConfig.tools.length} tools`);
  
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const assistant = await client.beta.assistants.create(assistantConfig);
      console.log(`✅ Assistant created successfully (ID: ${assistant.id})`);
      return assistant;
    } catch (error) {
      if (error instanceof Error) {
        lastError = error;
        console.error(
          `❌ Attempt ${attempt}/${config.maxRetries} failed:`,
          error.message
        );
      } else {
        lastError = new Error('Unknown error occurred');
        console.error(
          `❌ Attempt ${attempt}/${config.maxRetries} failed with unknown error`
        );
      }
      
      if (attempt < config.maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Failed to create assistant after ${config.maxRetries} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Validates and transforms tool configurations
 * @param toolConfigs Array of tool configurations
 * @returns Validated and transformed tool definitions
 * @throws Error if tool validation fails
 */
function validateAndTransformTools(toolConfigs: any[]): FunctionTool[] {
  return toolConfigs.map((toolConfig: unknown) => {
    if (!isToolConfig(toolConfig)) {
      throw new Error(`Invalid tool configuration: Missing or invalid definition`);
    }

    const { definition } = toolConfig;
    if (definition.type !== "function" || !definition.function) {
      throw new Error(
        `Invalid tool definition: Must be of type "function" and include function definition`
      );
    }

    if (!isValidFunctionParameters(definition.function.parameters)) {
      throw new Error(`Invalid function parameters for tool`);
    }

    return definition;
  });
}

function isToolConfig(value: unknown): value is ToolConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'definition' in value &&
    typeof (value as ToolConfig).definition === 'object'
  );
}

function isValidFunctionParameters(value: unknown): value is FunctionParameters {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  const params = value as FunctionParameters;
  return (
    params.type === "object" &&
    typeof params.properties === "object" &&
    params.properties !== null &&
    (!params.required || Array.isArray(params.required))
  );
}
