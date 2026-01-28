'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Download, 
  Eye,
  FileText,
  Mic,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Copy,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'

// Types
interface PieceBase {
  id: string
  name: string
  type: 'pdf' | 'audio' | 'image'
  size: number
  status: 'processing' | 'processed'
  uploaded_at: string
  dossier_id: string
}

interface PiecePDF extends PieceBase {
  type: 'pdf'
  pages: number
  extracted_text: string
  summary: string
  key_elements: { text: string; page: string; type: 'strength' | 'weakness' | 'info' }[]
  dates: { date: string; event: string }[]
}

interface PieceAudio extends PieceBase {
  type: 'audio'
  duration: string
  transcription: { timestamp: string; speaker: string; text: string }[]
  speakers: { id: string; name: string; percentage: number }[]
  summary: string
  notable_points: { timestamp: string; text: string }[]
}

interface PieceImage extends PieceBase {
  type: 'image'
  images_count: number
  current_image: number
  description: string
  ocr_text: string
  detected_elements: { label: string; value: string }[]
  legal_note?: string
}

type Piece = PiecePDF | PieceAudio | PieceImage

// Mock data
const mockPiecePDF: PiecePDF = {
  id: '3',
  name: 'Évaluations annuelles 2019-2024',
  type: 'pdf',
  size: 1200000,
  status: 'processed',
  uploaded_at: '2026-01-25T10:00:00Z',
  dossier_id: '1',
  pages: 32,
  extracted_text: `SAS TECHCORP
Évaluation Annuelle des Performances
Année : 2022

Collaborateur : Jean DUPONT
Poste : Responsable Commercial Senior
Département : Direction Commerciale
Responsable : Marie MARTIN, Directrice Commerciale
Date de l'entretien : 14 mars 2023

APPRÉCIATION GLOBALE : EXCELLENT

M. Dupont a réalisé une année exceptionnelle. Ses objectifs commerciaux ont été dépassés de 15%, avec un chiffre d'affaires généré de 2,3M€ contre un objectif de 2M€.

POINTS FORTS :
- Leadership naturel et capacité à fédérer les équipes
- Excellente relation client, taux de satisfaction de 94%
- Proactivité dans la prospection de nouveaux marchés
- Rigueur dans le suivi des dossiers

AXES D'AMÉLIORATION :
- Poursuivre le développement des compétences managériales
- Renforcer la coordination avec le service technique

RECOMMANDATION :
Au vu des performances exceptionnelles de M. Dupont, nous recommandons sa promotion au poste de Directeur Commercial à compter de juin 2023.`,
  summary: `Ce document contient les 6 évaluations annuelles de M. Jean Dupont pour les années 2019 à 2024. Toutes les évaluations sont positives avec des mentions "Excellent" ou "Très bon". Les objectifs ont été atteints ou dépassés chaque année. Le document mentionne une progression de carrière exemplaire et recommande une promotion en 2023.`,
  key_elements: [
    { text: '6 évaluations positives consécutives', page: '2, 7, 12, 17, 22, 27', type: 'strength' },
    { text: 'Mention "Excellent" en 2022, 2023, 2024', page: '17, 22, 27', type: 'strength' },
    { text: 'Recommandation promotion juin 2023', page: '22', type: 'strength' },
    { text: 'Aucune mention de retard ou problème', page: 'Tout le document', type: 'info' },
  ],
  dates: [
    { date: '15/03/2020', event: 'Évaluation 2019' },
    { date: '12/03/2021', event: 'Évaluation 2020' },
    { date: '18/03/2022', event: 'Évaluation 2021' },
    { date: '14/03/2023', event: 'Évaluation 2022' },
    { date: '11/03/2024', event: 'Évaluation 2023' },
  ],
}

