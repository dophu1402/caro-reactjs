function Square({ isWinSquare, isCurrentMove, onClick, value }) {
    const playerStyle = (value === 'X') ? ' x' : ' o'
    const moveStyle = isCurrentMove ? ' currentMove' : '';
    const squareStyle = isWinSquare ? ' winSquare' : '';
    const className = 'square' + squareStyle + moveStyle + playerStyle;
    return (
        <button className={className} onClick={onClick}>
            {value}
        </button>
    );
}

export default Square;