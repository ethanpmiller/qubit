import { shapes, getShape } from './shapes.js';
import { startMusic, playMove, playLineClear, playGameOver } from './sound.js';
import { updateScore, showLeaderboard } from './ui.js';

export function initGame() {
  // Canvas and game variables
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreDiv = document.getElementById('score');
  const leaderboardDiv = document.getElementById('leaderboard');
  const restartBtn = document.getElementById('restartBtn');

  let gridWidth = 10;
  let gridHeight = 20;
  let blockSize = 24;

  let board = [];
  let currentShape, currentShapeIndex, currentX, currentY, currentRotation;
  let gameInterval = null;
  let gameOverFlag = false;
  let score = 0;

  function createBoard() {
    board = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));
  }

  function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
  }

  function getColor(value) {
    const colors = [
      '#00ffff', // I
      '#0000ff', // J
      '#ffa500', // L
      '#ffff00', // O
      '#00ff00', // S
      '#800080', // T
      '#ff0000', // Z
    ];
    return colors[value - 1];
  }

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let y=0; y<gridHeight; y++) {
      for(let x=0; x<gridWidth; x++) {
        if(board[y][x]) {
          drawBlock(x, y, getColor(board[y][x]));
        }
      }
    }
    if(currentShape) {
      drawShape();
    }
  }

  function spawnShape() {
    currentShapeIndex = Math.floor(Math.random() * shapes.length);
    currentShape = getShape(currentShapeIndex);
    currentX = Math.floor(gridWidth/2) - Math.ceil(currentShape[0].length/2);
    currentY = 0;
    currentRotation = 0;
    if(collision(currentX, currentY, currentShape, currentRotation)) {
      gameOver();
    }
  }

  function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
  }

  function getRotatedShape() {
    let shape = currentShape;
    for(let i=0; i<currentRotation; i++) {
      shape = rotate(shape);
    }
    return shape;
  }

  function collision(x, y, shape, rotation) {
    const matrix = shape;
    for(let yIdx=0; yIdx<matrix.length; yIdx++) {
      for(let xIdx=0; xIdx<matrix[yIdx].length; xIdx++) {
        if(matrix[yIdx][xIdx]) {
          let newX = x + xIdx;
          let newY = y + yIdx;
          if(newX<0 || newX>=gridWidth || newY>=gridHeight || (newY>=0 && board[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function move(dx) {
    if(!collision(currentX+dx, currentY, getRotatedShape(), currentRotation)) {
      currentX += dx;
      playMove();
    }
  }

  function rotateShape() {
    const newRotation = (currentRotation + 1) % 4;
    if(!collision(currentX, currentY, currentShape, newRotation)) {
      currentRotation = newRotation;
      playMove();
    }
  }

  function drop() {
    if(!collision(currentX, currentY+1, getRotatedShape(), currentRotation)) {
      currentY++;
    } else {
      lockShape();
      clearLines();
      spawnShape();
    }
    drawBoard();
  }

  function lockShape() {
    const shape = getRotatedShape();
    for(let yIdx=0; yIdx<shape.length; yIdx++) {
      for(let xIdx=0; xIdx<shape[yIdx].length; xIdx++) {
        if(shape[yIdx][xIdx]) {
          let xPos = currentX + xIdx;
          let yPos = currentY + yIdx;
          if(yPos>=0 && yPos<gridHeight && xPos>=0 && xPos<gridWidth) {
            board[yPos][xPos] = currentShapeIndex + 1;
          }
        }
      }
    }
  }

  function clearLines() {
    let linesCleared = 0;
    for(let y=gridHeight-1; y>=0; y--) {
      if(board[y].every(cell => cell)) {
        board.splice(y,1);
        board.unshift(Array(gridWidth).fill(0));
        linesCleared++;
      }
    }
    if(linesCleared > 0) {
      score += linesCleared * 100;
      updateScore(score);
      playLineClear();
    }
  }

  function gameOver() {
    playGameOver();
    clearInterval(gameInterval);
    alert('Game Over! Your score: ' + score);
    saveHighScore();
    showLeaderboard();
  }

  function saveHighScore() {
    let name = prompt('Enter your name for the high score:', 'Player');
    if(!name) name = 'Anonymous';
    const highScores = JSON.parse(localStorage.getItem('qubitHighScores')) || [];
    highScores.push({name, score, time: new Date().toISOString()});
    highScores.sort((a,b) => b.score - a.score);
    if(highScores.length > 10) highScores.pop();
    localStorage.setItem('qubitHighScores', JSON.stringify(highScores));
  }

  function showLeaderboard() {
    const highScores = JSON.parse(localStorage.getItem('qubitHighScores')) || [];
    leaderboardDiv.innerHTML = '';
    highScores.forEach(entry => {
      const div = document.createElement('div');
      div.innerText = `${entry.name} - ${entry.score} (${new Date(entry.time).toLocaleString()})`;
      leaderboardDiv.appendChild(div);
    });
  }

  function drawShape() {
    const shape = getRotatedShape();
    ctx.fillStyle = '#fff';
    for(let yIdx=0; yIdx<shape.length; yIdx++) {
      for(let xIdx=0; xIdx<shape[yIdx].length; xIdx++) {
        if(shape[yIdx][xIdx]) {
          drawBlock(currentX + xIdx, currentY + yIdx, getColor(currentShapeIndex+1));
        }
      }
    }
  }

  // Control handlers
  document.addEventListener('keydown', e => {
    if(gameOverFlag) return;
    switch(e.key) {
      case 'ArrowLeft': move(-1); break;
      case 'ArrowRight': move(1); break;
      case 'ArrowDown': drop(); break;
      case 'ArrowUp': rotateShape(); break;
      case ' ': // Hard drop
        while(!collision(currentX, currentY+1, getRotatedShape(), currentRotation)) {
          currentY++;
        }
        drop();
        break;
    }
  });

  // Restart button
  document.getElementById('restartBtn').onclick = () => {
    createBoard();
    score = 0;
    updateScore(score);
    gameOverFlag = false;
    spawnShape();
    clearInterval(gameInterval);
    gameInterval = setInterval(drop, 500);
    startMusic();
    showLeaderboard();
  };

  // Initialize game
  createBoard();
  spawnShape();
  gameInterval = setInterval(drop, 500);
  startMusic();

  // Expose some functions globally if needed
  // (Optional: for debugging)
}