const mockPieceAudio: PieceAudio = {
  id: '12',
  name: 'Enregistrement entretien préalable',
  type: 'audio',
  size: 15400000,
  status: 'processed',
  uploaded_at: '2026-01-25T10:00:00Z',
  dossier_id: '1',
  duration: '32:45',
  summary: `Enregistrement de l'entretien préalable au licenciement du 10 janvier 2026. Durée : 32 min. Présents : M. Dupont (salarié), Mme Martin (DRH), M. Bernard (représentant du personnel). L'employeur invoque des "difficultés relationnelles" et "un manque d'implication récent". Le salarié conteste fermement et rappelle ses évaluations positives. Aucune mention des retards évoqués dans la lettre de licenciement.`,
  speakers: [
    { id: 'jd', name: 'Jean Dupont', percentage: 45 },
    { id: 'mm', name: 'Marie Martin', percentage: 40 },
    { id: 'pb', name: 'Pierre Bernard', percentage: 15 },
  ],
  transcription: [
    { timestamp: '00:00', speaker: 'Marie Martin', text: "Bonjour Monsieur Dupont, bonjour Monsieur Bernard. Merci d'être présents pour cet entretien préalable. Je vais vous rappeler le cadre de cet entretien. Nous sommes réunis aujourd'hui pour vous exposer les motifs pour lesquels la direction envisage votre licenciement et recueillir vos observations." },
    { timestamp: '01:15', speaker: 'Jean Dupont', text: "Je vous remercie. Je suis très surpris par cette convocation. J'ai toujours eu d'excellentes évaluations et j'ai été promu Directeur Commercial il y a seulement 18 mois." },
    { timestamp: '02:30', speaker: 'Marie Martin', text: "La direction a constaté ces derniers mois des difficultés relationnelles avec certains membres de votre équipe, ainsi qu'un manque d'implication dans les projets stratégiques." },
    { timestamp: '03:45', speaker: 'Jean Dupont', text: "C'est totalement faux ! Je conteste fermement ces accusations. Mon évaluation de mars 2024 mentionne \"excellent\" sur tous les critères. Comment pouvez-vous parler de manque d'implication ?" },
    { timestamp: '05:10', speaker: 'Pierre Bernard', text: "Je souhaite noter que Monsieur Dupont n'a jamais fait l'objet d'un avertissement ou d'une sanction disciplinaire. Comment expliquez-vous ce saut direct vers un licenciement ?" },
  ],
  notable_points: [
    { timestamp: '05:32', text: "Aucune mention des retards dans l'entretien, alors que la lettre de licenciement (Pièce 8) mentionne \"des retards répétés\" comme motif." },
  ],
}

const mockPieceImage: PieceImage = {
  id: '11',
  name: 'Captures SMS avec N+1',
  type: 'image',
  size: 4200000,
  status: 'processed',
  uploaded_at: '2026-01-25T10:00:00Z',
  dossier_id: '1',
  images_count: 8,
  current_image: 1,
  description: `Image 1/8 : Capture d'écran d'une conversation WhatsApp entre "Jean" et "Marie M. (Boss)" datée du 5 octobre 2025. La conversation montre un échange où le manager demande de "faire un effort sur les horaires" et le salarié répond qu'il "a des contraintes familiales temporaires". Le ton de l'échange est cordial.`,
  ocr_text: `[08:47] Marie M. (Boss) : Bonjour Jean, j'ai noté que tu es arrivé à 9h30 ce matin. On avait dit 9h.

[08:52] Jean : Bonjour Marie, oui désolé j'ai des contraintes familiales en ce moment avec les enfants. C'est temporaire.

[09:12] Marie M. (Boss) : Je comprends. Essaie quand même de faire un effort. On a une réunion client à 10h demain.`,
  detected_elements: [
    { label: 'Plateforme', value: 'WhatsApp' },
    { label: 'Contact', value: 'Marie M. (Boss)' },
    { label: 'Date', value: '5 octobre 2025' },
    { label: 'Heure', value: '08:47 - 09:12' },
  ],
  legal_note: `Le manager reconnaît les "contraintes familiales" du salarié et n'exige pas de mesure corrective immédiate. Cet échange contredit la lettre de licenciement qui mentionne des "retards inexcusés".`,
}

