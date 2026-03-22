"use client"

import { useRouter } from "next/navigation"
import { Car, Truck, Bus } from "lucide-react"
import type { TestCode } from "@/lib/questions"

const tests = [
  {
    code: "code8" as TestCode,
    title: "CODE 8",
    subtitle: "Light Motor Vehicle",
    description: "Cars, bakkies, and light delivery vehicles (GVM up to 3,500 kg)",
    icon: Car,
    colorClass: "bg-blue-50 text-blue-600 border-blue-200",
    badgeClass: "bg-blue-100 text-blue-700"
  },
  {
    code: "code10" as TestCode,
    title: "CODE 10",
    subtitle: "Heavy Motor Vehicle",
    description: "Trucks and heavy vehicles (GVM 3,501 kg to 16,000 kg)",
    icon: Truck,
    colorClass: "bg-emerald-50 text-emerald-600 border-emerald-200",
    badgeClass: "bg-emerald-100 text-emerald-700"
  },
  {
    code: "code14" as TestCode,
    title: "CODE 14",
    subtitle: "Extra-Heavy Motor Vehicle",
    description: "Articulated trucks, buses, and extra-heavy vehicles (GVM over 16,000 kg)",
    icon: Bus,
    colorClass: "bg-amber-50 text-amber-600 border-amber-200",
    badgeClass: "bg-amber-100 text-amber-700"
  }
]

export function HomeScreen() {
  const router = useRouter()

  const startTest = (code: TestCode) => {
    router.push(`/test/${code}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">
            <span role="img" aria-label="South African flag">&#127487;&#127462;</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            SA Learner&apos;s Licence Practice Tests
          </h1>
          <p className="text-muted-foreground max-w-md">
            Prepare for your South African learner&apos;s licence test with realistic 60-question practice exams.
          </p>
        </div>

        <div className="grid gap-4 w-full max-w-lg">
          {tests.map((test) => {
            const Icon = test.icon
            return (
              <button
                key={test.code}
                onClick={() => startTest(test.code)}
                className="group bg-card border rounded-xl p-6 text-left transition-all hover:shadow-lg hover:border-primary hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border ${test.colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${test.badgeClass}`}>
                      {test.title}
                    </span>
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      {test.subtitle}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      {test.description}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>60 Questions</span>
                      <span>60 Minutes</span>
                      <span>Pass: 77%</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>Practice test for educational purposes only</p>
      </footer>
    </div>
  )
}
