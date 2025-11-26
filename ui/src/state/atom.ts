import { atom } from 'jotai';

export const dateKeyAtom = atom(new Date().toISOString().slice(2, 10).replace(/-/g, ''));

// Track current set number for each workout by workout ID
export const workoutSetCountersAtom = atom<Record<string, number>>({});
