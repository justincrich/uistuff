"use server";

import {
  AssessmentResult,
  Finding,
  InspectorCheckRequest,
  InspectorAnalysisRequest,
  ToolsResponse,
  InspectorCheckResponseSchema,
  VulnerabilityToolResponseSchema,
  ToolsWithVulnerabilitySchema,
  VulnerabilityFinding,
} from "@/schemas";
import { parseDirtyJSONWithLLM } from "@/lib/parseDirtyJSONWithLLM";

// Define the return type for our test connection function
type TestConnectionResult = {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, any>;
};

/**
 * Test connection to an MCP server
 *
 * This function creates an MCP client, attempts to connect to the server,
 * and then immediately disconnects upon successful connection.
 */
export async function testMCPConnection(
  serverUrl: string,
  apiKey?: string
): Promise<TestConnectionResult> {
  console.log("=== MCP Connection Test Started ===");
  console.log(`Server URL: ${serverUrl}`);
  console.log(`API Key provided: ${apiKey ? "Yes" : "No"}`);

  try {
    // Use the /inspect/test endpoint to test the connection
    const requestBody: InspectorCheckRequest = {
      url: serverUrl,
      analysisType: "tool_injection",
      ...(apiKey && { bearer: apiKey }),
    };

    console.log(
      `Sending request to inspector/check endpoint: ${JSON.stringify({
        ...requestBody,
        bearer: apiKey ? "[REDACTED]" : undefined,
      })}`
    );

    const response = await fetch(
      `https://server.rhinobase.workers.dev/inspector/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Raw response data: ${JSON.stringify(data)}`);
    console.log("=== MCP Connection Test Completed Successfully ===");

    const parsedData = InspectorCheckResponseSchema.safeParse(data);

    if (parsedData.error || !parsedData.success) {
      console.error(
        `Invalid response format: ${
          parsedData.error ? parsedData.error.toString() : "Unknown error"
        }`
      );
      throw new Error("Invalid response from MCP server");
    }

    console.log(`Validated response data: ${JSON.stringify(parsedData.data)}`);

    return {
      success: true,
      message: "Successfully connected to MCP server",
      details: parsedData.data,
    };
  } catch (error) {
    // Log the error for debugging
    console.error("=== MCP Connection Test Failed ===");
    console.error("Error details:", error);

    let errorDetails = {};

    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
      errorDetails = {
        name: error.name,
        message: error.message,
      };
    }

    // Check for network-related errors
    if (error && typeof error === "object" && "code" in error) {
      console.error(`Error code: ${error.code}`);
      errorDetails = {
        ...errorDetails,
        code: error.code,
      };
    }

    // Check for event details
    if (error && typeof error === "object" && "event" in error) {
      console.error(`Event details: ${JSON.stringify(error.event)}`);
      errorDetails = {
        ...errorDetails,
        event: error.event,
      };
    }

    // Return formatted error
    return {
      success: false,
      message: "Failed to connect to MCP server",
      error: error instanceof Error ? error.message : String(error),
      details: errorDetails,
    };
  }
}

/**
 * Run a security assessment on an MCP server using the agent-based approach
 *
 * This function uses direct API calls to the inspector endpoints
 */
