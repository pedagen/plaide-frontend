'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Download, 
  FileText,
  Mic,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  Play,
  Pause,
  Copy,
  Loader2,
  AlertTriangle,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { piecesAPI, Piece, APIError } from '@/lib/api'

export default function PieceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dossierId = params.id as string
  const pieceId = params.pieceId as string

  const [piece, setPiece] = useState<Piece | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)

  // Charger la pièce
  useEffect(() => {
    const fetchPiece = async () => {
      try {
        const data = await piecesAPI.get(pieceId)
        setPiece(data)
      } catch (err) {
        if (err instanceof APIError) {
          setError(err.message)
        } else {
          setError('Impossible de charger cette pièce')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPiece()
  }, [pieceId])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-400" />
      case 'audio': return <Mic className="w-6 h-6 text-green-400" />
      case 'image': return <ImageIcon className="w-6 h-6 text-purple-400" />
      default: return <FileText className="w-6 h-6" />
    }
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-white/50">Chargement de la pièce...</p>
        </div>
      </div>
    )
  }

  // Error
  if (error || !piece) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card padding="lg" className="text-center border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">Pièce non trouvée</h3>
          <p className="text-white/50 text-sm mb-6">{error}</p>
          <Link href={`/dossier/${dossierId}`}>
            <Button>Retour au dossier</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href={`/dossier/${dossierId}`}
          className="inline-flex items-center gap-1 text-white/40 hover:text-white/60 text-sm mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dossier
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              piece.type_fichier === 'pdf' ? 'bg-red-500/20' :
              piece.type_fichier === 'audio' ? 'bg-green-500/20' :
              'bg-purple-500/20'
            }`}>
              {getTypeIcon(piece.type_fichier)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{piece.nom_fichier}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                <span>{piece.type_fichier.toUpperCase()}</span>
                <span>•</span>
                <span>{formatFileSize(piece.taille_octets)}</span>
                <span>•</span>
                <Badge variant={piece.traite ? 'success' : 'warning'} size="sm">
                  {piece.traite ? 'Analysé' : 'En cours'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              Télécharger
            </Button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - AI Analysis */}
        <div className="space-y-6">
          {/* Summary */}
          {piece.analysis && (
            <Card padding="lg">
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Résumé IA
              </h2>
              <p className="text-white/80 leading-relaxed">
                {piece.analysis.summary}
              </p>
            </Card>
          )}

          {/* Key Elements */}
          {piece.analysis?.key_elements && piece.analysis.key_elements.length > 0 && (
            <Card padding="lg">
              <h2 className="font-display text-lg font-bold mb-4">Éléments clés</h2>
              <ul className="space-y-3">
                {piece.analysis.key_elements.map((element, index) => (
                  <li key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                    element.type === 'strength' ? 'bg-green-500/10' :
                    element.type === 'weakness' ? 'bg-red-500/10' :
                    'bg-white/5'
                  }`}>
                    <span className={
                      element.type === 'strength' ? 'text-green-400' :
                      element.type === 'weakness' ? 'text-red-400' :
                      'text-white/50'
                    }>
                      {element.type === 'strength' ? '✓' : element.type === 'weakness' ? '!' : '•'}
                    </span>
                    <div>
                      <p className="text-sm">{element.text}</p>
                      {element.page && (
                        <p className="text-xs text-indigo-400 mt-1">[Page {element.page}]</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Dates */}
          {piece.analysis?.dates && piece.analysis.dates.length > 0 && (
            <Card padding="lg">
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Dates extraites
              </h2>
              <ul className="space-y-2">
                {piece.analysis.dates.map((date, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <span className="text-indigo-400 font-mono text-sm">{date.date}</span>
                    <span className="text-sm">{date.event}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Transcription for audio */}
          {piece.type_fichier === 'audio' && piece.transcription && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <Mic className="w-5 h-5 text-green-400" />
                  Transcription
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCopy(piece.transcription?.text || '')}
                >
                  {copied ? 'Copié !' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              {/* Audio player simulation */}
              <div className="p-4 bg-white/5 rounded-xl mb-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 bg-white/10 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full w-1/3" />
                    </div>
                    <div className="flex justify-between text-xs text-white/40 mt-1">
                      <span>00:00</span>
                      <span>{piece.transcription.duration || '00:00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcription segments */}
              <div className="space-y-3 max-h-96 overflow-auto">
                {piece.transcription.segments?.map((segment, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-xs text-white/40 font-mono w-12 shrink-0">
                      {Math.floor(segment.start / 60).toString().padStart(2, '0')}:
                      {Math.floor(segment.start % 60).toString().padStart(2, '0')}
                    </span>
                    <p className="text-sm text-white/80">{segment.text}</p>
                  </div>
                )) || (
                  <p className="text-sm text-white/80">{piece.transcription.text}</p>
                )}
              </div>
            </Card>
          )}

          {/* Speakers for audio */}
          {piece.type_fichier === 'audio' && piece.transcription?.speakers && (
            <Card padding="lg">
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Intervenants détectés
              </h2>
              <div className="space-y-3">
                {piece.transcription.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                      {speaker.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{speaker.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-2 bg-indigo-500 rounded-full" 
                            style={{ width: `${speaker.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/40">{speaker.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Content */}
        <div className="space-y-6">
          {/* Extracted text for PDF */}
          {piece.type_fichier === 'pdf' && piece.contenu_extrait && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold">Texte extrait</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCopy(piece.contenu_extrait || '')}
                >
                  {copied ? 'Copié !' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="bg-white/5 rounded-xl p-4 max-h-[600px] overflow-auto">
                <pre className="text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed">
                  {piece.contenu_extrait}
                </pre>
              </div>
            </Card>
          )}

          {/* Image preview */}
          {piece.type_fichier === 'image' && (
            <Card padding="lg">
              <h2 className="font-display text-lg font-bold mb-4">Aperçu</h2>
              <div className="bg-white/5 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 text-sm">Aperçu de l&apos;image</p>
                </div>
              </div>
            </Card>
          )}

          {/* OCR text for image */}
          {piece.type_fichier === 'image' && piece.ocr_result && (
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold">Texte OCR</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCopy(piece.ocr_result?.text || '')}
                >
                  {copied ? 'Copié !' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              {piece.ocr_result.description && (
                <div className="p-3 bg-purple-500/10 rounded-lg mb-4">
                  <p className="text-sm text-white/80">{piece.ocr_result.description}</p>
                </div>
              )}

              <div className="bg-white/5 rounded-xl p-4 max-h-[400px] overflow-auto">
                <pre className="text-sm text-white/70 whitespace-pre-wrap font-sans">
                  {piece.ocr_result.text}
                </pre>
              </div>

              {/* Detected elements */}
              {piece.ocr_result.detected_elements && piece.ocr_result.detected_elements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium mb-3">Éléments détectés</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {piece.ocr_result.detected_elements.map((el, index) => (
                      <div key={index} className="p-2 bg-white/5 rounded-lg">
                        <p className="text-xs text-white/40">{el.label}</p>
                        <p className="text-sm font-medium">{el.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Processing status if not yet processed */}
          {!piece.traite && (
            <Card padding="lg" className="border-yellow-500/20">
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                <div>
                  <h3 className="font-medium">Analyse en cours</h3>
                  <p className="text-sm text-white/50">Cette pièce est en cours de traitement...</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
