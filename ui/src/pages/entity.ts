export interface WorkoutRecord {
  workoutName: WorkoutName;
  workoutReps: number;
}

export type WorkoutName = 'Pullups' |
  'Dips' |
  'Squats' |
  'Kettlebell Swings';

export const workoutNames: WorkoutName[] = [
  'Pullups',
  'Dips',
  'Squats',
  'Kettlebell Swings',
];