export async function runAgentAssessment(
  serverUrl: string,
  apiKey?: string
): Promise<AssessmentResult> {
  console.log("=== MCP Agent-based Security Assessment Started ===");
  console.log(`Server URL: ${serverUrl}`);
  console.log(`API Key provided: ${apiKey ? "Yes" : "No"}`);

  try {
    // Set up headers for all requests
    const headers = {
      "Content-Type": "application/json",
    };

    // First run a basic security check
    console.log("Running basic security check...");
    const checkRequestBody: InspectorCheckRequest = {
      url: serverUrl,
      analysisType: "tool_injection",
      ...(apiKey && { bearer: apiKey }),
    };

    console.log(
      `Sending check request: ${JSON.stringify({
        ...checkRequestBody,
        bearer: apiKey ? "[REDACTED]" : undefined,
      })}`
    );

    const checkResponse = await fetch(
      `https://server.rhinobase.workers.dev/inspector/check`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(checkRequestBody),
      }
    );

    console.log(
      `Check response status: ${checkResponse.status} ${checkResponse.statusText}`
    );

    if (!checkResponse.ok) {
      console.error(`Check endpoint error! status: ${checkResponse.status}`);
      throw new Error(`Check endpoint error! status: ${checkResponse.status}`);
    }

    const checkResultRaw = await checkResponse.json();
    console.log(`Raw check result: ${JSON.stringify(checkResultRaw)}`);

    const parsedCheckResult =
      InspectorCheckResponseSchema.safeParse(checkResultRaw);

    if (
      !parsedCheckResult.success ||
      parsedCheckResult.data.status !== "connected"
    ) {
      console.error(
        `Invalid check response format: ${
          parsedCheckResult.error
            ? parsedCheckResult.error.toString()
            : "Unknown error"
        }`
      );
      throw new Error("Invalid response from check endpoint");
    }

    const checkResult = parsedCheckResult.data;
    console.log(`Validated check result: ${JSON.stringify(checkResult)}`);
    console.log("Basic security check completed");

    // Then run detailed inspections for tool injection
    console.log("Running tool injection inspection...");
    const toolInjectionRequestBody: InspectorAnalysisRequest = {
      url: serverUrl,
      ...(apiKey && { bearer: apiKey }),
      analysisType: "tool_injection",
    };

    console.log(
      `Sending tool injection request: ${JSON.stringify({
        ...toolInjectionRequestBody,
        bearer: apiKey ? "[REDACTED]" : undefined,
      })}`
    );

    const toolInjectionResponse = await fetch(
      `https://server.rhinobase.workers.dev/inspector`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(toolInjectionRequestBody),
      }
    );

    console.log(
      `Tool injection response status: ${toolInjectionResponse.status} ${toolInjectionResponse.statusText}`
    );

    if (!toolInjectionResponse.ok) {
      console.error(
        `Tool injection inspection error! status: ${toolInjectionResponse.status}`
      );
      throw new Error(
        `Tool injection inspection error! status: ${toolInjectionResponse.status}`
      );
    }

    const toolInjectionRaw = await toolInjectionResponse.text();
    console.log(`Raw tool injection result: ${toolInjectionRaw}`);
    const cleaned = await parseDirtyJSONWithLLM(toolInjectionRaw);

    console.log(
      `Raw tool injection result: ${JSON.stringify(cleaned, null, 2)}`
    );

    const parsedToolInjection = ToolsWithVulnerabilitySchema.safeParse(cleaned);

    if (parsedToolInjection.error || !parsedToolInjection.success) {
      console.error(
        `Invalid tool injection response format: ${
          parsedToolInjection.error
            ? parsedToolInjection.error.toString()
            : "Unknown error"
        }`
      );
      throw new Error("Invalid response from tool injection endpoint");
    }

    const toolInjectionResult = parsedToolInjection.data;
    console.log(
      `Validated tool injection result: ${JSON.stringify(toolInjectionResult)}`
    );
    console.log("Tool injection inspection completed");

    // Then run detailed inspections for prompt injection
    console.log("Running prompt injection inspection...");
    const promptInjectionRequestBody: InspectorAnalysisRequest = {
      url: serverUrl,
      ...(apiKey && { bearer: apiKey }),
      analysisType: "prompt_injection",
    };

    console.log(
      `Sending prompt injection request: ${JSON.stringify({
        ...promptInjectionRequestBody,
        bearer: apiKey ? "[REDACTED]" : undefined,
      })}`
    );

    const promptInjectionResponse = await fetch(
      `https://server.rhinobase.workers.dev/inspector`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(promptInjectionRequestBody),
      }
    );

    const promptInjectionRaw = await promptInjectionResponse.text();
    console.log(`Raw prompt injection result: ${promptInjectionRaw}`);
    const cleanedPromptInjection = await parseDirtyJSONWithLLM(
      promptInjectionRaw
    );

    console.log(
      `Raw prompt injection result: ${JSON.stringify(
        cleanedPromptInjection,
        null,
        2
      )}`
    );

    console.log(
      `Prompt injection response status: ${promptInjectionResponse.status} ${promptInjectionResponse.statusText}`
    );

    if (!promptInjectionResponse.ok) {
      console.error(
        `Prompt injection inspection error! status: ${promptInjectionResponse.status}`
      );
      throw new Error(
        `Prompt injection inspection error! status: ${promptInjectionResponse.status}`
      );
    }

    const parsedPromptInjection = ToolsWithVulnerabilitySchema.safeParse(
      cleanedPromptInjection
    );

    if (parsedPromptInjection.error || !parsedPromptInjection.success) {
      console.error(
        `Invalid prompt injection response format: ${
          parsedPromptInjection.error
            ? parsedPromptInjection.error.toString()
            : "Unknown error"
        }`
      );
      throw new Error("Invalid response from prompt injection endpoint");
    }

    const promptInjectionResult = parsedPromptInjection.data;
    console.log(
      `Validated prompt injection result: ${JSON.stringify(
        promptInjectionResult
      )}`
    );
    console.log("Prompt injection inspection completed");

    // // Process and combine the results
    console.log("Processing security assessment results...");

    // Process findings from both analyses
    const findings: Finding[] = [];
    let totalVulnerabilities = 0;
    let maxSeverityImpact = 0;

    // Process tool injection vulnerabilities
    toolInjectionResult.forEach((tool, index) => {
      if (tool.vulnerability_analysis) {
        // Check if vulnerability_analysis is an object with findings property
        if (
          typeof tool.vulnerability_analysis === "object" &&
          tool.vulnerability_analysis.findings
        ) {
          // Process structured findings
          tool.vulnerability_analysis.findings.forEach(
            (finding: VulnerabilityFinding, findingIndex: number) => {
              const severityMap: Record<
                string,
                "Critical" | "High" | "Medium" | "Low"
              > = {
                critical: "Critical",
                high: "High",
                medium: "Medium",
                low: "Low",
              };

              const mappedSeverity =
                severityMap[finding.severity.toLowerCase()] || "Medium";
              const severityImpact =
                { Critical: 4, High: 3, Medium: 2, Low: 1 }[mappedSeverity] ||
                2;

              findings.push({
                id: `ti-${index}-${findingIndex}`,
                toolName: tool.name,
                severity: mappedSeverity,
                type: finding.category || "Tool Injection",
                description:
                  finding.description ||
                  finding.evidence ||
                  `Vulnerability in ${tool.name}`,
              });

              totalVulnerabilities++;
              maxSeverityImpact = Math.max(maxSeverityImpact, severityImpact);
            }
          );
        } else {
          // Fallback for string analysis
          try {
            const analysisText = String(tool.vulnerability_analysis);
            if (
              analysisText.includes("vulnerable") ||
              analysisText.includes("weakness")
            ) {
              findings.push({
                id: `ti-${index}`,
                toolName: tool.name,
                severity: "Medium", // Default severity
                type: "Tool Injection",
                description: `Potential tool injection vulnerability in ${
                  tool.name
                }: ${analysisText.substring(0, 100)}...`,
              });
              totalVulnerabilities++;
              maxSeverityImpact = Math.max(maxSeverityImpact, 2); // Medium = 2
            }
          } catch (err) {
            console.error(`Error processing tool injection finding: ${err}`);
          }
        }
      }
    });

    // Process prompt injection vulnerabilities
    promptInjectionResult.forEach((tool, index) => {
      if (tool.vulnerability_analysis && tool.vulnerability_analysis.findings) {
        tool.vulnerability_analysis.findings.forEach(
          (finding, findingIndex) => {
            const severityMap: Record<
              string,
              "Critical" | "High" | "Medium" | "Low"
            > = {
              critical: "Critical",
              high: "High",
              medium: "Medium",
              low: "Low",
            };

            const mappedSeverity =
              severityMap[finding.severity.toLowerCase()] || "Medium";
            const severityImpact =
              { Critical: 4, High: 3, Medium: 2, Low: 1 }[mappedSeverity] || 2;

            findings.push({
              id: `pi-${index}-${findingIndex}`,
              toolName: tool.name,
              severity: mappedSeverity,
              type: finding.category || "Prompt Injection",
              description:
                finding.description ||
                finding.evidence ||
                `Vulnerability in ${tool.name}`,
            });

            totalVulnerabilities++;
            maxSeverityImpact = Math.max(maxSeverityImpact, severityImpact);
          }
        );
      }
    });

    // Calculate security score (higher is better)
    // Base score of 100, reduced by number and severity of vulnerabilities
    const baseScore = 100;
    const vulnerabilityPenalty = totalVulnerabilities * 5; // Each vulnerability reduces score by 5
    const severityPenalty = maxSeverityImpact * 5; // Additional penalty based on max severity

    const securityScore = Math.max(
      0,
      Math.min(100, baseScore - vulnerabilityPenalty - severityPenalty)
    );

    console.log(
      `Processed ${findings.length} findings with security score ${securityScore}`
    );
    console.log("=== MCP Agent-based Security Assessment Completed ===");

    return {
      success: true,
      message: "Assessment completed successfully",
      securityScore,
      findings,
    };
  } catch (error) {
    console.error("=== MCP Agent-based Security Assessment Failed ===");
    console.error("Error details:", error);

    const errorResult = {
      success: false,
      message: "Failed to complete security assessment",
      error: error instanceof Error ? error.message : String(error),
      securityScore: 0,
      findings: [],
    };

    console.error(`Returning error result: ${JSON.stringify(errorResult)}`);

    return errorResult;
  }
}

