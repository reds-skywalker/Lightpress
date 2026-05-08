export default function Header({ score }) {
  return (
    <header className="game-header">
      <div className="brand">
        <h1>LightPress</h1>
      </div>
      <div className="user-stats">
        <span>Usuario: Eduardo_Dev</span>
        <span>Monedas: <span>{score}</span></span>
      </div>
      <div className="header-actions">
        {/* Un solo botón en forma de rombo para el Sign Out */}
        <div className="icon-btn" title="Cerrar Sesión" style={{ cursor: 'pointer' }}>
          <span>⏻</span>
        </div>
      </div>
    </header>
  );
}