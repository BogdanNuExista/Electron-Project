const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
//const dbPath = path.join('C:', 'Users', 'dariu', 'Desktop', 'New folder', 'my-app', 'dataBase', 'data.db');\
const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');

let db = new sqlite3.Database(dbPath);


const row = 20;
const col = 10;
const sq = 30;
const vacant = 'white'; // color of an empty square

// draw a square
function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x*sq, y*sq, sq, sq);
    context.strokeStyle = 'black';
    context.strokeRect(x*sq, y*sq, sq, sq);
}

// create the board
let board = [];
for (let r = 0; r < row; r++) {
    board[r] = [];
    for (let c = 0; c < col; c++) {
        board[r][c] = vacant;
    }
}

// draw the board
function drawBoard() {
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < col; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// the pieces and their patterns

const Z = [
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,0,1],
        [0,1,1],
        [0,1,0]
    ],
    [
        [0,0,0],
        [1,1,0],
        [0,1,1]
    ],
    [
        [0,1,0],
        [1,1,0],
        [1,0,0]
    ]
];

const S = [
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [0,1,0],
        [0,1,1],
        [0,0,1]
    ],
    [
        [0,0,0],
        [0,1,1],
        [1,1,0]
    ],
    [
        [1,0,0],
        [1,1,0],
        [0,1,0]
    ]
];

const T = [
    [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],
    [
        [0,1,0],
        [0,1,1],
        [0,1,0]
    ],
    [
        [0,0,0],
        [1,1,1],
        [0,1,0]
    ],
    [
        [0,1,0],
        [1,1,0],
        [0,1,0]
    ]
];

const O = [
    [
        [1,1],
        [1,1]
    ]
];

const L = [
    [
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [0,0,0],
        [1,1,1],
        [1,0,0]
    ],
    [
        [1,1,0],
        [0,1,0],
        [0,1,0]
    ]
];

const I = [
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0]
    ],
    [
        [0,0,0,0],
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0]
    ],
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ]
];

const J = [
    [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [0,1,0],
        [0,1,0]
    ],
    [
        [0,0,0],
        [1,1,1],
        [0,0,1]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ]
];

// the pieces and their colors
const pieces = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'yellow'],
    [O, 'blue'],
    [L, 'purple'],
    [I, 'cyan'],
    [J, 'orange']
];

// generate random pieces
function randomPiece() {
    let r = Math.floor(Math.random() * pieces.length);
    return new Piece(pieces[r][0], pieces[r][1]);
}

let p = randomPiece();

// The object Piece
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0; // start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    // control the pieces
    this.x = 3;
    this.y = -2;
}

// draw a piece to the board
Piece.prototype.fill = function(color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // draw only occupied squares
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

// draw a piece to the board
Piece.prototype.draw = function() {
    this.fill(this.color);
}

// undraw a piece
Piece.prototype.unDraw = function() {
    this.fill(vacant);
}

// move down the piece
Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
}

// move right the piece
Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move left the piece
Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
        if (this.x > col / 2) {
            // it's the right wall
            kick = -1; // need to move the piece to the left
        } else {
            // it's the left wall
            kick = 1; // need to move the piece to the right
        }
    }
    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

Piece.prototype.lock = function() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // skip the vacant squares
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // pieces to lock on top = game over
            if (this.y + r < 0) {
                
                context.fillStyle = 'black';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = 'red';
                context.font = '50px Arial';
                context.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2, 200, 100);
                
                // stop request animation frame
                gameOver = true;
                addScoreIfInTop10();
                setTimeout(restartGame, 2000); // restart the game after 2 seconds
                
            }
            // lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // remove full rows
    for (let r = 0; r < row; r++) {
        let isRowFull = true;
        for (let c = 0; c < col; c++) {
            isRowFull = isRowFull && (board[r][c] != vacant);
        }
        if (isRowFull) {
            // if the row is full
            // we move down all the rows above it
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < col; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for (let c = 0; c < col; c++) {
                board[0][c] = vacant;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();
    // update the score
    scoreElement.innerHTML = score;
}

// collision function
Piece.prototype.collision = function(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            // conditions
            if (newX < 0 || newX >= col || newY >= row) {
                return true;
            }
            // skip newY < 0; board[-1] will crash our game
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece already in place
            if (board[newY][newX] != vacant) {
                return true;
            }
        }
    }
    return false;
}

// CONTROL the piece
document.addEventListener('keydown', CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
    } else if (event.keyCode == 38) {
        p.rotate();
    } else if (event.keyCode == 39) {
        p.moveRight();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}

// drop the piece every 1sec
let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();

/////////////////////////

function restartGame() {
    // reset the game state
    context.clearRect(0, 0, canvas.width, canvas.height);

    score = 0;
    board = [];
    for (let r = 0; r < row; r++) {
        board[r] = [];
        for (let c = 0; c < col; c++) {
            board[r][c] = vacant;
        }
    }
    drawBoard();
    scoreElement.innerHTML = score;
    p = randomPiece();
    drop();
}

function insertIntoLeaderboard(name, score, game_id)
{
    let user_id = localStorage.getItem('current user id');
    db.run('INSERT INTO leaderboard(name, score, game_id, user_id) VALUES(?, ?, ?, ?)', [name, score, game_id, user_id]);
}

function addScoreIfInTop10()
{
    db.all('SELECT * FROM leaderboard WHERE game_id = ? ORDER BY score DESC LIMIT 10', [2], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        if (rows.length < 10 || rows[rows.length - 1].score < score) {
            insertIntoLeaderboard('Tetris', score, 2);
        }
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = '../mainPage/index.html';
    });
});