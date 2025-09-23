export interface WorkoutRecord {
  workoutName: string;
  workoutSet: number;
  workoutReps: number;
  weight: number;
  dateKey: string;
}

export interface WorkoutRecordItem extends WorkoutRecord {
  workoutDate: Date;
}

export type WorkoutName = string;

export const workoutNames: WorkoutName[] = [
  'Pullups',
  'Dips',
  'Squats',
  'Kettlebell Swings',
];

