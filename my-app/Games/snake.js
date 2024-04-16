const canvas = document.getElementById('game-board');
const context = canvas.getContext('2d');

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join('C:', 'Users', 'dariu', 'Desktop', 'New folder', 'my-app', 'dataBase', 'data.db');
//const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');
let db = new sqlite3.Database(dbPath);


let score = 0;
let snake = [{x: 200, y: 200}];
let direction = {x: 0, y: 0};
let apple = null;

function randomApple() {
    apple = {
        x: Math.floor(Math.random() * canvas.width / 20) * 20,
        y: Math.floor(Math.random() * canvas.height / 20) * 20,
    };
    for (let part of snake) {
        if (part.x === apple.x && part.y === apple.y) return randomApple();
    }
}

function update() {
    const head = {...snake[0]}; // copy head
    head.x += direction.x;
    head.y += direction.y;
    snake.unshift(head);

    if (apple && apple.x === head.x && apple.y === head.y) { // eat apple
        score++;
        randomApple();
    } else {
        snake.pop(); // remove tail
    }

    // game over
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        snake.length = 0;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) snake.length = i;
    }

    document.getElementById('score').textContent = 'Score: ' + score;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    context.fillStyle = 'green';
    for (let part of snake) {
        context.fillRect(part.x, part.y, 20, 20); // draw snake
    }

    if (apple) {
        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, 20, 20); // draw apple
    }
}

function loop() {
    update();
    draw();
    if (snake.length === 0) { // game over
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'red';
        context.font = '50px Arial';
        context.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);

        addScoreIfInTop10();
        setTimeout(restartGame, 2000); // restart the game after 2 seconds
    } else {
        setTimeout(loop, 200);
    }
}

function restartGame() {
    // reset the game state
    score = 0;
    snake = [{x: 200, y: 200}];
    direction = {x: 0, y: 0};
    apple = null;
    randomApple();
    loop(); // start the game loop again
}

loop();
randomApple();

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowLeft': 
            if (direction.x !== 20) direction = {x: -20, y: 0}; 
            break;
        case 'ArrowRight': 
            if (direction.x !== -20) direction = {x: 20, y: 0}; 
            break;
        case 'ArrowUp': 
            if (direction.y !== 20) direction = {x: 0, y: -20}; 
            break;
        case 'ArrowDown': 
            if (direction.y !== -20) direction = {x: 0, y: 20}; 
            break;
    }
});

function insertIntoLeaderboard(name, score, game_id) {
    let user_id = localStorage.getItem('current user id');
    db.run('INSERT INTO leaderboard(name, score, game_id, user_id) VALUES(?, ?, ?, ?)', [name, score, game_id, user_id]);
}

function addScoreIfInTop10()
{
    db.all('SELECT * FROM leaderboard WHERE game_id = ? ORDER BY score DESC LIMIT 10', [1], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        if (rows.length < 10 || rows[rows.length - 1].score < score) {
            insertIntoLeaderboard('Snake', score, 1);
        }
    });
}

window.addEventListener('DOMContentLoaded', (event) => {

    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = '../mainPage/index.html';
    }
    );
});
