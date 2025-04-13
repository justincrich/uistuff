"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Check, Loader2 } from "lucide-react"

export default function ServerSubmissionForm() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleTestConnection = () => {
    setIsConnecting(true)
    // Simulate connection test
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="server-name">Server Name</Label>
            <Input id="server-name" placeholder="Production API Server" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="server-url">Server URL</Label>
            <Input id="server-url" placeholder="https://api.example.com/mcp" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Authentication Method</Label>
          <RadioGroup defaultValue="api-key" className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="api-key" id="api-key" />
              <Label htmlFor="api-key" className="font-normal">
                API Key
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oauth" id="oauth" />
              <Label htmlFor="oauth" className="font-normal">
                OAuth 2.0
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bearer" id="bearer" />
              <Label htmlFor="bearer" className="font-normal">
                Bearer Token
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic" className="font-normal">
                Basic Auth
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="font-normal">
                Custom Header
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input id="api-key" type="password" placeholder="Enter your API key" />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleTestConnection} disabled={isConnecting || isConnected}>
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : isConnected ? (
              <>
                <Check className="mr-2 h-4 w-4 text-emerald-500" />
                Connection Successful
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tool Descriptions</Label>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="tool-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-slate-500" />
                  <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">JSON, YAML, or OpenAPI (Max 10MB)</p>
                </div>
                <Input id="tool-file" type="file" className="hidden" />
              </label>
            </div>
          </TabsContent>
          <TabsContent value="manual" className="space-y-4">
            <Textarea
              placeholder="Paste your tool descriptions here in JSON or YAML format..."
              className="min-h-[200px]"
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="context">Additional Context</Label>
        <Textarea
          id="context"
          placeholder="Provide any additional context about your MCP server that might be relevant for the assessment..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
