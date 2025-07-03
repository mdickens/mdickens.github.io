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

    // Diplomatic Path
    const diplomaticPath = [
        'n',
        'analyze signal',
        's',
        'begin decoding',
        'share findings',
        'advocate for first contact',
        'embrace the light'
    ];

    const diplomaticResult = runPath(diplomaticPath);
    assert(diplomaticResult && diplomaticResult.win, 'Diplomatic path');

    // Confrontational Path
    const confrontationalPath1 = [
        'n',
        'recommend caution',
        'suggest active scan',
        'raise shields',
        'target their weapons',
        'board their ship'
    ];

    const confrontationalResult1 = runPath(confrontationalPath1);
    assert(confrontationalResult1 && confrontationalResult1.win, 'Confrontational path 1');

    const confrontationalPath2 = [
        'n',
        'recommend caution',
        'suggest active scan',
        'raise shields',
        'target their engines',
        'demand their surrender'
    ];

    const confrontationalResult2 = runPath(confrontationalPath2);
    assert(confrontationalResult2 && confrontationalResult2.win, 'Confrontational path 2');

    const confrontationalPath3 = [
        'n',
        'recommend caution',
        'suggest active scan',
        'fire warning shot'
    ];

    const confrontationalResult3 = runPath(confrontationalPath3);
    assert(confrontationalResult3 && confrontationalResult3.death, 'Confrontational path 3');
    
    // Discovery Path
    const discoveryPath1 = [
        'n',
        'analyze signal',
        's',
        'begin decoding',
        'keep working',
        'go to the coordinates',
        'land on the planet',
        'take a data crystal',
        'leave the archives',
        'share with humanity'
    ];

    const discoveryResult1 = runPath(discoveryPath1);
    assert(discoveryResult1 && discoveryResult1.win, 'Discovery path 1');

    const discoveryPath2 = [
        'n',
        'analyze signal',
        's',
        'begin decoding',
        'keep working',
        'go to the coordinates',
        'land on the planet',
        'take a data crystal',
        'leave the archives',
        'keep for yourself'
    ];

    const discoveryResult2 = runPath(discoveryPath2);
    assert(discoveryResult2 && discoveryResult2.death, 'Discovery path 2');


    testResultsElement.innerHTML += `<p>Tests complete. Passed: ${passed}, Failed: ${failed}</p>`;
}

runTests();
