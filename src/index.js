import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './Board.js';

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        squareIndex: null,
      }],
      xIsNext: true,
      currentStep: 0,
      sortAscending: true,
    };
  }

  render() {
    const current = this.state.history[this.state.currentStep];
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightedSquares={calculateWinner(current.squares).slice(1)}
          />
        </div>
        <div className="game-info">
          <div>{this.getStatus()}</div>
          <button onClick={() => this.onSortClick()}>Sort: {this.state.sortAscending ? 'Ascending' : 'Descending'}</button>
          <ol>{this.getMoveHistory()}</ol>
        </div>
      </div>
    );
  }

  onSortClick() {
    console.log('Sort button clicked');
    this.setState({
      sortAscending: !this.state.sortAscending,
    });
  }

  // Get the current game status string
  getStatus() {
    const current = this.state.history[this.state.currentStep];
    const [winner, a, b, c] = calculateWinner(current.squares);
    if (winner) {
      return 'Winner: ' + winner;
    } else if (isDraw(current.squares)) {
      return 'Draw, nobody wins!'
    } else {
      return 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
  }

  // Gets the interactive move list
  getMoveHistory() {
    var history = this.state.history.slice()

    if (!this.state.sortAscending) {
      history.reverse();
    }

    return history.map((boardState, i) => {
      const moveNumber = this.state.sortAscending ? i : (history.length - i - 1);

      // Row and column of the move
      const row = Math.floor(boardState.squareIndex / 3) + 1;
      const col = (boardState.squareIndex % 3) + 1;
      const desc = (boardState.squareIndex == null) ?
        'Game Start' :
        'Move #' + moveNumber + ' (' + row + ',' + col + ')';

      return (
        <li key={boardState.squareIndex}>
          <button 
            className={i === this.state.currentStep ? 'button-bold' : 'button'}
            onClick={() => this.jumpTo(i)}>{desc}
          </button>
        </li>
      )
    });
  }

  // Jumps the history to the specified step
  jumpTo(step) {
    this.setState({
      currentStep: step,
      xIsNext: (step % 2 === 0),
    });
  }

  // Click handler for tapping a square on the board
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStep + 1);
    const current = history[this.state.currentStep];
    const squares = current.squares.slice();

    // Don't fill in square if
    // 1) It is already full
    // 2) There is a winner
    // 3) We are not viewing the most recent state in history
    const [winner, a, b, c] = calculateWinner(squares);
    if (squares[i] || winner) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Add the new state to the history and flip whose turn it is
    this.setState({
      history: history.concat([{
        squares: squares,
        squareIndex: i,
      }]),
      xIsNext: !this.state.xIsNext,
      currentStep: this.state.currentStep + 1,
    });
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }

  return [null];
}

function isDraw(squares) {
  console.log(squares);
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return false;
    }
  }
  return true;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
