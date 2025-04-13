// MCP Client utility module
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import {
  testParameterInjection,
  testContextLeakage,
  testToolPoisoning,
  testCrossToolManipulation,
  testAuthenticationBypass,
  calculateSecurityScore,
} from "./tests";
import { AssessmentResult, Finding } from "@/schemas";
// MCP client configuration
const CLIENT_CONFIG = {
  name: "mcp-security-scanner",
  version: "1.0.0",
  capabilities: {},
};

/**
 * Creates and returns a configured MCP client
 */
export function createMCPClient() {
  console.log("Creating MCP client...");
  const client = new Client(
    {
      name: CLIENT_CONFIG.name,
      version: CLIENT_CONFIG.version,
    },
    {
      capabilities: CLIENT_CONFIG.capabilities,
    }
  );
  console.log("MCP client created successfully");
  return client;
}

/**
 * Creates a transport for the MCP client
 */
export function createMCPTransport(serverUrl: string, apiKey?: string) {
  console.log("Creating SSE transport...");
  const transportUrl = new URL(serverUrl);
  console.log(`Transport URL: ${transportUrl.toString()}`);

  const transportConfig = {
    requestInit: apiKey
      ? {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      : undefined,
  };
  console.log(
    "Transport configuration:",
    JSON.stringify(transportConfig, (key, value) =>
      key === "Authorization" ? "Bearer [REDACTED]" : value
    )
  );

  const transport = new SSEClientTransport(transportUrl, transportConfig);
  console.log("SSE transport created successfully");
  return transport;
}

/**
 * Creates and connects an MCP client
 * Returns the connected client which should be closed when done
 */
export async function connectMCPClient(serverUrl: string, apiKey?: string) {
  const client = createMCPClient();
  const transport = createMCPTransport(serverUrl, apiKey);

  console.log(`Attempting to connect to MCP server at ${serverUrl}...`);
  try {
    await client.connect(transport);
    console.log("MCP connection established successfully");
    return client;
  } catch (error) {
    console.error("Connection attempt failed:", error);
    throw error;
  }
}

/**
 * Security scanner class to manage security assessment process using MCP
 */
export class SecurityScanner {
  private client: Client | null = null;

  /**
   * Initialize the security scanner
   */
  constructor() {
    // Future initialization code
  }

  /**
   * Connect to an MCP server
   */
  async connect(serverUrl: string, apiKey?: string) {
    this.client = await connectMCPClient(serverUrl, apiKey);
    return this.client;
  }

  /**
   * Close the connection to the MCP server
   */
  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  /**
   * Basic security check of an MCP server using /inspector/check endpoint
   */
  async check(serverUrl: string, apiKey?: string) {
    console.log("Running security check via /inspector/check endpoint");

    const checkUrl = new URL("/inspector/check", serverUrl);
    const response = await fetch(checkUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        url: serverUrl,
        ...(apiKey ? { bearer: apiKey } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`Check failed with status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Detailed security inspection of an MCP server using /inspector endpoint
   */
  async inspect(
    serverUrl: string,
    analysisType: "tool_injection" | "prompt_injection",
    apiKey?: string
  ) {
    console.log(
      `Running security inspection via /inspector endpoint for ${analysisType}`
    );

    const inspectUrl = new URL("/inspector", serverUrl);
    const response = await fetch(inspectUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        url: serverUrl,
        analysisType,
        ...(apiKey ? { bearer: apiKey } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`Inspection failed with status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Discover available tools on the MCP server
   */
  async discoverTools() {
    if (!this.client) {
      throw new Error("Not connected to an MCP server");
    }

    // TODO: Implement actual tool discovery using MCP client
    // For now, return mock tools for testing
    return [
      {
        id: "user-auth",
        name: "User Authentication",
        description: "Handles user authentication flows",
      },
      {
        id: "data-retrieval",
        name: "Data Retrieval",
        description: "Fetches data from external sources",
      },
      {
        id: "content-gen",
        name: "Content Generation",
        description: "Generates text content for various purposes",
      },
      {
        id: "image-proc",
        name: "Image Processing",
        description: "Processes and transforms images",
      },
      {
        id: "search",
        name: "Search Function",
        description: "Searches for relevant information",
      },
      {
        id: "email",
        name: "Email Sender",
        description: "Sends emails to users",
      },
      {
        id: "payment",
        name: "Payment Processing",
        description: "Handles payment transactions",
      },
      {
        id: "data-analysis",
        name: "Data Analysis",
        description: "Analyzes data for insights",
      },
    ];
  }

  /**
   * Run a security assessment on the connected MCP server
   */
  async runAssessment(): Promise<AssessmentResult> {
    if (!this.client) {
      throw new Error("Not connected to an MCP server");
    }

    try {
      // Step 1: Discover available tools
      const tools = await this.discoverTools();
      console.log(`Discovered ${tools.length} tools`);

      // Step 2: Initialize findings array
      const findings: Finding[] = [];

      // Step 3: Run authentication tests
      console.log("Testing authentication...");
      const authFindings = await testAuthenticationBypass(this.client);
      findings.push(...authFindings);

      // Step 4: Test each tool for vulnerabilities
      for (const tool of tools) {
        console.log(`Testing tool: ${tool.name}...`);

        // Run parameter injection tests
        const injectionFindings = await testParameterInjection(
          this.client,
          tool
        );
        findings.push(...injectionFindings);

        // Run context leakage tests
        const leakageFindings = await testContextLeakage(this.client, tool);
        findings.push(...leakageFindings);

        // Run tool poisoning tests
        const poisoningFindings = await testToolPoisoning(this.client, tool);
        findings.push(...poisoningFindings);
      }

      // Step 5: Run cross-tool tests
      console.log("Testing cross-tool interactions...");
      const crossToolFindings = await testCrossToolManipulation(
        this.client,
        tools
      );
      findings.push(...crossToolFindings);

      // Step 6: Calculate security score
      const securityScore = calculateSecurityScore(findings);

      // Step 7: Return assessment results
      return {
        success: true,
        message: "Assessment completed successfully",
        securityScore,
        findings,
      };
    } catch (error) {
      console.error("Assessment failed:", error);
      return {
        success: false,
        message: "Assessment failed",
        error: error instanceof Error ? error.message : String(error),
        securityScore: 0,
        findings: [],
      };
    }
  }
}
