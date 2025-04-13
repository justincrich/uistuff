import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

const tools = [
  {
    id: "t1",
    name: "User Authentication",
    score: 68,
    vulnerabilities: 2,
    critical: 0,
    high: 1,
    medium: 1,
    low: 0,
    status: "Vulnerable",
  },
  {
    id: "t2",
    name: "Data Retrieval",
    score: 72,
    vulnerabilities: 1,
    critical: 0,
    high: 0,
    medium: 1,
    low: 0,
    status: "Vulnerable",
  },
  {
    id: "t3",
    name: "Content Generation",
    score: 42,
    vulnerabilities: 3,
    critical: 1,
    high: 1,
    medium: 1,
    low: 0,
    status: "Critical",
  },
  {
    id: "t4",
    name: "Image Processing",
    score: 95,
    vulnerabilities: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    status: "Secure",
  },
  {
    id: "t5",
    name: "Search Function",
    score: 65,
    vulnerabilities: 2,
    critical: 0,
    high: 1,
    medium: 0,
    low: 1,
    status: "Vulnerable",
  },
  {
    id: "t6",
    name: "Email Sender",
    score: 92,
    vulnerabilities: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    status: "Secure",
  },
  {
    id: "t7",
    name: "Payment Processing",
    score: 78,
    vulnerabilities: 1,
    critical: 0,
    high: 0,
    medium: 1,
    low: 0,
    status: "Vulnerable",
  },
  {
    id: "t8",
    name: "Data Analysis",
    score: 90,
    vulnerabilities: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    status: "Secure",
  },
]

export default function ToolSecurityTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tool</TableHead>
          <TableHead>Security Score</TableHead>
          <TableHead>Vulnerabilities</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.map((tool) => (
          <TableRow key={tool.id}>
            <TableCell className="font-medium">{tool.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress
                  value={tool.score}
                  className="h-2 w-24"
                  indicatorClassName={
                    tool.score >= 90 ? "bg-emerald-500" : tool.score >= 70 ? "bg-amber-500" : "bg-red-500"
                  }
                />
                <span className="text-sm">{tool.score}/100</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                {tool.critical > 0 && (
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    {tool.critical} Critical
                  </Badge>
                )}
                {tool.high > 0 && (
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    {tool.high} High
                  </Badge>
                )}
                {tool.medium > 0 && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    {tool.medium} Medium
                  </Badge>
                )}
                {tool.low > 0 && (
                  <Badge variant="outline" className="border-blue-500 text-blue-500">
                    {tool.low} Low
                  </Badge>
                )}
                {tool.vulnerabilities === 0 && (
                  <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                    No Issues
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  tool.status === "Secure"
                    ? "bg-emerald-500"
                    : tool.status === "Critical"
                      ? "bg-red-500"
                      : "bg-amber-500"
                }
              >
                {tool.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
