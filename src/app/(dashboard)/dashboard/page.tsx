'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Mic, 
  Image,
  MoreVertical,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Button, Card, Input, Badge } from '@/components/ui'

// Mock data
const mockDossiers = [
  {
    id: '1',
    name: 'Dupont c/ TechCorp - Licenciement',
    type: 'Droit du travail',
    pieces_count: 12,
    created_at: '2026-01-25T10:00:00Z',
    status: 'analyzed' as const,
    file_types: ['pdf', 'audio', 'image'],
  },
  {
    id: '2',
    name: 'Martin - Divorce contentieux',
    type: 'Droit de la famille',
    pieces_count: 8,
    created_at: '2026-01-24T14:30:00Z',
    status: 'analyzing' as const,
    file_types: ['pdf', 'image'],
  },
  {
    id: '3',
    name: 'SAS Innov c/ SARL Tech',
    type: 'Droit commercial',
    pieces_count: 23,
    created_at: '2026-01-20T09:15:00Z',
    status: 'analyzed' as const,
    file_types: ['pdf'],
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dossiers] = useState(mockDossiers)

  const filteredDossiers = dossiers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'analyzed':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3" />
            Analysé
          </Badge>
        )
      case 'analyzing':
        return (
          <Badge variant="warning" size="sm">
            <Loader2 className="w-3 h-3 animate-spin" />
            En cours
          </Badge>
        )
      default:
        return (
          <Badge variant="default" size="sm">
            En attente
          </Badge>
        )
    }
  }

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-3 h-3" />
      case 'audio':
        return <Mic className="w-3 h-3" />
      case 'image':
        return <Image className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Mes dossiers</h1>
          <p className="text-white/50 mt-1">
            {dossiers.length} dossier{dossiers.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button leftIcon={<Plus className="w-5 h-5" />}>
            Nouveau dossier
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un dossier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <Button variant="secondary" leftIcon={<Filter className="w-4 h-4" />}>
          Filtres
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card padding="md" className="bg-indigo-500/10 border-indigo-500/20">
          <p className="text-white/50 text-sm">Dossiers actifs</p>
          <p className="text-3xl font-display font-bold mt-1">{dossiers.length}</p>
        </Card>
        <Card padding="md" className="bg-green-500/10 border-green-500/20">
          <p className="text-white/50 text-sm">Pièces analysées</p>
          <p className="text-3xl font-display font-bold mt-1">
            {dossiers.reduce((acc, d) => acc + d.pieces_count, 0)}
          </p>
        </Card>
        <Card padding="md" className="bg-purple-500/10 border-purple-500/20">
          <p className="text-white/50 text-sm">Temps économisé</p>
          <p className="text-3xl font-display font-bold mt-1">~15h</p>
        </Card>
      </div>

      {/* Dossiers list */}
      <div className="space-y-4">
        {filteredDossiers.length === 0 ? (
          <Card padding="lg" className="text-center">
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">Aucun dossier trouvé</h3>
              <p className="text-white/50 text-sm mb-6">
                {searchQuery 
                  ? 'Essayez avec d\'autres termes de recherche'
                  : 'Créez votre premier dossier pour commencer'
                }
              </p>
              {!searchQuery && (
                <Link href="/dashboard/new">
                  <Button leftIcon={<Plus className="w-5 h-5" />}>
                    Créer un dossier
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          filteredDossiers.map((dossier) => (
            <Link key={dossier.id} href={`/dossier/${dossier.id}`}>
              <Card hover padding="md" className="group">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium truncate">{dossier.name}</h3>
                      {getStatusBadge(dossier.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/40">
                      <span>{dossier.type}</span>
                      <span>•</span>
                      <span>{dossier.pieces_count} pièces</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(dossier.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* File types */}
                  <div className="hidden sm:flex items-center gap-2">
                    {dossier.file_types.map((type) => (
                      <span
                        key={type}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40"
                      >
                        {getFileTypeIcon(type)}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <button 
                    className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70"
                    onClick={(e) => {
                      e.preventDefault()
                      // TODO: Show dropdown menu
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
