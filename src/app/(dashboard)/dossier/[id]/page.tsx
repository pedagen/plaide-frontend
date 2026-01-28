'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Download, 
  Plus, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Paperclip,
  Send,
  Mic,
  Image,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react'
import { Button, Card, Badge, Input } from '@/components/ui'

// Mock data pour la démo
const mockDossier = {
  id: '1',
  name: 'Dupont c/ TechCorp — Licenciement',
  type: 'Droit du travail',
  status: 'analyzed',
  pieces_count: 12,
  created_at: '2026-01-25T10:00:00Z',
  synthesis: {
    summary: `Litige prud'homal opposant M. Jean Dupont (salarié, Directeur Commercial) à SAS TechCorp (employeur) suite à un licenciement pour insuffisance professionnelle notifié le 15 janvier 2026. Le salarié, embauché le 1er mars 2019 avec une ancienneté de 6 ans et 10 mois, conteste le motif invoqué au regard de ses évaluations annuelles positives jusqu'en 2024.`,
    parties: [
      { name: 'Jean Dupont', role: 'Demandeur', quality: 'Directeur Commercial', source: 'Pièce 1, p.1' },
      { name: 'SAS TechCorp', role: 'Défendeur', quality: 'Employeur', source: 'Pièce 1, p.1' },
    ],
    strengths: [
      { text: 'Évaluations annuelles "Excellent" de 2019 à 2024', source: 'Pièce 3, p.2-8', importance: 'high' },
      { text: 'Promotion au poste de Directeur Commercial en juin 2023', source: 'Pièce 5, p.1', importance: 'high' },
      { text: 'Augmentation de 15% accordée en janvier 2024', source: 'Pièce 6, p.1', importance: 'medium' },
      { text: 'Aucun avertissement préalable au licenciement', source: 'Pièce 8', importance: 'high' },
    ],
    weaknesses: [
      { text: '2 retards signalés en octobre 2025', source: 'Pièce 9, p.1', importance: 'low' },
      { text: 'Objectifs commerciaux T4 2025 atteints à 78%', source: 'Pièce 10, p.3', importance: 'medium' },
    ],
    key_dates: [
      { date: '01/03/2019', event: 'Embauche', type: 'contract' },
      { date: '15/06/2023', event: 'Promotion', type: 'contract' },
      { date: '10/01/2026', event: 'Entretien préalable', type: 'procedure' },
      { date: '15/01/2026', event: 'Licenciement', type: 'termination' },
    ],
    unclear_points: [
      'Le changement de périmètre commercial mentionné dans les mails n\'est pas formalisé par un avenant',
      'La date exacte de la notification des objectifs T4 2025 n\'est pas claire',
      'Y a-t-il eu d\'autres salariés licenciés dans la même période ?',
    ],
  },
  timeline: [
    { date: '2019-03-01', title: 'Embauche', description: 'Embauche de M. Dupont en qualité de Commercial Senior', type: 'contract', source: 'Pièce 1' },
    { date: '2023-06-15', title: 'Promotion', description: 'Promotion au poste de Directeur Commercial', type: 'contract', source: 'Pièce 5' },
    { date: '2024-01-15', title: 'Augmentation', description: 'Augmentation de salaire de 15%', type: 'contract', source: 'Pièce 6' },
    { date: '2025-10-03', title: 'Premier retard', description: 'Premier retard signalé par email de la RH', type: 'incident', source: 'Pièce 9' },
    { date: '2025-10-17', title: 'Deuxième retard', description: 'Deuxième retard signalé', type: 'incident', source: 'Pièce 9' },
    { date: '2026-01-10', title: 'Entretien préalable', description: 'Entretien préalable au licenciement', type: 'procedure', source: 'Pièce 8' },
    { date: '2026-01-15', title: 'Licenciement', description: 'Notification du licenciement pour insuffisance professionnelle', type: 'termination', source: 'Pièce 8' },
  ],
  pieces: [
    { id: '1', name: 'Contrat de travail', type: 'pdf', size: 245000, pages: 12, status: 'processed' },
    { id: '2', name: 'Bulletins de paie 2024-2025', type: 'pdf', size: 890000, pages: 24, status: 'processed' },
    { id: '3', name: 'Évaluations annuelles 2019-2024', type: 'pdf', size: 1200000, pages: 32, status: 'processed' },
    { id: '5', name: 'Avenant promotion juin 2023', type: 'pdf', size: 125000, pages: 4, status: 'processed' },
    { id: '6', name: 'Courrier augmentation janv 2024', type: 'pdf', size: 85000, pages: 2, status: 'processed' },
    { id: '8', name: 'Lettre de licenciement', type: 'pdf', size: 156000, pages: 3, status: 'processed' },
    { id: '9', name: 'Emails RH retards', type: 'pdf', size: 234000, pages: 5, status: 'processed' },
    { id: '10', name: 'Objectifs commerciaux T4 2025', type: 'pdf', size: 567000, pages: 8, status: 'processed' },
    { id: '11', name: 'Captures SMS avec N+1', type: 'image', size: 4200000, pages: 8, status: 'processed' },
    { id: '12', name: 'Enregistrement entretien préalable', type: 'audio', size: 15400000, duration: '32 min', status: 'processed' },
  ],
}

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Y a-t-il des contradictions dans les évaluations ?',
    timestamp: '14:32',
  },
  {
    id: '2',
    role: 'assistant',
    content: `Oui, il y a une contradiction notable :

• Les évaluations 2019-2024 mentionnent toutes "Excellent" ou "Très bon" [Pièce 3]

• Cependant, la lettre de licenciement invoque une "insuffisance professionnelle persistante" [Pièce 8, p.2]

Cette contradiction pourrait constituer un élément fort pour contester le motif du licenciement.`,
    timestamp: '14:32',
    sources: [
      { piece: 'Pièce 3', page: '2-8' },
      { piece: 'Pièce 8', page: '2' },
    ],
  },
  {
    id: '3',
    role: 'user',
    content: 'Quel est le montant du salaire ?',
    timestamp: '14:35',
  },
  {
    id: '4',
    role: 'assistant',
    content: `D'après le contrat de travail et les bulletins de paie :

**Salaire brut mensuel : 6 250 €**

Soit 75 000 € brut annuel + variable pouvant atteindre 15% (non mentionné dans les pièces de 2025).`,
    timestamp: '14:35',
    sources: [
      { piece: 'Pièce 2', page: '3' },
      { piece: 'Pièce 7', page: '1' },
    ],
  },
]

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: { piece: string; page: string }[]
}

