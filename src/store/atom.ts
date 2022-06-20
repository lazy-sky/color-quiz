import { atom } from 'recoil'

export const stageState = atom({
  key: 'stageState',
  default: 1,
})

export const remainTimeState = atom({
  key: 'remainTimeState',
  default: 15,
})

export const scoreState = atom({
  key: 'scoreState',
  default: 0,
})
