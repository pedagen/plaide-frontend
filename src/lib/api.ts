/**
 * Plaide API Client
 * 
 * Ce fichier gère toute la communication entre le frontend (Next.js)
 * et le backend (FastAPI).
 * 
 * Configuration requise:
 * - NEXT_PUBLIC_API_URL dans .env.local
 * - Token JWT stocké après login
 */

// ============================================
// CONFIGURATION
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token JWT stocké en mémoire (ou localStorage en prod)
let authToken: string | null = null;

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  cabinet_name?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  cabinet_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Dossier {
  id: string;
  titre: string;
  client_nom: string;
  type_affaire: 'travail' | 'famille' | 'immobilier' | 'commercial' | 'penal' | 'autre';
  statut: 'nouveau' | 'en_cours' | 'analyse' | 'termine';
  pieces_count: number;
  synthese?: Synthesis;
  created_at: string;
  updated_at: string;
}

export interface DossierCreate {
  titre: string;
  client_nom: string;
  type_affaire: string;
}

export interface Piece {
  id: string;
  dossier_id: string;
  nom_fichier: string;
  type_fichier: 'pdf' | 'audio' | 'image' | 'email' | 'text';
  mime_type: string;
  taille_octets: number;
  contenu_extrait?: string;
  transcription?: TranscriptionResult;
  ocr_result?: OCRResult;
  analysis?: PieceAnalysis;
  traite: boolean;
  created_at: string;
}

export interface TranscriptionResult {
  text: string;
  segments: { start: number; end: number; text: string }[];
  speakers?: { name: string; percentage: number }[];
  duration: string;
}

export interface OCRResult {
  text: string;
  description: string;
  detected_elements: { label: string; value: string }[];
}

export interface PieceAnalysis {
  summary: string;
  key_elements: { text: string; page?: string; type: 'strength' | 'weakness' | 'info' }[];
  dates: { date: string; event: string }[];
}

export interface Synthesis {
  summary: string;
  parties: { name: string; role: string; quality: string; source: string }[];
  strengths: { text: string; source: string }[];
  weaknesses: { text: string; source: string }[];
  key_dates: { date: string; event: string; type: string; source: string }[];
  unclear_points: string[];
  contradictions?: { description: string; sources: string[] }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { piece: string; page?: string; excerpt: string }[];
  created_at: string;
}

export interface ChatResponse {
  response: string;
  sources: { piece: string; page?: string; excerpt: string }[];
}

export interface UploadProgress {
  piece_id: string;
  status: 'uploading' | 'processing' | 'processed' | 'error';
  progress: number;
  current_step?: string;
  estimated_remaining?: string;
  error?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Effectue une requête HTTP vers le backend
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Ajouter le token d'authentification si disponible
  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Gérer les erreurs HTTP
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
    throw new APIError(
      error.detail || `Erreur ${response.status}`,
      response.status
    );
  }

  // Retourner vide pour les 204
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Upload un fichier avec suivi de progression
 */
async function uploadFile(
  endpoint: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadProgress> {
  const url = `${API_URL}${endpoint}`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);

  // Pour le suivi de progression, on utilise XMLHttpRequest
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new APIError(`Upload failed: ${xhr.statusText}`, xhr.status));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new APIError('Network error during upload', 0));
    });

    xhr.open('POST', url);
    
    if (authToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    }
    
    xhr.send(formData);
  });
}

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
export class APIError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetchAPI<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Stocker le token
    authToken = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('plaide_token', response.access_token);
    }
    
    return response;
  },

  /**
   * Connexion
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetchAPI<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Stocker le token
    authToken = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('plaide_token', response.access_token);
    }
    
    return response;
  },

  /**
   * Déconnexion
   */
  logout(): void {
    authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('plaide_token');
    }
  },

  /**
   * Récupérer le profil utilisateur
   */
  async getProfile(): Promise<User> {
    return fetchAPI<User>('/api/auth/me');
  },

  /**
   * Rafraîchir le token
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await fetchAPI<AuthResponse>('/api/auth/refresh', {
      method: 'POST',
    });
    
    authToken = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('plaide_token', response.access_token);
    }
    
    return response;
  },

  /**
   * Initialiser le token depuis le localStorage
   */
  initFromStorage(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('plaide_token');
    if (token) {
      authToken = token;
      return true;
    }
    return false;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!authToken;
  },
};

// ============================================
// DOSSIERS API
// ============================================

