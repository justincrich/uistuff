"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AssessmentConfigForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Test Intensity</Label>
        <div className="space-y-4">
          <Slider defaultValue={[75]} max={100} step={25} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>Basic</div>
            <div>Standard</div>
            <div>Comprehensive</div>
            <div>Exhaustive</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assessment Scope</Label>
        <RadioGroup defaultValue="all">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal">
              All Tools
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="selected" id="selected" />
            <Label htmlFor="selected" className="font-normal">
              Selected Tools Only
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Tool Selection</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "User Authentication",
            "Data Retrieval",
            "Content Generation",
            "Image Processing",
            "Search Function",
            "Email Sender",
            "Payment Processing",
            "Data Analysis",
          ].map((tool) => (
            <Card key={tool} className="p-3 flex items-center space-x-2">
              <Checkbox id={`tool-${tool}`} />
              <Label htmlFor={`tool-${tool}`} className="font-normal text-sm">
                {tool}
              </Label>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vulnerability Categories</Label>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="custom">Custom Weighting</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">
                All vulnerability categories will be tested with equal priority.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="custom">
            <div className="space-y-4">
              {[
                { name: "Tool Poisoning", description: "Attacks that manipulate tool behavior" },
                { name: "Parameter Injection", description: "Malicious input to tool parameters" },
                { name: "Context Leakage", description: "Unauthorized access to context data" },
                { name: "Cross-Tool Manipulation", description: "Using one tool to attack another" },
                { name: "Authentication Bypass", description: "Bypassing tool access controls" },
              ].map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{category.name}</Label>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <Badge variant="outline">High Priority</Badge>
                  </div>
                  <Slider defaultValue={[75]} max={100} step={25} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>Low</div>
                    <div>Medium</div>
                    <div>High</div>
                    <div>Critical</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label>Advanced Options</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="custom-test-data" />
            <Label htmlFor="custom-test-data" className="font-normal">
              Include custom test data
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cross-tool" />
            <Label htmlFor="cross-tool" className="font-normal">
              Enable cross-tool interaction testing
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="detailed-reporting" defaultChecked />
            <Label htmlFor="detailed-reporting" className="font-normal">
              Generate detailed test case reports
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remediation" defaultChecked />
            <Label htmlFor="remediation" className="font-normal">
              Include remediation recommendations
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
