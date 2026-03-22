"use client"

import { useState, useRef } from "react"
import { useAdminStore } from "@/lib/admin-store"
import type { Question, TestCode } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, ImageIcon, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionItemProps {
  question: Question
  index: number
  testCode: TestCode
}

export function QuestionItem({ question, index, testCode }: QuestionItemProps) {
  const { token, images, addImage, removeImage } = useAdminStore()
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imageKey = `${testCode}_${index}`
  const imageData = images[imageKey]
  const hasImage = !!imageData

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setErrorMessage("Please select an image file")
      setStatus("error")
      return
    }

    setStatus("uploading")
    setErrorMessage("")

    const formData = new FormData()
    formData.append("image", file)
    formData.append("testCode", testCode)
    formData.append("questionIndex", String(index))

    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        addImage(imageKey, data)
        setStatus("success")
        if (fileInputRef.current) fileInputRef.current.value = ""
        setTimeout(() => setStatus("idle"), 2000)
      } else {
        setErrorMessage(data.error || "Upload failed")
        setStatus("error")
      }
    } catch {
      setErrorMessage("Upload failed - connection error")
      setStatus("error")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Remove this image?")) return

    try {
      const res = await fetch(`/api/images/${testCode}/${index}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        removeImage(imageKey)
      }
    } catch {
      alert("Delete failed")
    }
  }

  return (
    <div className="bg-card border rounded-xl p-4 flex gap-4">
      {/* Question Number */}
      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground mb-2 whitespace-pre-line leading-relaxed">
          {question.q}
        </p>

        {/* Status Badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
            hasImage
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          <ImageIcon className="w-3 h-3" />
          {hasImage ? "Has Image" : "No Image"}
        </span>

        {/* Current Image */}
        {hasImage && (
          <div className="mt-3">
            <img
              src={imageData.url}
              alt={`Question ${index + 1}`}
              className="max-w-[200px] max-h-[150px] rounded-lg border object-contain bg-muted"
            />
          </div>
        )}

        {/* Upload Controls */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="text-xs max-w-[200px]"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleUpload}
            disabled={status === "uploading"}
            className="h-8"
          >
            {status === "uploading" ? (
              "Uploading..."
            ) : status === "success" ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                Uploaded
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 mr-1" />
                Upload
              </>
            )}
          </Button>

          {hasImage && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              className="h-8"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Remove
            </Button>
          )}
        </div>

        {/* Status Message */}
        {status === "error" && errorMessage && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  )
}
