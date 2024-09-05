/*
*
* "board" is a matrix that holds data about the
* game board, in a form of BoardSquare objects
*
* openedSquares holds the position of the opened squares
*
* flaggedSquares holds the position of the flagged squares
*
 */

/*
*
* simple object to keep the data for each square
* of the board
*
*/
class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;
let boardMetadataGlobal = {};
let gameDifficulty = 'easy';
const directions = [
    new Pair(-1, -1), new Pair(-1, 0), new Pair(-1, 1), // Top-left, Top-center, Top-right
    new Pair(0, -1), new Pair(0, 1), // Left, Right
    new Pair(1, -1), new Pair(1, 0), new Pair(1, 1)  // Bottom-left, Bottom-center, Bottom-right
];

const checkNeigh = [
    new Pair(-1, 0), // Top-left, Top-center, Top-right
    new Pair(0, -1), new Pair(0, 1), // Left, Right
    new Pair(1, 0)  // Bottom-left, Bottom-center, Bottom-right
];

/*
*
* the probability of a bomb in each square
*
 */
let bombProbability = 3;
let maxProbability = 15;

function minesweeperGameBootstrapper(rowCount, colCount) {
    console.log(rowCount, colCount);
    let easy = {
        'rowCount': 9,
        'colCount': 9,
    };
    // TODO you can declare here the medium and expert difficulties

    let medium = {
        'rowcount': 15,
        'colCount': 15
    }

    let hard = {
        'rowcount': 20,
        'colCount': 20
    }

    if (rowCount == null && colCount == null) {
        // TODO have a default difficulty
        rowCount = easy.rowCount;
        colCount = easy.colCount;
    } else {
        generateBoard({ 'rowCount': rowCount, 'colCount': colCount });
    }
}

function generateBoard(boardMetadata) {
    boardMetadataGlobal = boardMetadata;

    /*
    *
    * "generate" an empty matrix
    *
     */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        board[i] = new Array(boardMetadata.rowCount);
    }



    /*
    *
    * TODO fill the matrix with "BoardSquare" objects, that are in a pre-initialized state
    *
    */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            board[i][j] = new BoardSquare();
        }
    }


    /*
    *
    * "place" bombs according to the probabilities declared at the top of the file
    * those could be read from a config file or env variable, but for the
    * simplicity of the solution, I will not do that
    *
    */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            // TODO place the bomb, you can use the following formula: Math.random() * maxProbability < bombProbability
            if (Math.random() * maxProbability < bombProbability) {
                board[i][j].hasBomb = true;
            } else {
                board[i][j].hasBomb = false;
                squaresLeft++;
            }
        }
    }



    /*
    *
    * TODO set the state of the board, with all the squares closed
    * and no flagged squares
    *
     */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        openedSquares[i] = new Array(boardMetadata.rowCount);
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            openedSquares[i][j] = false;
        }
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        flaggedSquares[i] = new Array(boardMetadata.rowCount);
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            flaggedSquares[i][j] = false;
        }
    }

    //BELOW THERE ARE SHOWCASED TWO WAYS OF COUNTING THE VICINITY BOMBS

    /*
    *
    * TODO count the bombs around each square
    *
    */

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            let bombCount = 0;

            if (board[i][j].hasBomb != true) {
                for (const coordinate of checkNeigh) {
                    const newRow = i + coordinate.x;
                    const newCol = j + coordinate.y;

                    // Check if the new cell is within bounds
                    if (newRow >= 0 && newRow < boardMetadata.rowCount && newCol >= 0 && newCol < boardMetadata.colCount) {
                        if (board[newRow][newCol].hasBomb == true) {
                            bombCount++;
                        }
                    }
                }
                board[i][j].bombsAround = bombCount;

            } else {
                const cell = document.getElementById(`cell-r${i}-c${j}`);
            }

        }
    }

    /*
    *
    * print the board to the console to see the result
    *
    */
    // console.log(board);
}




/*
* call the function that "handles the game"
* called at the end of the file, because if called at the start,
* all the global variables will appear as undefined / out of scope
*
 */
// minesweeperGameBootstrapper(5, 5);

// TODO create the other required functions such as 'discovering' a tile, and so on (also make sure to handle the win/loss cases)
function discoverTile(row, col) {
    if (board[row][col].hasBomb == true) {
        const cell = document.getElementById(`cell-r${row}-c${col}`);
        const bombCountElem = document.createElement('span');
        bombCountElem.textContent = '💣';
        cell.appendChild(bombCountElem)
        handleLoss();
    } else {
        squaresLeft--;
        uncoverTiles(row, col);
        
        if (squaresLeft <= 0) {
            handleWin();
        }
    }
}

