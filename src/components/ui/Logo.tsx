'use client'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8 text-lg', text: 'text-lg' },
    md: { icon: 'w-12 h-12 text-2xl', text: 'text-2xl' },
    lg: { icon: 'w-16 h-16 text-3xl', text: 'text-4xl' },
  }

  return (
    <div className="flex items-center gap-3">
      <div 
        className={`${sizes[size].icon} rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center`}
      >
        ⚖️
      </div>
      {showText && (
        <span className={`font-display font-bold ${sizes[size].text}`}>
          Plaide
        </span>
      )}
    </div>
  )
}
