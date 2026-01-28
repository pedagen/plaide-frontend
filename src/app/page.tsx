'use client'

import Link from 'next/link'
import { ArrowRight, FileText, Mic, Image, Zap, Shield, Clock } from 'lucide-react'
import { Logo, Button } from '@/components/ui'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Connexion</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Commencer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-indigo-300">Offre Fondateur • 49€/mois à vie</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="gradient-text">5 heures</span> de lecture
            <br />
            <span className="text-white/90">en</span>{' '}
            <span className="gradient-text">5 minutes</span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Plaide analyse automatiquement vos dossiers juridiques — PDF, audio, images — 
            et génère une synthèse structurée avec points forts, points faibles et chronologie.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Essayer gratuitement
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="secondary" size="lg">
                Voir la démo
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-white/40 mt-4">
            Pas de carte bancaire requise • 14 jours d&apos;essai gratuit
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Tous vos formats, une seule analyse
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Uploadez n&apos;importe quel type de document. Notre IA comprend tout.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-8 text-center group hover:border-indigo-500/30 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Documents PDF</h3>
              <p className="text-white/50 text-sm">
                Contrats, courriers, conclusions, jugements, pièces administratives...
              </p>
            </div>
            
            <div className="glass-card p-8 text-center group hover:border-indigo-500/30 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Enregistrements audio</h3>
              <p className="text-white/50 text-sm">
                Entretiens, réunions, appels téléphoniques, audiences enregistrées...
              </p>
            </div>
            
            <div className="glass-card p-8 text-center group hover:border-indigo-500/30 transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Images et SMS</h3>
              <p className="text-white/50 text-sm">
                Captures d&apos;écran, SMS, WhatsApp, photos de documents...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Concentrez-vous sur ce qui compte :{' '}
                <span className="gradient-text">défendre</span>
              </h2>
              <p className="text-white/60 mb-8">
                Un avocat épuisé, c&apos;est un client moins bien défendu. 
                Plaide vous libère des heures de lecture pour que vous puissiez 
                vous concentrer sur la stratégie et l&apos;accompagnement de vos clients.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Gagnez 5 heures par dossier</h4>
                    <p className="text-sm text-white/50">
                      Analyse automatique de toutes vos pièces en quelques minutes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ne ratez rien d&apos;important</h4>
                    <p className="text-sm text-white/50">
                      L&apos;IA repère les contradictions et les points clés automatiquement
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Vos données restent vôtres</h4>
                    <p className="text-sm text-white/50">
                      Hébergement en France, chiffrement, jamais utilisé pour l&apos;entraînement
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-display font-bold">Exemple de synthèse</h4>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  Généré en 3 min
                </span>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/40 text-xs mb-2">RÉSUMÉ</p>
                  <p className="text-white/80">
                    Litige prud&apos;homal opposant Jean Dupont (salarié depuis 2019) 
                    à SAS TechCorp suite à un licenciement pour insuffisance professionnelle.
                  </p>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-xs mb-2">✅ POINTS FORTS</p>
                  <p className="text-white/80">
                    Évaluations excellent de 2019 à 2024 [Pièce 3] • 
                    Promotion en 2023 [Pièce 5]
                  </p>
                </div>
                
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-xs mb-2">⚠️ POINTS FAIBLES</p>
                  <p className="text-white/80">
                    2 retards notifiés en octobre 2025 [Pièce 9]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Un prix simple, transparent
          </h2>
          <p className="text-white/50 mb-12">
            Pas de surprise, pas de frais cachés
          </p>
          
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-bold rounded-bl-xl">
              OFFRE FONDATEUR
            </div>
            
            <div className="pt-4">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-display font-bold">49€</span>
                <span className="text-white/50">/mois</span>
              </div>
              <p className="text-sm text-indigo-400 mb-6">au lieu de 149€ — À VIE</p>
              
              <ul className="space-y-3 text-left max-w-xs mx-auto mb-8">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                  <span>Dossiers illimités</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                  <span>Tous les formats (PDF, audio, images)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                  <span>Chat IA avec sources citées</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                  <span>Export PDF et Word</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                  <span>Support prioritaire</span>
                </li>
              </ul>
              
              <Link href="/signup">
                <Button size="lg" className="w-full">
                  Devenir Fondateur
                </Button>
              </Link>
              
              <p className="text-xs text-white/40 mt-4">
                Limité aux 100 premiers inscrits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-white/40">
            © 2026 Plaide. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
