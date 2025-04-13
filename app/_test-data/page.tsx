import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertCircle, CheckCircle, Play } from "lucide-react"
import TestDataTable from "@/components/test-data-table"
import TestCaseDetail from "@/components/test-case-detail"

export default function TestDataPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Data Explorer</h1>
          <p className="text-muted-foreground">Explore and analyze test cases used in vulnerability assessments</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search test cases..." className="pl-8" />
          </div>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run Custom Test
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Test Cases</TabsTrigger>
            <TabsTrigger value="failed">Failed Tests</TabsTrigger>
            <TabsTrigger value="passed">Passed Tests</TabsTrigger>
            <TabsTrigger value="custom">Custom Tests</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center">
              <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
              <span>24 Failed</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 text-emerald-500 mr-1" />
              <span>118 Passed</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
                <CardDescription>Test inputs used during vulnerability assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <TestDataTable />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Test Case Detail</CardTitle>
                <CardDescription>Detailed view of the selected test case</CardDescription>
              </CardHeader>
              <CardContent>
                <TestCaseDetail />
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
