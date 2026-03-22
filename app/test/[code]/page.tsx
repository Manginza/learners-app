import { TestScreen } from "@/components/test-screen"
import type { TestCode } from "@/lib/questions"

interface TestPageProps {
  params: Promise<{ code: string }>
}

export default async function TestPage({ params }: TestPageProps) {
  const { code } = await params
  const validCodes = ["code8", "code10", "code14"]
  
  if (!validCodes.includes(code)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Test Code</h1>
          <p className="text-muted-foreground">Please select a valid test from the home page.</p>
        </div>
      </div>
    )
  }

  return <TestScreen testCode={code as TestCode} />
}
