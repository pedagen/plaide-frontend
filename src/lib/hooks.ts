/**
 * Hooks React pour utiliser l'API Plaide
 * 
 * Ces hooks gèrent le state, le loading, et les erreurs
 * automatiquement pour chaque appel API.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import api, { 
  Dossier, 
  Piece, 
  Synthesis, 
  ChatMessage, 
  ChatResponse,
  UploadProgress,
  APIError 
} from './api';

// ============================================
// AUTH HOOKS
// ============================================

/**
 * Hook pour gérer l'authentification
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe au chargement
    const hasToken = api.auth.initFromStorage();
    setIsAuthenticated(hasToken);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await api.auth.login({ email, password });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as APIError).message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}

// ============================================
// DOSSIERS HOOKS
// ============================================

/**
 * Hook pour lister les dossiers
 */
export function useDossiers() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDossiers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.dossiers.list();
      setDossiers(data);
    } catch (err) {
      setError((err as APIError).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDossiers();
  }, [fetchDossiers]);

  return { dossiers, isLoading, error, refetch: fetchDossiers };
}

/**
 * Hook pour un dossier spécifique
 */
export function useDossier(id: string) {
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDossier = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.dossiers.get(id);
      setDossier(data);
    } catch (err) {
      setError((err as APIError).message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDossier();
  }, [fetchDossier]);

  return { dossier, isLoading, error, refetch: fetchDossier };
}

/**
 * Hook pour créer un dossier
 */
export function useCreateDossier() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDossier = async (data: {
    titre: string;
    client_nom: string;
    type_affaire: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const dossier = await api.dossiers.create(data);
      return { success: true, dossier };
    } catch (err) {
      const message = (err as APIError).message;
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { createDossier, isLoading, error };
}

// ============================================
// PIECES HOOKS
// ============================================

/**
 * Hook pour les pièces d'un dossier
 */
export function usePieces(dossierId: string) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPieces = useCallback(async () => {
    if (!dossierId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.pieces.list(dossierId);
      setPieces(data);
    } catch (err) {
      setError((err as APIError).message);
    } finally {
      setIsLoading(false);
    }
  }, [dossierId]);

  useEffect(() => {
    fetchPieces();
  }, [fetchPieces]);

  return { pieces, isLoading, error, refetch: fetchPieces };
}

/**
 * Hook pour uploader des fichiers
 */
export function useUploadPieces(dossierId: string) {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    const newUploads = new Map<string, UploadProgress>();

    for (const file of files) {
      // Initialiser le statut
      newUploads.set(file.name, {
        piece_id: '',
        status: 'uploading',
        progress: 0,
      });
      setUploads(new Map(newUploads));

      try {
        const result = await api.pieces.upload(
          dossierId,
          file,
          (progress) => {
            newUploads.set(file.name, {
              ...newUploads.get(file.name)!,
              progress,
            });
            setUploads(new Map(newUploads));
          }
        );

        newUploads.set(file.name, result);
        setUploads(new Map(newUploads));
      } catch (error) {
        newUploads.set(file.name, {
          piece_id: '',
          status: 'error',
          progress: 0,
          error: (error as APIError).message,
        });
        setUploads(new Map(newUploads));
      }
    }

    setIsUploading(false);
  };

  const clearUploads = () => {
    setUploads(new Map());
  };

  return { uploads, isUploading, uploadFiles, clearUploads };
}

// ============================================
// CHAT HOOKS
// ============================================

/**
 * Hook pour le chat avec un dossier
 */
export function useChat(dossierId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'historique
  const fetchHistory = useCallback(async () => {
    if (!dossierId) return;
    setIsLoading(true);
    try {
      const history = await api.chat.getHistory(dossierId);
      setMessages(history);
    } catch (err) {
      setError((err as APIError).message);
    } finally {
      setIsLoading(false);
    }
  }, [dossierId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Envoyer un message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Ajouter le message user localement
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setError(null);

    try {
      const response = await api.chat.send(dossierId, content);

      // Ajouter la réponse assistant
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        sources: response.sources,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError((err as APIError).message);
      // Retirer le message user en cas d'erreur
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  // Effacer l'historique
  const clearHistory = async () => {
    try {
      await api.chat.clearHistory(dossierId);
      setMessages([]);
    } catch (err) {
      setError((err as APIError).message);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    clearHistory,
    refetch: fetchHistory,
  };
}

// ============================================
// ANALYZE HOOKS
// ============================================

/**
 * Hook pour lancer et suivre l'analyse d'un dossier
 */
export function useAnalyze(dossierId: string) {
  const [status, setStatus] = useState<{
    isAnalyzing: boolean;
    progress: number;
    currentStep: string;
  }>({
    isAnalyzing: false,
    progress: 0,
    currentStep: '',
  });
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async () => {
    setError(null);
    setStatus({ isAnalyzing: true, progress: 0, currentStep: 'Démarrage...' });

    try {
      // Lancer l'analyse
      await api.analyze.start(dossierId);

      // Polling du statut
      await api.analyze.waitForCompletion(
        dossierId,
        ({ progress, step }) => {
          setStatus({ isAnalyzing: true, progress, currentStep: step });
        }
      );

      setStatus({ isAnalyzing: false, progress: 100, currentStep: 'Terminé' });
      return { success: true };
    } catch (err) {
      setError((err as APIError).message);
      setStatus({ isAnalyzing: false, progress: 0, currentStep: '' });
      return { success: false, error: (err as APIError).message };
    }
  };

  return { ...status, error, startAnalysis };
}

// ============================================
// EXPORT HOOKS
// ============================================

/**
 * Hook pour exporter un dossier
 */
export function useExport(dossierId: string, dossierName: string) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPDF = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const blob = await api.export.toPDF(dossierId);
      api.export.downloadBlob(blob, `${dossierName}-synthese.pdf`);
    } catch (err) {
      setError((err as APIError).message);
    } finally {
      setIsExporting(false);
    }
  };

  const exportWord = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const blob = await api.export.toWord(dossierId);
      api.export.downloadBlob(blob, `${dossierName}-synthese.docx`);
    } catch (err) {
      setError((err as APIError).message);
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, error, exportPDF, exportWord };
}
