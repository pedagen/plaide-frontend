'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Button, Card, Input, Badge } from '@/components/ui'
import { useDossiers } from '@/lib/hooks'
import { authAPI, dossiersAPI } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { dossiers, isLoading, error, refetch } = useDossiers()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const isAuth = authAPI.initFromStorage()
    if (!isAuth) {
      router.push('/login')
    }
  }, [router])

  const filteredDossiers = dossiers.filter(d => 
    d.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type_affaire.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.client_nom.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'termine':
      case 'analyzed':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3" />
            Analysé
          </Badge>
        )
      case 'en_cours':
      case 'analyse':
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
            Nouveau
          </Badge>
        )
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      travail: 'Droit du travail',
      famille: 'Droit de la famille',
      immobilier: 'Droit immobilier',
      commercial: 'Droit commercial',
      penal: 'Droit pénal',
      autre: 'Autre',
    }
    return types[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleDelete = async (e: React.MouseEvent, dossierId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      try {
        await dossiersAPI.delete(dossierId)
        refetch()
      } catch (err) {
        console.error('Erreur lors de la suppression:', err)
      }
    }
  }

  // État de chargement
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-white/50">Chargement des dossiers...</p>
        </div>
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card padding="lg" className="text-center border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">Erreur de chargement</h3>
          <p className="text-white/50 text-sm mb-6">{error}</p>
          <Button onClick={refetch} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Réessayer
          </Button>
        </Card>
      </div>
    )
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
            {dossiers.reduce((acc, d) => acc + (d.pieces_count || 0), 0)}
          </p>
        </Card>
        <Card padding="md" className="bg-purple-500/10 border-purple-500/20">
          <p className="text-white/50 text-sm">Temps économisé</p>
          <p className="text-3xl font-display font-bold mt-1">
            ~{Math.max(1, dossiers.length * 5)}h
          </p>
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
                      <h3 className="font-medium truncate">{dossier.titre}</h3>
                      {getStatusBadge(dossier.statut)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/40">
                      <span>{dossier.client_nom}</span>
                      <span>•</span>
                      <span>{getTypeLabel(dossier.type_affaire)}</span>
                      <span>•</span>
                      <span>{dossier.pieces_count || 0} pièces</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(dossier.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button 
                    className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70"
                    onClick={(e) => handleDelete(e, dossier.id)}
                    title="Supprimer"
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