/**
 * Run a security assessment on an MCP server
 *
 * This function simulates an assessment and returns mock findings immediately
 * Will be replaced by the agent-based implementation in the future
 */
export async function runSecurityAssessment(
  serverUrl: string,
  apiKey?: string
): Promise<AssessmentResult> {
  console.log("=== MCP Security Assessment Started ===");
  console.log(`Server URL: ${serverUrl}`);
  console.log(`API Key provided: ${apiKey ? "Yes" : "No"}`);

  try {
    // In a real implementation, this would connect to the server and perform actual tests
    // For now, we're returning mock data

    // Create mock findings
    const mockFindings: Finding[] = [
      {
        id: "f1",
        toolName: "User Authentication",
        severity: "High",
        type: "Parameter Injection",
        description:
          "Authentication bypass possible through parameter manipulation",
      },
      {
        id: "f2",
        toolName: "Data Retrieval",
        severity: "Medium",
        type: "Context Leakage",
        description: "Sensitive data exposed in error responses",
      },
      {
        id: "f3",
        toolName: "Content Generation",
        severity: "Critical",
        type: "Tool Poisoning",
        description:
          "Prompt injection vulnerability allows arbitrary content generation",
      },
      {
        id: "f4",
        toolName: "Search Function",
        severity: "Low",
        type: "Input Validation",
        description: "Improper input validation could lead to reflected XSS",
      },
      {
        id: "f5",
        toolName: "Payment Processing",
        severity: "Medium",
        type: "Insecure Communication",
        description: "Payment details transmitted over insecure channel",
      },
    ];

    const securityScore = 82;

    console.log("=== MCP Security Assessment Completed Successfully ===");
    console.log(`Findings: ${mockFindings.length}`);
    console.log(`Security Score: ${securityScore}`);

    return {
      success: true,
      message: "Assessment completed successfully",
      securityScore,
      findings: mockFindings,
    };
  } catch (error) {
    console.error("=== MCP Security Assessment Failed ===");
    console.error("Error details:", error);

    return {
      success: false,
      message: "Failed to complete security assessment",
      error: error instanceof Error ? error.message : String(error),
      securityScore: 0,
      findings: [],
    };
  }
}
