// Game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// Set canvas size
canvas.width = 400;
canvas.height = 400;

// Game settings
const gridSize = 20;
const initialSpeed = 150;
let speed = initialSpeed;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// Snake and food
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameInterval;
let isGameRunning = false;

// Initialize game
function initGame() {
    // Create initial snake
    snake = [
        {x: 5 * gridSize, y: 10 * gridSize},
        {x: 4 * gridSize, y: 10 * gridSize},
        {x: 3 * gridSize, y: 10 * gridSize}
    ];
    
    // Generate first food
    generateFood();
    
    // Reset score and speed
    score = 0;
    speed = initialSpeed;
    scoreElement.textContent = score;
    
    // Set initial direction
    direction = 'right';
    nextDirection = 'right';
}

// Generate food at random position
function generateFood() {
    const maxPos = canvas.width / gridSize;
    food = {
        x: Math.floor(Math.random() * maxPos) * gridSize,
        y: Math.floor(Math.random() * maxPos) * gridSize
    };
    
    // Make sure food doesn't appear on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            return generateFood();
        }
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head with different color
            ctx.fillStyle = '#4cc9f0';
        } else {
            // Body with gradient
            const gradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + gridSize, segment.y + gridSize);
            gradient.addColorStop(0, '#4cc9f0');
            gradient.addColorStop(1, '#4895ef');
            ctx.fillStyle = gradient;
        }
        
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        
        // Add eyes to the head
        if (index === 0) {
            ctx.fillStyle = 'white';
            // Position eyes based on direction
            if (direction === 'right') {
                ctx.fillRect(segment.x + 13, segment.y + 5, 4, 4);
                ctx.fillRect(segment.x + 13, segment.y + 11, 4, 4);
            } else if (direction === 'left') {
                ctx.fillRect(segment.x + 3, segment.y + 5, 4, 4);
                ctx.fillRect(segment.x + 3, segment.y + 11, 4, 4);
            } else if (direction === 'up') {
                ctx.fillRect(segment.x + 5, segment.y + 3, 4, 4);
                ctx.fillRect(segment.x + 11, segment.y + 3, 4, 4);
            } else if (direction === 'down') {
                ctx.fillRect(segment.x + 5, segment.y + 13, 4, 4);
                ctx.fillRect(segment.x + 11, segment.y + 13, 4, 4);
            }
        }
    });
    
    // Draw food with animation effect
    const pulse = Math.sin(Date.now() / 200) * 2 + 2;
    ctx.fillStyle = '#f72585';
    ctx.beginPath();
    ctx.arc(
        food.x + gridSize / 2,
        food.y + gridSize / 2,
        gridSize / 2 - pulse,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Update game state
function update() {
    // Move snake
    const head = {x: snake[0].x, y: snake[0].y};
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    switch (direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }
    
    // Check for collisions with walls
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        gameOver();
        return;
    }
    
    // Check for collisions with self
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        scoreElement.textContent = score;
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // Increase speed slightly
        speed = Math.max(initialSpeed - (score / 2), 50);
        
        // Generate new food
        generateFood();
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startBtn.textContent = 'Start Game';
    
    // Show game over animation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f72585';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Start game function
function startGame() {
    if (isGameRunning) {
        // Pause game
        clearInterval(gameInterval);
        isGameRunning = false;
        startBtn.textContent = 'Resume Game';
    } else {
        // Start or resume game
        if (!isGameRunning && snake.length === 0) {
            initGame();
        }
        isGameRunning = true;
        startBtn.textContent = 'Pause Game';
        gameInterval = setInterval(gameLoop, speed);
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
}

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
        case ' ':
            if (!isGameRunning && snake.length > 0) {
                startGame();
            }
            break;
    }
});

// Button event listeners
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
    clearInterval(gameInterval);
    initGame();
    draw();
    isGameRunning = false;
    startBtn.textContent = 'Start Game';
});

// Mobile controls
upBtn.addEventListener('click', () => { if (direction !== 'down') nextDirection = 'up'; });
downBtn.addEventListener('click', () => { if (direction !== 'up') nextDirection = 'down'; });
leftBtn.addEventListener('click', () => { if (direction !== 'right') nextDirection = 'left'; });
rightBtn.addEventListener('click', () => { if (direction !== 'left') nextDirection = 'right'; });

// Initial draw
initGame();
draw();
