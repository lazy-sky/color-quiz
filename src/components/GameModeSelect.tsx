import { useRecoilState } from 'recoil'
import { Sun, Moon, Shuffle } from 'lucide-react'
import { gameModeState, type GameMode } from '@/store/atom'

const modes: { value: GameMode; label: string; icon: JSX.Element }[] = [
  { value: 'light', label: '밝은 색 찾기', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: '어두운 색 찾기', icon: <Moon className="w-4 h-4" /> },
  { value: 'random', label: '랜덤 모드', icon: <Shuffle className="w-4 h-4" /> },
]

export const GameModeSelect = () => {
  const [gameMode, setGameMode] = useRecoilState(gameModeState)

  return (
      <div className="fixed top-4 left-4 flex flex-col gap-2">
          {modes.map(({ value, label, icon }) => (
              <button
          key={value}
          onClick={() => setGameMode(value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            gameMode === value
              ? 'bg-white/20 text-white dark:bg-gray-800/40 dark:text-gray-100'
              : 'text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-100'
          }`}
          title={label}
        >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
              </button>
      ))}
      </div>
  )
} 