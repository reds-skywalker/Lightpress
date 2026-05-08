import { useState, useRef, useCallback } from 'react';

const BUTTON_COUNT = 11;
const MAX_LIVES = 3;
const CLASSIC_START_TIME = 3000;
const MIN_CLASSIC_TIME = 1200;
const MEMORY_SHOW_TIME = 650;
const MEMORY_PAUSE_TIME = 250;

export default function useGameLogic() {
  const [mode, setMode] = useState('classic');
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [activeButton, setActiveButton] = useState(null);
  const [lockedBoard, setLockedBoard] = useState(true);
  const [timeLeft, setTimeLeft] = useState(CLASSIC_START_TIME);
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [message, setMessage] = useState('Selecciona un modo y presiona iniciar.');
  
  // Estado para la retroalimentación visual (acierto/error)
  const [buttonFeedback, setButtonFeedback] = useState({ id: null, type: null });

  // Referencias para limpiar temporizadores y evitar cierres obsoletos (stale closures)
  const timerRef = useRef(null);
  const sequenceTimersRef = useRef([]);
  const stateRef = useRef({ lives, combo, level, score, sequence, playerStep, activeButton });

  // Sincronizar el estado actual en la referencia
  stateRef.current = { lives, combo, level, score, sequence, playerStep, activeButton };

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sequenceTimersRef.current.forEach(clearTimeout);
    sequenceTimersRef.current = [];
  };

  const triggerFeedback = (id, type) => {
    setButtonFeedback({ id, type });
    setTimeout(() => setButtonFeedback({ id: null, type: null }), 280);
  };

  const finishGame = async (msg) => {
    clearAllTimers();
    setGameRunning(false);
    setLockedBoard(true);
    setActiveButton(null);
    setMessage(msg);
try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "Eduardo_Dev", // Aquí podrías usar el nombre del usuario
          score: stateRef.current.score,
          level: stateRef.current.level
        })
      });
      console.log("Puntaje guardado exitosamente");
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  const getRoundTime = (currentLevel) => {
    return Math.max(MIN_CLASSIC_TIME, CLASSIC_START_TIME - ((currentLevel - 1) * 180));
  };

  const getRandomButton = (exclude = null) => {
    let next = Math.floor(Math.random() * BUTTON_COUNT);
    while (BUTTON_COUNT > 1 && next === exclude) next = Math.floor(Math.random() * BUTTON_COUNT);
    return next;
  };

  const startClassicTimer = (time) => {
    clearAllTimers();
    setTimeLeft(time);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearAllTimers();
          const { lives: currentLives } = stateRef.current;
          setLives(currentLives - 1);
          setCombo(0);
          setActiveButton(null);
          setLockedBoard(true);
          
          if (currentLives - 1 <= 0) {
            finishGame('Se terminó el tiempo y no quedan vidas.');
          } else {
            setMessage('Se terminó el tiempo. Pierdes una vida.');
            setTimeout(() => nextClassicRound(), 400);
          }
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  };

  const nextClassicRound = (previous = null) => {
    const nextBtn = getRandomButton(previous);
    setActiveButton(nextBtn);
    setLockedBoard(false);
    setMessage('¡Presiona el botón encendido!');
    startClassicTimer(getRoundTime(stateRef.current.level));
  };

  const startClassic = () => {
    nextClassicRound();
  };

  const showSequence = (currentSeq) => {
    setLockedBoard(true);
    setPlayerStep(0);
    setActiveButton(null);
    setMessage('Observa la secuencia...');
    
    currentSeq.forEach((id, index) => {
      const on = setTimeout(() => { setActiveButton(id); }, index * (MEMORY_SHOW_TIME + MEMORY_PAUSE_TIME));
      const off = setTimeout(() => { setActiveButton(null); }, index * (MEMORY_SHOW_TIME + MEMORY_PAUSE_TIME) + MEMORY_SHOW_TIME);
      sequenceTimersRef.current.push(on, off);
    });

    const unlock = setTimeout(() => {
      setLockedBoard(false);
      setMessage('Ahora repite la secuencia.');
    }, currentSeq.length * (MEMORY_SHOW_TIME + MEMORY_PAUSE_TIME) + 120);
    sequenceTimersRef.current.push(unlock);
  };

  const startMemory = () => {
    const initialSeq = [getRandomButton()];
    setSequence(initialSeq);
    setPlayerStep(0);
    setActiveButton(null);
    setLockedBoard(true);
    setMessage('Observa la secuencia...');
    setTimeout(() => showSequence(initialSeq), 350);
  };

  const startGame = () => {
    clearAllTimers();
    setGameRunning(true);
    setScore(0);
    setLevel(1);
    setLives(MAX_LIVES);
    setCombo(0);
    if (mode === 'classic') {
      startClassic();
    } else {
      startMemory();
    }
  };

  const handleClassicPress = (id) => {
    const { activeButton: active, level: lvl, combo: cmb, score: scr, lives: lvs } = stateRef.current;
    if (id !== active) {
      setLives(lvs - 1);
      setCombo(0);
      triggerFeedback(id, 'wrong');
      if (lvs - 1 <= 0) return finishGame('Te quedaste sin vidas. Juego terminado.');
      setMessage('Botón incorrecto. Pierdes una vida.');
      return;
    }
    
    clearAllTimers();
    const newCombo = cmb + 1;
    const newLevel = newCombo % 5 === 0 ? lvl + 1 : lvl;
    const points = 10 + newLevel * 2 + Math.floor(newCombo / 3);
    
    setCombo(newCombo);
    setLevel(newLevel);
    setScore(scr + points);
    triggerFeedback(id, 'correct');
    setLockedBoard(true);
    setActiveButton(null);
    setMessage(`Correcto +${points} puntos.`);
    
    setTimeout(() => nextClassicRound(active), 350);
  };

  const handleMemoryPress = (id) => {
    const { sequence: seq, playerStep: step, lives: lvs, combo: cmb, level: lvl, score: scr } = stateRef.current;
    const expected = seq[step];

    if (id !== expected) {
      setLives(lvs - 1);
      setCombo(0);
      triggerFeedback(id, 'wrong');
      setLockedBoard(true);
      if (lvs - 1 <= 0) return finishGame('Fallaste la secuencia y te quedaste sin vidas.');
      setMessage('Botón incorrecto. Se repetirá la secuencia.');
      setTimeout(() => showSequence(seq), 700);
      return;
    }

    triggerFeedback(id, 'correct');
    const nextStep = step + 1;
    setPlayerStep(nextStep);

    if (nextStep < seq.length) {
      setMessage(`Bien. Siguiente paso ${nextStep}/${seq.length}.`);
      return;
    }

    const newCombo = cmb + 1;
    const newLevel = lvl + 1;
    const points = 25 + seq.length * 10 + newCombo * 3;
    const newSeq = [...seq, getRandomButton(seq[seq.length - 1])];

    setCombo(newCombo);
    setLevel(newLevel);
    setScore(scr + points);
    setSequence(newSeq);
    setLockedBoard(true);
    setPlayerStep(0);
    setMessage(`Secuencia completada +${points} puntos. Nivel ${newLevel}.`);
    
    setTimeout(() => showSequence(newSeq), 900);
  };

  const handleButtonPress = (id) => {
    if (!gameRunning || lockedBoard) return;
    if (mode === 'classic') handleClassicPress(id);
    else handleMemoryPress(id);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    clearAllTimers();
    setGameRunning(false);
    setScore(0);
    setLevel(1);
    setLives(MAX_LIVES);
    setCombo(0);
    setSequence([]);
    setTimeLeft(CLASSIC_START_TIME);
    setMessage(`Modo ${newMode === 'classic' ? 'clásico' : 'memoria'} seleccionado.`);
  };

  // Calcular variables derivadas para la UI
  const statusText = mode === 'classic' ? `${(timeLeft / 1000).toFixed(1)}s` : `${playerStep}/${sequence.length}`;
  const progress = mode === 'classic' 
    ? Math.max(0, Math.min(100, (timeLeft / getRoundTime(level)) * 100))
    : sequence.length ? Math.max(0, Math.min(100, (playerStep / sequence.length) * 100)) : 0;

  return {
    mode, gameRunning, score, level, lives, combo, activeButton, lockedBoard,
    message, statusText, progress, sequenceLength: sequence.length, buttonFeedback,
    handleModeChange, startGame, handleButtonPress
  };
}
