import React from 'react';

interface WorkoutSet {
  set: number;
  reps: number;
  weight: number;
}

interface WorkoutHistoryPageUnitProps {
  date: string;
  workoutName: string;
  elapsedTime: string;
  sets: WorkoutSet[];
  memo: string;
  isExpanded: boolean;
  onClick: () => void;
}

const WorkoutHistoryPageUnit: React.FC<WorkoutHistoryPageUnitProps> = ({
  date,
  workoutName,
  elapsedTime,
  sets,
  memo,
  isExpanded,
  onClick,
}) => {
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

          {/* Bottom Layer */}
          <div>
            <strong>Memo:</strong>
            <p>{memo}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutHistoryPageUnit;
