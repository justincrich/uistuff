import { z } from "zod";

// Inspector Check Request Schema
export interface InspectorCheckRequest {
  url: string;
  bearer?: string;
  analysisType: string;
  model: string;
}

// Inspector Analysis Request Schema
export interface InspectorAnalysisRequest {
  url: string;
  bearer?: string;
  analysisType: string;
  model: string;
}

// Define the response schema for the inspector check endpoint
export const InspectorCheckResponseSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// Define the schema for a vulnerability finding
export const VulnerabilityFindingSchema = z.object({
  category: z.string().optional(),
  severity: z.string(),
  description: z.string().optional(),
  evidence: z.string().optional(),
});

export type VulnerabilityFinding = z.infer<typeof VulnerabilityFindingSchema>;

// Define the schema for a vulnerability analysis
export const VulnerabilityAnalysisSchema = z.object({
  findings: z.array(VulnerabilityFindingSchema).optional(),
  summary: z.string().optional(),
});

// Define the schema for a tool with vulnerability info
export const VulnerabilityToolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  vulnerability_analysis: VulnerabilityAnalysisSchema.optional(),
});

export const ToolsWithVulnerabilitySchema = z.array(VulnerabilityToolSchema);

export type VulnerabilityToolResponse = z.infer<typeof VulnerabilityToolSchema>;

// Define the schema for tool response
export const ToolResponseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const ToolsResponseSchema = z.array(ToolResponseSchema);

export type ToolsResponse = z.infer<typeof ToolsResponseSchema>;

// Define the finding schema for our application
export interface Finding {
  id: string;
  toolName: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  type: string;
  description: string;
}

// Define the assessment result schema for our application
export interface AssessmentResult {
  success: boolean;
  message: string;
  error?: string;
  securityScore: number;
  findings: Finding[];
}