export const dossiersAPI = {
  /**
   * Liste tous les dossiers
   */
  async list(): Promise<Dossier[]> {
    const response = await fetchAPI<{ dossiers: Dossier[] }>('/api/dossiers');
    return response.dossiers;
  },

  /**
   * Récupère un dossier par son ID
   */
  async get(id: string): Promise<Dossier> {
    return fetchAPI<Dossier>(`/api/dossiers/${id}`);
  },

  /**
   * Crée un nouveau dossier
   */
  async create(data: DossierCreate): Promise<Dossier> {
    return fetchAPI<Dossier>('/api/dossiers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Met à jour un dossier
   */
  async update(id: string, data: Partial<DossierCreate>): Promise<Dossier> {
    return fetchAPI<Dossier>(`/api/dossiers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprime un dossier
   */
  async delete(id: string): Promise<void> {
    await fetchAPI(`/api/dossiers/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Récupère la synthèse d'un dossier
   */
  async getSynthesis(id: string): Promise<Synthesis> {
    return fetchAPI<Synthesis>(`/api/dossiers/${id}/synthese`);
  },
};

// ============================================
// PIECES API
// ============================================

export const piecesAPI = {
  /**
   * Liste les pièces d'un dossier
   */
  async list(dossierId: string): Promise<Piece[]> {
    const response = await fetchAPI<{ pieces: Piece[] }>(`/api/dossiers/${dossierId}/pieces`);
    return response.pieces;
  },

  /**
   * Récupère une pièce par son ID
   */
  async get(pieceId: string): Promise<Piece> {
    return fetchAPI<Piece>(`/api/pieces/${pieceId}`);
  },

  /**
   * Upload une pièce
   */
  async upload(
    dossierId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadProgress> {
    return uploadFile(`/api/dossiers/${dossierId}/pieces`, file, onProgress);
  },

  /**
   * Upload plusieurs pièces
   */
  async uploadMultiple(
    dossierId: string,
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadProgress[]> {
    const results: UploadProgress[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const result = await this.upload(
        dossierId,
        files[i],
        (progress) => onProgress?.(i, progress)
      );
      results.push(result);
    }
    
    return results;
  },

  /**
   * Vérifie le statut de traitement d'une pièce
   */
  async getStatus(pieceId: string): Promise<UploadProgress> {
    return fetchAPI<UploadProgress>(`/api/pieces/${pieceId}/status`);
  },

  /**
   * Récupère le contenu extrait d'une pièce
   */
  async getContent(pieceId: string): Promise<{ content: string; analysis: PieceAnalysis }> {
    return fetchAPI(`/api/pieces/${pieceId}/content`);
  },

  /**
   * Supprime une pièce
   */
  async delete(pieceId: string): Promise<void> {
    await fetchAPI(`/api/pieces/${pieceId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// ANALYZE API
// ============================================

export const analyzeAPI = {
  /**
   * Lance l'analyse complète d'un dossier
   */
  async start(dossierId: string): Promise<{ status: string; message: string }> {
    return fetchAPI(`/api/dossiers/${dossierId}/analyze`, {
      method: 'POST',
    });
  },

  /**
   * Vérifie le statut de l'analyse
   */
  async getStatus(dossierId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress: number;
    current_step: string;
    estimated_remaining?: string;
  }> {
    return fetchAPI(`/api/dossiers/${dossierId}/analyze/status`);
  },

  /**
   * Polling du statut jusqu'à completion
   */
  async waitForCompletion(
    dossierId: string,
    onProgress?: (status: { progress: number; step: string }) => void,
    intervalMs: number = 2000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getStatus(dossierId);
          
          onProgress?.({
            progress: status.progress,
            step: status.current_step,
          });

          if (status.status === 'completed') {
            resolve();
          } else if (status.status === 'error') {
            reject(new Error('Analyse failed'));
          } else {
            setTimeout(poll, intervalMs);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },
};

// ============================================
// CHAT API
// ============================================

export const chatAPI = {
  /**
   * Envoie un message et reçoit une réponse
   */
  async send(dossierId: string, message: string): Promise<ChatResponse> {
    return fetchAPI<ChatResponse>(`/api/dossiers/${dossierId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  /**
   * Récupère l'historique du chat
   */
  async getHistory(dossierId: string): Promise<ChatMessage[]> {
    const response = await fetchAPI<{ messages: ChatMessage[] }>(
      `/api/dossiers/${dossierId}/chat/history`
    );
    return response.messages;
  },

  /**
   * Efface l'historique du chat
   */
  async clearHistory(dossierId: string): Promise<void> {
    await fetchAPI(`/api/dossiers/${dossierId}/chat/history`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// EXPORT API
// ============================================

export const exportAPI = {
  /**
   * Exporte la synthèse en PDF
   */
  async toPDF(dossierId: string): Promise<Blob> {
    const url = `${API_URL}/api/dossiers/${dossierId}/export/pdf`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new APIError('Export PDF failed', response.status);
    }

    return response.blob();
  },

  /**
   * Exporte la synthèse en Word
   */
  async toWord(dossierId: string): Promise<Blob> {
    const url = `${API_URL}/api/dossiers/${dossierId}/export/docx`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new APIError('Export Word failed', response.status);
    }

    return response.blob();
  },

  /**
   * Télécharge un fichier exporté
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

const api = {
  auth: authAPI,
  dossiers: dossiersAPI,
  pieces: piecesAPI,
  analyze: analyzeAPI,
  chat: chatAPI,
  export: exportAPI,
};

export default api;
