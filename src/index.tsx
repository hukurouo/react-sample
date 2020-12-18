import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type typeSquare = {
  value: string;
  onClick: any;
  isHighLight: boolean
}

type typeBoard = {
  squares: string[]
  onClick: any
  isHighLights: boolean[]
}

type typeBoardState = {
  squares: string[]
  colrow: string
}

type typeGameState = {
  history: typeBoardState[]
  xIsNext: boolean
  listIsReverse: boolean
  stepNumber: number
  isHighLights: boolean[]
}


function Square(props: typeSquare) {
  if (props.isHighLight){
    return (
      <button className="square_highlight" onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}


class Board extends React.Component<typeBoard> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        isHighLight={this.props.isHighLights[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        { Array(3).fill('').map((_val,i)=>{
          return (
            <div className="board-row">
              { Array(3).fill('').map((_val,j)=>{
                return (this.renderSquare(3*i + j));
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component<{}, typeGameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(''),
        colrow: 'Go to game start'
      }],
      stepNumber: 0,
      listIsReverse: false,
      xIsNext: true,
      isHighLights: Array(9).fill(false)
    };
  }
  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        colrow: 'Go to move #' + history.length + ' (' + calculateColRow(i) + ')' 
      }]),
      stepNumber: history.length,
      listIsReverse: false,
      isHighLights: Array(9).fill(false),
      xIsNext: !this.state.xIsNext,
    });
    const winner = calculateWinner(squares); 
    if (winner) {this.highlightBoard(winner.board)}
  }

  jumpTo(step: any) {
    this.setState({
      stepNumber: step,
      isHighLights: Array(9).fill(false),
      xIsNext: (step % 2) === 0,
    });
  }

  highlightBoard (lines: number[] | null){
    if(lines === null){return}
    let Lights = Array(9).fill(false)
    Lights.forEach((_element,i) => {
      if (lines.includes(i)) {Lights[i] = true}
    });
    this.setState({
      isHighLights: Lights,
    })
  }

  listToggle = () => {
    this.setState({
      listIsReverse: !this.state.listIsReverse,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const stepNum = this.state.stepNumber
    
    const moves = history.map((step, move) => {
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
             {stepNum === move 
                ? <b>{step.colrow}</b>
                : step.colrow
              }
          </button>
        </li>
      );
    });

    const movesReverse = history.slice(0).reverse().map((step, move) => {
      move = history.length - move + - 1
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
             {stepNum === move 
                ? <b>{step.colrow}</b>
                : step.colrow
              }
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div><h1>3目並べ(React Tutorial)</h1></div>

        <div className="game-board">
          <Board
            isHighLights={this.state.isHighLights}
            squares={current.squares}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <br/>
        <div>{status}</div>
        <div>{String(this.state.isHighLights)}</div>
        <div className="game-info">
          
          <ul>
          <button onClick={this.listToggle}>
             toggle!
          </button></ul>
          {this.state.listIsReverse
            ? <ol reversed>{movesReverse}</ol>
            : <ol>{moves}</ol>
          }
        </div>
      </div>
    );
  }
}

function calculateColRow(i: number){
  const colrows = ['1,1', '2,1', '3,1', '1,2', '2,2', '3,2', '1,3', '2,3', '3,3']
  return colrows[i]
}



function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] !== '' && squares[a] === squares[b] && squares[a] === squares[c]) {
      const res = {winner: squares[a], board: lines[i]}
      return res;
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);