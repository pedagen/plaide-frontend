'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Briefcase, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button, Card, Input, DropZone } from '@/components/ui'
import { dossiersAPI, piecesAPI, analyzeAPI, APIError } from '@/lib/api'

const caseTypes = [
  { id: 'travail', name: 'Droit du travail', icon: '👔', description: 'Licenciement, harcèlement, contrat...' },
  { id: 'famille', name: 'Droit de la famille', icon: '👨‍👩‍👧', description: 'Divorce, garde, pension...' },
  { id: 'commercial', name: 'Droit commercial', icon: '🏢', description: 'Litiges, contrats, sociétés...' },
  { id: 'penal', name: 'Droit pénal', icon: '⚖️', description: 'Défense, constitution partie civile...' },
  { id: 'immobilier', name: 'Droit immobilier', icon: '🏠', description: 'Bail, copropriété, vente...' },
  { id: 'autre', name: 'Autre', icon: '📁', description: 'Autre type de dossier' },
]

export default function NewDossierPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [titre, setTitre] = useState('')
  const [clientNom, setClientNom] = useState('')
  const [type, setType] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!titre || !clientNom || !type) return

    setIsCreating(true)
    setError('')

    try {
      // 1. Créer le dossier
      const dossier = await dossiersAPI.create({
        titre,
        client_nom: clientNom,
        type_affaire: type,
      })

      // 2. Upload les fichiers si présents
      if (files.length > 0) {
        setUploadProgress({ current: 0, total: files.length })
        
        for (let i = 0; i < files.length; i++) {
          await piecesAPI.upload(dossier.id, files[i])
          setUploadProgress({ current: i + 1, total: files.length })
        }
      }

      // 3. Lancer l'analyse si des fichiers ont été uploadés
      if (files.length > 0) {
        await analyzeAPI.start(dossier.id)
      }

      // 4. Rediriger vers le dossier
      router.push(`/dossier/${dossier.id}`)
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message)
      } else {
        setError('Une erreur est survenue lors de la création du dossier')
      }
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/70 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux dossiers
        </Link>
        <h1 className="font-display text-3xl font-bold">Nouveau dossier</h1>
        <p className="text-white/50 mt-1">
          Créez un nouveau dossier et uploadez vos pièces
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300
                ${step >= s 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white/5 text-white/40'
                }
              `}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? 'bg-indigo-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Info */}
      {step === 1 && (
        <Card padding="lg">
          <h2 className="font-display text-xl font-bold mb-6">
            Informations du dossier
          </h2>
          
          <div className="space-y-6">
            <Input
              label="Titre du dossier"
              placeholder="Ex: Licenciement abusif"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              leftIcon={<Briefcase className="w-5 h-5" />}
            />

            <Input
              label="Nom du client"
              placeholder="Ex: M. Jean Dupont"
              value={clientNom}
              onChange={(e) => setClientNom(e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
            />

            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">
                Type de dossier
              </label>
              <div className="grid grid-cols-2 gap-3">
                {caseTypes.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setType(ct.id)}
                    className={`
                      p-4 rounded-xl text-left transition-all duration-200
                      ${type === ct.id 
                        ? 'bg-indigo-500/20 border-2 border-indigo-500' 
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }
                    `}
                  >
                    <span className="text-2xl mb-2 block">{ct.icon}</span>
                    <p className="font-medium text-sm">{ct.name}</p>
                    <p className="text-xs text-white/40 mt-1">{ct.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={() => setStep(2)}
              disabled={!titre || !clientNom || !type}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Continuer
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Upload */}
      {step === 2 && (
        <Card padding="lg">
          <h2 className="font-display text-xl font-bold mb-2">
            Ajoutez vos pièces
          </h2>
          <p className="text-white/50 text-sm mb-6">
            Vous pourrez en ajouter d&apos;autres plus tard
          </p>
          
          <DropZone
            onFilesSelected={setFiles}
            multiple
            maxFiles={20}
            maxSize={50}
          />

          <div className="flex justify-between mt-8">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button
              onClick={() => setStep(3)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {files.length > 0 ? 'Continuer' : 'Passer cette étape'}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <Card padding="lg">
          <h2 className="font-display text-xl font-bold mb-6">
            Récapitulatif
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm mb-1">Titre du dossier</p>
              <p className="font-medium">{titre}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm mb-1">Client</p>
              <p className="font-medium">{clientNom}</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm mb-1">Type</p>
              <p className="font-medium">
                {caseTypes.find(ct => ct.id === type)?.name}
              </p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-white/50 text-sm mb-1">Pièces</p>
              <p className="font-medium">
                {files.length > 0 
                  ? `${files.length} fichier${files.length > 1 ? 's' : ''} à uploader`
                  : 'Aucune pièce (vous pourrez en ajouter après)'
                }
              </p>
            </div>
          </div>

          {/* Upload progress */}
          {uploadProgress && (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mt-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <div className="flex-1">
                  <p className="text-sm text-indigo-300">
                    Upload en cours... ({uploadProgress.current}/{uploadProgress.total})
                  </p>
                  <div className="h-2 bg-white/10 rounded-full mt-2">
                    <div 
                      className="h-2 bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!uploadProgress && (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mt-6">
              <p className="text-sm text-indigo-300">
                💡 Une fois le dossier créé, l&apos;analyse commencera automatiquement. 
                Vous recevrez une notification quand ce sera terminé.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="secondary" onClick={() => setStep(2)} disabled={isCreating}>
              Retour
            </Button>
            <Button
              onClick={handleCreate}
              isLoading={isCreating}
              disabled={isCreating}
            >
              Créer le dossier
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
