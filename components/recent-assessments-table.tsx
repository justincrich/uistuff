import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Link from "next/link"

const recentAssessments = [
  {
    id: "a1",
    name: "Production API Server",
    date: "2023-04-10",
    score: 82,
    status: "Completed",
    vulnerabilities: 12,
    critical: 1,
  },
  {
    id: "a2",
    name: "Development MCP Server",
    date: "2023-04-08",
    score: 68,
    status: "Completed",
    vulnerabilities: 24,
    critical: 3,
  },
  {
    id: "a3",
    name: "Staging Environment",
    date: "2023-04-05",
    score: 91,
    status: "Completed",
    vulnerabilities: 5,
    critical: 0,
  },
  {
    id: "a4",
    name: "Customer Portal Tools",
    date: "2023-04-01",
    score: 76,
    status: "Completed",
    vulnerabilities: 18,
    critical: 2,
  },
  {
    id: "a5",
    name: "Internal Dashboard",
    date: "2023-03-28",
    score: 88,
    status: "Completed",
    vulnerabilities: 9,
    critical: 0,
  },
]

export default function RecentAssessmentsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Vulnerabilities</TableHead>
          <TableHead>Critical</TableHead>
          <TableHead className="text-right">Report</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentAssessments.map((assessment) => (
          <TableRow key={assessment.id}>
            <TableCell className="font-medium">{assessment.name}</TableCell>
            <TableCell>{assessment.date}</TableCell>
            <TableCell>
              <span
                className={
                  assessment.score >= 90
                    ? "text-emerald-500"
                    : assessment.score >= 70
                      ? "text-amber-500"
                      : "text-red-500"
                }
              >
                {assessment.score}/100
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={assessment.status === "Completed" ? "default" : "secondary"}>{assessment.status}</Badge>
            </TableCell>
            <TableCell>{assessment.vulnerabilities}</TableCell>
            <TableCell>
              <span className={assessment.critical > 0 ? "text-red-500 font-medium" : ""}>{assessment.critical}</span>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/reports/${assessment.id}`}>
                  <FileText className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
