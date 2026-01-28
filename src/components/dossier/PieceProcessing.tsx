'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Loader2, Clock } from 'lucide-react'
import { Card } from '@/components/ui'

interface ProcessingStep {
  id: string
  label: string
  description: string
  status: 'pending' | 'processing' | 'completed'
  progress?: number
}

interface PieceProcessingProps {
  pieceType: 'pdf' | 'audio' | 'image'
  pieceName: string
  onComplete?: () => void
}

export function PieceProcessing({ pieceType, pieceName, onComplete }: PieceProcessingProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([])
  const [estimatedTime, setEstimatedTime] = useState('~5 minutes')

  useEffect(() => {
    // Define steps based on piece type
    const baseSteps: ProcessingStep[] = [
      {
        id: 'upload',
        label: 'Upload du fichier',
        description: 'Transfert vers le serveur',
        status: 'completed',
      },
    ]

    if (pieceType === 'pdf') {
      setSteps([
        ...baseSteps,
        {
          id: 'extraction',
          label: 'Extraction du texte',
          description: 'PyPDF2 / pdfplumber',
          status: 'processing',
          progress: 85,
        },
        {
          id: 'analysis',
          label: 'Analyse IA du contenu',
          description: 'Claude 3.5 Sonnet',
          status: 'pending',
        },
        {
          id: 'elements',
          label: 'Extraction des éléments clés',
          description: 'Dates, entités, résumé',
          status: 'pending',
        },
        {
          id: 'integration',
          label: 'Intégration à la synthèse',
          description: 'Mise à jour du dossier',
          status: 'pending',
        },
      ])
      setEstimatedTime('~2 minutes')
    } else if (pieceType === 'audio') {
      setSteps([
        ...baseSteps,
        {
          id: 'transcription',
          label: 'Transcription audio',
          description: 'OpenAI Whisper',
          status: 'processing',
          progress: 67,
        },
        {
          id: 'diarization',
          label: 'Détection des intervenants',
          description: 'Speaker diarization',
          status: 'pending',
        },
        {
          id: 'analysis',
          label: 'Analyse IA du contenu',
          description: 'Claude 3.5 Sonnet',
          status: 'pending',
        },
        {
          id: 'elements',
          label: 'Extraction des éléments clés',
          description: 'Points notables, résumé',
          status: 'pending',
        },
        {
          id: 'integration',
          label: 'Intégration à la synthèse',
          description: 'Mise à jour du dossier',
          status: 'pending',
        },
      ])
      setEstimatedTime('~8 minutes')
    } else {
      setSteps([
        ...baseSteps,
        {
          id: 'vision',
          label: 'Analyse visuelle',
          description: 'Claude Vision',
          status: 'processing',
          progress: 45,
        },
        {
          id: 'ocr',
          label: 'Extraction du texte (OCR)',
          description: 'Reconnaissance de caractères',
          status: 'pending',
        },
        {
          id: 'analysis',
          label: 'Analyse du contexte',
          description: 'Claude 3.5 Sonnet',
          status: 'pending',
        },
        {
          id: 'integration',
          label: 'Intégration à la synthèse',
          description: 'Mise à jour du dossier',
          status: 'pending',
        },
      ])
      setEstimatedTime('~1 minute')
    }
  }, [pieceType])

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        )
      case 'processing':
        return (
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40">
            <Clock className="w-5 h-5" />
          </div>
        )
    }
  }

  const getStatusColor = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'processing':
        return 'text-indigo-400'
      default:
        return 'text-white/30'
    }
  }

  const getStatusLabel = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé'
      case 'processing':
        return 'En cours'
      default:
        return 'En attente'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl animate-pulse ${
            pieceType === 'pdf' ? 'bg-red-500/20' :
            pieceType === 'audio' ? 'bg-green-500/20' : 'bg-purple-500/20'
          }`}>
            {pieceType === 'pdf' ? '📄' : pieceType === 'audio' ? '🎙️' : '📱'}
          </span>
          {pieceName}
        </h1>
        <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            En cours de traitement
          </span>
          <span>{pieceType.toUpperCase()}</span>
        </div>
      </div>

      {/* Processing steps */}
      <Card padding="lg">
        <h2 className="font-display text-lg font-bold mb-6">Progression de l&apos;analyse</h2>
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              {getStepIcon(step.status)}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className={`font-medium ${step.status === 'pending' ? 'text-white/50' : ''}`}>
                    {step.label}
                  </span>
                  <span className={`text-sm ${getStatusColor(step.status)}`}>
                    {step.status === 'processing' && step.progress 
                      ? `${step.progress}%` 
                      : getStatusLabel(step.status)
                    }
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      step.status === 'completed' 
                        ? 'bg-green-500 w-full' 
                        : step.status === 'processing'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        : 'bg-white/20 w-0'
                    }`}
                    style={{ 
                      width: step.status === 'processing' && step.progress 
                        ? `${step.progress}%` 
                        : step.status === 'completed' 
                        ? '100%' 
                        : '0%' 
                    }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Estimated time */}
        <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
          <p className="text-sm text-white/70">
            ⏱️ Temps estimé restant : <strong className="text-indigo-400">{estimatedTime}</strong>
          </p>
          <p className="text-xs text-white/40 mt-1">
            Vous recevrez une notification quand l&apos;analyse sera terminée
          </p>
        </div>
      </Card>

      {/* What happens next */}
      <Card padding="lg" className="mt-6">
        <h3 className="font-display font-bold mb-4">🔮 Ce qui va se passer ensuite</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {pieceType === 'audio' ? (
            <>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">📝</span>
                <p className="text-sm font-medium mt-2">Transcription complète</p>
                <p className="text-xs text-white/40 mt-1">Texte avec timestamps</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">👥</span>
                <p className="text-sm font-medium mt-2">Intervenants identifiés</p>
                <p className="text-xs text-white/40 mt-1">Qui parle quand</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">🤖</span>
                <p className="text-sm font-medium mt-2">Résumé IA</p>
                <p className="text-xs text-white/40 mt-1">Points clés extraits</p>
              </div>
            </>
          ) : pieceType === 'image' ? (
            <>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">👁️</span>
                <p className="text-sm font-medium mt-2">Description visuelle</p>
                <p className="text-xs text-white/40 mt-1">Ce que montre l&apos;image</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">📝</span>
                <p className="text-sm font-medium mt-2">Texte extrait (OCR)</p>
                <p className="text-xs text-white/40 mt-1">Contenu textuel</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">🔍</span>
                <p className="text-sm font-medium mt-2">Éléments détectés</p>
                <p className="text-xs text-white/40 mt-1">Dates, noms, contexte</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">📄</span>
                <p className="text-sm font-medium mt-2">Texte complet</p>
                <p className="text-xs text-white/40 mt-1">Contenu extrait</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">🤖</span>
                <p className="text-sm font-medium mt-2">Résumé IA</p>
                <p className="text-xs text-white/40 mt-1">Points clés extraits</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl text-center">
                <span className="text-2xl">📊</span>
                <p className="text-sm font-medium mt-2">Mise à jour synthèse</p>
                <p className="text-xs text-white/40 mt-1">Intégration automatique</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
