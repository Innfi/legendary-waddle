import { atom, DefaultValue, selector } from 'recoil';

import type { WorkoutName } from './entity';

export interface AppState {
  currentWorkoutName: WorkoutName | null;
  dateKey: string;
}

export const defaultAppState = atom<AppState>({
  key: 'appState',
  default: {
    currentWorkoutName: null,
    dateKey: new Date().toISOString().slice(2, 10).replace(/-/g, ''), 
  },
});

export const nameSelector = selector({
  key: 'workoutNameSelector',
  get: ({ get }): WorkoutName | null => {
    const state = get(defaultAppState);

    return state.currentWorkoutName;
  },
  set: ({ set, get }, newWorkoutName) => {
    const state = get(defaultAppState);

    return set(defaultAppState, {
      ...state,
      currentWorkoutName: newWorkoutName instanceof DefaultValue
        ? state.currentWorkoutName
        : newWorkoutName,
    });
  },
});

export const dateKeySelector = selector({
  key: 'dateKeySelector',
  get: ({ get }): string => {
    const state = get(defaultAppState);

    return state.dateKey;
  },
  set: ({ set, get }, newDateKey) => {
    const state = get(defaultAppState);

    return set(defaultAppState, {
      ...state,
      dateKey: newDateKey instanceof DefaultValue
        ? state.dateKey
        : newDateKey,
    });
  },
});