// Helper functions
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const getSpeakerColor = (index: number) => {
  const colors = ['blue', 'purple', 'green', 'orange', 'pink']
  return colors[index % colors.length]
}

export default function PieceDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<'pdf' | 'audio' | 'image'>('pdf')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPage, setCurrentPage] = useState(17)
  const [currentImageIndex, setCurrentImageIndex] = useState(1)

  // Select mock data based on tab
  const piece = activeTab === 'pdf' ? mockPiecePDF : activeTab === 'audio' ? mockPieceAudio : mockPieceImage

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation tabs for demo */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-white/40">Type de pièce :</span>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'pdf' ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-white/60'}`}
        >
          📄 PDF
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'audio' ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-white/60'}`}
        >
          🎙️ Audio
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'image' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white/60'}`}
        >
          📱 Image
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link 
            href={`/dossier/${params.id}`}
            className="inline-flex items-center gap-1 text-white/40 hover:text-white/60 text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dossier
          </Link>
          <h1 className="font-display text-2xl font-bold flex items-center gap-3">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              piece.type === 'pdf' ? 'bg-red-500/20' :
              piece.type === 'audio' ? 'bg-green-500/20' : 'bg-purple-500/20'
            }`}>
              {piece.type === 'pdf' ? '📄' : piece.type === 'audio' ? '🎙️' : '📱'}
            </span>
            Pièce {piece.id} — {piece.name}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {piece.type === 'audio' ? 'Transcrit' : 'Analysé'}
            </span>
            <span>{piece.type.toUpperCase()}</span>
            <span>{formatFileSize(piece.size)}</span>
            {piece.type === 'pdf' && <span>{(piece as PiecePDF).pages} pages</span>}
            {piece.type === 'audio' && <span>{(piece as PieceAudio).duration}</span>}
            {piece.type === 'image' && <span>{(piece as PieceImage).images_count} images</span>}
            <span>Uploadé le {formatDate(piece.uploaded_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Télécharger
          </Button>
          <Button variant="secondary" leftIcon={<Eye className="w-4 h-4" />}>
            Voir l&apos;original
          </Button>
        </div>
      </div>

      {/* Content based on type */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* ========== PDF VIEW ========== */}
        {piece.type === 'pdf' && (
          <>
            {/* Left column */}
            <div className="col-span-1 space-y-6">
              {/* AI Summary */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h2 className="font-display font-bold">Résumé IA</h2>
                </div>
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <p className="text-sm text-white/80 leading-relaxed">
                    {(piece as PiecePDF).summary}
                  </p>
                </div>
              </Card>

              {/* Key Elements */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🔑</span>
                  <h2 className="font-display font-bold">Éléments clés</h2>
                </div>
                <ul className="space-y-3">
                  {(piece as PiecePDF).key_elements.map((el, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`mt-0.5 ${
                        el.type === 'strength' ? 'text-green-400' : 
                        el.type === 'weakness' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {el.type === 'strength' ? '✓' : el.type === 'weakness' ? '✗' : '!'}
                      </span>
                      <div>
                        <p className="text-sm">{el.text}</p>
                        <p className="text-xs text-white/40">Page {el.page}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Dates */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" />
                  <h2 className="font-display font-bold">Dates extraites</h2>
                </div>
                <div className="space-y-2">
                  {(piece as PiecePDF).dates.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/60">{d.event}</span>
                      <span>{d.date}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right column - Extracted text */}
            <div className="col-span-2">
              <Card padding="lg" className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h2 className="font-display font-bold">Texte extrait</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{(piece as PiecePDF).pages} pages</span>
                    <Button variant="ghost" size="sm" leftIcon={<Copy className="w-4 h-4" />}>
                      Copier
                    </Button>
                  </div>
                </div>
                
                {/* Page selector */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <span className="text-sm text-white/50">Page :</span>
                  <select 
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value={1}>1 - Page de garde</option>
                    <option value={2}>2 - Évaluation 2019</option>
                    <option value={17}>17 - Évaluation 2022</option>
                    <option value={22}>22 - Évaluation 2023</option>
                    <option value={27}>27 - Évaluation 2024</option>
                  </select>
                </div>

                {/* Text content */}
                <div className="h-[500px] overflow-auto pr-4 text-sm text-white/80 leading-relaxed">
                  <div className="p-4 bg-white/5 rounded-lg mb-4">
                    <p className="text-xs text-indigo-400 font-medium mb-2">PAGE {currentPage} — ÉVALUATION ANNUELLE 2022</p>
                    <pre className="whitespace-pre-wrap font-sans">{(piece as PiecePDF).extracted_text}</pre>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ========== AUDIO VIEW ========== */}
        {piece.type === 'audio' && (
          <>
            {/* Left column */}
            <div className="col-span-1 space-y-6">
              {/* Audio Player */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎵</span>
                  <h2 className="font-display font-bold">Lecteur audio</h2>
                </div>
                
                {/* Waveform placeholder */}
                <div className="h-16 bg-white/5 rounded-xl mb-4 flex items-center justify-center px-4">
                  <div className="flex items-center gap-1 h-full py-2">
                    {[30, 60, 80, 40, 90, 50, 70, 35, 85, 45, 65, 25].map((h, i) => (
                      <div 
                        key={i}
                        className="w-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between mb-2 text-xs text-white/40">
                  <span>05:32</span>
                  <span>{(piece as PieceAudio).duration}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full mb-4">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '17%' }} />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </Card>

              {/* AI Summary */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h2 className="font-display font-bold">Résumé IA</h2>
                </div>
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <p className="text-sm text-white/80 leading-relaxed">
                    {(piece as PieceAudio).summary}
                  </p>
                </div>
              </Card>

              {/* Speakers */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5" />
                  <h2 className="font-display font-bold">Intervenants détectés</h2>
                </div>
                <div className="space-y-3">
                  {(piece as PieceAudio).speakers.map((speaker, i) => (
                    <div key={speaker.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className={`w-8 h-8 rounded-full bg-${getSpeakerColor(i)}-500/30 flex items-center justify-center text-xs font-bold`}>
                        {speaker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{speaker.name}</p>
                        <p className="text-xs text-white/40">{speaker.percentage}% du temps de parole</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right column - Transcription */}
            <div className="col-span-2">
              <Card padding="lg" className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <h2 className="font-display font-bold">Transcription Whisper</h2>
                    <Badge variant="success" size="sm">Automatique</Badge>
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<Copy className="w-4 h-4" />}>
                    Copier
                  </Button>
                </div>

                {/* Transcription content */}
                <div className="h-[600px] overflow-auto pr-4 space-y-4">
                  {(piece as PieceAudio).transcription.map((t, i) => {
                    const speakerIndex = (piece as PieceAudio).speakers.findIndex(s => s.name === t.speaker)
                    const color = getSpeakerColor(speakerIndex)
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="shrink-0">
                          <span className="text-xs text-white/40">{t.timestamp}</span>
                        </div>
                        <div className={`flex-1 p-3 bg-${color}-500/10 rounded-lg border-l-2 border-${color}-500`}>
                          <p className={`text-xs text-${color}-400 font-medium mb-1`}>{t.speaker}</p>
                          <p className="text-sm text-white/80">{t.text}</p>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Notable points */}
                  {(piece as PieceAudio).notable_points.map((np, i) => (
                    <div key={`np-${i}`} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-xs text-yellow-400 font-medium mb-2">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        POINT NOTABLE — {np.timestamp}
                      </p>
                      <p className="text-sm text-white/80">{np.text}</p>
                    </div>
                  ))}

                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <p className="text-sm text-white/40">
                      [Suite de la transcription disponible • 27 minutes restantes]
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ========== IMAGE VIEW ========== */}
        {piece.type === 'image' && (
          <>
            {/* Left column */}
            <div className="col-span-1 space-y-6">
              {/* Thumbnails */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5" />
                  <h2 className="font-display font-bold">Images ({(piece as PieceImage).images_count})</h2>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: (piece as PieceImage).images_count }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i + 1)}
                      className={`aspect-[9/16] rounded-lg flex items-center justify-center text-xs ${
                        currentImageIndex === i + 1 
                          ? 'bg-white/10 border-2 border-indigo-500' 
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </Card>

              {/* AI Description (Vision) */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">👁️</span>
                  <h2 className="font-display font-bold">Description IA</h2>
                  <Badge variant="info" size="sm">Claude Vision</Badge>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <p className="text-sm text-white/80 leading-relaxed">
                    {(piece as PieceImage).description}
                  </p>
                </div>
              </Card>

              {/* Detected Elements */}
              <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🔍</span>
                  <h2 className="font-display font-bold">Éléments détectés</h2>
                </div>
                <ul className="space-y-3">
                  {(piece as PieceImage).detected_elements.map((el, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <div>
                        <p className="text-sm">{el.label} : <span className="text-white/80">{el.value}</span></p>
                      </div>
                    </li>
                  ))}
                  {(piece as PieceImage).legal_note && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <p className="text-sm text-green-400">Manager reconnaît &quot;contraintes familiales&quot;</p>
                    </li>
                  )}
                </ul>
              </Card>
            </div>

            {/* Right column - Preview + OCR */}
            <div className="col-span-2 space-y-6">
              {/* Image Preview */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    <h2 className="font-display font-bold">Aperçu — Image {currentImageIndex}/{(piece as PieceImage).images_count}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setCurrentImageIndex(Math.max(1, currentImageIndex - 1))}
                      disabled={currentImageIndex === 1}
                    >
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCurrentImageIndex(Math.min((piece as PieceImage).images_count, currentImageIndex + 1))}
                      disabled={currentImageIndex === (piece as PieceImage).images_count}
                    >
                      Suivant <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Simulated phone screenshot */}
                <div className="max-w-xs mx-auto">
                  <div className="bg-[#1a1a2e] rounded-3xl p-4 border border-white/10">
                    {/* Status bar */}
                    <div className="flex justify-between text-xs text-white/50 mb-3 px-2">
                      <span>09:12</span>
                      <span>📶 🔋</span>
                    </div>
                    {/* Header */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-sm">MM</div>
                      <div>
                        <p className="font-medium text-sm">Marie M. (Boss)</p>
                        <p className="text-xs text-white/40">en ligne</p>
                      </div>
                    </div>
                    {/* Messages */}
                    <div className="space-y-3 px-2">
                      <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]">
                          <p className="text-sm">Bonjour Jean, j&apos;ai noté que tu es arrivé à 9h30 ce matin. On avait dit 9h.</p>
                          <p className="text-[10px] text-white/40 text-right mt-1">08:47</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-green-600 rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]">
                          <p className="text-sm">Bonjour Marie, oui désolé j&apos;ai des contraintes familiales en ce moment. C&apos;est temporaire.</p>
                          <p className="text-[10px] text-white/60 text-right mt-1">08:52 ✓✓</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]">
                          <p className="text-sm">Je comprends. Essaie quand même de faire un effort.</p>
                          <p className="text-[10px] text-white/40 text-right mt-1">09:12</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* OCR Text */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h2 className="font-display font-bold">Texte extrait (OCR)</h2>
                  </div>
                  <Button variant="ghost" size="sm" leftIcon={<Copy className="w-4 h-4" />}>
                    Copier
                  </Button>
                </div>
                <div className="p-4 bg-white/5 rounded-xl text-sm text-white/80 whitespace-pre-wrap">
                  {(piece as PieceImage).ocr_text}
                </div>
                
                {(piece as PieceImage).legal_note && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400 font-medium mb-1">💡 POINT JURIDIQUE</p>
                    <p className="text-sm text-white/80">{(piece as PieceImage).legal_note}</p>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
