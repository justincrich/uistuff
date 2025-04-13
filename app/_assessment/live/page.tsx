"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, Pause, Play, XCircle } from "lucide-react"
import Link from "next/link"

export default function LiveAssessment() {
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentTool, setCurrentTool] = useState("User Authentication")
  const [completedTools, setCompletedTools] = useState<string[]>([])
  const [findings, setFindings] = useState<any[]>([])
  const [timeRemaining, setTimeRemaining] = useState("8:42")

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })

      // Simulate tool completion
      if (progress === 25) {
        setCompletedTools((prev) => [...prev, "User Authentication"])
        setCurrentTool("Data Retrieval")
        setFindings((prev) => [
          ...prev,
          {
            id: "f1",
            tool: "User Authentication",
            severity: "High",
            type: "Parameter Injection",
            description: "Authentication bypass possible through parameter manipulation",
          },
        ])
      } else if (progress === 50) {
        setCompletedTools((prev) => [...prev, "Data Retrieval"])
        setCurrentTool("Content Generation")
        setFindings((prev) => [
          ...prev,
          {
            id: "f2",
            tool: "Data Retrieval",
            severity: "Medium",
            type: "Context Leakage",
            description: "Sensitive data exposed in error responses",
          },
        ])
      } else if (progress === 75) {
        setCompletedTools((prev) => [...prev, "Content Generation"])
        setCurrentTool("Image Processing")
        setFindings((prev) => [
          ...prev,
          {
            id: "f3",
            tool: "Content Generation",
            severity: "Critical",
            type: "Tool Poisoning",
            description: "Prompt injection vulnerability allows arbitrary content generation",
          },
        ])
      }

      // Update time remaining
      if (progress < 100) {
        const minutes = Math.floor(((100 - progress) * 8.42) / 100)
        const seconds = Math.floor((((100 - progress) * 8.42) / 100 - minutes) * 60)
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`)
      } else {
        setTimeRemaining("0:00")
      }
    }, 300)

    return () => clearInterval(interval)
  }, [progress, isPaused])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Assessment</h1>
          <p className="text-muted-foreground">Production API Server - Comprehensive Assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button variant="destructive" size="sm">
            Cancel Assessment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Assessment Progress</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Time Remaining: {timeRemaining}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {progress}%</span>
              <span>{completedTools.length} of 8 tools completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            {["User Authentication", "Data Retrieval", "Content Generation", "Image Processing"].map((tool) => (
              <Card
                key={tool}
                className={`border ${
                  completedTools.includes(tool)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : tool === currentTool && progress < 100
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{tool}</span>
                  {completedTools.includes(tool) ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : tool === currentTool && progress < 100 ? (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-slate-200 dark:border-slate-700" />
                  )}
                </CardContent>
              </Card>
            ))}

            {["Search Function", "Email Sender", "Payment Processing", "Data Analysis"].map((tool) => (
              <Card
                key={tool}
                className={`border ${
                  completedTools.includes(tool)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : tool === currentTool && progress < 100
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : ""
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{tool}</span>
                  {completedTools.includes(tool) ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : tool === currentTool && progress < 100 ? (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-slate-200 dark:border-slate-700" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="findings">
        <TabsList>
          <TabsTrigger value="findings">Live Findings</TabsTrigger>
          <TabsTrigger value="tests">Test Cases</TabsTrigger>
        </TabsList>
        <TabsContent value="findings">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Findings</CardTitle>
              <CardDescription>Issues detected during the assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {findings.length > 0 ? (
                <div className="space-y-4">
                  {findings.map((finding) => (
                    <div
                      key={finding.id}
                      className={`p-4 border rounded-md ${
                        finding.severity === "Critical"
                          ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                          : finding.severity === "High"
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                            : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {finding.severity === "Critical" ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : finding.severity === "High" ? (
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
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
                                ? "border-red-500 text-red-500"
                                : finding.severity === "High"
                                  ? "border-orange-500 text-orange-500"
                                  : "border-yellow-500 text-yellow-500"
                            }
                          >
                            {finding.severity}
                          </Badge>
                          <div className="mt-1 text-xs text-muted-foreground">{finding.tool}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                    <Clock className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No findings yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Vulnerabilities will appear here as they are discovered during the assessment process.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {progress === 100 && (
                <Button asChild className="w-full">
                  <Link href="/reports/new">View Complete Report</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
              <CardDescription>Individual test cases being executed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "t1", name: "Authentication Bypass Test", status: "passed", tool: "User Authentication" },
                  { id: "t2", name: "Parameter Injection Test", status: "failed", tool: "User Authentication" },
                  { id: "t3", name: "SQL Injection Test", status: "passed", tool: "Data Retrieval" },
                  { id: "t4", name: "Cross-Tool Manipulation", status: "failed", tool: "Content Generation" },
                  { id: "t5", name: "Prompt Injection Test", status: "running", tool: "Content Generation" },
                ].map((test) => (
                  <div key={test.id} className="p-3 border rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{test.name}</div>
                      <div className="text-xs text-muted-foreground">{test.tool}</div>
                    </div>
                    <div>
                      {test.status === "passed" ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-600 border-emerald-600 dark:bg-emerald-950/20"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Passed
                        </Badge>
                      ) : test.status === "failed" ? (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-600 dark:bg-red-950/20">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-950/20"
                        >
                          <div className="h-3 w-3 mr-1 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                          Running
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
