import "./ProgressBar.css";

export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="progress-bar-boundary">
      <div style={{ width: `${percent || 0}%` }}>{percent}%</div>
    </div>
  );
}
