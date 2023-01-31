import { useState } from "react";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
};

export function Board({ xIsNext, squares, onPlay, uStatus }) {
  const grid = [0,1,2,3,4,5,6,7,8]

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
      uStatus("Start")
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
      uStatus("Reset")
    }
  return <>
    <div className="status">{status}</div>
    <div className="board"> 
      {grid.map( i => (
        <Square className="square" value={squares[i]} onSquareClick={() => handleClick(i)} />
      ))}
    </div>
    </>
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [status, setStatus] = useState("Start");
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleStatus(gameStatus) {
    setStatus(gameStatus);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `${move} ${squares}`;
    } else {
      description = 'Go to game start';
    }
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
    );
  });

  return (
    <div className="game">
      <div className="container">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} uStatus={handleStatus} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
      <button>{status} Game</button>
    </div>
  );
} 
