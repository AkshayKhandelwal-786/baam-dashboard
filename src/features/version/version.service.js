import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/** Upgrdate the version from here to give an update */
const latest = 0.1;
const message = `welcome`

const useVersionStore = create(
  persist(
    (set, get) => ({
      current: 0.1,
      latest: latest,
      message: message,
      addVersion: () => set({ current: get().latest }),
      clearStorage: () => {
        set({ latest: latest, message: message })
      }
    }),
    {
      name: 'version-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useVersionStore;
