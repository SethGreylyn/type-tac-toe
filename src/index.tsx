import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';

interface SquareProps {
    value: Square;
    onClick: () => void;
}

function Square(props: SquareProps) {
      return (
        <button className="square" onClick={props.onClick}>
        {props.value}
        </button>
      );
    }

interface BoardProps {
    squares: Squares;
    player: Player;
    onClick: (i: number) => void;
}

interface BoardState {
}

class Board extends React.Component<BoardProps, BoardState> {
    renderSquare(i: number) {
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
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

type Player = 'X' | 'O';
type Square = (Player | null);
type Squares = Square[];

interface GameProps {
}

interface GameState {
    squares: Squares;
    player: Player;
    history: { squares: Squares}[];
    stepNumber: number;
}

class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);
        let history = [{
            squares: Array(9).fill(null)
        }];
        this.state = {
            history,
            squares: Array(9).fill(null),
            player: 'X',
            stepNumber: 0
        };
    }
    squareClick(i: number) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const player: Player = this.state.player.slice() as Player;
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = player;
        const nextPlayer = player === 'X' ? 'O' : 'X';

        this.setState({
            history: history.concat({squares}),
            squares,
            player: nextPlayer,
            stepNumber: history.length
        });
    }
    jumpTo(step: number) {
        console.log(step);
        this.setState({
            stepNumber: step,
            player: (step % 2 === 0) ? 'X' : 'O'
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
            `Go to move ${move}` :
            `Go to game start`;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${winner}!`;
        } else {
            status = `Next player: ${this.state.player}`;
        }
        return (
        <div className="game">
            <div className="game-board">
                <Board
                    player={this.state.player}
                    squares={current.squares}
                    onClick={(i: number) => this.squareClick(i)}
                />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

function calculateWinner(squares: Squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [6, 4, 2],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ];
    for (let line = 0; line < lines.length; ++line) {
        const [a, b, c] = lines[line];
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