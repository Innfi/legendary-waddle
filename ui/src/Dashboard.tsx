
export default function DashboardPage() {
  return (
    <div>
      dashboard page: {navigator.maxTouchPoints > 0 ? 'Mobile/Tablet' : 'Desktop'}
    </div>
  );
}
