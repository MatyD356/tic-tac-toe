const GameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const makeMove = (move, target) => {
        if (move == "X") {
            if (board[target - 1] == "") {
                board[target - 1] = move
                console.log(`making ${move} on ${target} square`)
                console.log(board)
            } else {
                console.log("not a valid move");
            }
        } else if (move == "O") {
            if (board[target - 1] == "") {
                board[target - 1] = move;
                console.log(`making ${move} on ${target} square`)
                console.log(board)
            } else {
                console.log("not a valid move");
            }
        }
    }
    return { makeMove };
})();


GameBoard.makeMove("O", 3);
GameBoard.makeMove("X", 3);