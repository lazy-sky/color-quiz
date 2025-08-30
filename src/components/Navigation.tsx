import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const Navigation = () => {
  const location = useLocation()

  const links = [
    { path: '/', label: 'QUIZ' },
    { path: '/rank', label: 'RANKING' },
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
                  ? 'text-white dark:text-gray-900 font-bold scale-110'
                  : 'text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900'
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
