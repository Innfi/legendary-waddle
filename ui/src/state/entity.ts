export const workoutNames: string[] = [
  'Pullups',
  'Dips',
  'Squats',
  'Kettlebell Swings',
];

export interface WorkoutRecord {
  workoutName: string | null;
  workoutSet: number;
  workoutReps: number;
  weight: number;
}

export interface WorkoutRecordItem extends WorkoutRecord {
  workoutId: number;
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

export interface Record {
  id: number;
  workout_set: number;
  workout_reps: number;
  weight: number;
}

export interface WorkoutWithRecords {
  workout_id: number;
  date_key: string;
  name: string;
  memo: string;
  records: Record[];
}

export type BulkWorkoutRecord = {
  weight: number;
  sets: number;
  reps: number;
};

export type BulkWorkoutItem = {
  name: string;
  memo?: string | null;
  records: BulkWorkoutRecord[];
};

export type BulkWorkoutPayload = {
  dateKey: string;
  workouts: BulkWorkoutItem[];
};
