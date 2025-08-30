import { ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
      <div className="h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 py-8 h-full flex flex-col">
              <Navigation />
              <main className="flex-1 flex flex-col">{children}</main>
          </div>
      </div>
  )
}

export default Layout 