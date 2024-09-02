import "./App.css";
import Board from "./components/Board";
import UpcomingBlock from "./components/UpcomingBlocks";
import { useTetris } from "./hooks/useTetris";

function App() {
  const { board, startGame, isPlaying, score, upcomingBlocks } = useTetris();
  return (
    <div className="app">
      <div>
        <h1>Tetris</h1>
        <Board currentBoard={board} />
      </div>
      <div className="controls">
        <h1>Score: {score}</h1>
        {isPlaying ? (
          <UpcomingBlock upcomingBlock={upcomingBlocks} />
        ) : (
          <button onClick={startGame} className="button-53">
            New Game
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
