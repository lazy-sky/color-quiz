import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const Navigation = () => {
  const location = useLocation()

  const links = [
    { path: '/', label: '퀴즈!' },
    { path: '/rank', label: '랭킹' },
  ]

  return (
      <nav className="flex justify-center">
          <ul className="flex gap-8">
              {links.map(({ path, label }) => (
                  <li key={path}>
                      <Link
              to={path}
              className={cn(
                'text-xl font-medium transition-all',
                location.pathname === path
                  ? 'text-white font-bold scale-110'
                  : 'text-gray-400 hover:text-white'
              )}
            >
                          {label}
                      </Link>
                  </li>
        ))}
          </ul>
      </nav>
  )
}

export default Navigation
