const testResultsElement = document.getElementById('test-results');

function runTests() {
    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            passed++;
            testResultsElement.innerHTML += `<p style="color: #0f0;">[PASS] ${message}</p>`;
        } else {
            failed++;
            testResultsElement.innerHTML += `<p style="color: #f00;">[FAIL] ${message}</p>`;
        }
    }

    function runPath(steps) {
        startGame();
        let lastScene = null;
        for (const step of steps) {
            const scene = story[state.currentScene];
            if (scene.exits && scene.exits[step]) {
                state.currentScene = scene.exits[step];
                lastScene = story[state.currentScene];
            } else if (scene.actions && scene.actions.find(a => a.command === step)) {
                const action = scene.actions.find(a => a.command === step);
                state.currentScene = action.next;
                lastScene = story[state.currentScene];
            } else {
                return null;
            }
        }
        return lastScene;
    }

    // Death Paths
    const deathPaths = [
        { path: ['w', 'use multi-tool on stasis field'], expected: 'You are now frozen in time, just like the rest of the crew. You have failed.' },
        { path: ['n', 'reboot systems'], expected: 'You are vaporized instantly. You have failed.' },
        { path: ['s', 'restart engines'], expected: 'You have failed.' },
        { path: ['e', 'reverse polarity of scanner'], expected: 'You have failed.' },
        { path: ['up', 'e', 'up', 'demand release of crew'], expected: 'You have failed.' },
        { path: ['up', 'e', 'up', 'attack crystal'], expected: 'You have failed.' },
        { path: ['up', 'e', 's', 'jump to central crystal'], expected: 'You have failed.' },
        { path: ['up', 'e', 's', 'e'], expected: 'You have failed.' },
        { path: ['up', 'e', 's', 'w'], expected: 'You have failed.' },
        { path: ['e', 'scan self', 'harness flux', 'phase into alien ship', 'e', 'approach red crystal'], expected: 'You have failed.' },
        { path: ['contact ai', 'go to ai core', 'purge ai'], expected: 'You have failed.' },
        { path: ['contact ai', 'go to ai core', 'reason with ai', 'tell ai to shut down'], expected: 'You have failed.' },
        { path: ['s', 'take maintenance bot', 'reprogram bot', 'send bot to attack alien ship'], expected: 'You have failed.' },
        { path: ['e', 'use chemical synthesizer', 'create sedative'], expected: 'You have failed.' },
    ];

    for (const test of deathPaths) {
        const result = runPath(test.path);
        assert(result && result.death && result.text === test.expected, `Death path: ${test.path.join(' -> ')}`);
    }

    // Victory Path
    const victoryPath = [
        'e',
        'scan self',
        'harness flux',
        'w',
        's',
        'take maintenance bot',
        'reactivate bot',
        'keep bot',
        'n',
        'n',
        'check ship logs',
        's',
        'up',
        'e',
        'n',
        'take stone tool',
        's',
        'down',
        'up',
        'help alien',
        'ask for more knowledge',
        'return to body',
        'release crew'
    ];

    const victoryResult = runPath(victoryPath);
    assert(victoryResult && victoryResult.win, 'Victory path');

    testResultsElement.innerHTML += `<p>Tests complete. Passed: ${passed}, Failed: ${failed}</p>`;
}

runTests();
