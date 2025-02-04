import { ToolConfig } from "../types/index.js";
import { getBalanceTool } from "./getBalance.js";
import { getWalletAddressTool } from "./getWalletAddress.js";
import { requestFaucetFundsTool } from "./requestFaucetFunds.js";
import { transferTool } from "./sendTransfer.js";
import { createNftCollectionTool } from "./createNftCollection.js";
import { deployTokenTool } from "./deployToken.js";
import { mintNftTool } from "./mintNft.js";
import { stakeSolTool } from "./stakeSol.js";
import { tradeTool } from "./trade.js";
import { createImageTool } from "./createImage.js";
import { getTPSTool } from "./getTPS.js";
import { launchPumpFunTokenTool } from "./launchPumpFunToken.js";
import { lendTool } from "./lend.js";
import { pythFetchPriceTool } from "./pythFetchPrice.js";
import { getTokenDataTool } from "./getTokenData.js";
import { raydiumCreateAmmV4Tool } from "./raydiumCreateAmmV4.js";
import { raydiumCreateClmmTool } from "./raydiumCreateClmm.js";
import { raydiumCreateCpmmTool } from "./raydiumCreateCpmm.js";
import { registerDomainTool } from "./registerDomain.js";
import { stakeWithJupTool } from "./stakeWithJup.js";
import { createOrcaWhirlpoolTool } from "./createOrcaWhirlpool.js";
import { telegramNotifyTool } from "./telegramNotify.js";

const toolList: ToolConfig[] = [
  getBalanceTool,
  getWalletAddressTool,
  requestFaucetFundsTool,
  transferTool,
  createNftCollectionTool,
  deployTokenTool,
  mintNftTool,
  stakeSolTool,
  tradeTool,
  createImageTool,
  getTPSTool,
  launchPumpFunTokenTool,
  lendTool,
  pythFetchPriceTool,
  getTokenDataTool,
  raydiumCreateAmmV4Tool,
  raydiumCreateClmmTool,
  raydiumCreateCpmmTool,
  registerDomainTool,
  stakeWithJupTool,
  createOrcaWhirlpoolTool,
  telegramNotifyTool,
];

export const tools: Record<string, ToolConfig> = {};

toolList.forEach(tool => {
  tools[tool.definition.function.name] = tool;
});
