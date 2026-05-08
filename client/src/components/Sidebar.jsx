export default function Sidebar({
  mode,
  onModeChange,
  score,
  level,
  lives,
  combo,
  sequenceLength,
  gameRunning,
  onStartGame
}) {
  // Función auxiliar para renderizar los corazones basados en el número de vidas
  const renderLives = () => {
    const maxLives = 3;
    const fullHearts = '♥'.repeat(lives);
    const emptyHearts = '♡'.repeat(maxLives - lives);
    return fullHearts + emptyHearts;
  };

  return (
    <aside className="game-sidebar">
      {/* Bloque de Selección de Modo */}
      <div className="mode-block">
        <p className="sidebar-label">Modo de juego</p>
        <h2>LightPress</h2>
        <div className="mode-actions">
          <button
            type="button"
            className={`mode-btn ${mode === 'classic' ? 'selected' : ''}`}
            onClick={() => onModeChange('classic')}
            disabled={gameRunning} // Desactivado si el juego está corriendo
          >
            Clásico
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'memory' ? 'selected' : ''}`}
            onClick={() => onModeChange('memory')}
            disabled={gameRunning}
          >
            Memoria
          </button>
        </div>
        <button
          type="button"
          className="main-action-btn"
          onClick={onStartGame}
        >
          {gameRunning ? 'Reiniciar' : 'Iniciar'}
        </button>
      </div>

      {/* Bloque de Puntuación y Estadísticas */}
      <div className="score-block">
        <p className="sidebar-label">Puntuación</p>
        <strong className="score-value">{score}</strong>
        <div className="stats-grid">
          <span>Nivel</span>
          <strong>{level}</strong>
          
          <span>Vidas</span>
          <strong style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>
            {renderLives()}
          </strong>
          
          <span>Combo</span>
          <strong>{combo}</strong>
          
          <span>Secuencia</span>
          <strong>{sequenceLength}</strong>
        </div>
      </div>
    </aside>
  );
}