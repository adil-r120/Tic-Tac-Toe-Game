// Game elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const pvpBtn = document.getElementById('pvp-btn');
const pvcBtn = document.getElementById('pvc-btn');
const difficultySelector = document.getElementById('difficulty-selector');
const easyBtn = document.getElementById('easy-btn');
const hardBtn = document.getElementById('hard-btn');
const homeButton = document.getElementById('home-button');
const gameCells = document.querySelectorAll('.cell');
const playerDisplay = document.getElementById('current-player');
const resetButton = document.getElementById('reset-btn');
const messageOverlay = document.getElementById('message');
const winnerText = document.getElementById('winner-text');
const motivationalQuote = document.getElementById('motivational-quote');
const newGameButton = document.getElementById('new-game-btn');
const homeThemeToggle = document.getElementById('home-theme-toggle');
const gameThemeToggle = document.getElementById('game-theme-toggle');

// Game state
let gameMode = 'pvp'; // 'pvp' or 'pvc'
let difficulty = 'easy'; // 'easy' or 'hard'
let currentTurn = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isDarkMode = true;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Motivational quotes
const motivationalQuotes = [
    "Excellent strategy! 🎯",
    "You're a natural-born winner! 🏆",
    "That was pure genius! 🧠",
    "Masterful play! ✨",
    "You've got the winning touch! 🔥",
    "Incredible move! 👏",
    "You're unstoppable! 💪",
    "Flawless victory! 🌟",
    "Game-changing play! 🚀",
    "You're a Tic-Tac-Toe champion! 🏅",
    "Brilliant execution! ⭐",
    "That's how it's done! 💥",
    "You're on fire today! 🔥",
    "Legendary move!  legend",
    "You've outplayed everyone! 🎉"
];

// Toggle theme
const toggleTheme = () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode');
    
    // Update button text
    const themeText = isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode';
    homeThemeToggle.textContent = themeText;
    gameThemeToggle.textContent = isDarkMode ? '🌙' : '☀️';
};

// Show game screen
const showGameScreen = () => {
    homeScreen.classList.add('hide');
    gameScreen.classList.remove('hide');
    resetGame();
};

// Show home screen
const showHomeScreen = () => {
    gameScreen.classList.add('hide');
    homeScreen.classList.remove('hide');
    messageOverlay.classList.add('hide');
};

// Handle cell click
const handleClick = (event) => {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    // Check if cell is already filled or game is not active
    if (boardState[index] !== '' || !gameActive) {
        return;
    }

    // For PvC mode, if it's computer's turn, ignore click
    if (gameMode === 'pvc' && currentTurn === 'O') {
        return;
    }

    // Update cell and game board
    makeMove(index);
    
    // For PvC mode, computer makes a move after player
    if (gameMode === 'pvc' && currentTurn === 'O' && !gameActive) {
        setTimeout(makeComputerMove, 500);
    }
};

// Make a move
const makeMove = (index) => {
    boardState[index] = currentTurn;
    gameCells[index].textContent = currentTurn;
    gameCells[index].classList.add(currentTurn.toLowerCase());

    // Check for win or draw
    if (checkWin()) {
        endGame(`${currentTurn} wins!`);
    } else if (checkDraw()) {
        endGame("It's a draw!");
    } else {
        // Switch player
        currentTurn = currentTurn === 'X' ? 'O' : 'X';
        playerDisplay.textContent = currentTurn;
        
        // For computer move in PvC mode
        if (gameMode === 'pvc' && currentTurn === 'O' && gameActive) {
            setTimeout(makeComputerMove, 500);
        }
    }
};

// Computer move logic
const makeComputerMove = () => {
    if (!gameActive) return;
    
    let index;
    
    if (difficulty === 'hard') {
        // Hard difficulty - try to win or block player
        index = getBestMove();
    } else {
        // Easy difficulty - random move
        index = getRandomMove();
    }
    
    if (index !== -1) {
        makeMove(index);
    }
};

// Get random available move
const getRandomMove = () => {
    const availableMoves = boardState
        .map((value, index) => value === '' ? index : null)
        .filter(val => val !== null);
    
    if (availableMoves.length === 0) return -1;
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
};

// Get best move for hard difficulty
const getBestMove = () => {
    // Try to win
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boardState[a] === 'O' && boardState[b] === 'O' && boardState[c] === '') return c;
        if (boardState[a] === 'O' && boardState[c] === 'O' && boardState[b] === '') return b;
        if (boardState[b] === 'O' && boardState[c] === 'O' && boardState[a] === '') return a;
    }
    
    // Try to block player
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boardState[a] === 'X' && boardState[b] === 'X' && boardState[c] === '') return c;
        if (boardState[a] === 'X' && boardState[c] === 'X' && boardState[b] === '') return b;
        if (boardState[b] === 'X' && boardState[c] === 'X' && boardState[a] === '') return a;
    }
    
    // Take center if available
    if (boardState[4] === '') return 4;
    
    // Take corner if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => boardState[index] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available spot
    return getRandomMove();
};

// Check for win
const checkWin = () => {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return boardState[a] !== '' && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
};

// Check for draw
const checkDraw = () => {
    return boardState.every(cell => cell !== '');
};

// Get random motivational quote
const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
};

// End the game
const endGame = (message) => {
    gameActive = false;
    winnerText.textContent = message;
    motivationalQuote.textContent = getRandomQuote();
    messageOverlay.classList.remove('hide');
};

// Reset the game
const resetGame = () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentTurn = 'X';
    
    // Clear cells
    gameCells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    
    // Update UI
    playerDisplay.textContent = currentTurn;
    messageOverlay.classList.add('hide');
};

// Event listeners
gameCells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click', resetGame);
homeButton.addEventListener('click', showHomeScreen);
homeThemeToggle.addEventListener('click', toggleTheme);
gameThemeToggle.addEventListener('click', toggleTheme);

// Home screen buttons
pvpBtn.addEventListener('click', () => {
    gameMode = 'pvp';
    showGameScreen();
});

pvcBtn.addEventListener('click', () => {
    gameMode = 'pvc';
    difficultySelector.classList.remove('hide');
});

easyBtn.addEventListener('click', () => {
    difficulty = 'easy';
    difficultySelector.classList.add('hide');
    showGameScreen();
});

hardBtn.addEventListener('click', () => {
    difficulty = 'hard';
    difficultySelector.classList.add('hide');
    showGameScreen();
});

// Initialize with home screen visible and dark mode
showHomeScreen();