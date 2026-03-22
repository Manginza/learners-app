"use client"

import { useTestStore } from "@/lib/test-store"
import { cn } from "@/lib/utils"

export function QuestionGrid() {
  const { questions, answers, flags, currentQ, submitted, setCurrentQuestion } = useTestStore()

  return (
    <div className="bg-card border rounded-xl p-4 mb-4 shadow-sm">
      <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-1.5">
        {Array.from({ length: 60 }).map((_, index) => {
          const isAnswered = answers[index] !== -1
          const isFlagged = flags[index]
          const isCurrent = index === currentQ
          const isCorrect = submitted && answers[index] === questions[index]?.a
          const isIncorrect = submitted && isAnswered && !isCorrect

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={cn(
                "aspect-square rounded-md text-xs font-semibold border-2 transition-all relative",
                isCurrent && "ring-2 ring-primary ring-offset-1",
                !submitted && isAnswered && "bg-primary/10 border-primary/50 text-primary",
                !submitted && !isAnswered && "bg-background border-border text-muted-foreground hover:border-primary/50",
                submitted && isCorrect && "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
                submitted && isIncorrect && "bg-red-100 border-red-500 text-red-700 dark:bg-red-950/50 dark:text-red-400"
              )}
            >
              {index + 1}
              {isFlagged && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
      
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-border bg-background" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-primary/50 bg-primary/10" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-border bg-background relative">
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
          </div>
          <span>Flagged</span>
        </div>
      </div>
    </div>
  )
}
