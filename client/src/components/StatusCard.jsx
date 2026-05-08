export default function StatusCard({ message, statusText, progress }) {
  return (
    <>
      <div className="game-status-card">
        <div>
          <p className="eyebrow">Estado</p>
          <h2>{message}</h2>
        </div>
        <div className="status-pill">{statusText}</div>
      </div>
      
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </>
  );
}