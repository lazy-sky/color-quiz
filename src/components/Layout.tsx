import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Navigation from './Navigation'
import { ThemeToggle } from './ThemeToggle'
import { GameModeSelect } from './GameModeSelect'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
      <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white dark:from-gray-100 dark:to-gray-200 dark:text-gray-900">
          <div className="container mx-auto px-4 py-8 h-full flex flex-col">
              <ThemeToggle />
              {isHomePage && <GameModeSelect />}
              <Navigation />
              <main className="flex-1 flex flex-col">{children}</main>
          </div>
      </div>
  )
}

export default Layout 