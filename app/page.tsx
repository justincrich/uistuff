"use client";

import { useReducer, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileWarning,
  Loader2,
  Play,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import VulnerabilityOverviewChart from "@/components/vulnerability-overview-chart";
import { LogoIcon } from "@/components/icons/logo";
import { testMCPConnection, runAgentAssessment } from "./actions";
import { Finding } from "@/schemas";
import { toast } from "sonner";

// Define action types as enum with consolidated categories
enum ActionType {
  // Connection related actions
  CONNECTION = "connection",

  // Scan related actions
  SCAN = "scan",

  // Finding related actions
  FINDING = "finding",

  // Reset action
  RESET = "reset",

  // URL changed action
  URL_CHANGED = "url_changed",
}

// Define the state interface
interface ScannerState {
  // Connection states
  connectionStatus: "idle" | "connecting" | "connected" | "failed";

  // Run states
  runAttempted: boolean;

  // URL tracking
  lastServerUrl: string;

  // Scan states
  scanStatus: "idle" | "scanning" | "completed";
  findings: Finding[];
  securityScore: number;

  // Selected model
  selectedModel: string;
}

// Define the initial state
const initialState: ScannerState = {
  connectionStatus: "idle",
  runAttempted: false,
  lastServerUrl: "",
  scanStatus: "idle",
  findings: [],
  securityScore: 0,
  selectedModel: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
};

// Define consolidated action types with consistent payload pattern
type ScannerAction =
  | {
      type: ActionType.CONNECTION;
      status: "start" | "success" | "failed";
    }
  | {
      type: ActionType.SCAN;
      status: "start" | "update" | "complete" | "idle";
      payload?: {
        findings?: Finding[];
        securityScore?: number;
      };
    }
  | {
      type: ActionType.RESET;
    }
  | {
      type: ActionType.URL_CHANGED;
      url: string;
    }
  | {
      type: ActionType.FINDING;
      model: string;
    };

// Define the reducer function with consolidated actions
function scannerReducer(
  state: ScannerState,
  action: ScannerAction
): ScannerState {
  switch (action.type) {
    case ActionType.CONNECTION:
      switch (action.status) {
        case "start":
          return {
            ...state,
            connectionStatus: "connecting",
          };
        case "success":
          return {
            ...state,
            connectionStatus: "connected",
            runAttempted: false,
          };
        case "failed":
          return {
            ...state,
            connectionStatus: "failed",
            runAttempted: true,
          };
        default:
          return state;
      }

    case ActionType.SCAN:
      switch (action.status) {
        case "start":
          return {
            ...state,
            scanStatus: "scanning",
            findings: [],
          };
        case "update":
          return {
            ...state,
            findings:
              action.payload?.findings !== undefined
                ? action.payload.findings
                : state.findings,
          };
        case "complete":
          return {
            ...state,
            scanStatus: "completed",
            findings:
              action.payload?.findings !== undefined
                ? action.payload.findings
                : state.findings,
            securityScore:
              action.payload?.securityScore !== undefined
                ? action.payload.securityScore
                : state.securityScore,
          };
        default:
          return state;
      }

    case ActionType.URL_CHANGED:
      // If URL changed, reset connection status
      if (action.url !== state.lastServerUrl) {
        return {
          ...initialState,
          lastServerUrl: action.url,
        };
      }
      return state;

    case ActionType.FINDING:
      return {
        ...state,
        selectedModel: action.model,
      };

    case ActionType.RESET:
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

export default function SecurityScannerPage() {
  const [state, dispatch] = useReducer(scannerReducer, initialState);
  const [progress, setProgress] = useState(0);

  // Destructure state for easier access
  const {
    connectionStatus,
    scanStatus,
    findings,
    securityScore,
    runAttempted,
    lastServerUrl,
    selectedModel,
  } = state;

  // Derived state
  const isConnecting = connectionStatus === "connecting";
  const isConnected = connectionStatus === "connected";
  const connectionFailed = connectionStatus === "failed";
  const isScanning = scanStatus === "scanning";
  const scanComplete = scanStatus === "completed";

  // Artificial progress while scanning
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    let startTime: number | undefined;

    if (isScanning) {
      setProgress(0); // Start at 0%
      startTime = Date.now();

      interval = setInterval(() => {
        const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;

        setProgress((prevProgress) => {
          // If we've been scanning for more than 3 seconds, cap at 75%
          if (elapsedSeconds > 3 && prevProgress >= 75) {
            return 75; // Cap at 75% until actually complete
          }

          // Otherwise increment by 25% each second, capped at 75%
          const nextProgress = prevProgress + 25;
          return Math.min(nextProgress, 75);
        });
      }, 1000);
    }

    // Clear interval when scan completes
    if (scanComplete && interval) {
      clearInterval(interval);
    }

    // Set progress to 100% when scan is complete
    if (scanComplete) {
      setProgress(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, scanComplete]);

  // Handle server URL changes
  const handleServerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    dispatch({ type: ActionType.URL_CHANGED, url });
  };

  // Handle model change
  const handleModelChange = (value: string) => {
    dispatch({ type: ActionType.FINDING, model: value });
  };

  // Test connection to server
  const handleTestConnection = async () => {
    // Get the server URL and API key from the form
    const serverUrlElement = document.getElementById(
      "server-url"
    ) as HTMLInputElement;
    const apiKeyElement = document.getElementById(
      "api-key-input"
    ) as HTMLInputElement;

    const serverUrl = serverUrlElement?.value;
    const apiKey = apiKeyElement?.value;

    if (!serverUrl) {
      toast.error("Server URL is required");
      return;
    }

    dispatch({ type: ActionType.CONNECTION, status: "start" });

    try {
      // Test the connection using our server action
      const result = await testMCPConnection(
        serverUrl,
        selectedModel,
        apiKey || ""
      );

      if (result.success) {
        toast.success("Connection successful!");
        dispatch({ type: ActionType.CONNECTION, status: "success" });
      } else {
        toast.error(result.error || "Connection failed");
        dispatch({ type: ActionType.CONNECTION, status: "failed" });
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      toast.error(
        "Connection test failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      dispatch({ type: ActionType.CONNECTION, status: "failed" });
    }
  };

  // Reset the assessment
  const resetAssessment = () => {
    dispatch({ type: ActionType.RESET });
    toast.info("Assessment reset");
  };

  // Start the assessment process
  const startAssessment = async () => {
    // Get the server URL and API key from the form
    const serverUrlElement = document.getElementById(
      "server-url"
    ) as HTMLInputElement;
    const apiKeyElement = document.getElementById(
      "api-key-input"
    ) as HTMLInputElement;

    const serverUrl = serverUrlElement?.value;
    const apiKey = apiKeyElement?.value;

    if (!serverUrl) {
      toast.error("Server URL is required");
      return;
    }

    // If this is a cold run (not already connected), handle the connection status
    if (!isConnected) {
      dispatch({ type: ActionType.CONNECTION, status: "start" });
    }

    dispatch({ type: ActionType.SCAN, status: "start" });
    toast.success("Assessment started");

    try {
      // Run the security assessment using our agent-based approach
      const result = await runAgentAssessment(
        serverUrl,
        selectedModel,
        apiKey || ""
      );

      if (result.success) {
        // Update findings and complete the scan
        dispatch({
          type: ActionType.SCAN,
          status: "complete",
          payload: {
            findings: result.findings,
            securityScore: result.securityScore,
          },
        });

        // Mark connection as successful too if this was a cold run
        if (!isConnected) {
          dispatch({ type: ActionType.CONNECTION, status: "success" });
        }

        toast.success("Assessment completed", {
          description: `Security score: ${result.securityScore}/100`,
        });
      } else {
        toast.error(result.error || "Assessment failed");

        // Mark connection as failed too if this was a cold run
        dispatch({ type: ActionType.CONNECTION, status: "failed" });
        dispatch({ type: ActionType.SCAN, status: "idle" });
      }
    } catch (error) {
      console.error("Assessment failed:", error);
      toast.error(
        "Assessment failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );

      // Mark connection as failed too if this was a cold run
      dispatch({ type: ActionType.CONNECTION, status: "failed" });
      dispatch({ type: ActionType.SCAN, status: "idle" });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">MCP Security Scanner</h1>
        </div>
        {(isScanning || scanComplete) && (
          <Button variant="outline" onClick={resetAssessment}>
            New Assessment
          </Button>
        )}
      </div>

      {/* Credentials Section - Always visible */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>MCP Server Details</CardTitle>
            <CardDescription>
              Enter the connection details for your MCP server to begin the
              assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="server-url">Server URL</Label>
              <Input
                id="server-url"
                placeholder="https://api.example.com/mcp"
                disabled={isScanning || scanComplete}
                onChange={handleServerUrlChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key-input">API Key</Label>
              <Input
                id="api-key-input"
                type="password"
                placeholder="Enter your API key"
                disabled={isScanning || scanComplete}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-select">LLM Model</Label>
              <Select
                value={selectedModel}
                onValueChange={handleModelChange}
                disabled={isScanning || scanComplete}
              >
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="@cf/meta/llama-3.1-8b-instruct-fast">
                      Llama 3.1 8B Instruct Fast
                    </SelectItem>
                    <SelectItem value="@cf/meta/llama-3.1-70b-instruct">
                      Llama 3.1 70B Instruct
                    </SelectItem>
                    <SelectItem value="@cf/meta/llama-3.3-70b-instruct-fp8-fast">
                      Llama 3.3 70B Instruct FP8 Fast
                    </SelectItem>
                    <SelectItem value="@cf/meta/llama-3-8b-instruct">
                      Llama 3 8B Instruct
                    </SelectItem>
                    <SelectItem value="@cf/meta/llama-3.1-8b-instruct">
                      Llama 3.1 8B Instruct
                    </SelectItem>
                    <SelectItem value="@cf/meta/llama-3.2-11b-vision-instruct">
                      Llama 3.2 11B Vision Instruct
                    </SelectItem>
                    <SelectItem value="@hf/nousresearch/hermes-2-pro-mistral-7b">
                      Hermes 2 Pro Mistral 7B
                    </SelectItem>
                    <SelectItem value="@hf/thebloke/deepseek-coder-6.7b-instruct-awq">
                      DeepSeek Coder 6.7B Instruct AWQ
                    </SelectItem>
                    <SelectItem value="@cf/deepseek-ai/deepseek-r1-distill-qwen-32b">
                      DeepSeek R1 Distill Qwen 32B
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                placeholder="Provide any additional context about your MCP server that might be relevant for the assessment..."
                className="min-h-[100px]"
                disabled={isScanning || scanComplete}
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isConnecting || isScanning || scanComplete}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-success" />
                    Connection Successful
                  </>
                ) : connectionFailed ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4 text-error" />
                    Connection Failed
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              <Button
                onClick={startAssessment}
                disabled={
                  isScanning ||
                  scanComplete ||
                  (connectionFailed && !lastServerUrl) ||
                  (runAttempted && connectionFailed)
                }
              >
                <Play className="mr-2 h-4 w-4" />
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Scanning Progress Section - Only visible during scanning or when complete */}
      {(isScanning || scanComplete) && (
        <section className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>
                  Scan Status: {scanComplete ? "Complete" : "In Progress"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress: {Math.round(progress)}%</span>
                  <span>
                    {scanComplete ? "All" : "Analyzing"} security endpoints and
                    tools
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Results Section - Visible when scan is complete */}
      {scanComplete && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">Security Report</h2>
            <Badge>Completed</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Security Score
                </CardTitle>
                {securityScore >= 70 ? (
                  <ShieldCheck className="h-4 w-4 text-success" />
                ) : securityScore >= 40 ? (
                  <Shield className="h-4 w-4 text-warning" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-error" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityScore}/100</div>
                <p className="text-xs text-muted-foreground">
                  {securityScore >= 70
                    ? "Good security posture"
                    : "Needs improvement"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vulnerabilities Found
                </CardTitle>
                <FileWarning className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{findings.length}</div>
                <p className="text-xs text-muted-foreground">
                  {
                    findings.filter(
                      (f) => f.severity.toLowerCase() === "critical"
                    ).length
                  }{" "}
                  critical,{" "}
                  {
                    findings.filter((f) => f.severity.toLowerCase() === "high")
                      .length
                  }{" "}
                  high,{" "}
                  {
                    findings.filter(
                      (f) => f.severity.toLowerCase() === "medium"
                    ).length
                  }{" "}
                  medium,{" "}
                  {
                    findings.filter((f) => f.severity.toLowerCase() === "low")
                      .length
                  }{" "}
                  low
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tools Assessed
                </CardTitle>
                <ShieldCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {(() => {
                  // Get unique tool names from findings - these are the vulnerable ones
                  const vulnerableToolNames = [
                    ...new Set(findings.map((f) => f.toolName)),
                  ];
                  const vulnerableCount = vulnerableToolNames.length;

                  // Get the total tool count from the combined result - this should be passed in the assessment result
                  // For now we're using the metadata stored in the first finding's id
                  // Extract the total tool count from findings metadata if possible
                  let totalTools = 0;

                  if (findings.length > 0) {
                    // Try to get tool count from custom metadata - format is now 'ti-X-Y-Z'
                    // where Z is the total number of tools
                    const findingId = findings[0].id;
                    const match = findingId.match(/^(?:ti|pi)-\d+-\d+-(\d+)/);
                    if (match && match[1]) {
                      totalTools = Number(match[1]);
                    }

                    // Ensure we have at least as many tools as we have unique vulnerable tools
                    totalTools = Math.max(totalTools, vulnerableCount);
                  }

                  // If we couldn't determine the total, use the vulnerable count
                  if (totalTools === 0) {
                    totalTools = vulnerableCount;
                  }

                  const secureCount = totalTools - vulnerableCount;

                  return (
                    <>
                      <div className="text-2xl font-bold">{totalTools}</div>
                      <p className="text-xs text-muted-foreground">
                        {totalTools === 0
                          ? "0 secure, 0 vulnerable"
                          : `${secureCount} secure, ${vulnerableCount} vulnerable`}
                      </p>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* <Card>
              <CardHeader>
                <CardTitle>Vulnerability Overview</CardTitle>
                <CardDescription>
                  Distribution of vulnerabilities by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <VulnerabilityOverviewChart />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Top Vulnerability Types
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Tool Poisoning",
                          percentage: 32,
                          color: "bg-error",
                        },
                        {
                          name: "Parameter Injection",
                          percentage: 28,
                          color: "bg-warning",
                        },
                        {
                          name: "Context Leakage",
                          percentage: 21,
                          color: "bg-info",
                        },
                        {
                          name: "Cross-Tool Manipulation",
                          percentage: 12,
                          color: "bg-primary",
                        },
                        {
                          name: "Authentication Bypass",
                          percentage: 7,
                          color: "bg-secondary-4",
                        },
                      ].map((item) => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {item.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.percentage}%
                            </div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-7 dark:bg-gray-2">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Details</CardTitle>
                <CardDescription>
                  Comprehensive list of all detected vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {findings.map((finding) => (
                    <div
                      key={finding.id}
                      className={`p-4 border rounded-md ${
                        finding.severity === "Critical"
                          ? "border-error bg-error/10"
                          : finding.severity === "High"
                          ? "border-warning bg-warning/10"
                          : "border-info bg-info/10"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {finding.severity === "Critical" ? (
                              <AlertCircle className="h-4 w-4 text-error" />
                            ) : finding.severity === "High" ? (
                              <AlertCircle className="h-4 w-4 text-warning" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-info" />
                            )}
                            <h3 className="font-medium">{finding.type}</h3>
                          </div>
                          <p className="mt-1 text-sm">{finding.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={
                              finding.severity === "Critical"
                                ? "border-error text-error"
                                : finding.severity === "High"
                                ? "border-warning text-warning"
                                : "border-info text-info"
                            }
                          >
                            {finding.severity}
                          </Badge>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {finding.toolName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remediation Recommendations</CardTitle>
                <CardDescription>
                  Actionable steps to address identified vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {findings.map((finding, index) => (
                    <Card key={finding.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-7 dark:bg-gray-2">
                          {finding.severity === "Critical" ? (
                            <ShieldAlert className="h-4 w-4 text-error" />
                          ) : finding.severity === "High" ? (
                            <FileWarning className="h-4 w-4 text-warning" />
                          ) : (
                            <Clock className="h-4 w-4 text-info" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {index + 1}. Fix {finding.type} in{" "}
                                  {finding.toolName}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={
                                    finding.severity === "Critical"
                                      ? "border-error text-error"
                                      : finding.severity === "High"
                                      ? "border-warning text-warning"
                                      : "border-info text-info"
                                  }
                                >
                                  {finding.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {finding.type === "Tool Poisoning"
                                  ? "Implement input sanitization and context isolation to prevent prompt injection attacks."
                                  : finding.type === "Parameter Injection"
                                  ? "Add strict parameter validation and type checking to prevent parameter manipulation attacks."
                                  : "Add proper error handling to prevent sensitive information leakage in error responses."}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {finding.toolName}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">
                                Difficulty:
                              </span>
                              <span>
                                {finding.severity === "Critical"
                                  ? "Hard"
                                  : finding.severity === "High"
                                  ? "Medium"
                                  : "Easy"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">
                                Estimate:
                              </span>
                              <span>
                                {finding.severity === "Critical"
                                  ? "3-5 days"
                                  : finding.severity === "High"
                                  ? "1-2 days"
                                  : "2-4 hours"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              <span>Not Started</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}

// {/* Scanning Section - Visible when scanning or complete */}
// {(isScanning || scanComplete) && (
//   <section className="mb-12">
//     <h2 className="text-2xl font-bold mb-4">Assessment Progress</h2>
//     <Card>
//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <CardTitle>
//             Scan Status: {scanComplete ? "Complete" : "In Progress"}
//           </CardTitle>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-2">
//           <div className="flex justify-between text-sm">
//             <span>Progress: {scanComplete ? "100" : "0"}%</span>
//             <span>{scanComplete ? "8" : "0"} of 8 tools completed</span>
//           </div>
//           <Progress value={scanComplete ? 100 : 5} className="h-2" />
//         </div>

//         <div className="mt-6 grid grid-cols-4 gap-4">
//           {[
//             "User Authentication",
//             "Data Retrieval",
//             "Content Generation",
//             "Image Processing",
//             "Search Function",
//             "Email Sender",
//             "Payment Processing",
//             "Data Analysis",
//           ].map((tool) => (
//             <Card
//               key={tool}
//               className={`border ${
//                 scanComplete ? "border-success bg-success/10" : ""
//               }`}
//             >
//               <CardContent className="p-4 flex items-center justify-between">
//                 <span className="text-sm font-medium">{tool}</span>
//                 {scanComplete ? (
//                   <CheckCircle className="h-5 w-5 text-success" />
//                 ) : isScanning ? (
//                   <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
//                 ) : (
//                   <div className="h-5 w-5 rounded-full border border-gray-6 dark:border-gray-3" />
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </CardContent>
//     </Card>

//     <div className="mt-6">
//       <h3 className="text-xl font-bold mb-4">Live Findings</h3>
//       <Card>
//         <CardHeader>
//           <CardTitle>Detected Vulnerabilities</CardTitle>
//           <CardDescription>
//             Issues detected during the assessment
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {findings.length > 0 ? (
//             <div className="space-y-4">
//               {findings.map((finding) => (
//                 <div
//                   key={finding.id}
//                   className={`p-4 border rounded-md ${
//                     finding.severity === "Critical"
//                       ? "border-error bg-error/10"
//                       : finding.severity === "High"
//                       ? "border-warning bg-warning/10"
//                       : "border-info bg-info/10"
//                   }`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <div className="flex items-center gap-2">
//                         {finding.severity === "Critical" ? (
//                           <AlertCircle className="h-4 w-4 text-error" />
//                         ) : finding.severity === "High" ? (
//                           <AlertCircle className="h-4 w-4 text-warning" />
//                         ) : (
//                           <AlertCircle className="h-4 w-4 text-info" />
//                         )}
//                         <h3 className="font-medium">{finding.type}</h3>
//                       </div>
//                       <p className="mt-1 text-sm">
//                         {finding.description}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <Badge
//                         variant="outline"
//                         className={
//                           finding.severity === "Critical"
//                             ? "border-error text-error"
//                             : finding.severity === "High"
//                             ? "border-warning text-warning"
//                             : "border-info text-info"
//                         }
//                       >
//                         {finding.severity}
//                       </Badge>
//                       <div className="mt-1 text-xs text-muted-foreground">
//                         {finding.toolName}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-8 text-center">
//               <div className="rounded-full bg-gray-7 p-3 dark:bg-gray-2">
//                 <Clock className="h-6 w-6 text-gray-4" />
//               </div>
//               <h3 className="mt-4 text-lg font-medium">
//                 No findings yet
//               </h3>
//               <p className="mt-2 text-sm text-muted-foreground max-w-sm">
//                 Vulnerabilities will appear here as they are discovered
//                 during the assessment process.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   </section>
// )}
