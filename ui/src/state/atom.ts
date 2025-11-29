import { atom } from 'jotai';

export const dateKeyAtom = atom(new Date().toISOString().slice(2, 10).replace(/-/g, ''));

// Track current set number for each workout by workout ID
export const workoutSetCountersAtom = atom<Record<string, number>>({});

// Store last used values for sets, reps, and weight by workout ID
export const lastWorkoutValuesAtom = atom<
  Record<string, { sets: number; reps: number; weight: number }>
>({});
