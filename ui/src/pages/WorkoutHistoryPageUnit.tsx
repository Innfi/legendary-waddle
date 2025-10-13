import React, { useState } from 'react';
import { useUpdateWorkoutMemo } from './api';

interface WorkoutSet {
  set: number;
  reps: number;
  weight: number;
}

interface WorkoutHistoryPageUnitProps {
  workoutId: number;
  date: string;
  workoutName: string;
  elapsedTime: string;
  sets: WorkoutSet[];
  memo: string;
  isExpanded: boolean;
  onClick: () => void;
}

const WorkoutHistoryPageUnit: React.FC<WorkoutHistoryPageUnitProps> = ({
  workoutId,
  date,
  workoutName,
  elapsedTime,
  sets,
  memo,
  isExpanded,
  onClick,
}) => {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoValue, setMemoValue] = useState(memo);
  const updateMemoMutation = useUpdateWorkoutMemo();

  const handleMemoSave = async () => {
    try {
      await updateMemoMutation.mutateAsync({ workoutId, memo: memoValue });
      setIsEditingMemo(false);
    } catch (error) {
      console.error('Failed to update memo:', error);
    }
  };

  const handleMemoCancel = () => {
    setMemoValue(memo);
    setIsEditingMemo(false);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0' }}>
      {/* Top Layer */}
      <div onClick={onClick} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isExpanded ? '16px' : '0', cursor: 'pointer' }}>
        <div>
          <strong>Date:</strong> {date}
        </div>
        <div>
          <strong>Workout:</strong> {workoutName}
        </div>
        <div>
          <strong>Time:</strong> {elapsedTime}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Middle Layer */}
          <div style={{ marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Set</th>
                  {sets.map((s) => (
                    <td key={s.set} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{s.set}</td>
                  ))}
                </tr>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Reps</th>
                  {sets.map((s) => (
                    <td key={s.set} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{s.reps}</td>
                  ))}
                </tr>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Weight (kg)</th>
                  {sets.map((s) => (
                    <td key={s.set} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{s.weight}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Layer - Memo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <strong>Memo:</strong>
              {!isEditingMemo && (
                <button
                  onClick={() => setIsEditingMemo(true)}
                  style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '12px' }}
                >
                  Edit
                </button>
              )}
            </div>
            
            {isEditingMemo ? (
              <div>
                <textarea
                  value={memoValue}
                  onChange={(e) => setMemoValue(e.target.value)}
                  style={{ width: '100%', minHeight: '60px', marginBottom: '8px' }}
                />
                <div>
                  <button
                    onClick={handleMemoSave}
                    disabled={updateMemoMutation.isPending}
                    style={{ marginRight: '8px', padding: '4px 12px' }}
                  >
                    {updateMemoMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleMemoCancel}
                    disabled={updateMemoMutation.isPending}
                    style={{ padding: '4px 12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>{memo}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutHistoryPageUnit;
