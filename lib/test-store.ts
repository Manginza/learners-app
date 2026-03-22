import { create } from 'zustand'
import type { Question, TestCode } from './questions'
import { code8Questions, code10Questions, code14Questions } from './questions'

interface TestState {
  currentTest: TestCode | null
  questions: Question[]
  answers: number[]
  flags: boolean[]
  currentQ: number
  timeLeft: number
  submitted: boolean
  gridVisible: boolean
  
  // Actions
  startTest: (type: TestCode) => void
  setAnswer: (questionIndex: number, answerIndex: number) => void
  toggleFlag: (questionIndex: number) => void
  setCurrentQuestion: (index: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  submitTest: () => void
  decrementTime: () => void
  toggleGrid: () => void
  reset: () => void
}

export const useTestStore = create<TestState>((set, get) => ({
  currentTest: null,
  questions: [],
  answers: [],
  flags: [],
  currentQ: 0,
  timeLeft: 3600,
  submitted: false,
  gridVisible: false,
  
  startTest: (type: TestCode) => {
    let questions: Question[] = []
    if (type === 'code8') questions = [...code8Questions]
    else if (type === 'code10') questions = [...code10Questions]
    else questions = [...code14Questions]
    
    set({
      currentTest: type,
      questions,
      answers: new Array(60).fill(-1),
      flags: new Array(60).fill(false),
      currentQ: 0,
      timeLeft: 3600,
      submitted: false,
      gridVisible: false
    })
  },
  
  setAnswer: (questionIndex: number, answerIndex: number) => {
    const { answers, submitted } = get()
    if (submitted) return
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    set({ answers: newAnswers })
  },
  
  toggleFlag: (questionIndex: number) => {
    const { flags } = get()
    const newFlags = [...flags]
    newFlags[questionIndex] = !newFlags[questionIndex]
    set({ flags: newFlags })
  },
  
  setCurrentQuestion: (index: number) => {
    set({ currentQ: index })
  },
  
  nextQuestion: () => {
    const { currentQ } = get()
    if (currentQ < 59) set({ currentQ: currentQ + 1 })
  },
  
  prevQuestion: () => {
    const { currentQ } = get()
    if (currentQ > 0) set({ currentQ: currentQ - 1 })
  },
  
  submitTest: () => {
    set({ submitted: true })
  },
  
  decrementTime: () => {
    const { timeLeft } = get()
    if (timeLeft > 0) set({ timeLeft: timeLeft - 1 })
  },
  
  toggleGrid: () => {
    const { gridVisible } = get()
    set({ gridVisible: !gridVisible })
  },
  
  reset: () => {
    set({
      currentTest: null,
      questions: [],
      answers: [],
      flags: [],
      currentQ: 0,
      timeLeft: 3600,
      submitted: false,
      gridVisible: false
    })
  }
}))
