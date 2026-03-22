"use client"

import { useEffect, useState } from "react"
import { useAdminStore } from "@/lib/admin-store"
import { allQuestions, type TestCode } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QuestionItem } from "./question-item"
import { LogOut, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminPanel() {
  const { email, currentTab, images, logout, setCurrentTab, setImages } = useAdminStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "with-image" | "no-image">("all")

  // Load images on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await fetch("/api/images")
        if (res.ok) {
          const data = await res.json()
          setImages(data)
        }
      } catch {
        console.error("Failed to load images")
      }
    }
    loadImages()
  }, [setImages])

  const questions = allQuestions[currentTab]
  const questionsWithImages = questions.filter((_, i) => images[`${currentTab}_${i}`])

  const filteredQuestions = questions.map((q, i) => ({ question: q, index: i })).filter(({ question, index }) => {
    const hasImage = !!images[`${currentTab}_${index}`]
    if (filter === "with-image" && !hasImage) return false
    if (filter === "no-image" && hasImage) return false
    if (searchQuery && !question.q.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const tabs: { code: TestCode; label: string }[] = [
    { code: "code8", label: "Code 8" },
    { code: "code10", label: "Code 10" },
    { code: "code14", label: "Code 14" },
  ]

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Image Manager</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.code}
              onClick={() => {
                setCurrentTab(tab.code)
                setSearchQuery("")
                setFilter("all")
              }}
              className={cn(
                "px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                currentTab === tab.code
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="pl-9"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Questions</option>
            <option value="with-image">With Image</option>
            <option value="no-image">Without Image</option>
          </select>
        </div>

        {/* Stats */}
        <p className="text-sm text-muted-foreground mb-4">
          {questionsWithImages.length} of {questions.length} questions have images
        </p>

        {/* Question List */}
        <div className="space-y-3">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map(({ question, index }) => (
              <QuestionItem
                key={index}
                question={question}
                index={index}
                testCode={currentTab}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No questions match your filter.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
