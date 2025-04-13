import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import VulnerabilityScoreCard from "@/components/vulnerability-score-card"
import VulnerabilityTable from "@/components/vulnerability-table"
import ToolSecurityTable from "@/components/tool-security-table"
import RemediationList from "@/components/remediation-list"

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Security Report</h1>
            <Badge>Completed</Badge>
          </div>
          <p className="text-muted-foreground">Production API Server - April 10, 2023</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Run New Assessment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <VulnerabilityScoreCard
          title="Overall Security Score"
          score={82}
          description="Good security posture"
          icon={Shield}
          color="emerald"
        />
        <VulnerabilityScoreCard
          title="Vulnerabilities Found"
          score={12}
          description="3 critical, 4 high, 5 medium"
          icon={AlertTriangle}
          color="orange"
        />
        <VulnerabilityScoreCard
          title="Tools Assessed"
          score={8}
          description="3 secure, 5 vulnerable"
          icon={FileText}
          color="blue"
        />
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="remediation">Remediation</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Summary</CardTitle>
              <CardDescription>Overview of the security assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Findings</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Critical Tool Poisoning Vulnerability</p>
                          <p className="text-sm text-muted-foreground">
                            Content Generation tool vulnerable to prompt injection attacks
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Authentication Bypass</p>
                          <p className="text-sm text-muted-foreground">
                            User Authentication tool vulnerable to parameter manipulation
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Context Leakage</p>
                          <p className="text-sm text-muted-foreground">
                            Data Retrieval tool exposes sensitive information in error responses
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Secure Tools</p>
                          <p className="text-sm text-muted-foreground">
                            3 tools passed all security tests with no vulnerabilities
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Vulnerability Distribution</h3>
                    <div className="h-64 border rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-muted-foreground">Vulnerability distribution chart</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Assessment Details</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Assessment Date</p>
                      <p>April 10, 2023</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Assessment Type</p>
                      <p>Comprehensive</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Duration</p>
                      <p>8 minutes 42 seconds</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Test Cases</p>
                      <p>142 tests executed</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                    <p className="font-medium">Priority Actions</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>1. Fix prompt injection vulnerability in Content Generation tool</li>
                      <li>2. Implement parameter validation in User Authentication tool</li>
                      <li>3. Add error handling to prevent context leakage in Data Retrieval</li>
                      <li>4. Implement cross-tool security boundaries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Details</CardTitle>
              <CardDescription>Comprehensive list of all detected vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <VulnerabilityTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Tool Security Analysis</CardTitle>
              <CardDescription>Security assessment results for each MCP tool</CardDescription>
            </CardHeader>
            <CardContent>
              <ToolSecurityTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remediation">
          <Card>
            <CardHeader>
              <CardTitle>Remediation Recommendations</CardTitle>
              <CardDescription>Actionable steps to address identified vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <RemediationList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
