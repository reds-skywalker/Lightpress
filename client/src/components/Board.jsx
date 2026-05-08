export default function Board({ 
  activeButton, 
  onButtonPress, 
  gameRunning, 
  lockedBoard,
  buttonFeedback // Agregamos esta prop
}) {
  const buttons = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="board-container">
      {buttons.map((id) => {
        // Determinamos si este botón en específico tiene un efecto de feedback activo
        let feedbackClass = '';
        if (buttonFeedback.id === id) {
          feedbackClass = `feedback-${buttonFeedback.type}`;
        }

        return (
          <button
            key={id}
            type="button"
            className={`pop-btn ${activeButton === id ? 'on' : 'off'} ${feedbackClass}`}
            disabled={!gameRunning || lockedBoard}
            onClick={() => onButtonPress(id)}
          >
            {id}
          </button>
        );
      })}
    </div>
  );
}