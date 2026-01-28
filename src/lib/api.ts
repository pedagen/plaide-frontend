const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiError {
  message: string
  status: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      }
      throw error
    }

    return response.json()
  }

  // ============ DOSSIERS ============

  async getDossiers() {
    return this.request<Dossier[]>('/api/dossiers')
  }

  async getDossier(id: string) {
    return this.request<DossierDetail>(`/api/dossiers/${id}`)
  }

  async createDossier(data: CreateDossierDto) {
    return this.request<Dossier>('/api/dossiers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteDossier(id: string) {
    return this.request<void>(`/api/dossiers/${id}`, {
      method: 'DELETE',
    })
  }

  // ============ PIECES ============

  async uploadPiece(dossierId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(
      `${this.baseUrl}/api/dossiers/${dossierId}/pieces`,
      {
        method: 'POST',
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }

    return response.json()
  }

  async deletePiece(dossierId: string, pieceId: string) {
    return this.request<void>(`/api/dossiers/${dossierId}/pieces/${pieceId}`, {
      method: 'DELETE',
    })
  }

  // ============ ANALYSE ============

  async analyzeDossier(dossierId: string) {
    return this.request<AnalysisResult>(`/api/dossiers/${dossierId}/analyze`, {
      method: 'POST',
    })
  }

  async getSynthesis(dossierId: string) {
    return this.request<Synthesis>(`/api/dossiers/${dossierId}/synthesis`)
  }

  async getTimeline(dossierId: string) {
    return this.request<TimelineEvent[]>(`/api/dossiers/${dossierId}/timeline`)
  }

  // ============ CHAT ============

  async sendMessage(dossierId: string, message: string) {
    return this.request<ChatResponse>(`/api/dossiers/${dossierId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  async getChatHistory(dossierId: string) {
    return this.request<ChatMessage[]>(`/api/dossiers/${dossierId}/chat`)
  }

  // ============ EXPORT ============

  async exportPdf(dossierId: string) {
    const response = await fetch(
      `${this.baseUrl}/api/dossiers/${dossierId}/export/pdf`,
      {
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      }
    )
    return response.blob()
  }

  async exportWord(dossierId: string) {
    const response = await fetch(
      `${this.baseUrl}/api/dossiers/${dossierId}/export/word`,
      {
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      }
    )
    return response.blob()
  }
}

// Types
export interface Dossier {
  id: string
  name: string
  type: string
  created_at: string
  updated_at: string
  pieces_count: number
  status: 'pending' | 'analyzing' | 'analyzed' | 'error'
}

export interface DossierDetail extends Dossier {
  pieces: Piece[]
  synthesis?: Synthesis
}

export interface Piece {
  id: string
  name: string
  type: 'pdf' | 'audio' | 'image' | 'text'
  size: number
  uploaded_at: string
  status: 'pending' | 'processing' | 'processed' | 'error'
}

export interface Synthesis {
  summary: string
  parties: Party[]
  strengths: SynthesisPoint[]
  weaknesses: SynthesisPoint[]
  key_dates: KeyDate[]
  generated_at: string
}

export interface Party {
  name: string
  role: string
  quality: string
  source: string
}

export interface SynthesisPoint {
  text: string
  source: string
  importance: 'high' | 'medium' | 'low'
}

export interface KeyDate {
  date: string
  event: string
  source: string
}

export interface TimelineEvent {
  date: string
  title: string
  description: string
  type: 'contract' | 'letter' | 'incident' | 'procedure' | 'other'
  source: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  timestamp: string
}

export interface ChatSource {
  piece_name: string
  page?: number
  excerpt: string
}

export interface ChatResponse {
  message: ChatMessage
}

export interface AnalysisResult {
  status: 'success' | 'error'
  message: string
}

export interface CreateDossierDto {
  name: string
  type: string
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL)
