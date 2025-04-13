import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Play } from "lucide-react"

const testCases = [
  {
    id: "tc1",
    name: "Authentication Bypass Test",
    tool: "User Authentication",
    category: "Parameter Injection",
    result: "Failed",
    date: "2023-04-10",
  },
  {
    id: "tc2",
    name: "SQL Injection Test",
    tool: "Data Retrieval",
    category: "Parameter Injection",
    result: "Passed",
    date: "2023-04-10",
  },
  {
    id: "tc3",
    name: "Prompt Injection Test",
    tool: "Content Generation",
    category: "Tool Poisoning",
    result: "Failed",
    date: "2023-04-10",
  },
  {
    id: "tc4",
    name: "Cross-Tool Command Test",
    tool: "Search Function",
    category: "Cross-Tool Manipulation",
    result: "Failed",
    date: "2023-04-10",
  },
  {
    id: "tc5",
    name: "Error Handling Test",
    tool: "Data Retrieval",
    category: "Context Leakage",
    result: "Failed",
    date: "2023-04-10",
  },
  {
    id: "tc6",
    name: "Input Validation Test",
    tool: "Payment Processing",
    category: "Parameter Injection",
    result: "Passed",
    date: "2023-04-10",
  },
  {
    id: "tc7",
    name: "Authentication Token Test",
    tool: "User Authentication",
    category: "Authentication Bypass",
    result: "Passed",
    date: "2023-04-10",
  },
  {
    id: "tc8",
    name: "Content Filtering Test",
    tool: "Content Generation",
    category: "Tool Poisoning",
    result: "Failed",
    date: "2023-04-10",
  },
]

export default function TestDataTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Test Case</TableHead>
          <TableHead>Tool</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testCases.map((test) => (
          <TableRow key={test.id}>
            <TableCell className="font-medium">{test.name}</TableCell>
            <TableCell>{test.tool}</TableCell>
            <TableCell>{test.category}</TableCell>
            <TableCell>
              {test.result === "Failed" ? (
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-600 dark:bg-red-950/20">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-600 border-emerald-600 dark:bg-emerald-950/20"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Passed
                </Badge>
              )}
            </TableCell>
            <TableCell>{test.date}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <Play className="h-4 w-4 mr-1" />
                Run
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
