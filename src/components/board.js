import Square from './square';
import React from 'react';

function Board({squares, winSquares, currentMove, onClick, boardSize}) {
    let board = [];
    for (let row = 0; row < boardSize; row++) {
        let squareRow = [];
        for (let col = 0; col < boardSize; col++) {
            squareRow.push(renderSquare(squares, winSquares, currentMove, row * boardSize + col, onClick));
        }
        board.push(<div key={row} className="board-row">{squareRow}</div>);
    } 

    return (
        <div>{board}</div>
    );

}

function renderSquare(squares, winSquares, currentMove, i, onClick) {
    return (
        <Square key={i}
            value={squares[i]}
            onClick={() => { onClick(i) }}
            isWinSquare={winSquares && winSquares.includes(i)}
            isCurrentMove={currentMove === i}
        />
    );
}

export default Board;
