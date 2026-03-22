import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TestCode } from './questions'

interface ImageData {
  filename: string
  url: string
  testCode: string
  questionIndex: number
  uploadedAt: string
}

interface AdminState {
  token: string | null
  email: string | null
  currentTab: TestCode
  images: Record<string, ImageData>
  
  // Actions
  setAuth: (token: string, email: string) => void
  logout: () => void
  setCurrentTab: (tab: TestCode) => void
  setImages: (images: Record<string, ImageData>) => void
  addImage: (key: string, data: ImageData) => void
  removeImage: (key: string) => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      currentTab: 'code8',
      images: {},
      
      setAuth: (token: string, email: string) => set({ token, email }),
      logout: () => set({ token: null, email: null }),
      setCurrentTab: (tab: TestCode) => set({ currentTab: tab }),
      setImages: (images: Record<string, ImageData>) => set({ images }),
      addImage: (key: string, data: ImageData) => set((state) => ({
        images: { ...state.images, [key]: data }
      })),
      removeImage: (key: string) => set((state) => {
        const newImages = { ...state.images }
        delete newImages[key]
        return { images: newImages }
      })
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ token: state.token, email: state.email })
    }
  )
)
