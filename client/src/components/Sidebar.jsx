import { useState, useEffect } from 'react'; // 1. Importamos los hooks necesarios

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
  // 2. Estado y Fetch para el microservicio Lambda
  const [gameTip, setGameTip] = useState("Estableciendo conexión...");

  useEffect(() => {
    // Obtenemos la URL de las variables de entorno
    const apiUrl = import.meta.env.VITE_LAMBDA_TIPS_URL;

    if (apiUrl) {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          setGameTip(`[${data.tipo.toUpperCase()}] ${data.mensaje}`);
        })
        .catch((error) => {
          console.error("Error de enlace Lambda:", error);
          setGameTip("Sistemas operando al 100%."); // Fallback si el fetch falla
        });
    } else {
      setGameTip("Señal de la base perdida."); 
    }
  }, []);

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

      {/* 3. Nuevo Bloque: Transmisión Serverless (Lambda) */}
      <div 
        className="lambda-transmission-block" 
        style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: 'rgba(34, 197, 94, 0.05)', 
          border: '1px solid rgba(34, 197, 94, 0.3)', 
          borderRadius: '8px' 
        }}
      >
        <p className="sidebar-label" style={{ color: '#22c55e', marginBottom: '8px', fontSize: '0.85rem' }}>
          Transmisión Serverless
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.4' }}>
          {gameTip}
        </p>
      </div>
    </aside>
  );
}