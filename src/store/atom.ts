import { atom } from 'recoil'

export type GameMode = 'light' | 'dark' | 'random'

export const scoreState = atom<number>({
  key: 'scoreState',
  default: 0,
})

export const stageState = atom<number>({
  key: 'stageState',
  default: 1,
})

export const remainTimeState = atom<number>({
  key: 'remainTimeState',
  default: 15,
})

export const gameModeState = atom<GameMode>({
  key: 'gameModeState',
  default: 'random',
})
