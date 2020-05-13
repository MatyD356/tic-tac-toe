const GameBoard = (() => {
    const container = document.querySelector(".board-container");
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    const makeMove = (move, target) => {
        let column = 0;
        if (target > 5) {
            column = 2;
            target -= 6;
        } else if (target > 2) {
            column = 1;
            target -= 3;
        }
        if (move == "AI") {
            if (board[column][target] == "") {
                board[column][target] = "O"
                renderBoard();
                GameFlow.changeGameState("playerXTurn")
            }
        }
        else if (move == "X") {
            if (board[column][target] == "") {
                board[column][target] = move
                renderBoard();
                if (GameFlow.getPlayerO() == "AI") {
                    GameFlow.changeGameState("aiPlayerTurn");
                } else {
                    GameFlow.changeGameState("playerOTurn");
                }
            } else {
                alert("not a valid move");
                GameFlow.changeGameState("playerXTurn")
            }
        } else if (move == "O") {
            if (board[column][target] == "") {
                board[column][target] = move;
                renderBoard();
            } else {
                alert("not a valid move");
                GameFlow.changeGameState("playerOTurn")
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
        const clickHandler = (e) => {
            if (GameFlow.getGameStatus() == "playerXTurn") {
                makeMove("X", e.target.dataset.index);
                if (checkForGameEnd()) {
                    return;
                };
            } else if (GameFlow.getGameStatus() == "playerOTurn") {
                makeMove("O", e.target.dataset.index);
                if (checkForGameEnd()) {
                    return;
                }
                GameFlow.changeGameState("playerXTurn")
            } else if (GameFlow.getGameStatus() == "aiPlayerTurn") {
                while (GameFlow.getGameStatus() == "aiPlayerTurn") {
                    let num = Math.floor(Math.random() * (9 - 0)) + 0;
                    makeMove("AI", num)
                    checkForGameEnd()
                    return;
                };
            }
        }
        container.onclick = clickHandler;
        setInterval(() => {
            if (GameFlow.getGameStatus() == "aiPlayerTurn") {
                container.click();
            }
        }, 100)

    };
    const checkForGameEnd = () => {
        let leftSpots = 9;
        let leftCrosswise = board[0][0] + board[1][1] + board[2][2]
        let rightCrosswise = board[2][0] + board[1][1] + board[0][2]
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] !== "") {
                    leftSpots--;
                }
            }
        }
        for (let i = 0; i < board.length; i++) {
            let row = board[i].reduce((a, b) => {
                return a + b;
            });
            let col = "";
            for (let j = 0; j < board.length; j++) {
                col += board[j][i];
            }
            if (col == "XXX" || row == "XXX" || leftCrosswise == "XXX" || rightCrosswise == "XXX") {
                alert("X wins");
                GameFlow.changeGameState("PlayerXWins")
                return true;
            }
            if (col == "OOO" || row == "OOO" || leftCrosswise == "OOO" || rightCrosswise == "OOO") {
                alert("O wins");
                GameFlow.changeGameState("PlayerOWins")
                return true;
            }
            if (leftSpots == 0) {
                alert("draw")
                GameFlow.changeGameState("draw")
                return true;
            }
        };

    };
    const changeBoard = (arr) => {
        board = arr;
    };
    return { makeMove, renderBoard, watchForchange, checkForGameEnd, changeBoard };
})();
const GameControlls = (() => {
    const forms = Array.from(document.querySelectorAll(".form"));
    const inputs = Array.from(document.querySelectorAll(".name-input"));
    const createButtons = Array.from(document.querySelectorAll(".create"));
    const leftColumn = document.querySelector(".left-column");
    const rightColumn = document.querySelector(".right-column");
    const addEventListeners = () => {
        document.querySelector(".start").addEventListener("click", () => {
            if (GameFlow.getGameStatus() === "start") {
                for (let i = 0; i < forms.length; i++) {
                    forms[i].style.display = "block";
                }
                GameFlow.changeGameState("creatingPlayers")
            }
        });
        document.querySelector(".restart").addEventListener("click", () => {
            restartGame();
        });
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
                        if (inputs[0].value.length < 3) {
                            alert("to short")
                        } else {
                            playerName = inputs[0].value
                            GameFlow.createPlayer(playerName, createButtons[i].id)
                        }
                    } else if (i == 3) {
                        if (inputs[1].value.length < 3) {
                            alert("to short")
                        } else {
                            playerName = inputs[1].value
                            GameFlow.createPlayer(playerName, createButtons[i].id)
                        }
                    }
                });
            } else if (createButtons[i].textContent == "Play vs AI") {
                createButtons[i].addEventListener("click", () => {
                    GameFlow.createPlayer("AI", "O")
                })
            };
        }
    };
    const restartGame = () => {
        GameFlow.deletePlayer("X");
        GameFlow.deletePlayer("O");
        GameBoard.changeBoard([]);
        GameBoard.renderBoard();
        hideScore();
        GameBoard.changeBoard([["", "", ""], ["", "", ""], ["", "", ""]]);
        GameFlow.changeGameState("start");
        GameFlow.startGame();
    }
    const hideScore = () => {
        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display = "none";
        }
        if (document.querySelector(".form-player-O")) {
            document.querySelector(".form-player-O").style.display = "none";
        }
        if (leftColumn.querySelector(".player-info")) {
            leftColumn.querySelector(".player-info").remove();
        }
        if (rightColumn.querySelector(".player-info")) {
            rightColumn.querySelector(".player-info").remove();
        }
    }
    const showScore = (player) => {
        let div = document.createElement("div");
        div.classList.add("player-info")
        div.innerHTML =
            `<p>Player ${player.getSign()}</p>
            <h1>${player.getName()} </h1>`
        if (player.getSign() == "X" && leftColumn.children.length == 1) {
            forms[0].style.display = "none";
            leftColumn.appendChild(div)
        } else if (player.getSign() == "O" && rightColumn.children.length == 2) {
            forms[1].style.display = "none";
            document.querySelector(".form-player-O").style.display = "none";
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
                clearInterval(check);
                changeGameState("playerXTurn");
                GameBoard.renderBoard();
                GameBoard.watchForchange();
            }
        }, 100)
    };
    const changeGameState = (newState) => {
        gameState = newState;
    };
    const getGameStatus = () => {
        return gameState;
    };
    const startGame = () => {
        checkForPlayers();
    };
    const createPlayer = (name, sign) => {
        if (sign == "X") { playerX = Player(name, sign) }
        else if (sign == "O") { playerO = Player(name, sign) }
    };
    const deletePlayer = (target) => {
        if (target == "X") {
            playerX = null;
        } else if (target == "O") {
            playerO = null;
        }
    }
    const getPlayerO = () => {
        return playerO.getName();
    }
    return { startGame, createPlayer, changeGameState, getGameStatus, deletePlayer, getPlayerO }
})();
GameControlls.addEventListeners();
GameFlow.startGame()