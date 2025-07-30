// Game elements
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
function resizeCanvas() {
    const size = Math.min(window.innerWidth - 40, 400);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game settings
const gridSize = 20;
const initialSpeed = 150;
let speed = initialSpeed;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// Game state
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameInterval;
let isGameRunning = false;

// Initialize game
function initGame() {
    snake = [
        {x: 5 * gridSize, y: 10 * gridSize},
        {x: 4 * gridSize, y: 10 * gridSize},
        {x: 3 * gridSize, y: 10 * gridSize}
    ];
    generateFood();
    score = 0;
    speed = initialSpeed;
    scoreElement.textContent = score;
    direction = 'right';
    nextDirection = 'right';
}

// Generate food
function generateFood() {
    const maxPos = Math.floor(canvas.width / gridSize);
    food = {
        x: Math.floor(Math.random() * maxPos) * gridSize,
        y: Math.floor(Math.random() * maxPos) * gridSize
    };
    
    // Ensure food doesn't appear on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            return generateFood();
        }
    }
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#4cc9f0';
        } else {
            const gradient = ctx.createLinearGradient(
                segment.x, segment.y, 
                segment.x + gridSize, segment.y + gridSize
            );
            gradient.addColorStop(0, '#4cc9f0');
            gradient.addColorStop(1, '#4895ef');
            ctx.fillStyle = gradient;
        }
        
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        
        // Draw eyes on head
        if (index === 0) {
            ctx.fillStyle = 'white';
            const eyeSize = gridSize / 5;
            const offset = gridSize / 4;
            
            if (direction === 'right') {
                ctx.fillRect(segment.x + gridSize - offset, segment.y + offset, eyeSize, eyeSize);
                ctx.fillRect(segment.x + gridSize - offset, segment.y + gridSize - offset*2, eyeSize, eyeSize);
            } else if (direction === 'left') {
                ctx.fillRect(segment.x + offset - eyeSize, segment.y + offset, eyeSize, eyeSize);
                ctx.fillRect(segment.x + offset - eyeSize, segment.y + gridSize - offset*2, eyeSize, eyeSize);
            } else if (direction === 'up') {
                ctx.fillRect(segment.x + offset, segment.y + offset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x + gridSize - offset*2, segment.y + offset - eyeSize, eyeSize, eyeSize);
            } else if (direction === 'down') {
                ctx.fillRect(segment.x + offset, segment.y + gridSize - offset, eyeSize, eyeSize);
                ctx.fillRect(segment.x + gridSize - offset*2, segment.y + gridSize - offset, eyeSize, eyeSize);
            }
        }
    });
    
    // Draw food with pulse animation
    const pulseSize = (Math.sin(Date.now() / 200) * 2) + (gridSize / 2 - 4);
    ctx.fillStyle = '#f72585';
    ctx.beginPath();
    ctx.arc(
        food.x + gridSize / 2,
        food.y + gridSize / 2,
        pulseSize,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Update game state
function update() {
    const head = {x: snake[0].x, y: snake[0].y};
    direction = nextDirection;
    
    // Move head
    switch (direction) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        speed = Math.max(initialSpeed - (score / 2), 50);
        generateFood();
    } else {
        snake.pop();
    }
}

// Game over
function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startBtn.textContent = 'Start Game';
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f72585';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Start/pause game
function startGame() {
    if (isGameRunning) {
        clearInterval(gameInterval);
        isGameRunning = false;
        startBtn.textContent = 'Resume Game';
    } else {
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

// Event listeners
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
        case ' ': if (!isGameRunning && snake.length > 0) startGame(); break;
    }
});

// Button controls
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
    clearInterval(gameInterval);
    initGame();
    draw();
    isGameRunning = false;
    startBtn.textContent = 'Start Game';
});

// Touch controls
const handleDirection = (dir) => {
    if ((dir === 'up' && direction !== 'down') ||
        (dir === 'down' && direction !== 'up') ||
        (dir === 'left' && direction !== 'right') ||
        (dir === 'right' && direction !== 'left')) {
        nextDirection = dir;
    }
};

upBtn.addEventListener('click', () => handleDirection('up'));
downBtn.addEventListener('click', () => handleDirection('down'));
leftBtn.addEventListener('click', () => handleDirection('left'));
rightBtn.addEventListener('click', () => handleDirection('right'));

// Touch events for mobile
upBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection('up');
});
downBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection('down');
});
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection('left');
});
rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleDirection('right');
});

// Initialize game
initGame();
draw();
