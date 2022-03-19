import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
        <span className="label"></span>
          <span className="label">1</span>
          <span className="label">2</span>
          <span className="label">3</span>
        </div>
        <div className="board-row">
          <span className="label">1</span>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          <span className="label">2</span>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          <span className="label">3</span>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveIndex: null,
      }],
      xIsNext: true,
      currentStep: 0,
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
          />
        </div>
        <div className="game-info">
          <div>{this.getStatus()}</div>
          <ol>{this.getMoveHistory()}</ol>
        </div>
      </div>
    );
  }

  // Get the current game status string
  getStatus() {
    const current = this.state.history[this.state.currentStep];
    const winner = calculateWinner(current.squares);
    if (winner) {
      return 'Winner: ' + winner;
    } else {
      return 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
  }

  // Gets the interactive move list
  getMoveHistory() {
    const current = this.state.history[this.state.currentStep];
    return this.state.history.map((boardState, moveIndex) => {
      // Row and column of the move
      const row = Math.floor(current.moveIndex / 3) + 1;
      const col = (current.moveIndex % 3) + 1;
      const desc = moveIndex ?
        'Move #' + moveIndex + ' (' + row + ',' + col + ')' :
        'Game Start';
      return (
        <li key={moveIndex}>
          <button 
            className={moveIndex == this.state.currentStep ? 'button-bold' : 'button'}
            onClick={() => this.jumpTo(moveIndex)}>{desc}
          </button>
        </li>
      )
    });
  }

  // Jumps the history to the specified step
  jumpTo(step) {
    this.setState({
      currentStep: step,
      xIsNext: (step % 2 == 0),
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
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Add the new state to the history and flip whose turn it is
    this.setState({
      history: history.concat([{
        squares: squares,
        moveIndex: i,
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
