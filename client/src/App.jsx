import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatusCard from './components/StatusCard';
import Board from './components/Board';
// Importamos nuestro Custom Hook
import useGameLogic from './hooks/useGameLogic';

export default function App() {
  // Extraemos todos los estados y funciones de nuestro "cerebro"
  const {
    mode, gameRunning, score, level, lives, combo, activeButton, lockedBoard,
    message, statusText, progress, sequenceLength, buttonFeedback,
    handleModeChange, startGame, handleButtonPress
  } = useGameLogic();

  return (
    <div className="app-container">
      <Header score={score} />
      
      <main className="game-area">
        <Sidebar 
          mode={mode}
          onModeChange={handleModeChange}
          score={score}
          level={level}
          lives={lives}
          combo={combo}
          sequenceLength={sequenceLength}
          gameRunning={gameRunning}
          onStartGame={startGame}
        />

        <section className="play-section">
           <StatusCard 
             message={message}
             statusText={statusText}
             progress={progress}
           />
           
           <Board 
             activeButton={activeButton}
             onButtonPress={handleButtonPress}
             gameRunning={gameRunning}
             lockedBoard={lockedBoard}
             buttonFeedback={buttonFeedback} // Pasamos la nueva prop al tablero
           />
        </section>
      </main>
    </div>
  );
}