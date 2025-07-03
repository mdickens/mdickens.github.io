const storyTextElement = document.getElementById('story-text');
const inventoryElement = document.getElementById('inventory');
const playerInputElement = document.getElementById('player-input');
const choicesElement = document.getElementById('choices');

let state = {};

const story = {
    start: {
        text: 'The year is 2381. You are Dr. Aris Thorne, a xeno-linguist aboard the research vessel *Odyssey*. Your career has been a quiet one since the controversial "Ares-7 Incident," a misunderstanding that led to the loss of a priceless alien artifact. Now, you spend your days analyzing stellar phenomena, a job far below your skill set.\n\nThe ship\'s AI, "Helios," chimes in your ear, "Dr. Thorne, your presence is requested on the bridge. We\'ve detected an anomaly."\n\n(Type "help" for a list of commands)',
        exits: {
            n: 'bridge'
        },
        items: [],
        actions: []
    },
    bridge: {
        text: 'You arrive on the bridge. Captain Eva Rostova, a woman with a stern but fair reputation, stands before the main viewscreen. The screen displays a swirling nebula, but overlaid is a complex waveform. "Dr. Thorne," she says without turning, "Helios is picking up a signal from the nebula. It\'s structured, melodic... and definitely not natural. Give me your analysis."',
        exits: {},
        items: [],
        actions: [
            { command: 'analyze signal', next: 'analyzeSignal' },
            { command: 'recommend caution', next: 'recommendCaution' }
        ]
    },
    analyzeSignal: {
        text: 'You study the waveform, your heart pounding. The patterns are intricate, almost biological. "This isn\'t just a signal, Captain," you say. "It\'s a language. A complex one. I need to get to the communications lab to decode it properly. This could be the discovery of the century."\n\nA private message flashes on your datapad. It\'s from Director Kaelen, your former mentor: "Aris, this is the opportunity we\'ve been waiting for. Don\'t let Rostova\'s caution stifle this. I need you to get me that data. I can restore your career, and more."',
        exits: {
            s: 'commsLab'
        },
        items: [],
        actions: []
    },
    recommendCaution: {
        text: 'You temper your excitement. "The Ares-7 Incident taught us that we need to be careful," you say. "We should proceed with extreme caution. Observe the signal from a safe distance before we make any moves. We don\'t know who or what is out there."\n\nA private message flashes on your datapad. It\'s from Director Kaelen: "Aris, don\'t be a fool. Caution is for bureaucrats. Seize this opportunity. I need that data."',
        exits: {},
        items: [],
        actions: [
            { command: 'suggest passive scan', next: 'passiveScan' },
            { command: 'suggest active scan', next: 'activeScan' }
        ]
    },
    commsLab: {
        text: 'You are in the communications lab, a room filled with humming servers and holographic displays. The alien signal is now visualized as a beautiful, shifting tapestry of light and sound. You can feel the song resonating within you. This is your life\'s work, realized. Suddenly, a crew member, Ensign Miller, collapses, clutching his head. The alien signal is affecting him.',
        exits: {
            n: 'bridge'
        },
        items: [],
        actions: [
            { command: 'help miller', next: 'helpMiller' },
            { command: 'ignore miller', next: 'ignoreMiller' }
        ]
    },
    helpMiller: {
        text: 'You rush to Miller\'s side, shielding him from the signal\'s full intensity. You manage to stabilize him, but you\'ve lost valuable time decoding the message. The signal suddenly stops.',
        exits: {
            n: 'bridge'
        },
        items: [],
        actions: []
    },
    ignoreMiller: {
        text: 'You ignore Miller, focusing on the signal. You are on the verge of a breakthrough when the signal abruptly cuts out. Miller is in a coma.',
        exits: {
            n: 'bridge'
        },
        items: [],
        actions: []
    },
    passiveScan: {
        text: 'Rostova nods. "My thoughts exactly, Doctor. Helios, begin a passive scan. Let\'s see what we can learn without showing our hand." The ship\'s sensors begin to gather data on the signal\'s origin.',
        exits: {
            n: 'bridge'
        },
        items: [],
        actions: []
    },
    activeScan: {
        text: 'You suggest a more aggressive approach. "A passive scan won\'t give us enough data. We need to send a pulse, see how it reacts." Rostova hesitates, then nods. "Very well, Doctor. But be ready for anything." The ship sends a powerful scan towards the nebula. The nebula responds with a burst of energy that shakes the ship.',
        exits: {
            n: 'bridge'
        },
        items: [],
        actions: [
            { command: 'raise shields', next: 'raiseShields' },
            { command: 'fire warning shot', next: 'fireWarningShot' }
        ]
    },
    raiseShields: {
        text: 'You raise the ship\'s shields just in time to deflect another, more powerful energy blast from the nebula. The ship shudders, but holds. "They\'re hostile," Rostova says, her voice grim. "Prepare for combat."',
        exits: {},
        items: [],
        actions: [
            { command: 'target their weapons', next: 'targetWeapons' },
            { command: 'target their engines', next: 'targetEngines' }
        ]
    },
    fireWarningShot: {
        death: true,
        text: 'You fire a warning shot from the ship\'s phaser cannons. The shot is absorbed by the nebula, which responds with a massive wave of energy that vaporizes the *Odyssey*. You have failed.'
    },
    targetWeapons: {
        text: 'You target the Stellarian ship\'s weapon systems. Your phasers score a direct hit, and you see a chain reaction of explosions ripple across their vessel. They are disabled.',
        exits: {},
        items: [],
        actions: [
            { command: 'board their ship', next: 'boardShip' }
        ]
    },
    targetEngines: {
        text: 'You target the Stellarian ship\'s engines. Your phasers strike true, and their ship is left dead in the water. They are at your mercy.',
        exits: {},
        items: [],
        actions: [
            { command: 'demand their surrender', next: 'demandSurrender' }
        ]
    },
    boardShip: {
        win: true,
        text: 'You lead a boarding party onto the disabled Stellarian ship. You find them not hostile, but terrified. They were not attacking you, but trying to warn you of the star-devourer. You have misunderstood their intentions, but you have also inadvertently saved them from the coming threat. You have a lot to answer for, but you have also opened the door to a new, albeit complicated, relationship with the Stellarians. Congratulations?'
    },
    demandSurrender: {
        win: true,
        text: 'You demand the Stellarians\' surrender. They comply, and you take their ship as a prize. You are hailed as a hero for defeating a hostile alien force, but you will always wonder if you made the right choice. The truth of the Stellarians\' intentions is lost forever. Congratulations?'
    },
    decoding: {
        text: 'You spend hours, then days, lost in the alien song. You begin to see patterns, repetitions, a syntax. It\'s a language of pure mathematics and harmony. You are on the verge of a breakthrough.',
        exits: {},
        items: [],
        actions: [
            { command: 'share findings', next: 'shareFindings' },
            { command: 'keep working', next: 'keepWorking' }
        ]
    },
    shareFindings: {
        text: 'You bring your preliminary findings to Captain Rostova. "They are a crystalline species," you explain. "They call themselves the Stellarians. Their language is a form of light and sound. I believe they are peaceful."',
        exits: {},
        items: [],
        actions: [
            { command: 'advocate for first contact', next: 'firstContact' }
        ]
    },
    keepWorking: {
        text: 'You are close to a full translation. You push yourself to the brink, ignoring calls from the bridge. You finally break the code, revealing a message of peace and a warning of a great danger. You also find a set of coordinates hidden in the message.',
        exits: {},
        items: [],
        actions: [
            { command: 'reveal the message', next: 'revealMessage' },
            { command: 'go to the coordinates', next: 'goToCoordinates' }
        ]
    },
    goToCoordinates: {
        text: 'You use the ship\'s navigation system to go to the coordinates from the message. You arrive at a desolate, ancient planet. A single structure stands on the surface, a testament to a long-dead civilization.',
        exits: {},
        items: [],
        actions: [
            { command: 'land on the planet', next: 'landOnPlanet' }
        ]
    },
    landOnPlanet: {
        text: 'You land the *Odyssey* on the planet and lead an expedition to the structure. It is a vast library, filled with crystalline data storage devices. You have found the Stellarian archives.',
        exits: {},
        items: [],
        actions: [
            { command: 'take a data crystal', next: 'takeDataCrystal' },
            { command: 'leave the archives', next: 'leaveArchives' }
        ]
    },
    takeDataCrystal: {
        text: 'You take one of the data crystals. It hums in your hand, and you feel a sense of immense knowledge contained within.',
        exits: {},
        items: ['Stellarian data crystal'],
        actions: [
            { command: 'leave the archives', next: 'leaveArchives' }
        ]
    },
    leaveArchives: {
        text: 'You return to the *Odyssey* with your findings. You now have a choice to make. What will you do with this knowledge?',
        exits: {},
        items: [],
        actions: [
            { command: 'share with humanity', next: 'shareWithHumanity' },
            { command: 'keep for yourself', next: 'keepForYourself' }
        ]
    },
    shareWithHumanity: {
        win: true,
        text: 'You share the Stellarian knowledge with humanity. It ushers in a new golden age of technology and understanding. You are remembered as the person who brought humanity into a new era. Congratulations!'
    },
    keepForYourself: {
        death: true,
        text: 'You keep the Stellarian knowledge for yourself. The power corrupts you, and you become a tyrant, using your advanced knowledge to enslave humanity. You are eventually overthrown and executed for your crimes. You have failed.'
    },
    firstContact: {
        text: 'Based on your recommendation, Captain Rostova agrees to send a message of peace. You compose a response in the Stellarian\'s own language, a message of greeting and friendship. The reply is instantaneous: a single, brilliant pulse of light that envelops the *Odyssey*.',
        exits: {},
        items: [],
        actions: [
            { command: 'embrace the light', next: 'embraceTheLight' }
        ]
    },
    revealMessage: {
        text: 'You rush to the bridge with the translated message. "Captain, the Stellarians are peaceful, but they are fleeing from something. A... a devourer of stars. It is coming."',
        exits: {},
        items: [],
        actions: [
            { command: 'propose alliance', next: 'proposeAlliance' }
        ]
    },
    embraceTheLight: {
        win: true,
        text: 'You close your eyes and embrace the light. Your mind is filled with the song of the Stellarians, a symphony of a billion years of existence. You have made first contact and ushered in a new era of peace and understanding for humanity. Congratulations!'
    },
    proposeAlliance: {
        win: true,
        text: 'You propose an alliance with the Stellarians to face the coming darkness. They agree, and their fleet of crystalline ships joins the *Odyssey*. Together, you face the star-devourer and emerge victorious. You have saved not only your own species, but two. Congratulations!'
    }
};

