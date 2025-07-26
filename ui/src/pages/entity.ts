export interface WorkoutRecord {
  workoutName: WorkoutName;
  workoutSet: number;
  workoutReps: number;
  workoutDate: Date;
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

