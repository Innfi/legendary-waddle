export const calculateAverages = (records: { workoutReps: number; weight: number }[]) => {
  if (!records || records.length === 0) {
    return { minWeight: '-', maxWeight: '-', maxReps: 0, totalSets: 0 };
  }
  
  const weights = records.map(r => r.weight);
  const reps = records.map(r => r.workoutReps);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const maxReps = Math.max(...reps);

  return {
    minWeight: minWeight.toString(),
    maxWeight: maxWeight.toString(),
    maxReps,
    totalSets: records.length
  };
};