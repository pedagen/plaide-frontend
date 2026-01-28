'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Folder, 
  Plus, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Star,
  Trash2,
  HelpCircle
} from 'lucide-react'
import { Logo, Button } from '@/components/ui'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigation = [
    { name: 'Mes dossiers', href: '/dashboard', icon: Folder },
    { name: 'Nouveau dossier', href: '/dashboard/new', icon: Plus },
    { name: 'Favoris', href: '/dashboard/favorites', icon: Star },
    { name: 'Corbeille', href: '/dashboard/trash', icon: Trash2 },
  ]

  const secondaryNav = [
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
    { name: 'Aide', href: '/dashboard/help', icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/5 border border-white/10 lg:hidden"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a12] border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link href="/dashboard">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Main navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Secondary navigation */}
          <div className="p-4 border-t border-white/5 space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* User section */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Utilisateur</p>
                <p className="text-xs text-white/40 truncate">user@email.com</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-0">
        <div className="min-h-screen p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