function uncoverTiles(row, col) {
    if (openedSquares[row][col] == true)
        return;

    openedSquares[row][col] = true;
    const button = document.getElementById(`button-${row}-${col}`);
    button.style.display = 'none';

    uncoverTiles(row, col);
    const cell = document.getElementById(`cell-r${row}-c${col}`);
    // Create and append the bomb count span
    const bombCountElem = document.createElement('span');
    bombCountElem.textContent = board[row][col].bombsAround;
    cell.appendChild(bombCountElem)
    squaresLeft--;

    for (const coordinate of checkNeigh) {
        const newRow = parseInt(row, 10) + coordinate.x;
        const newCol = parseInt(col, 10) + coordinate.y;

        if (newRow >= 0 && newRow < boardMetadataGlobal.rowCount && newCol >= 0 && newCol < boardMetadataGlobal.colCount) {
            //console.log(`${newRow} ${newCol} ${openedSquares[newRow][newCol]} ${board[newRow][newCol].hasBomb}`);
            if (openedSquares[newRow][newCol] == false && board[newRow][newCol].hasBomb == false) {

                uncoverTiles(newRow, newCol);
            }
        }
    }
}

function handleLoss() {
    // TODO
    console.log("u lost");
    var myModal = new bootstrap.Modal(document.getElementById('lostModal'));
    myModal.show();
}

function handleWin() {
    console.log("u won");
    var myModal = new bootstrap.Modal(document.getElementById('winModal'));
    myModal.show();
}


// Listen for difficulty change and update the grid accordingly
document.getElementById('difficulty').addEventListener('change', function () {
    var selectedDifficulty = this.value;
    console.log(difficulty);
    gameDifficulty = selectedDifficulty;
    let size = updateGrid(selectedDifficulty);
    minesweeperGameBootstrapper(Math.sqrt(size), Math.sqrt(size));
});

document.getElementById('modal-button').addEventListener('click', function () {
    updateGrid('easy');
    minesweeperGameBootstrapper(9, 9);
});

document.getElementById('modal-button-lost').addEventListener('click', function () {
    updateGrid(gameDifficulty);
    minesweeperGameBootstrapper(9, 9);
});

// Function to create and update the grid
function updateGrid(difficulty) {
    var gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    var bombInput = document.getElementById('bombInput');
    var maxInput = document.getElementById('maxInput');

    let size;
    if (difficulty === 'easy') {
        size = 9;
        bombProbability = 3;
    } else if (difficulty === 'medium') {
        size = 15;
        bombProbability = 5;
    } else if (difficulty === 'hard') {
        size = 20;
        bombProbability = 7;
    }
    bombInput.value = bombProbability;
    maxInput.value = maxProbability;

    gridContainer.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    gridContainer.style.width = `${size * 30}px`;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.id = `cell-r${i}-c${j}`;

            const button = document.createElement('button');
            const randomColor = `hsl(${90 + Math.random() * 50}, 60%, 40%)`;
            button.style.backgroundColor = randomColor;
            button.style.width = '100%';
            button.style.height = '100%';
            button.style.zIndex = '10';
            button.className = "button";
            button.id = `button-${i}-${j}`;

            // Add click event listener to the button
            button.addEventListener('click', function (event) {
                    // Left click
                    button.style.display = 'none';
                    const buttonId = event.target.id;
                    const parts = buttonId.split('-');
                    // get row and column
                    const rowPart = parts[1];
                    const colPart = parts[2];
    
                    discoverTile(rowPart, colPart);
            });

            document.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                const buttonId = event.target.id;
                if(buttonId != null){
                    const parts = buttonId.split('-');
                    // get row and column
                    const rowPart = parts[1];
                    const colPart = parts[2];
                    flagCell(rowPart, colPart);
                }
              
            });


            // Append button to cell and cell to grid container
            cell.appendChild(button);
            gridContainer.appendChild(cell);
        }
    }

    return size * size;
}


// Flag a cell
function flagCell(row, col){
    const button = document.getElementById(`button-${row}-${col}`);
    button.innerHTML = "🚩 ";
    flaggedSquares[row][col] = true;
}


// Adjust values for bombProbability

document.getElementById('increase').addEventListener('click', function() {
    let input = document.getElementById('bombInput');
    let value = parseInt(input.value, 10);
    bombProbability = value + 1;
    input.value = bombProbability;
    generateBoard({ 'rowCount': boardMetadataGlobal.rowCount, 'colCount': boardMetadataGlobal.colCount });
});

document.getElementById('decrease').addEventListener('click', function() {
    let input = document.getElementById('bombInput');
    let value = parseInt(input.value, 10);
    if (value > 3) { // Prevent going below 0
        bombProbability = value - 1;
        input.value = bombProbability;
        generateBoard({ 'rowCount': boardMetadataGlobal.rowCount, 'colCount': boardMetadataGlobal.colCount });
    }
});

document.getElementById('increaseMax').addEventListener('click', function() {
    let input = document.getElementById('maxInput');
    let value = parseInt(input.value, 10);
    maxProbability = value + 1;
    input.value = maxProbability;
    generateBoard({ 'rowCount': boardMetadataGlobal.rowCount, 'colCount': boardMetadataGlobal.colCount });
});

document.getElementById('decreaseMax').addEventListener('click', function() {
    let input = document.getElementById('maxInput');
    let value = parseInt(input.value, 10);
    if (value > 15) { // Prevent going below 0
        maxProbability = value - 1;
        input.value = maxProbability;
        generateBoard({ 'rowCount': boardMetadataGlobal.rowCount, 'colCount': boardMetadataGlobal.colCount });
    }
});

// Initialize with the Easy grid on page load
window.onload = function () {
    updateGrid('easy');
    minesweeperGameBootstrapper(9, 9);
};