function startGame() {
    state = {
        currentScene: 'start',
        inventory: [],
        step: 0,
        millerSaved: false
    };
    showScene();
}

function showScene() {
    const scene = story[state.currentScene];
    if (!scene) {
        return;
    }

    state.step++;

    if (scene.death) {
        storyTextElement.innerText = scene.text;
        inventoryElement.innerHTML = '';
        playerInputElement.style.display = 'none';
        choicesElement.innerHTML = '';
        const button = document.createElement('button');
        button.innerText = 'Try Again';
        button.addEventListener('click', startGame);
        choicesElement.appendChild(button);
        return;
    }

    if (scene.win) {
        storyTextElement.innerText = scene.text;
        inventoryElement.innerHTML = '';
        playerInputElement.style.display = 'none';
        choicesElement.innerHTML = '';
        return;
    }

    storyTextElement.innerText = scene.text;
    updateInventory();
    updateChoices();
}

function updateInventory() {
    inventoryElement.innerHTML = 'Inventory: ' + (state.inventory.length > 0 ? state.inventory.join(', ') : 'empty');
}

function updateChoices() {
    const scene = story[state.currentScene];
    choicesElement.innerHTML = '';
    for (const exit in scene.exits) {
        const button = document.createElement('button');
        button.innerText = exit;
        button.addEventListener('click', () => handleInput(exit));
        choicesElement.appendChild(button);
    }
    if (scene.actions) {
        for (const action of scene.actions) {
            const button = document.createElement('button');
            button.innerText = action.command;
            button.addEventListener('click', () => handleInput(action.command));
            choicesElement.appendChild(button);
        }
    }
}

