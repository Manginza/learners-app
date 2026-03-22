"use client"

import { useEffect, useState } from "react"
import { useAdminStore } from "@/lib/admin-store"
import { LoginForm } from "./login-form"
import { AdminPanel } from "./admin-panel"

export function AdminDashboard() {
  const { token, setAuth, logout } = useAdminStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          setAuth(token, data.email)
          setIsAuthenticated(true)
        } else {
          logout()
        }
      } catch {
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token, setAuth, logout])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />
  }

  return <AdminPanel />
}
