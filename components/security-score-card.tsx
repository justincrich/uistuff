import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SecurityScoreCardProps {
  title: string
  score: number
  change: number
  icon: LucideIcon
  description: string
}

export default function SecurityScoreCard({ title, score, change, icon: Icon, description }: SecurityScoreCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-success" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}/100</div>
        <div className="flex items-center">
          <span className={cn("text-xs", change > 0 ? "text-success" : change < 0 ? "text-error" : "text-gray-4")}>
            {change > 0 ? "+" : ""}
            {change} pts
          </span>
          <span className="ml-2 text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
