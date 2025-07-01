document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gameContainer = document.getElementById('game-container');
    const mainMenu = document.getElementById('main-menu');
    const gameScreen = document.getElementById('game-screen');
    const vsPlayerButton = document.getElementById('vs-player-button');
    const vsAiButton = document.getElementById('vs-ai-button');
    const mainMenuButton = document.getElementById('main-menu-button');

    const gameBoard = document.getElementById('game-board');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const helpButton = document.getElementById('help-button');
    const settingsButton = document.getElementById('settings-button');
    const turnIndicator = document.getElementById('player-turn-indicator');
    const winCanvas = document.getElementById('win-canvas');
    const ctx = winCanvas.getContext('2d');

    // Modals & Settings
    const allModals = Array.from(document.querySelectorAll('.modal'));
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const muteToggle = document.getElementById('mute-toggle');
    const fullscreenButton = document.getElementById('fullscreen-button');

    // --- Game State ---
    let cells = [];
    let currentPlayer = 'X';
    let boardState = Array(16).fill(null);
    let playerPieces = { 'X': [], 'O': [] };
    let gameActive = true;
    let aiEnabled = false;

    // --- Constants ---
    const PIECE_LIMIT = 4;
    const WINNING_COMBINATIONS = [
        [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
        [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
        [0, 5, 10, 15], [3, 6, 9, 12]
    ];

    // --- Initialization ---
    function init() {
        setupMainMenuListeners();
        setupGameListeners();
        // Initial settings setup
        const isHighContrast = localStorage.getItem('quantum-high-contrast') === 'true';
        if (isHighContrast) {
            document.body.classList.add('high-contrast');
            highContrastToggle.setAttribute('aria-checked', 'true');
            highContrastToggle.textContent = 'On';
        }
    }

    function setupMainMenuListeners() {
        vsPlayerButton.addEventListener('click', () => startGame(false));
        vsAiButton.addEventListener('click', () => startGame(true));
    }

    function setupGameListeners() {
        mainMenuButton.addEventListener('click', showMainMenu);
        resetButton.addEventListener('click', resetGame);
        helpButton.addEventListener('click', () => openModal(document.getElementById('help-modal')));
        settingsButton.addEventListener('click', () => openModal(document.getElementById('settings-modal')));
        document.getElementById('play-again-button').addEventListener('click', () => {
            closeModal(document.getElementById('game-over-modal'));
            resetGame();
        });
        
        highContrastToggle.addEventListener('click', toggleHighContrast);
        muteToggle.addEventListener('click', () => {}); // Placeholder
        fullscreenButton.addEventListener('click', toggleFullScreen);

        allModals.forEach(modal => {
            const closeBtn = modal.querySelector('.close-button');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal(modal));
            }
        });
    }

    function startGame(isAiGame) {
        aiEnabled = isAiGame;
        mainMenu.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        resetGame();
    }

    function showMainMenu() {
        mainMenu.classList.remove('hidden');
        gameScreen.classList.add('hidden');
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        cells = [];
        winCanvas.width = gameBoard.offsetWidth;
        winCanvas.height = gameBoard.offsetHeight;
        gameBoard.classList.add('animate-board');

        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.setAttribute('tabindex', '0');
            cell.style.animationDelay = `${i * 0.02}s`;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCellClick(e);
                }
            });
            gameBoard.appendChild(cell);
            cells.push(cell);
        }
    }

    // --- Game Logic ---
    function handleCellClick(event) {
        if (!gameActive || (aiEnabled && currentPlayer === 'O')) return;
        
        const index = parseInt(event.currentTarget.dataset.index);
        if (boardState[index]) return;

        makeMove(index);
    }

    function makeMove(index) {
        if (!gameActive || boardState[index]) return;

        // Sound and visual effects
        createRipple({ currentTarget: cells[index], clientX: cells[index].getBoundingClientRect().left + 50, clientY: cells[index].getBoundingClientRect().top + 50 });

        // Piece placement logic
        if (playerPieces[currentPlayer].length >= PIECE_LIMIT) {
            const oldestPieceIndex = playerPieces[currentPlayer].shift();
            boardState[oldestPieceIndex] = null;
            animatePiece(cells[oldestPieceIndex], '', 'removing');
        }
        boardState[index] = currentPlayer;
        playerPieces[currentPlayer].push(index);
        animatePiece(cells[index], currentPlayer, 'placed');
        cells[index].className = 'cell ' + currentPlayer;

        // Check game status
        const winningCombination = checkWinner();
        if (winningCombination) {
            endGame(false, winningCombination);
        } else if (cells.every((_, i) => boardState[i] !== null)) {
            endGame(true);
        } else {
            switchPlayer();
            if (aiEnabled && currentPlayer === 'O') {
                // AI's turn
                setTimeout(aiMove, 500);
            }
        }
        updateOldestPieceIndicator();
    }
    
    function aiMove() {
        if (!gameActive) return;
        // AI Level 1: Random valid move
        let availableCells = [];
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === null) {
                availableCells.push(i);
            }
        }
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const move = availableCells[randomIndex];
        makeMove(move);
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();
    }

    function checkWinner() {
        for (const combination of WINNING_COMBINATIONS) {
            const [a, b, c, d] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c] && boardState[a] === boardState[d]) {
                return combination;
            }
        }
        return null;
    }

    function endGame(isDraw, winningCombination = []) {
        gameActive = false;
        const messageContainer = document.getElementById('game-over-message');
        if (isDraw) {
            messageContainer.textContent = "It's a draw!";
        } else {
            messageContainer.textContent = `Player ${currentPlayer} wins!`;
            document.body.classList.add('screen-flash');
            setTimeout(() => document.body.classList.remove('screen-flash'), 500);
            drawLightning(winningCombination);
        }
        setTimeout(() => openModal(document.getElementById('game-over-modal')), 1000);
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        boardState.fill(null);
        playerPieces = { 'X': [], 'O': [] };
        ctx.clearRect(0, 0, winCanvas.width, winCanvas.height);
        
        gameBoard.classList.remove('animate-board');
        void gameBoard.offsetWidth;
        createBoard();
        updateTurnIndicator();
    }

    // --- UI & Animations (many functions like updateTurnIndicator, animatePiece, etc. are the same) ---
    function updateTurnIndicator() {
        statusDisplay.textContent = aiEnabled ? (currentPlayer === 'X' ? "Your Turn" : "AI's Turn") : `Player ${currentPlayer}'s turn`;
        const color = `var(--${currentPlayer.toLowerCase()}-color)`;
        turnIndicator.style.backgroundColor = color;
        turnIndicator.style.boxShadow = `0 0 10px ${color}`;
    }
    
    function animatePiece(cell, player, animationClass) {
        const piece = document.createElement('div');
        piece.textContent = player;
        piece.classList.add('piece');
        if (animationClass === 'removing') {
            const existingPiece = cell.querySelector('.piece');
            if (existingPiece) {
                existingPiece.classList.add('removing');
                existingPiece.addEventListener('transitionend', () => existingPiece.remove(), { once: true });
            }
        } else {
            cell.innerHTML = '';
            cell.appendChild(piece);
            requestAnimationFrame(() => piece.classList.add(animationClass));
        }
    }

    function updateOldestPieceIndicator() {
        document.querySelectorAll('.oldest-piece-indicator').forEach(ind => ind.remove());
        for (const player of ['X', 'O']) {
            if (playerPieces[player].length >= PIECE_LIMIT) {
                const oldestIndex = playerPieces[player][0];
                const indicator = document.createElement('div');
                indicator.classList.add('oldest-piece-indicator');
                cells[oldestIndex].appendChild(indicator);
            }
        }
    }

    function createRipple(event) {
        const cell = event.currentTarget;
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        const rect = cell.getBoundingClientRect();
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
        ripple.style.left = `${event.clientX - rect.left - ripple.offsetWidth / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - ripple.offsetHeight / 2}px`;
        cell.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }

    function drawLightning(combination) {
        const getCellCenter = (index) => ({ x: cells[index].offsetLeft + 50, y: cells[index].offsetTop + 50 });
        const startPoint = getCellCenter(combination[0]);
        const endPoint = getCellCenter(combination[3]);
        const colors = ['#ffffff', '#ff00ff', '#00ffff', '#00ff00', '#ffff00'];
        for (let i = 0; i < 15; i++) {
            createLightningBolt(startPoint.x, startPoint.y, endPoint.x, endPoint.y, colors[Math.floor(Math.random() * colors.length)], 5);
        }
    }

    function createLightningBolt(x1, y1, x2, y2, color, depth) {
        if (depth <= 0) return;
        const segments = 20;
        const roughness = 20;
        const points = [{ x: x1, y: y1 }];
        const dx = (x2 - x1) / segments;
        const dy = (y2 - y1) / segments;
        for (let i = 1; i < segments; i++) {
            const newX = x1 + dx * i + (Math.random() - 0.5) * roughness;
            const newY = y1 + dy * i + (Math.random() - 0.5) * roughness;
            points.push({ x: newX, y: newY });
            if (Math.random() > 0.9) {
                createLightningBolt(newX, newY, newX + (Math.random() - 0.5) * 100, newY + (Math.random() - 0.5) * 100, color, depth - 1);
            }
        }
        points.push({ x: x2, y: y2 });
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 + Math.random() * 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.stroke();
    }

    // --- Settings & Modals ---
    function openModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    function toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('quantum-high-contrast', isHighContrast);
        highContrastToggle.setAttribute('aria-checked', isHighContrast);
        highContrastToggle.textContent = isHighContrast ? 'On' : 'Off';
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => alert(`Fullscreen error: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    }
    document.addEventListener('fullscreenchange', () => {
        fullscreenButton.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Enter Fullscreen';
    });

    // --- Start the application ---
    init();
});