function handleInput(command) {
    const input = command || playerInputElement.value.toLowerCase().trim();
    playerInputElement.value = '';

    const scene = story[state.currentScene];
    let commandProcessed = false;

    if (input === 'help') {
        const exits = Object.keys(scene.exits).join(', ');
        const actions = scene.actions.map(a => a.command).join(', ');
        storyTextElement.innerText = `Available commands: n, s, e, w, ne, nw, se, sw, up, down, look, take <item>, use <item> on <target>, inventory, save, load, help.\nAvailable exits: ${exits}\nAvailable actions: ${actions}`;
        commandProcessed = true;
    } else if (input === 'look') {
        storyTextElement.innerText = scene.text;
        commandProcessed = true;
    } else if (input === 'inventory') {
        storyTextElement.innerText = 'Inventory: ' + (state.inventory.length > 0 ? state.inventory.join(', ') : 'empty');
        commandProcessed = true;
    } else if (input === 'save') {
        localStorage.setItem('echoesSave', JSON.stringify(state));
        storyTextElement.innerText = 'Game saved.';
        commandProcessed = true;
    } else if (input === 'load') {
        const savedState = localStorage.getItem('echoesSave');
        if (savedState) {
            state = JSON.parse(savedState);
            showScene();
            storyTextElement.innerText = 'Game loaded.';
        } else {
            storyTextElement.innerText = 'No saved game found.';
        }
        commandProcessed = true;
    } else if (scene.exits[input]) {
        state.currentScene = scene.exits[input];
        showScene();
        commandProcessed = true;
    } else if (scene.actions && scene.actions.find(a => a.command === input)) {
        const action = scene.actions.find(a => a.command === input);
        if (action.next === 'helpMiller') {
            state.millerSaved = true;
        }
        state.currentScene = action.next;
        showScene();
        commandProcessed = true;
    } else if (input.startsWith('take ')) {
        const item = input.substring(5);
        if (scene.items && scene.items.includes(item)) {
            state.inventory.push(item);
            scene.items.splice(scene.items.indexOf(item), 1);
            storyTextElement.innerText = `You take the ${item}.`;
            updateInventory();
        } else {
            storyTextElement.innerText = "You can't take that.";
        }
        commandProcessed = true;
    } else if (input.startsWith('use ')) {
        const parts = input.split(' on ');
        const item = parts[0].substring(4);
        const target = parts[1];
        if (state.inventory.includes(item)) {
            if (item === 'stellarian data crystal' && target === 'computer' && state.currentScene === 'commsLab') {
                state.currentScene = 'shareWithHumanity';
                showScene();
            } else {
                storyTextElement.innerText = "You can't use that on that.";
            }
        } else {
            storyTextElement.innerText = "You don't have that.";
        }
        commandProcessed = true;
    }

    if (!commandProcessed) {
        storyTextElement.innerText = "I don't understand that command.";
    }
}


playerInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleInput();
    }
});

startGame();