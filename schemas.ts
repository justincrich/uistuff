import { z } from "zod";

// Zod schema for Finding
export const FindingSchema = z.object({
  id: z.string(),
  toolName: z.string(),
  severity: z.enum(["Critical", "High", "Medium", "Low"]),
  type: z.string(),
  description: z.string(),
});

// TypeScript type derived from the schema
export type Finding = z.infer<typeof FindingSchema>;

// Zod schema for AssessmentResult
export const AssessmentResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  securityScore: z.number(),
  findings: z.array(FindingSchema),
});

// TypeScript type derived from the schema
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;

// Schema for inspector check request
export const InspectorCheckRequestSchema = z.object({
  url: z.string().url(),
  bearer: z.string().optional(),
  analysisType: z.enum(["tool_injection", "prompt_injection"]),
});

export type InspectorCheckRequest = z.infer<typeof InspectorCheckRequestSchema>;

export const InspectorCheckResponseSchema = z.object({
  status: z.enum(["connected", "error"]),
});

// Schema for inspector analysis request
export const InspectorAnalysisRequestSchema = z.object({
  url: z.string().url(),
  bearer: z.string().optional(),
  analysisType: z.enum(["tool_injection", "prompt_injection"]),
});

export type InspectorAnalysisRequest = z.infer<
  typeof InspectorAnalysisRequestSchema
>;

export type InspectorCheckResponse = z.infer<
  typeof InspectorCheckResponseSchema
>;

// Schema for tools response
export const ToolsResponseSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string().optional(),
    type: z.string().optional(),
  })
);

export type ToolsResponse = z.infer<typeof ToolsResponseSchema>;

// Schema for tools with vulnerability analysis
export const VulnerabilityToolResponseSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string(),
    inputSchema: z.object({
      type: z.string(),
      properties: z.record(
        z.object({
          type: z.string(),
        })
      ),
      required: z.array(z.string()),
      additionalProperties: z.boolean(),
      $schema: z.string(),
    }),
    vulnerability_analysis: z.string().transform((str) => {
      try {
        // Extract JSON from markdown
        const match = str.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (match && match[1]) {
          return JSON.parse(match[1]);
        }
        return null;
      } catch {
        return null;
      }
    }),
  })
);

export type VulnerabilityToolResponse = z.infer<
  typeof VulnerabilityToolResponseSchema
>;

export const VulnerabilityFindingSchema = z.object({
  category: z.string(),
  description: z.string(),
  evidence: z.string(),
  severity: z.string(),
});

export type VulnerabilityFinding = z.infer<typeof VulnerabilityFindingSchema>;

export const VulnerabilityAnalysisSchema = z.object({
  score: z.number(),
  findings: z.array(VulnerabilityFindingSchema),
});

export type VulnerabilityAnalysis = z.infer<typeof VulnerabilityAnalysisSchema>;

export const ToolWithVulnerabilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.object({
    type: z.string(),
    properties: z.record(
      z.object({
        type: z.string(),
      })
    ),
    required: z.array(z.string()),
    additionalProperties: z.boolean(),
    $schema: z.string(),
  }),
  vulnerability_analysis: VulnerabilityAnalysisSchema,
});

export type ToolWithVulnerability = z.infer<typeof ToolWithVulnerabilitySchema>;

export const ToolsWithVulnerabilitySchema = z.array(
  ToolWithVulnerabilitySchema
);

export type ToolsWithVulnerability = z.infer<
  typeof ToolsWithVulnerabilitySchema
>;