type TabType = 'synthese' | 'chat' | 'chronologie' | 'pieces'

export default function DossierPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<TabType>('synthese')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [isSending, setIsSending] = useState(false)

  const dossier = mockDossier

  const tabs = [
    { id: 'synthese' as const, label: 'Synthèse', icon: FileText, emoji: '📋' },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare, emoji: '💬' },
    { id: 'chronologie' as const, label: 'Chronologie', icon: Calendar, emoji: '📅' },
    { id: 'pieces' as const, label: 'Pièces', icon: Paperclip, emoji: '📎' },
  ]

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }

    setChatMessages([...chatMessages, userMessage])
    setChatInput('')
    setIsSending(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Je recherche dans les documents du dossier...\n\n(Cette réponse est simulée. En production, elle sera générée par l\'IA à partir des pièces du dossier.)',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }
      setChatMessages(prev => [...prev, assistantMessage])
      setIsSending(false)
    }, 1500)
  }

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

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-green-500'
      case 'incident': return 'bg-yellow-500'
      case 'procedure': return 'bg-orange-500'
      case 'termination': return 'bg-red-500'
      default: return 'bg-indigo-500'
    }
  }

  const getTimelineTextColor = (type: string) => {
    switch (type) {
      case 'contract': return 'text-green-400'
      case 'incident': return 'text-yellow-400'
      case 'procedure': return 'text-orange-400'
      case 'termination': return 'text-red-400'
      default: return 'text-indigo-400'
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-400" />
      case 'audio': return <Mic className="w-6 h-6 text-green-400" />
      case 'image': return <Image className="w-6 h-6 text-purple-400" />
      default: return <FileText className="w-6 h-6 text-white/40" />
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1 text-white/40 hover:text-white/60 text-sm mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux dossiers
            </Link>
            <h1 className="font-display text-2xl font-bold">{dossier.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Analysé
              </span>
              <span>{dossier.type}</span>
              <span>{dossier.pieces_count} pièces</span>
              <span>Créé le {formatDate(dossier.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              Exporter
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Ajouter des pièces
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                  : 'text-white/60 hover:bg-white/5'
                }
              `}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          
          {/* ========== TAB: SYNTHÈSE ========== */}
          {activeTab === 'synthese' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Résumé exécutif */}
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl">
                    📋
                  </div>
                  <h2 className="font-display text-lg font-bold">Résumé exécutif</h2>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {dossier.synthesis.summary}
                </p>
              </Card>

              {/* Parties */}
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">
                    👥
                  </div>
                  <h2 className="font-display text-lg font-bold">Parties identifiées</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {dossier.synthesis.parties.map((party, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl">
                      <p className="text-xs text-white/40 mb-1">{party.role.toUpperCase()}</p>
                      <p className="font-medium">{party.name}</p>
                      <p className="text-sm text-white/60">{party.quality}</p>
                      <p className="text-xs text-white/40 mt-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs cursor-pointer hover:bg-indigo-500/30">
                          [{party.source}]
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Points forts / faibles */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Points forts */}
                <Card padding="lg" className="border-green-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-green-400">Points forts</h2>
                  </div>
                  <ul className="space-y-3">
                    {dossier.synthesis.strengths.map((point, index) => (
                      <li key={index} className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-sm">{point.text}</p>
                        <p className="text-xs text-white/40 mt-1">
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs cursor-pointer hover:bg-indigo-500/30">
                            [{point.source}]
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Points faibles */}
                <Card padding="lg" className="border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-red-400">Points faibles</h2>
                  </div>
                  <ul className="space-y-3">
                    {dossier.synthesis.weaknesses.map((point, index) => (
                      <li key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm">{point.text}</p>
                        <p className="text-xs text-white/40 mt-1">
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs cursor-pointer hover:bg-indigo-500/30">
                            [{point.source}]
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Dates clés */}
              <Card padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-xl">
                    📅
                  </div>
                  <h2 className="font-display text-lg font-bold">Dates clés</h2>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  {dossier.synthesis.key_dates.map((item, index) => (
                    <div key={index} className="text-center p-4 bg-white/5 rounded-xl">
                      <p className={`text-xl font-display font-bold ${item.type === 'termination' ? 'text-red-400' : 'gradient-text'}`}>
                        {item.date}
                      </p>
                      <p className="text-sm text-white/50 mt-1">{item.event}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Points à éclaircir */}
              <Card padding="lg" className="border-yellow-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-yellow-400">Points à éclaircir</h2>
                </div>
                <ul className="space-y-2">
                  {dossier.synthesis.unclear_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="text-yellow-400">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Disclaimer */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-xs text-white/40">
                  ⚠️ Cette synthèse ne constitue pas un avis juridique. Elle est générée automatiquement à partir des documents fournis. 
                  Chaque élément doit être vérifié par l&apos;avocat.
                </p>
              </div>
            </div>
          )}

          {/* ========== TAB: CHAT ========== */}
          {activeTab === 'chat' && (
            <div className="max-w-3xl mx-auto h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-auto space-y-4 pb-4">
                {chatMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        px-4 py-3 max-w-[85%] 
                        ${message.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl rounded-br-sm' 
                          : 'bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm'
                        }
                      `}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.sources && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.sources.map((source, i) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs cursor-pointer hover:bg-indigo-500/30"
                            >
                              [{source.piece}, p.{source.page}]
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-white/30 mt-2">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-white/5 pt-4">
                <div className="relative">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Posez une question sur le dossier..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isSending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center hover:shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-white/30 mt-2 text-center">
                  Les réponses citent toujours leurs sources
                </p>
              </div>
            </div>
          )}

          {/* ========== TAB: CHRONOLOGIE ========== */}
          {activeTab === 'chronologie' && (
            <div className="max-w-3xl mx-auto">
              <div className="relative pl-8">
                {/* Timeline line */}
                <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 to-pink-500" />
                
                {dossier.timeline.map((event, index) => (
                  <div key={index} className="relative pb-8 last:pb-0">
                    {/* Dot */}
                    <div className={`absolute left-0 w-6 h-6 rounded-full ${getTimelineColor(event.type)} border-4 border-[#0a0a12]`} />
                    
                    {/* Content */}
                    <Card padding="md" className="ml-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-bold ${getTimelineTextColor(event.type)}`}>
                          {formatDate(event.date)}
                        </span>
                        <Badge 
                          variant={
                            event.type === 'contract' ? 'success' : 
                            event.type === 'incident' ? 'warning' : 
                            event.type === 'termination' ? 'error' : 'info'
                          }
                          size="sm"
                        >
                          {event.title}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/80">{event.description}</p>
                      <p className="text-xs text-white/40 mt-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs cursor-pointer hover:bg-indigo-500/30">
                          [{event.source}]
                        </span>
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== TAB: PIÈCES ========== */}
          {activeTab === 'pieces' && (
            <div className="max-w-4xl mx-auto space-y-3">
              {dossier.pieces.map((piece) => (
                <Link 
                  key={piece.id}
                  href={`/dossier/${params.id}/piece/${piece.id}`}
                >
                  <Card 
                    padding="md" 
                    hover 
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        piece.type === 'pdf' ? 'bg-red-500/20' :
                        piece.type === 'audio' ? 'bg-green-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {getFileIcon(piece.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">Pièce {piece.id} — {piece.name}</p>
                        <p className="text-sm text-white/40">
                          {piece.type.toUpperCase()} • {formatFileSize(piece.size)} 
                          {piece.pages && ` • ${piece.pages} pages`}
                          {piece.duration && ` • ${piece.duration}`}
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3" />
                        {piece.type === 'audio' ? 'Transcrit' : 'Analysé'}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </div>
                  </Card>
                </Link>
              ))}
              
              {/* Add more */}
              <Card 
                padding="md" 
                hover 
                className="cursor-pointer border-dashed border-white/20"
              >
                <div className="flex items-center justify-center gap-3 py-4 text-white/50 hover:text-white/70">
                  <Plus className="w-5 h-5" />
                  <span>Ajouter des pièces</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right sidebar - Quick chat (visible on synthese/chronologie/pieces) */}
        {activeTab !== 'chat' && (
          <aside className="w-80 border-l border-white/5 flex flex-col shrink-0 hidden xl:flex">
            <div className="p-4 border-b border-white/5">
              <h3 className="font-display font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat rapide
              </h3>
              <p className="text-xs text-white/40 mt-1">Posez vos questions sur les pièces</p>
            </div>
            
            {/* Mini chat */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {chatMessages.slice(-4).map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      px-3 py-2 max-w-[90%] text-xs
                      ${message.role === 'user' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl rounded-br-sm' 
                        : 'bg-white/5 border border-white/10 rounded-xl rounded-bl-sm'
                      }
                    `}
                  >
                    <p className="line-clamp-3">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <button 
                onClick={() => setActiveTab('chat')}
                className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300"
              >
                Ouvrir le chat complet →
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
