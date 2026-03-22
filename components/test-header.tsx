"use client"

import { useTestStore } from "@/lib/test-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestHeaderProps {
  title: string
  timeLeft: number
  onExit: () => void
}

export function TestHeader({ title, timeLeft, onExit }: TestHeaderProps) {
  const { answers, flags, toggleGrid, gridVisible } = useTestStore()

  const answered = answers.filter((a) => a !== -1).length
  const flagged = flags.filter((f) => f).length
  const progress = (answered / 60) * 100

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  const timerClass = cn(
    "font-mono text-lg font-bold tabular-nums",
    timeLeft <= 300 ? "text-red-500 animate-pulse" : timeLeft <= 600 ? "text-amber-500" : "text-foreground"
  )

  return (
    <div className="bg-card border rounded-xl p-4 mb-4 sticky top-4 z-10 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <Button variant="ghost" size="sm" onClick={onExit} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Exit
        </Button>
        <span className="text-sm font-medium text-foreground hidden sm:block">{title}</span>
        <span className={timerClass}>{timeString}</span>
      </div>

      <div className="bg-muted rounded-full h-2 overflow-hidden mb-2">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{answered} of 60 answered</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleGrid}
          className={cn("h-7 px-2 text-xs", gridVisible && "bg-muted")}
        >
          <LayoutGrid className="w-3.5 h-3.5 mr-1" />
          Navigator
        </Button>
        <span>{flagged} flagged</span>
      </div>
    </div>
  )
}
