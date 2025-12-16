import { atom } from 'jotai';
import dayjs, { type Dayjs } from 'dayjs';
import type { WorkoutUnit } from './entity';

export const dateKeyAtom = atom(new Date().toISOString().slice(2, 10).replace(/-/g, ''));

// Track current set number for each workout by workout ID
export const workoutSetCountersAtom = atom<Record<string, number>>({});

// Store last used values for sets, reps, and weight by workout ID
export const lastWorkoutValuesAtom = atom<
  Record<string, { sets: number; reps: number; weight: number }>
>({});

// Store workouts for the workout history submit form
export const workoutsAtom = atom<WorkoutUnit[]>([]);

// Store selected date for workout submission
export const selectedDateAtom = atom<Dayjs>(dayjs());

export const selectedMonthAtom = atom<Dayjs>(dayjs());
