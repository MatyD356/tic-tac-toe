const GameBoard = (() => {

    const container = document.querySelector(".board-container");
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];
    const makeMove = (move, target) => {
        let column = 0;

        if (target > 5) {
            column = 2;
            target -= 6;
        } else if (target > 2) {
            column = 1;
            target -= 3;
        }

        if (move == "X") {
            if (board[column][target] == "") {
                board[column][target] = move
                console.log(`making ${move} on ${target} square`)
                console.log(board)
                renderBoard();
            } else {
                console.log("not a valid move");
            }
        } else if (move == "O") {
            if (board[column][target] == "") {
                board[column][target] = move;
                console.log(`making ${move} on ${target} square`)
                console.log(board)
                renderBoard();
            } else {
                console.log("not a valid move");
            }
        }
    };
    const renderBoard = () => {
        container.textContent = "";
        let dataIndex = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                let div = document.createElement("div");
                div.textContent = board[i][j];
                div.classList.add("board-square");
                div.setAttribute("data-index", dataIndex);
                div.setAttribute("data-column", j)
                container.appendChild(div);
                dataIndex++;
            }
        };
    };
    const watchForchange = () => {
        const gameBoard = document.querySelector(".board-container");
        gameBoard.addEventListener("click", (e) => {
            if (GameFlow.getGameStatus() == "playerXTurn") {
                makeMove("X", e.target.dataset.index);
                checkForGameEnd();
                GameFlow.changeGameState("playerOTurn");
            } else if (GameFlow.getGameStatus() == "playerOTurn") {
                makeMove("O", e.target.dataset.index);
                checkForGameEnd();
                GameFlow.changeGameState("playerXTurn")
            }
        });
    };
    const checkForGameEnd = () => {
        for (let i = 0; i < board.length; i++) {
            let row = board[i].reduce((a, b) => {
                return a + b;
            });
            let col = "";
            for (let j = 0; j < board.length; j++) {
                col += board[j][i];
                console.log(col)
            }
            if (col == "XXX" || row == "XXX") {
                alert("X wins");
                GameFlow.changeGameState("PlayerXWins")
                return;
            } else if (col == "OOO" || row == "OOO") {
                alert("O wins");
                GameFlow.changeGameState("PlayerOWins")
                return;
            };
        };

    };

    return { makeMove, renderBoard, watchForchange, checkForGameEnd };
})();

const GameControlls = (() => {
    const forms = Array.from(document.querySelectorAll(".form"));
    const inputs = Array.from(document.querySelectorAll(".name-input"));
    const createButtons = Array.from(document.querySelectorAll(".create"));
    const leftColumn = document.querySelector(".left-column");
    const rightColumn = document.querySelector(".right-column");

    const addEventListeners = () => {
        //showing forms
        document.querySelector(".start").addEventListener("click", () => {
            for (let i = 0; i < forms.length; i++) {
                forms[i].style.display = "block";
            }
            GameFlow.changeGameState("creatingPlayers")
        });
        //players forms events
        for (let i = 0; i < createButtons.length; i++) {
            if (createButtons[i].textContent == "Play vs Human") {
                createButtons[i].addEventListener("click", () => {
                    forms[1].style.display = "none";
                    document.querySelector(".form-player-O").style.display = "block";
                });
            } else if (createButtons[i].textContent == "Create Player") {
                createButtons[i].addEventListener("click", () => {
                    let playerName = null;
                    if (i == 0) {
                        console.log(inputs[0].value);
                        playerName = inputs[0].value
                    } else if (i == 3) {
                        playerName = inputs[1].value
                    }
                    GameFlow.createPlayer(playerName, createButtons[i].id)
                });
            } else if (createButtons[i].textContent == "Play vs AI") {
                createButtons[i].addEventListener("click", () => {
                    GameFlow.createPlayer("AI", "O")
                })
            };
        }
    };

    const showScore = (player) => {
        let div = document.createElement("div");
        div.innerHTML =
            `<h1>${player.getName()} </h1>
             <p>${player.getSign()}</p>`
        if (player.getSign() == "X") {
            leftColumn.textContent = "";
            leftColumn.appendChild(div)
        } else if (player.getSign() == "O") {
            rightColumn.textContent = "";
            rightColumn.appendChild(div)
        }
    }
    return { addEventListeners, showScore };
})();

const Player = ((name, sign) => {
    const getName = () => name;
    const getSign = () => sign;
    return { getName, getSign };
});

const GameFlow = (() => {
    let gameState = "start";
    let playerX = null;
    let playerO = null;

    const checkForPlayers = () => {
        let check = setInterval(() => {
            if (playerX) {
                GameControlls.showScore(playerX)
            }
            if (playerO) {
                GameControlls.showScore(playerO)
            }
            if (playerX && playerO) {
                clearInterval(check)
                changeGameState("playerXTurn")
                GameBoard.renderBoard();
                GameBoard.watchForchange();
            }
        }, 1000)
    };
    const changeGameState = (newState) => {
        gameState = newState;
    };
    const getGameStatus = () => {
        return gameState;
    };
    const startGame = () => {
        GameControlls.addEventListeners();
        checkForPlayers();
    };
    const createPlayer = (name, sign) => {
        if (sign == "X") { playerX = Player(name, sign) }
        else if (sign == "O") { playerO = Player(name, sign) }
        console.log(playerX.getName(), playerX.getSign())
        console.log(playerO.getName(), playerO.getSign())
    };
    return { startGame, createPlayer, changeGameState, getGameStatus }
})();

GameFlow.startGame()