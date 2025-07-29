export interface WorkoutRecord {
  workoutName: WorkoutName;
  workoutSet: number;
  workoutReps: number;
}

export interface WorkoutRecordItem extends WorkoutRecord {
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

