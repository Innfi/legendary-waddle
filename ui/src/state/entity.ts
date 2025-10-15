export const workoutNames: string[] = [
  'Pullups',
  'Dips',
  'Squats',
  'Kettlebell Swings',
];

export interface WorkoutRecord {
  workoutId: number;
  workoutName: string | null;
  workoutSet: number;
  workoutReps: number;
  weight: number;
}

export interface WorkoutRecordItem extends WorkoutRecord {
  workoutDate: Date;
}
