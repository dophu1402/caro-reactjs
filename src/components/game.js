import Board from './board';
import React, { useState } from 'react';
function Game() {
    const [history, setHistory] = useState([
        {
            squares: Array(400).fill(null),
            currentMove: null
        }
    ]);

    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXisNext] = useState(1);
    const [isDesc, setIsDesc] = useState(1);
    const [boardSize, setBoardSize] = useState(5);

    function jumpTo(step) {
        setStepNumber(step);
        setXisNext((step % 2) === 0);
    }

    function handleSort() {
        setIsDesc(!isDesc);
    }

    function handleClick(i) {
        const currentHistory = history.slice(0, stepNumber + 1);
        const squares = currentHistory[currentHistory.length - 1].squares.slice();
        if (calculateWinner(currentHistory[currentHistory.length - 1], boardSize) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(currentHistory.concat([
            {
                squares: squares,
                currentMove: i
            }
        ]));

        setStepNumber(currentHistory.length);
        setXisNext(!xIsNext);
    }

    function handleSizeChange(event) {
        let { value, min, max } = event.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        setHistory([{
            squares: Array(400).fill(null),
            currentMove: null
        }])
        setStepNumber(0);
        setXisNext(1);
        setBoardSize(value);
    }

    const currentHistory = history[stepNumber];
    let winner, draw;
    let winSquares;
    const isWin = calculateWinner(currentHistory, boardSize)
    if (isWin) {
        winSquares = isWin;
        winner = currentHistory.squares[winSquares[0]];
    } else if (stepNumber === boardSize * boardSize) {
        draw = true;
    }

    const moves = history.map((step, move) => {
        const player = move % 2 ? 'X' : 'O';
        const col = step.currentMove % boardSize;
        const row = (step.currentMove - step.currentMove % boardSize) / boardSize;
        const desc = move ?
            `Go to move #${move}: Player ${player} hits (${col + 1},${row + 1})` :
            'Go to game start';

        return (
            <li key={move}>
                <button className={(stepNumber === move) ? "bold-history" : "normal-history"}
                    onClick={() => jumpTo(move)}>
                    {desc}
                </button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (draw) {
        status = "This is a draw"
    }
    else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <div>
            <div className="board-size">
                <label>Board size: </label>
                <input type="number" min="5" max="20" step="1" defaultValue={boardSize}
                    onChange={(event) => { handleSizeChange(event) }}
                    onBlur={(event) => { event.target.value = boardSize }}>
                </input>
            </div>


            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentHistory.squares}
                        onClick={(i) => handleClick(i)}
                        winSquares={winSquares}
                        currentMove={currentHistory.currentMove}
                        boardSize={boardSize}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button className="sort-button" onClick={() => handleSort()}>
                        {(isDesc) ? "Sort in descending" : "Sort in ascending"}
                    </button>
                    <ol>{(isDesc) ? moves : moves.reverse()}</ol>
                </div>
            </div>
        </div>
    );

}

function calculateWinner(history, boardSize) {
    if (history.currentMove === null){
        return null;
    }
    const col = history.currentMove % boardSize;
    const row = (history.currentMove - history.currentMove % boardSize) / boardSize;

    const squares = [];
    for (let i = 0; i < boardSize; i++) {
        let squareRow = [];
        for (let j = 0; j < boardSize; j++) {
            squareRow[j] = history.squares[boardSize * i + j];
        }
        squares.push(squareRow);
    }

    let colLines = [];
    let count = 0;
    let isWin = false;

    /////////////////////check col
    for (let topRow = row - 1; topRow >= 0; topRow--) {
        if (squares[topRow][col] === squares[row][col]) {
            colLines.push(topRow * boardSize + col)
            count++;
        } else {
            break;
        }
    }

    for (let botRow = row + 1; botRow < boardSize; botRow++) {
        if (squares[botRow][col] === squares[row][col]) {
            colLines.push(botRow * boardSize + col)
            count++;
        } else {
            break;
        }
    }

    if (count >= 4) {
        isWin = true;
    } else {
        colLines = [];
    }

    //////////////////////////////// check row
    let rowLines = [];
    count = 0;
    for (let leftCol = col - 1; leftCol >= 0; leftCol--) {
        if (squares[row][leftCol] === squares[row][col]) {
            rowLines.push(row * boardSize + leftCol)
            count++;
        } else {
            break;
        }
    }

    for (let rightCol = col + 1; rightCol < boardSize; rightCol++) {
        if (squares[row][rightCol] === squares[row][col]) {
            rowLines.push(row * boardSize + rightCol)
            count++;
        } else {
            break;
        }
    }

    if (count >= 4) {
        isWin = true;
    }
    else {
        rowLines = [];
    }

    ////////////////////////////////// check diagonal 1
    let diagonalLines1 = [];
    count = 0;
    for (let topLeft = 1; row - topLeft >= 0 && col - topLeft >= 0; topLeft++) {
        let checkCol = col - topLeft;
        let checkRow = row - topLeft;
        if (squares[checkRow][checkCol] === squares[row][col]) {
            diagonalLines1.push(checkRow * boardSize + checkCol)
            count++;
        } else {
            break;
        }
    }
    for (let botRight = 1; row + botRight < boardSize && col + botRight < boardSize; botRight++) {
        let checkCol = col + botRight;
        let checkRow = row + botRight;
        if (squares[checkRow][checkCol] === squares[row][col]) {
            diagonalLines1.push(checkRow * boardSize + checkCol)
            count++;
        } else {
            break;
        }
    }

    if (count >= 4) {
        isWin = true;
    } else {
        diagonalLines1 = [];
    }

    ////////////////////////////////// check diagonal 2
    count = 0;
    let diagonalLines2 = [];
    for (let topRight = 1; row - topRight >= 0 && col + topRight < boardSize; topRight++) {
        let checkCol = col + topRight;
        let checkRow = row - topRight;
        if (squares[checkRow][checkCol] === squares[row][col]) {
            diagonalLines2.push(checkRow * boardSize + checkCol)
            count++;
        } else {
            break;
        }
    }
    for (let botLeft = 1; row + botLeft < boardSize && col - botLeft >= 0; botLeft++) {
        let checkCol = col - botLeft;
        let checkRow = row + botLeft;
        if (squares[checkRow][checkCol] === squares[row][col]) {
            diagonalLines2.push(checkRow * boardSize + checkCol)
            count++;
        } else {
            break;
        }
    }

    if (count >= 4) {
        isWin = true;
    } else {
        diagonalLines2 = [];
    }
    if (isWin) {
        let winLines = [];
        winLines = winLines.concat(rowLines, colLines, diagonalLines1, diagonalLines2)
        console.log(winLines);
        return winLines;
    }

    return null;
}

export default Game;