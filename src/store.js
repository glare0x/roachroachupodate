import { create } from 'zustand'

const initial = {1: {total: 0, participants: 0}, 2: {total: 0, participants: 0}, 3: {total: 0, participants: 0}, 4: {total: 0, participants: 0}};
export const useRoachStore = create((set) => ({
  roaches: {...initial},

  setRoaches: (_roaches) => set((state) => ({ roaches: _roaches })),
  removeRoaches: () => set({ roaches: {...initial} }),
}))