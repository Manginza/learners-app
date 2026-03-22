"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTestStore } from "@/lib/test-store"
import type { TestCode } from "@/lib/questions"
import { QuestionCard } from "./question-card"
import { QuestionGrid } from "./question-grid"
import { TestHeader } from "./test-header"
import { ResultsScreen } from "./results-screen"
import { ConfirmModal } from "./confirm-modal"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TestScreenProps {
  testCode: TestCode
}

export function TestScreen({ testCode }: TestScreenProps) {
  const router = useRouter()
  const {
    currentTest,
    questions,
    answers,
    currentQ,
    timeLeft,
    submitted,
    gridVisible,
    startTest,
    nextQuestion,
    prevQuestion,
    submitTest,
    decrementTime,
    reset
  } = useTestStore()

  const [showExitModal, setShowExitModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTimeUpModal, setShowTimeUpModal] = useState(false)

  // Start test on mount
  useEffect(() => {
    if (!currentTest || currentTest !== testCode) {
      startTest(testCode)
    }
  }, [currentTest, testCode, startTest])

  // Timer
  useEffect(() => {
    if (submitted || !currentTest) return

    const interval = setInterval(() => {
      const { timeLeft } = useTestStore.getState()
      if (timeLeft <= 1) {
        clearInterval(interval)
        setShowTimeUpModal(true)
      } else {
        decrementTime()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [submitted, currentTest, decrementTime])

  const handleExit = useCallback(() => {
    reset()
    router.push("/")
  }, [reset, router])

  const handleSubmit = useCallback(() => {
    setShowSubmitModal(false)
    submitTest()
  }, [submitTest])

  const handleTimeUp = useCallback(() => {
    setShowTimeUpModal(false)
    submitTest()
  }, [submitTest])

  // Not initialized yet
  if (!currentTest || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading test...</div>
      </div>
    )
  }

  // Show results
  if (submitted) {
    return <ResultsScreen />
  }

  const unanswered = answers.filter((a) => a === -1).length
  const submitMessage = unanswered > 0
    ? `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Are you sure you want to submit?`
    : "You have answered all 60 questions. Are you ready to submit?"

  const testTitles: Record<TestCode, string> = {
    code8: "Code 8 — Light Motor Vehicle",
    code10: "Code 10 — Heavy Motor Vehicle",
    code14: "Code 14 — Extra-Heavy Motor Vehicle"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-4">
        <TestHeader
          title={testTitles[currentTest]}
          timeLeft={timeLeft}
          onExit={() => setShowExitModal(true)}
        />

        {gridVisible && <QuestionGrid />}

        <QuestionCard />

        <div className="flex justify-between items-center gap-4 mt-4">
          <Button
            variant="secondary"
            onClick={prevQuestion}
            disabled={currentQ === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentQ < 59 ? (
            <Button onClick={nextQuestion} className="flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowSubmitModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Submit Test
            </Button>
          )}
        </div>
      </div>

      {/* Exit Modal */}
      <ConfirmModal
        open={showExitModal}
        onOpenChange={setShowExitModal}
        title="Exit Test?"
        description="Your progress will be lost. Are you sure?"
        confirmText="Exit"
        onConfirm={handleExit}
      />

      {/* Submit Modal */}
      <ConfirmModal
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        title="Submit Test?"
        description={submitMessage}
        confirmText="Submit"
        confirmVariant="default"
        onConfirm={handleSubmit}
      />

      {/* Time Up Modal */}
      <ConfirmModal
        open={showTimeUpModal}
        onOpenChange={setShowTimeUpModal}
        title="Time's Up!"
        description="Your 60 minutes are over. Your test will be submitted automatically."
        confirmText="View Results"
        confirmVariant="default"
        onConfirm={handleTimeUp}
        showCancel={false}
      />
    </div>
  )
}
