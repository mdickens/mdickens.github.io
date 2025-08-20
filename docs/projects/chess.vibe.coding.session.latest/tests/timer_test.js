QUnit.module('Timer', function(hooks) {
    hooks.beforeEach(function() {
        const gameSetupModal = document.getElementById('game-setup-modal');
        if (gameSetupModal) {
            gameSetupModal.style.display = 'none';
        }
        const mainLayout = document.getElementById('main-layout');
        if (mainLayout) {
            mainLayout.style.display = 'flex';
        }
        localStorage.clear();
        Game.setState({
            board: [
                ['', '', '', '', 'k', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', 'P', ''],
                ['', '', '', '', 'K', '', '', ''],
            ],
            whiteTurn: true,
            whiteKingMoved: false,
            blackKingMoved: false,
            whiteRooksMoved: [false, false],
            blackRooksMoved: [false, false],
            fiftyMoveRuleCounter: 0,
            lastMove: null,
            moveHistory: [],
            boardHistory: [],
            whiteCaptured: [],
            blackCaptured: []
        });
        whiteTime = 1;
        blackTime = 1;
        startTimer();
    });

    QUnit.test('should end the game when the timer runs out', function(assert) {
        const done = assert.async();
        setTimeout(function() {
            const gameOverModal = document.getElementById('game-over-modal');
            assert.equal(gameOverModal.style.display, 'flex', 'Game over modal should be displayed');
            done();
        }, 2000);
    });
});
