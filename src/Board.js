import React from 'react';
import './index.css';

const HEADER = -1;

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
        key={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return <div>
      {
        [HEADER, 0, 1, 2].map( (row) => {
          if (row === HEADER) {
            return this.renderBoardHeader();
          } else {
            return this.renderBoardRow(row);
          }
        })
      }
    </div>
  }

  renderBoardHeader() {
    return (
      <div className="board-row" key="board-header">
        <span className="label"></span>
        {
          [0, 1, 2].map((col) => {
            return <span className="label" key={col}>{col}</span>
          })
        }
      </div>
    );
  }

  renderBoardRow(row) {
    return (
      <div className="board-row" key={row}>
        <span className="label">{row}</span>
        {
          [0, 1, 2].map((col) => {
            return this.renderSquare(row * 3 + col)
          })
        }
      </div>
    );
  }
}

export default Board;