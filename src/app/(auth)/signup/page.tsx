'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import { Logo, Button, Input, Card } from '@/components/ui'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // TODO: Implement Supabase auth
      console.log('Signup:', { name, email, password })
      
      // Simulate signup
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/dashboard')
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <p className="text-white/50 mt-4">
            Créez votre compte Plaide
          </p>
        </div>

        {/* Offer badge */}
        <div className="glass-card p-4 mb-6 border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Offre Fondateur</p>
              <p className="text-xs text-white/50">49€/mois à vie au lieu de 149€</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Nom complet"
              type="text"
              placeholder="Me Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <Input
              label="Email professionnel"
              type="email"
              placeholder="vous@cabinet.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Min. 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="space-y-2 text-xs text-white/50">
              <p className="font-medium text-white/70">Votre mot de passe doit contenir :</p>
              <ul className="space-y-1">
                <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-400' : ''}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${password.length >= 8 ? 'bg-green-500/20' : 'bg-white/10'}`}>
                    {password.length >= 8 ? '✓' : ''}
                  </span>
                  Au moins 8 caractères
                </li>
                <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-400' : ''}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${/[A-Z]/.test(password) ? 'bg-green-500/20' : 'bg-white/10'}`}>
                    {/[A-Z]/.test(password) ? '✓' : ''}
                  </span>
                  Une majuscule
                </li>
                <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-400' : ''}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${/[0-9]/.test(password) ? 'bg-green-500/20' : 'bg-white/10'}`}>
                    {/[0-9]/.test(password) ? '✓' : ''}
                  </span>
                  Un chiffre
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Créer mon compte
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-8">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="underline">CGU</a> et{' '}
          <a href="#" className="underline">Politique de confidentialité</a>
        </p>
      </div>
    </div>
  )
}
