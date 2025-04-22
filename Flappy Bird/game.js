// Game configuration
const config = {
  difficulties: {
    easy: {
      pipeSpeed: 2,
      pipeGap: 170,
      pipeDistance: 350
    },
    medium: {
      pipeSpeed: 3,
      pipeGap: 150,
      pipeDistance: 300
    },
    hard: {
      pipeSpeed: 4,
      pipeGap: 130,
      pipeDistance: 250
    }
  }
};

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const pipeWidth = 80;
let pipes = [];

// Get screen elements
const startScreen = document.getElementById('startScreen');
const customizeScreen = document.getElementById('customizeScreen');
const leaderboardScreen = document.getElementById('leaderboardScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

// Get buttons and inputs
const startButton = document.getElementById('startButton');
const customizeButton = document.getElementById('customizeButton');
const leaderboardButton = document.getElementById('leaderboardButton');
const backFromCustomize = document.getElementById('backFromCustomize');
const backFromLeaderboard = document.getElementById('backFromLeaderboard');
const playAgainButton = document.getElementById('playAgainButton');
const mainMenuButton = document.getElementById('mainMenuButton');
const playerNameInput = document.getElementById('playerName');
const finalScoreSpan = document.getElementById('finalScore');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

// Get color option containers
const birdColorsDiv = document.getElementById('birdColors');
const eyeColorsDiv = document.getElementById('eyeColors');
const beakColorsDiv = document.getElementById('beakColors');
const birdPreview = document.getElementById('birdPreview');

// Game variables
let gameRunning = false;
let gameOver = false;
let score = 0;
let playerName = "Player";
let currentDifficulty = 'medium'; // Default difficulty

// Memory-based leaderboard
let leaderboard = [
  { name: "Bird Master", score: 25, difficulty: "hard", date: "4/15/2025" },
  { name: "Flappy Pro", score: 18, difficulty: "medium", date: "4/10/2025" },
  { name: "Sky Diver", score: 12, difficulty: "easy", date: "4/5/2025" }
];

// Bird properties
const bird = {
  x: canvas.width / 4,
  y: canvas.height / 2,
  width: 40,
  height: 30,
  gravity: 0.5,
  velocity: 0,
  jump: -10,
  color: '#FF6B6B',
  eyeColor: 'black',
  beakColor: 'orange'
};

// Available colors for customization
const colorOptions = {
  body: ['#FF6B6B', '#66CCFF', '#FFFF66', '#66FF66', '#FF66FF', '#FFFFFF'],
  eye: ['black', '#0000FF', '#FF0000', '#00FF00', '#FFFFFF'],
  beak: ['orange', '#FFD700', '#FF0000', '#8B4513', '#FFFFFF']
};

// Game colors
const colors = {
  pipe: '#4CAF50',
  ground: '#8B4513',
  sky: '#87CEEB',
  text: '#000000'
};

// Initialize game
function init() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  
  // Create initial pipes
  for (let i = 0; i < 3; i++) {
    createPipe(canvas.width + i * config.difficulties[currentDifficulty].pipeDistance);
  }
}

// Create a new pipe
function createPipe(x) {
  const minHeight = 50;
  const maxHeight = canvas.height - config.difficulties[currentDifficulty].pipeGap - minHeight - 100;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  
  pipes.push({
    x: x,
    topHeight: topHeight,
    bottomY: topHeight + config.difficulties[currentDifficulty].pipeGap,
    passed: false
  });
}

// Draw the bird
function drawBird(x, y, size = 1, context = ctx) {
  if (!context) return;
  
  const width = bird.width * size;
  const height = bird.height * size;
  
  // Bird body
  context.fillStyle = bird.color;
  context.beginPath();
  context.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI);
  context.fill();
  
  // Draw wing
  context.beginPath();
  context.ellipse(x - 5 * size, y, 12 * size, 7 * size, Math.PI / 4, 0, 2 * Math.PI);
  context.fill();
  
  // Draw eye
  context.fillStyle = 'white';
  context.beginPath();
  context.arc(x + 10 * size, y - 5 * size, 5 * size, 0, 2 * Math.PI);
  context.fill();
  
  context.fillStyle = bird.eyeColor;
  context.beginPath();
  context.arc(x + 12 * size, y - 5 * size, 2 * size, 0, 2 * Math.PI);
  context.fill();
  
  // Draw beak
  context.fillStyle = bird.beakColor;
  context.beginPath();
  context.moveTo(x + 20 * size, y);
  context.lineTo(x + 30 * size, y - 5 * size);
  context.lineTo(x + 30 * size, y + 5 * size);
  context.fill();
}

