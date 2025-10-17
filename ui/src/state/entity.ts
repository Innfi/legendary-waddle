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

export interface Workout {
  id: number;
  dateKey: string;
  name: string;
  memo: string;
}

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  favoriteWorkouts: { name: string; icon: string }[];
  goal: string;
};

export type RecordStats = {
  total_reps: number;
  total_sets: number;
  avg_reps: number;
  avg_interval_seconds: number;
};

export type ScheduleDetail = {
  workoutName: string;
  sets: number;
  reps: number;
};

export type Schedule = {
  id: number;
  plannedDate: string; // Assuming it's a string in ISO format
  details: ScheduleDetail[];
};

export type UpdateWorkoutMemoPayload = {
  memo: string;
};
