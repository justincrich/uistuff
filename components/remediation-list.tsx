import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Code, FileWarning, ShieldAlert } from "lucide-react"

const remediations = [
  {
    id: "r1",
    title: "Fix Prompt Injection in Content Generation",
    description:
      "Implement input sanitization and context isolation to prevent prompt injection attacks in the Content Generation tool.",
    tool: "Content Generation",
    severity: "Critical",
    difficulty: "Medium",
    timeEstimate: "2-3 days",
    status: "Not Started",
  },
  {
    id: "r2",
    title: "Add Parameter Validation to Authentication",
    description:
      "Implement strict parameter validation and type checking in the User Authentication tool to prevent parameter manipulation attacks.",
    tool: "User Authentication",
    severity: "High",
    difficulty: "Easy",
    timeEstimate: "1 day",
    status: "Not Started",
  },
  {
    id: "r3",
    title: "Implement Error Handling for Data Retrieval",
    description:
      "Add proper error handling to prevent sensitive information leakage in error responses from the Data Retrieval tool.",
    tool: "Data Retrieval",
    severity: "Medium",
    difficulty: "Easy",
    timeEstimate: "4 hours",
    status: "Not Started",
  },
  {
    id: "r4",
    title: "Add Cross-Tool Security Boundaries",
    description: "Implement security boundaries between tools to prevent cross-tool manipulation attacks.",
    tool: "All Tools",
    severity: "High",
    difficulty: "Hard",
    timeEstimate: "1 week",
    status: "Not Started",
  },
  {
    id: "r5",
    title: "Implement Input Validation for Payment Processing",
    description: "Add comprehensive input validation for all parameters in the Payment Processing tool.",
    tool: "Payment Processing",
    severity: "Medium",
    difficulty: "Medium",
    timeEstimate: "2 days",
    status: "Not Started",
  },
]

export default function RemediationList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Recommended Actions</h3>
          <p className="text-sm text-muted-foreground">
            Prioritized list of remediation steps to address vulnerabilities
          </p>
        </div>
        <Button>Generate Implementation Plan</Button>
      </div>

      <div className="space-y-4">
        {remediations.map((remediation, index) => (
          <Card key={remediation.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                {remediation.severity === "Critical" ? (
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                ) : remediation.severity === "High" ? (
                  <FileWarning className="h-4 w-4 text-orange-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {index + 1}. {remediation.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={
                          remediation.severity === "Critical"
                            ? "border-red-500 text-red-500"
                            : remediation.severity === "High"
                              ? "border-orange-500 text-orange-500"
                              : "border-yellow-500 text-yellow-500"
                        }
                      >
                        {remediation.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{remediation.description}</p>
                  </div>
                  <Badge variant="secondary">{remediation.tool}</Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Code className="h-4 w-4 text-slate-500" />
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span>{remediation.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-muted-foreground">Estimate:</span>
                    <span>{remediation.timeEstimate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-slate-500" />
                    <span className="text-muted-foreground">Status:</span>
                    <span>{remediation.status}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    <Code className="mr-2 h-4 w-4" />
                    View Implementation Guide
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
