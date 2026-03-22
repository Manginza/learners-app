"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTestStore } from "@/lib/test-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, HelpCircle, Flag, RotateCcw, Home } from "lucide-react"

type ReviewFilter = "all" | "incorrect" | "flagged" | "unanswered"

const letters = ["A", "B", "C", "D"]

export function ResultsScreen() {
  const router = useRouter()
  const { questions, answers, flags, currentTest, startTest, reset } = useTestStore()
  const [showReview, setShowReview] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all")

  let correct = 0
  let incorrect = 0
  let unanswered = 0

  for (let i = 0; i < 60; i++) {
    if (answers[i] === -1) unanswered++
    else if (answers[i] === questions[i]?.a) correct++
    else incorrect++
  }

  const percentage = Math.round((correct / 60) * 100)
  const passed = percentage >= 77

  const goHome = () => {
    reset()
    router.push("/")
  }

  const retake = () => {
    if (currentTest) {
      startTest(currentTest)
    }
  }

  const getFilteredQuestions = () => {
    const filtered: number[] = []
    for (let i = 0; i < 60; i++) {
      if (reviewFilter === "incorrect" && (answers[i] === -1 || answers[i] === questions[i]?.a)) continue
      if (reviewFilter === "flagged" && !flags[i]) continue
      if (reviewFilter === "unanswered" && answers[i] !== -1) continue
      filtered.push(i)
    }
    return filtered
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Results Card */}
        <div className="bg-card border rounded-xl p-8 shadow-sm text-center mb-6">
          <div
            className={cn(
              "w-36 h-36 rounded-full mx-auto flex flex-col items-center justify-center border-[6px] mb-6",
              passed ? "border-emerald-500" : "border-red-500"
            )}
          >
            <span className="text-4xl font-bold">{correct}</span>
            <span className="text-sm text-muted-foreground">out of 60</span>
          </div>

          <h2
            className={cn(
              "text-2xl font-bold mb-2",
              passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {passed ? "PASSED!" : "FAILED"}
          </h2>

          <p className="text-muted-foreground mb-6">
            You scored {percentage}% — {passed ? "You need 77% to pass. Well done!" : "You need 77% to pass. Keep studying!"}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex justify-center items-center gap-1">
                <CheckCircle className="w-5 h-5" />
                {correct}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Correct</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 flex justify-center items-center gap-1">
                <XCircle className="w-5 h-5" />
                {incorrect}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Incorrect</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex justify-center items-center gap-1">
                <HelpCircle className="w-5 h-5" />
                {unanswered}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Unanswered</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => setShowReview(true)} variant="default">
              Review Answers
            </Button>
            <Button onClick={goHome} variant="outline">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Button>
            <Button onClick={retake} variant="outline">
              <RotateCcw className="w-4 h-4 mr-1" />
              Retake
            </Button>
          </div>
        </div>

        {/* Review Section */}
        {showReview && (
          <div className="space-y-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(["all", "incorrect", "flagged", "unanswered"] as ReviewFilter[]).map((filter) => (
                <Button
                  key={filter}
                  variant={reviewFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setReviewFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Questions */}
            {getFilteredQuestions().map((index) => {
              const question = questions[index]
              const userAnswer = answers[index]
              const isCorrect = userAnswer === question.a
              const isUnanswered = userAnswer === -1
              const isFlagged = flags[index]

              return (
                <div
                  key={index}
                  className={cn(
                    "bg-card border rounded-xl p-5 border-l-4",
                    isCorrect && "border-l-emerald-500",
                    !isCorrect && !isUnanswered && "border-l-red-500",
                    isUnanswered && "border-l-amber-500"
                  )}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-muted-foreground font-medium">
                      Question {index + 1}
                    </span>
                    {isFlagged && (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center text-xs">
                        <Flag className="w-3.5 h-3.5 mr-1" />
                        Flagged
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-foreground mb-4 whitespace-pre-line">
                    {question.q}
                  </p>

                  <div className="space-y-2">
                    {question.o.map((option, optIndex) => {
                      const isCorrectOption = optIndex === question.a
                      const isUserSelection = optIndex === userAnswer
                      const isWrongSelection = isUserSelection && !isCorrectOption

                      return (
                        <div
                          key={optIndex}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border",
                            isCorrectOption && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                            isWrongSelection && "border-red-500 bg-red-50 dark:bg-red-950/30",
                            !isCorrectOption && !isWrongSelection && "border-border"
                          )}
                        >
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                              isCorrectOption && "bg-emerald-500 text-white",
                              isWrongSelection && "bg-red-500 text-white",
                              !isCorrectOption && !isWrongSelection && "bg-muted text-muted-foreground"
                            )}
                          >
                            {letters[optIndex]}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {getFilteredQuestions().length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No questions match this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
