"use client"

import { useTestStore } from "@/lib/test-store"
import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const letters = ["A", "B", "C", "D"]

export function QuestionCard() {
  const { questions, answers, flags, currentQ, submitted, setAnswer, toggleFlag } = useTestStore()

  const question = questions[currentQ]
  if (!question) return null

  const selectedAnswer = answers[currentQ]
  const isFlagged = flags[currentQ]

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of 60
        </span>
        <Button
          variant={isFlagged ? "secondary" : "ghost"}
          size="sm"
          onClick={() => toggleFlag(currentQ)}
          className={cn(
            "h-8 px-3 text-xs",
            isFlagged && "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
          )}
        >
          <Flag className="w-3.5 h-3.5 mr-1" />
          {isFlagged ? "Flagged" : "Flag"}
        </Button>
      </div>

      <div className="text-base font-medium text-foreground mb-6 leading-relaxed whitespace-pre-line">
        {question.q}
      </div>

      <div className="flex flex-col gap-3">
        {question.o.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === question.a
          const isWrongSelected = submitted && isSelected && !isCorrect

          let optionClass = "border-border hover:border-primary hover:bg-primary/5"
          let letterClass = "bg-muted text-muted-foreground"

          if (submitted) {
            if (isCorrect) {
              optionClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
              letterClass = "bg-emerald-500 text-white"
            } else if (isWrongSelected) {
              optionClass = "border-red-500 bg-red-50 dark:bg-red-950/30"
              letterClass = "bg-red-500 text-white"
            }
          } else if (isSelected) {
            optionClass = "border-primary bg-primary/10"
            letterClass = "bg-primary text-primary-foreground"
          }

          return (
            <button
              key={index}
              onClick={() => !submitted && setAnswer(currentQ, index)}
              disabled={submitted}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left",
                optionClass
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
                  letterClass
                )}
              >
                {letters[index]}
              </div>
              <div className="text-sm text-foreground pt-0.5">{option}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
