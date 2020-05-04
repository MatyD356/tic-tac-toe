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
    const renderBoard = () => {
        for (let i = 0; i < board.length; i++) {
            let container = document.querySelector(".board-container");
            let div = document.createElement("div");
            div.innerHTML = board[i];
            div.classList.add("board-square");
            container.appendChild(div);
        };
    }
    return { makeMove, renderBoard };
})();

const Player = ((name, sign) => {
    const getName = () => console.log(name);
    const getSign = () => sign;
    return { getName, getSign };
});

const playerX = Player("jeff", "X");
const playerY = Player("bob", "O");
document.querySelector(".start").addEventListener("click", function () {
    let forms = Array.from(document.querySelectorAll(".form"));
    for (let i = 0; i < forms.length; i++) {
        forms[i].style.display = "block";
    }
});
GameBoard.makeMove(playerX.getSign(), 3)
GameBoard.renderBoard();