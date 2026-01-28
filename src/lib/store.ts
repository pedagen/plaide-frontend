import { create } from 'zustand'
import { Dossier, DossierDetail, ChatMessage } from './api'

interface AppState {
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Dossiers
  dossiers: Dossier[]
  setDossiers: (dossiers: Dossier[]) => void
  addDossier: (dossier: Dossier) => void
  updateDossier: (id: string, updates: Partial<Dossier>) => void
  removeDossier: (id: string) => void
  
  // Current dossier
  currentDossier: DossierDetail | null
  setCurrentDossier: (dossier: DossierDetail | null) => void
  
  // Chat
  chatMessages: ChatMessage[]
  setChatMessages: (messages: ChatMessage[]) => void
  addChatMessage: (message: ChatMessage) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

interface User {
  id: string
  email: string
  name?: string
}

export const useStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Dossiers
  dossiers: [],
  setDossiers: (dossiers) => set({ dossiers }),
  addDossier: (dossier) => set((state) => ({ 
    dossiers: [dossier, ...state.dossiers] 
  })),
  updateDossier: (id, updates) => set((state) => ({
    dossiers: state.dossiers.map((d) => 
      d.id === id ? { ...d, ...updates } : d
    ),
  })),
  removeDossier: (id) => set((state) => ({
    dossiers: state.dossiers.filter((d) => d.id !== id),
  })),
  
  // Current dossier
  currentDossier: null,
  setCurrentDossier: (dossier) => set({ currentDossier: dossier }),
  
  // Chat
  chatMessages: [],
  setChatMessages: (messages) => set({ chatMessages: messages }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  isAnalyzing: false,
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}))
