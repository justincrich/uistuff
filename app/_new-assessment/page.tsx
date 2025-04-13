import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Server } from "lucide-react"
import ServerSubmissionForm from "@/components/server-submission-form"
import AssessmentConfigForm from "@/components/assessment-config-form"
import Link from "next/link"

export default function NewAssessment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Assessment</h1>
          <p className="text-muted-foreground">Configure and run a new MCP server vulnerability assessment</p>
        </div>
      </div>

      <Tabs defaultValue="server" className="space-y-6">
        <div className="flex items-center">
          <TabsList className="w-full grid grid-cols-3 max-w-xl">
            <TabsTrigger value="server">Server Details</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="review">Review & Start</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>MCP Server Details</CardTitle>
              <CardDescription>Enter the connection details for your MCP server</CardDescription>
            </CardHeader>
            <CardContent>
              <ServerSubmissionForm />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>
                Continue to Configuration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Configuration</CardTitle>
              <CardDescription>Configure the vulnerability assessment parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <AssessmentConfigForm />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Back to Server Details</Button>
              <Button>
                Continue to Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review & Start Assessment</CardTitle>
              <CardDescription>Review your configuration and start the assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Server Details</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Server Name</div>
                        <div>Production API Server</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">URL</div>
                        <div>https://api.example.com/mcp</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Authentication</div>
                        <div>API Key</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Tools Count</div>
                        <div>12 tools detected</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Assessment Configuration</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Test Intensity</div>
                        <div>Comprehensive</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Scope</div>
                        <div>All Tools</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Estimated Duration</div>
                        <div>8-10 minutes</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Priority Categories</div>
                        <div>Tool Poisoning, Parameter Injection</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-900">
                  <div className="flex items-center gap-4">
                    <Server className="h-8 w-8 text-slate-500" />
                    <div>
                      <h4 className="text-sm font-medium">Ready to Start Assessment</h4>
                      <p className="text-sm text-muted-foreground">
                        The assessment will run in the background and notify you when complete
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Back to Configuration</Button>
              <Button asChild>
                <Link href="/assessment/live">
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