// Draw pipes
function drawPipes() {
  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillStyle = colors.pipe;
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    
    // Pipe cap
    ctx.fillStyle = '#2E8B57';
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipeWidth + 10, 20);
    
    // Bottom pipe
    ctx.fillStyle = colors.pipe;
    ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY - 100);
    
    // Pipe cap
    ctx.fillStyle = '#2E8B57';
    ctx.fillRect(pipe.x - 5, pipe.bottomY, pipeWidth + 10, 20);
  });
}

// Draw ground
function drawGround() {
  ctx.fillStyle = colors.ground;
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
  
  // Add some texture to the ground
  ctx.fillStyle = '#A0522D';
  for (let i = 0; i < canvas.width; i += 30) {
    ctx.fillRect(i, canvas.height - 100, 20, 5);
  }
}

// Draw clouds
function drawClouds() {
  ctx.fillStyle = 'white';
  
  // Cloud 1
  ctx.beginPath();
  ctx.arc(100, 100, 30, 0, 2 * Math.PI);
  ctx.arc(130, 90, 30, 0, 2 * Math.PI);
  ctx.arc(160, 100, 25, 0, 2 * Math.PI);
  ctx.arc(130, 110, 25, 0, 2 * Math.PI);
  ctx.fill();
  
  // Cloud 2
  ctx.beginPath();
  ctx.arc(350, 150, 25, 0, 2 * Math.PI);
  ctx.arc(380, 140, 25, 0, 2 * Math.PI);
  ctx.arc(410, 150, 20, 0, 2 * Math.PI);
  ctx.arc(380, 160, 20, 0, 2 * Math.PI);
  ctx.fill();
}

// Draw score
function drawScore() {
  ctx.fillStyle = colors.text;
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(score, canvas.width / 2, 50);
}

// Update game state
function update() {
  if (!gameRunning || gameOver) return;
  
  // Update bird position
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  
  // Check for collision with ground
  if (bird.y + bird.height / 2 > canvas.height - 100) {
    bird.y = canvas.height - 100 - bird.height / 2;
    endGame();
  }
  
  // Check for collision with ceiling
  if (bird.y - bird.height / 2 < 0) {
    bird.y = bird.height / 2;
    bird.velocity = 0;
  }
  
  // Update pipes
  pipes.forEach(pipe => {
    pipe.x -= config.difficulties[currentDifficulty].pipeSpeed;
    
    // Check for collision with pipes
    if (
      bird.x + bird.width / 2 > pipe.x && 
      bird.x - bird.width / 2 < pipe.x + pipeWidth &&
      (bird.y - bird.height / 2 < pipe.topHeight || bird.y + bird.height / 2 > pipe.bottomY)
    ) {
      endGame();
    }
    
    // Check if bird passed the pipe
    if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
      pipe.passed = true;
      score++;
    }
  });
  
  // Remove pipes that are off screen
  if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
    pipes.shift();
    createPipe(pipes[pipes.length - 1].x + config.difficulties[currentDifficulty].pipeDistance);
  }
}

// Draw game
function draw() {
  // Clear canvas
  ctx.fillStyle = colors.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawClouds();
  drawPipes();
  drawGround();
  drawBird(bird.x, bird.y);
  drawScore();
}

// Game loop
function gameLoop() {
  if (gameRunning) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Handle jump
function jump() {
  if (!gameRunning || gameOver) return;
  bird.velocity = bird.jump;
}

// Start game
function startGame() {
  hideAllScreens();
  gameRunning = true;
  gameOver = false;
  init();
  requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
  gameOver = true;
  gameRunning = false;
  
  // Update leaderboard
  updateLeaderboard();
  
  // Show game over screen
  finalScoreSpan.textContent = score;
  gameOverScreen.style.display = 'flex';
}

// Update leaderboard
function updateLeaderboard() {
  // Format current date
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  // Add current score to leaderboard
  leaderboard.push({
    name: playerName,
    score: score,
    difficulty: currentDifficulty,
    date: dateStr
  });
  
  // Sort leaderboard by score (highest first)
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top 10 scores
  if (leaderboard.length > 10) {
    leaderboard = leaderboard.slice(0, 10);
  }
  
  // Update leaderboard display
  updateLeaderboardDisplay();
}

// Update leaderboard display
function updateLeaderboardDisplay() {
  const leaderboardBody = document.getElementById('leaderboardBody');
  leaderboardBody.innerHTML = '';
  
  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    
    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1;
    
    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name;
    
    const scoreCell = document.createElement('td');
    scoreCell.textContent = entry.score;
    
    const difficultyCell = document.createElement('td');
    difficultyCell.textContent = entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1);
    
    const dateCell = document.createElement('td');
    dateCell.textContent = entry.date;
    
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    row.appendChild(difficultyCell);
    row.appendChild(dateCell);
    
    leaderboardBody.appendChild(row);
  });
}

