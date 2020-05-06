const GameBoard = (() => {

    const container = document.querySelector(".board-container");
    const board = ["", "", "", "", "", "", "", "", ""];
    const makeMove = (move, target) => {
        if (move == "X") {
            if (board[target] == "") {
                board[target] = move
                console.log(`making ${move} on ${target} square`)
                console.log(board)
                renderBoard();
            } else {
                console.log("not a valid move");
            }
        } else if (move == "O") {
            if (board[target] == "") {
                board[target] = move;
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
        for (let i = 0; i < board.length; i++) {
            let div = document.createElement("div");
            div.textContent = board[i];
            div.classList.add("board-square");
            div.setAttribute("data-index", i)
            container.appendChild(div);
        };
    };
    const watchForchange = () => {
        const gameBoard = document.querySelector(".board-container");
        gameBoard.addEventListener("click", (e) => {
            if (GameFlow.getGameStatus() == "playerXTurn") {
                console.log(container)
                makeMove("X", e.target.dataset.index);
                console.log(e.target);
                GameFlow.changeGameState("playerOTurn")
            } else if (GameFlow.getGameStatus() == "playerOTurn") {
                console.log(container)
                makeMove("O", e.target.dataset.index);
                console.log(e.target);
                GameFlow.changeGameState("playerXTurn")
            }
        });
    };

    return { makeMove, renderBoard, watchForchange };
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
    }

    const changeGameState = (newState) => {
        gameState = newState;
    }
    const getGameStatus = () => {
        return gameState;
    }

    const startGame = () => {
        GameControlls.addEventListeners();
        checkForPlayers();
    }

    const createPlayer = (name, sign) => {
        if (sign == "X") { playerX = Player(name, sign) }
        else if (sign == "O") { playerO = Player(name, sign) }
        console.log(playerX.getName(), playerX.getSign())
        console.log(playerO.getName(), playerO.getSign())
    }

    return { startGame, createPlayer, changeGameState, getGameStatus }
})();

GameFlow.startGame()