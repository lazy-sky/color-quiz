import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
      <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 rounded-full p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-gray-800/30 dark:hover:bg-gray-800/50 transition-colors shadow-lg"
      aria-label="Toggle theme"
    >
          {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-yellow-400 drop-shadow" />
      ) : (
          <Moon className="h-6 w-6 text-gray-100" />
      )}
      </button>
  )
} 