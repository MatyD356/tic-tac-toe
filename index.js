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
    const addEventListeners = () => {
        //showing forms
        const forms = Array.from(document.querySelectorAll(".form"));
        document.querySelector(".start").addEventListener("click", () => {
            for (let i = 0; i < forms.length; i++) {
                forms[i].style.display = "block";
            }
            gameFlow.changeGameState("creatingPlayers")
        });
        //create btns
        const createButtons = Array.from(document.querySelectorAll(".create"));
        for (let i = 0; i < createButtons.length; i++) {
            if (createButtons[i].textContent == "Play vs Human") {
                createButtons[i].addEventListener("click", () => {
                    forms[1].style.display = "none";
                    document.querySelector(".form-player-O").style.display = "block";
                });
            } else if (createButtons[i].textContent == "Create Player") {
                let inputs = Array.from(document.querySelectorAll(".name-input"));
                let playerName = null;
                if (i == 0) {
                    playerName = inputs[0].value
                } else if (i == 3) {
                    playerName = inputs[1].value
                }
                createButtons[i].addEventListener("click", () => {
                    gameFlow.createPlayer(playerName, createButtons[i].id)
                });
            } else if (createButtons[i].textContent == "Play vs AI") {
                createButtons[i].addEventListener("click", () => {
                    gameFlow.createPlayer("AI", "O")
                })
            };
        }
    };
    return { makeMove, renderBoard, addEventListeners };
})();

const Player = ((name, sign) => {
    const getName = () => name;
    const getSign = () => sign;
    return { getName, getSign };
});

const gameFlow = (() => {
    let gameState = "start";
    let playerX = null;
    let playerO = null;

    const changeGameState = (newState) => {
        gameState = newState;
    }

    const startGame = () => {
        GameBoard.renderBoard();
        GameBoard.addEventListeners();

    }

    const createPlayer = (name, sign) => {
        if (sign == "X") { playerX = Player(name, sign) }
        else if (sign == "O") { playerO = Player(name, sign) }
        console.log(playerX.getName(), playerX.getSign())
        console.log(playerO.getName(), playerO.getSign())
    }
    return { startGame, createPlayer, changeGameState }
})();

gameFlow.startGame()