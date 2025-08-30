import { atom } from 'recoil'

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