// Create color options for customization
function createColorOptions() {
  // Bird color options
  birdColorsDiv.innerHTML = '';
  colorOptions.body.forEach(color => {
    const option = document.createElement('div');
    option.className = 'color-option';
    option.style.backgroundColor = color;
    if (color === bird.color) {
      option.classList.add('selected');
    }
    option.onclick = () => {
      document.querySelectorAll('#birdColors .color-option').forEach(el => el.classList.remove('selected'));
      option.classList.add('selected');
      bird.color = color;
      updateBirdPreview();
    };
    birdColorsDiv.appendChild(option);
  });
  
  // Eye color options
  eyeColorsDiv.innerHTML = '';
  colorOptions.eye.forEach(color => {
    const option = document.createElement('div');
    option.className = 'color-option';
    option.style.backgroundColor = color;
    if (color === bird.eyeColor) {
      option.classList.add('selected');
    }
    option.onclick = () => {
      document.querySelectorAll('#eyeColors .color-option').forEach(el => el.classList.remove('selected'));
      option.classList.add('selected');
      bird.eyeColor = color;
      updateBirdPreview();
    };
    eyeColorsDiv.appendChild(option);
  });
  
  // Beak color options
  beakColorsDiv.innerHTML = '';
  colorOptions.beak.forEach(color => {
    const option = document.createElement('div');
    option.className = 'color-option';
    option.style.backgroundColor = color;
    if (color === bird.beakColor) {
      option.classList.add('selected');
    }
    option.onclick = () => {
      document.querySelectorAll('#beakColors .color-option').forEach(el => el.classList.remove('selected'));
      option.classList.add('selected');
      bird.beakColor = color;
      updateBirdPreview();
    };
    beakColorsDiv.appendChild(option);
  });
}

// Update bird preview in customization screen
function updateBirdPreview() {
  // Create a new canvas element
  const previewCanvas = document.createElement('canvas');
  previewCanvas.width = 100;
  previewCanvas.height = 100;
  const previewCtx = previewCanvas.getContext('2d');
  
  // Draw background
  previewCtx.fillStyle = '#87CEEB';
  previewCtx.fillRect(0, 0, 100, 100);
  
  // Draw bird
  drawBird(50, 50, 1.5, previewCtx);
  
  // Update preview
  birdPreview.innerHTML = '';
  birdPreview.appendChild(previewCanvas);
}

// Show customize screen
function showCustomizeScreen() {
  hideAllScreens();
  customizeScreen.style.display = 'flex';
  createColorOptions();
  updateBirdPreview();
}

// Show leaderboard screen
function showLeaderboardScreen() {
  hideAllScreens();
  leaderboardScreen.style.display = 'flex';
  updateLeaderboardDisplay();
}

// Show start screen
function showStartScreen() {
  hideAllScreens();
  startScreen.style.display = 'flex';
}

// Hide all screens
function hideAllScreens() {
  startScreen.style.display = 'none';
  customizeScreen.style.display = 'none';
  leaderboardScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
}

// Set difficulty
function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  difficultyButtons.forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.difficulty === difficulty) {
      btn.classList.add('selected');
    }
  });
}

// Event listeners for the game
function setupEventListeners() {
  canvas.addEventListener('click', jump);
  startButton.addEventListener('click', startGame);
  customizeButton.addEventListener('click', showCustomizeScreen);
  leaderboardButton.addEventListener('click', showLeaderboardScreen);
  backFromCustomize.addEventListener('click', showStartScreen);
  backFromLeaderboard.addEventListener('click', showStartScreen);
  
  playAgainButton.addEventListener('click', () => {
    hideAllScreens();
    gameRunning = true;
    gameOver = false;
    init();
    requestAnimationFrame(gameLoop);
  });
  
  mainMenuButton.addEventListener('click', showStartScreen);
  
  // Difficulty button listeners
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setDifficulty(btn.dataset.difficulty);
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      jump();
    }
  });
}

// Initialize everything
function initialize() {
  setupEventListeners();
  createColorOptions();
  showStartScreen();
  updateLeaderboardDisplay();
  setDifficulty('medium'); // Set default difficulty
}

// Call initialize when the window loads
window.addEventListener('load', initialize); 
