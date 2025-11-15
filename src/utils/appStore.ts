import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

// Define the state and action types
interface AppState {
  dopen: boolean;
  rows: any[];
  setRows: (rows: any[]) => void;
  updateDopen: (dopen: boolean) => void;
}

// Define the persist configuration
const persistConfig: PersistOptions<AppState> = { name: 'cdot_store_api' };

// Define the store with the correct typing
const useAppStore = create(
  persist<AppState>(
    (set) => ({
      dopen: true,
      rows: [],
      setRows: (rows: any[]) => set({ rows }),
      updateDopen: (dopen: boolean) => set({ dopen }),
    }),
    persistConfig
  )
);

export default useAppStore;
