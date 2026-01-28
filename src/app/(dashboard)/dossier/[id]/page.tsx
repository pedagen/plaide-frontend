'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { Button, Card, Badge, Input } from '@/components/ui'
import { useDossier, usePieces, useChat, useUploadPieces, useExport } from '@/lib/hooks'
import { authAPI, analyzeAPI, Dossier, Piece, ChatMessage } from '@/lib/api'

type TabType = 'synthese' | 'chat' | 'chronologie' | 'pieces'

export default function DossierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dossierId = params.id as string
  
  const [activeTab, setActiveTab] = useState<TabType>('synthese')
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // Hooks API
  const { dossier, isLoading: dossierLoading, error: dossierError, refetch: refetchDossier } = useDossier(dossierId)
  const { pieces, isLoading: piecesLoading, refetch: refetchPieces } = usePieces(dossierId)
  const { messages, sendMessage, isSending, isLoading: chatLoading } = useChat(dossierId)
  const { uploadFiles, uploads, isUploading } = useUploadPieces(dossierId)
  const { exportPDF, exportWord, isExporting } = useExport(dossierId, dossier?.titre || 'dossier')
  
  // Auth check
  useEffect(() => {
    const isAuth = authAPI.initFromStorage()
    if (!isAuth) {
      router.push('/login')
    }
  }, [router])

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handlers
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return
    const message = chatInput
    setChatInput('')
    await sendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      await uploadFiles(files)
      refetchPieces()
      // Relancer l'analyse après upload
      await analyzeAPI.start(dossierId)
      refetchDossier()
    }
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-400" />
      case 'audio': return <Mic className="w-5 h-5 text-green-400" />
      case 'image': return <Image className="w-5 h-5 text-purple-400" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-green-500'
      case 'incident': return 'bg-yellow-500'
      case 'procedure': return 'bg-blue-500'
      case 'termination': return 'bg-red-500'
      default: return 'bg-white/50'
    }
  }

  // Loading state
  if (dossierLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-white/50">Chargement du dossier...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (dossierError || !dossier) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card padding="lg" className="text-center border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">Dossier non trouvé</h3>
          <p className="text-white/50 text-sm mb-6">{dossierError || 'Ce dossier n\'existe pas ou vous n\'y avez pas accès.'}</p>
          <Link href="/dashboard">
            <Button>Retour aux dossiers</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const synthesis = dossier.synthese

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-1 text-white/40 hover:text-white/60 text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Mes dossiers
          </Link>
          <h1 className="font-display text-2xl font-bold">{dossier.titre}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-white/50">
            <span>{dossier.client_nom}</span>
            <span>•</span>
            <span>{pieces.length} pièces</span>
            <span>•</span>
            <Badge variant={dossier.statut === 'termine' ? 'success' : 'warning'} size="sm">
              {dossier.statut === 'termine' ? 'Analysé' : 'En cours'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            leftIcon={<Download className="w-4 h-4" />}
            onClick={exportPDF}
            isLoading={isExporting}
          >
            Export PDF
          </Button>
          <label>
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.m4a"
            />
            <Button 
              as="span" 
              leftIcon={<Plus className="w-4 h-4" />}
              isLoading={isUploading}
            >
              Ajouter des pièces
            </Button>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 mb-6 shrink-0">
        {[
          { id: 'synthese', label: 'Synthèse', icon: FileText },
          { id: 'chat', label: 'Chat', icon: MessageSquare },
          { id: 'chronologie', label: 'Chronologie', icon: Calendar },
          { id: 'pieces', label: 'Pièces', icon: Paperclip },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all
              border-b-2 -mb-[2px]
              ${activeTab === tab.id 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-white/50 hover:text-white/70'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'pieces' && <span className="ml-1 text-xs text-white/40">({pieces.length})</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex gap-6">
        {/* Main content */}
        <div className="flex-1 overflow-auto pr-4">
          
          {/* TAB: SYNTHESE */}
          {activeTab === 'synthese' && synthesis && (
            <div className="space-y-6 pb-6">
              {/* Résumé */}
              <Card padding="lg">
                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Résumé exécutif
                </h2>
                <p className="text-white/80 leading-relaxed">{synthesis.summary}</p>
              </Card>

              {/* Parties */}
              {synthesis.parties && synthesis.parties.length > 0 && (
                <Card padding="lg">
                  <h2 className="font-display text-lg font-bold mb-4">Parties identifiées</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {synthesis.parties.map((party, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-xl">
                        <p className="font-medium">{party.name}</p>
                        <p className="text-sm text-white/50">{party.role} • {party.quality}</p>
                        <p className="text-xs text-indigo-400 mt-1">[{party.source}]</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Points forts */}
              {synthesis.strengths && synthesis.strengths.length > 0 && (
                <Card padding="lg" className="border-green-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-green-400">
                      Points forts ({synthesis.strengths.length})
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {synthesis.strengths.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-green-500/5 rounded-lg">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <div>
                          <p className="text-sm">{point.text}</p>
                          <p className="text-xs text-indigo-400 mt-1">[{point.source}]</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Points faibles */}
              {synthesis.weaknesses && synthesis.weaknesses.length > 0 && (
                <Card padding="lg" className="border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-red-400">
                      Points d&apos;attention ({synthesis.weaknesses.length})
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {synthesis.weaknesses.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg">
                        <span className="text-red-400 mt-0.5">!</span>
                        <div>
                          <p className="text-sm">{point.text}</p>
                          <p className="text-xs text-indigo-400 mt-1">[{point.source}]</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Points à éclaircir */}
              {synthesis.unclear_points && synthesis.unclear_points.length > 0 && (
                <Card padding="lg" className="border-yellow-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-yellow-400">Points à éclaircir</h2>
                  </div>
                  <ul className="space-y-2">
                    {synthesis.unclear_points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="text-yellow-400">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Disclaimer */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-xs text-white/40">
                  ⚠️ Cette synthèse ne constitue pas un avis juridique. Elle est générée automatiquement à partir des documents fournis. 
                  Chaque élément doit être vérifié par l&apos;avocat.
                </p>
              </div>
            </div>
          )}

          {/* TAB: CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-auto space-y-4 pb-4">
                {chatLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <h3 className="font-display font-bold mb-2">Posez vos questions</h3>
                    <p className="text-white/50 text-sm max-w-md mx-auto">
                      Interrogez le dossier en langage naturel. L&apos;IA citera toujours ses sources.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                      {[
                        'Y a-t-il des contradictions ?',
                        'Résumé des points forts',
                        'Quelles dates importantes ?'
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => { setChatInput(q); handleSendMessage(); }}
                          className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-white/60 hover:bg-white/10"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`
                          px-4 py-3 max-w-[80%] whitespace-pre-wrap
                          ${message.role === 'user' 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl rounded-br-sm' 
                            : 'bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm'
                          }
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-white/40 mb-2">Sources :</p>
                            {message.sources.map((source, i) => (
                              <p key={i} className="text-xs text-indigo-400">
                                [{source.piece}{source.page ? `, p.${source.page}` : ''}]
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Posez une question sur le dossier..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    isLoading={isSending}
                    disabled={!chatInput.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-center text-xs text-white/30 mt-3">
                  💡 L&apos;IA cite toujours ses sources. Vérifiez les références.
                </p>
              </div>
            </div>
          )}

          {/* TAB: CHRONOLOGIE */}
          {activeTab === 'chronologie' && synthesis?.key_dates && (
            <div className="space-y-4 pb-6">
              <Card padding="lg">
                <h2 className="font-display text-lg font-bold mb-6">Chronologie des faits</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                  <div className="space-y-6">
                    {synthesis.key_dates.map((event, index) => (
                      <div key={index} className="flex items-start gap-4 relative">
                        <div className={`w-8 h-8 rounded-full ${getTimelineColor(event.type)} flex items-center justify-center shrink-0 z-10`}>
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-medium">{event.event}</span>
                            <span className="text-xs text-white/40">{event.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB: PIECES */}
          {activeTab === 'pieces' && (
            <div className="space-y-4 pb-6">
              {piecesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                </div>
              ) : pieces.length === 0 ? (
                <Card padding="lg" className="text-center">
                  <Paperclip className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="font-display font-bold mb-2">Aucune pièce</h3>
                  <p className="text-white/50 text-sm mb-4">Ajoutez des pièces pour commencer l&apos;analyse</p>
                  <label>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                    <Button as="span" leftIcon={<Plus className="w-4 h-4" />}>
                      Ajouter des pièces
                    </Button>
                  </label>
                </Card>
              ) : (
                pieces.map((piece) => (
                  <Link 
                    key={piece.id}
                    href={`/dossier/${dossierId}/piece/${piece.id}`}
                  >
                    <Card padding="md" hover className="cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          piece.type_fichier === 'pdf' ? 'bg-red-500/20' :
                          piece.type_fichier === 'audio' ? 'bg-green-500/20' :
                          'bg-purple-500/20'
                        }`}>
                          {getFileIcon(piece.type_fichier)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{piece.nom_fichier}</p>
                          <p className="text-sm text-white/40">
                            {piece.type_fichier.toUpperCase()} • {formatFileSize(piece.taille_octets)}
                          </p>
                        </div>
                        <Badge variant={piece.traite ? 'success' : 'warning'} size="sm">
                          <CheckCircle className="w-3 h-3" />
                          {piece.traite ? 'Analysé' : 'En cours'}
                        </Badge>
                        <ChevronRight className="w-5 h-5 text-white/30" />
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Quick chat (visible on synthese/chronologie/pieces) */}
        {activeTab !== 'chat' && (
          <aside className="w-80 border-l border-white/5 flex flex-col shrink-0 hidden xl:flex">
            <div className="p-4 border-b border-white/5">
              <h3 className="font-display font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat rapide
              </h3>
              <p className="text-xs text-white/40 mt-1">Posez vos questions sur les pièces</p>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.slice(-4).map((message) => (
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
