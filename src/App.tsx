import "./App.css";
import Board from "./components/Board";
import { useTetris } from "./hooks/useTetris";

function App() {
  const { board, startGame, isPlaying, score } = useTetris();
  return (
    <div className="">
      <h1>Tetris</h1>
      <Board currentBoard={board} />
      <div className="controls">
        <h1>Score: {score}</h1>
        {isPlaying ? null : <button onClick={startGame}>New Game</button>}
      </div>
    </div>
  );
}

export default App;
