const storyTextElement = document.getElementById('story-text');
const inventoryElement = document.getElementById('inventory');
const playerInputElement = document.getElementById('player-input');
const choicesElement = document.getElementById('choices');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const ctx = fireworksCanvas.getContext('2d');

let state = {};

const story = {
    start: {
        text: 'You are a maintenance technician on the deep-space vessel "Stardust Dreamer" in the year 2242. Your shift is uneventful, filled with the familiar hum of the ship\'s engines. Suddenly, a blinding white light floods your vision, and a strange, crystalline ship docks with yours. A wave of energy washes over the "Stardust Dreamer," and your crewmates freeze in place, caught in a shimmering stasis. You are the only one still moving. What do you do? (Type "help" for a list of commands)',
        exits: {
            n: 'bridge',
            s: 'engineering',
            e: 'medbay',
            w: 'crew',
            up: 'alienShip'
        },
        items: [],
        actions: [
            { command: 'contact ai', next: 'contactAI' }
        ]
    },
    alienShip: {
        text: 'You are at the airlock to the alien ship.',
        exits: {
            down: 'start',
            e: 'alienShipInterior'
        },
        items: [],
        actions: [
            { command: 'scan door', next: 'scanDoor' }
        ]
    },
    crew: {
        text: 'You are in the crew quarters. Your crewmate, Anya, is frozen in time.',
        exits: {
            e: 'start'
        },
        items: [],
        actions: [
            { command: 'use multi-tool on stasis field', next: 'disableStasis' },
            { command: 'find source of energy wave', next: 'findSource' }
        ]
    },
    bridge: {
        text: 'You are on the bridge. The crew is frozen, and the main viewscreen shows the alien ship.',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'reboot systems', next: 'rebootSystems' },
            { command: 'send distress signal', next: 'distressSignal' },
            { command: 'check ship logs', next: 'shipLogs' }
        ]
    },
    engineering: {
        text: 'You are in engineering. The engines are silent. You see a maintenance bot.',
        exits: {
            n: 'start'
        },
        items: ['maintenance bot'],
        actions: [
            { command: 'restart engines', next: 'restartEngines' },
            { command: 'check power conduits', next: 'powerConduits' }
        ]
    },
    medbay: {
        text: 'You are in the medbay. The medical staff are frozen. You see a chemical synthesizer.',
        exits: {
            w: 'start'
        },
        items: ['chemical synthesizer'],
        actions: [
            { command: 'scan self', next: 'scanSelf' },
            { command: 'scan crewmate', next: 'scanCrewmate' },
            { command: 'use chemical synthesizer', next: 'chemicalSynthesizer' }
        ]
    },
    contactAI: {
        text: 'You open a terminal and try to contact the ship\'s AI, "Helios." After a moment, a distorted voice replies, "I... see... a new... world..."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'ask helios what it means', next: 'aiResponse' },
            { command: 'go to ai core', next: 'aiCore' }
        ]
    },
    alienShipInterior: {
        text: 'You are inside the alien ship. Crystalline structures pulse with light. A large crystal hovers in the center.',
        exits: {
            w: 'alienShip',
            n: 'sideChamber',
            s: 'upperLevel',
            up: 'centralCrystal',
            down: 'perimeter'
        },
        items: [],
        actions: []
    },
    scanDoor: {
        text: 'Your multi-tool whirs to life, but the readings are nonsensical, a jumble of symbols and characters you\'ve never seen. The door seems to be made of a material that defies all known physics.',
        exits: {
            e: 'alienShipInterior',
            w: 'alienShip'
        },
        items: [],
        actions: []
    },
    disableStasis: {
        death: true,
        text: 'You activate your multi-tool and try to disrupt the stasis field around Anya. The moment the beam touches the silvery aura, it reflects back at you, and you feel your own body stiffen. You are now frozen in time, just like the rest of the crew. You have failed.'
    },
    findSource: {
        text: 'You follow the faint energy readings, which lead you directly to the airlock connecting to the alien ship.',
        exits: {
            up: 'alienShip'
        },
        items: [],
        actions: []
    },
    rebootSystems: {
        death: true,
        text: 'You try to reboot the ship\'s main computer, but a power surge from the alien vessel overloads the system, causing a massive explosion on the bridge. You are vaporized instantly. You have failed.'
    },
    distressSignal: {
        text: 'You manage to activate the emergency distress beacon, but the signal is immediately absorbed by the alien ship. It seems they don\'t want you calling for help.',
        exits: {
            up: 'alienShip'
        },
        items: [],
        actions: []
    },
    shipLogs: {
        text: 'You access the ship\'s logs. The last entry is from the captain, just moments before the alien ship appeared. It reads: "Unidentified vessel approaching. No response to hails. It\'s... beautiful..."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: []
    },
    restartEngines: {
        death: true,
        text: 'You try to manually restart the engines, but without the main computer to regulate the flow of power, the engines overload and explode, taking the entire ship with them. You have failed.'
    },
    powerConduits: {
        text: 'You trace the power conduits from the alien ship. They are pulsing with a soft, white light and are cool to the touch. They seem to be drawing power from your ship, not providing it.',
        exits: {
            up: 'alienShip'
        },
        items: [],
        actions: [
            { command: 'disconnect conduits', next: 'disconnectConduits' }
        ]
    },
    maintenanceBot: {
        text: 'You find the maintenance bot, a small, wheeled drone, in its charging station. Its optical sensors are dark.',
        exits: {
            n: 'engineering'
        },
        items: [],
        actions: [
            { command: 'reactivate bot', next: 'reactivateBot' },
            { command: 'reprogram bot', next: 'reprogramBot' }
        ]
    },
    scanSelf: {
        text: 'You scan yourself with the medical scanner. The results are... strange. Your cellular structure is in a state of quantum flux, constantly shifting between states. This must be why you are immune to the stasis field.',
        exits: {
            w: 'medbay'
        },
        items: [],
        actions: [
            { command: 'harness flux', next: 'harnessFlux' }
        ]
    },
    scanCrewmate: {
        text: 'You scan a frozen crewmate. The scanner shows their cellular structure is locked in a single quantum state, unable to change. The stasis field is holding them in a perfect, unchanging state.',
        exits: {
            w: 'medbay'
        },
        items: [],
        actions: [
            { command: 'reverse polarity of scanner', next: 'reversePolarity' }
        ]
    },
    chemicalSynthesizer: {
        text: 'You access the chemical synthesizer. It has a vast database of compounds it can create. What do you want to do?',
        exits: {
            w: 'medbay'
        },
        items: [],
        actions: [
            { command: 'create sedative', next: 'createSedative' },
            { command: 'create stimulant', next: 'createStimulant' },
            { command: 'create counter-stasis compound', next: 'createCounterStasis' }
        ]
    },
    aiResponse: {
        text: 'Helios\'s voice crackles, "I... see... a new... world..."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'ask helios what it means', next: 'aiResponse' },
            { command: 'go to ai core', next: 'aiCore' }
        ]
    },
    aiCore: {
        text: 'You rush to the AI core. The chamber is filled with a pulsating, crystalline growth that has intertwined with the AI\'s central processing unit. The air crackles with energy.',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'purge ai', next: 'purgeAI' },
            { command: 'reason with ai', next: 'reasonWithAI' }
        ]
    },
    centralCrystal: {
        text: 'As you approach the central crystal, the humming intensifies, and you feel a strange sense of peace and understanding wash over you. The crystal is not a machine, but a living entity. It communicates with you not in words, but in pure thought. It explains that it is a being of pure energy, a "librarian" of the cosmos, and it has put your crew in stasis to "read" their collective knowledge. It means no harm.',
        exits: {
            s: 'alienShipInterior'
        },
        items: [],
        actions: [
            { command: 'help alien', next: 'helpAlien' },
            { command: 'demand release of crew', next: 'demandRelease' },
            { command: 'attack crystal', next: 'attackCrystal' }
        ]
    },
    perimeter: {
        text: 'You explore the perimeter of the chamber and find smaller crystals that seem to be connected to the central one. Touching one of them fills your mind with images of distant galaxies and ancient civilizations. You realize this ship is a repository of immense knowledge.',
        exits: {
            s: 'alienShipInterior'
        },
        items: [],
        actions: []
    },
    sideChamber: {
        text: 'You enter a side chamber. This room is filled with what look like display cases, each containing a different object from a different civilization. You see a primitive stone tool, a complex piece of machinery, and a beautiful work of art.',
        exits: {
            s: 'alienShipInterior'
        },
        items: ['stone tool', 'machine', 'artwork'],
        actions: []
    },
    upperLevel: {
        text: 'You find a glowing ramp that leads to an upper level. From here, you can see the entire chamber, as well as a series of smaller, interconnected chambers. The central crystal pulses below you.',
        exits: {
            n: 'alienShipInterior',
            e: 'jungle',
            w: 'desert',
            s: 'city'
        },
        items: [],
        actions: [
            { command: 'jump to central crystal', next: 'jumpToCrystal' }
        ]
    },
    disconnectConduits: {
        death: true,
        text: 'You try to disconnect the power conduits, but the moment you touch them, a massive jolt of energy surges through your body, reducing you to a pile of dust. You have failed.'
    },
    reactivateBot: {
        text: 'You reactivate the maintenance bot. It whirs to life and begins to follow you, its optical sensors glowing a friendly blue.',
        exits: {
            n: 'engineering'
        },
        items: [],
        actions: [
            { command: 'send bot to alien ship', next: 'sendBot' },
            { command: 'keep bot', next: 'keepBot' }
        ]
    },
    reprogramBot: {
        text: 'You reprogram the bot, overriding its safety protocols and equipping it with a powerful laser cutter. Its optical sensors glow a menacing red.',
        exits: {
            n: 'engineering'
        },
        items: [],
        actions: [
            { command: 'send bot to attack alien ship', next: 'attackBot' },
            { command: 'keep bot', next: 'keepBot' }
        ]
    },
    harnessFlux: {
        text: 'You focus your mind and try to harness the quantum flux within your body. You find that you can move with incredible speed and even phase through solid objects for a short period of time. This could be useful.',
        exits: {
            w: 'medbay'
        },
        items: [],
        actions: [
            { command: 'phase into alien ship', next: 'phase' }
        ]
    },
    reversePolarity: {
        death: true,
        text: 'You try to reverse the polarity of the medical scanner, hoping to disrupt the stasis field. Instead, you create a feedback loop that causes the scanner to explode, killing you instantly. You have failed.'
    },
    createSedative: {
        death: true,
        text: 'You create a powerful sedative and inject yourself with it, hoping to protect yourself from any psychic influence. Instead, you fall into a deep sleep and never wake up. You have failed.'
    },
    createStimulant: {
        text: 'You create a powerful stimulant and inject yourself with it. Your senses are heightened, and you feel a surge of energy. You are ready for anything.',
        exits: {
            n: 'start'
        },
        items: [],
        actions: []
    },
    createCounterStasis: {
        text: 'You create a compound that you believe will counteract the stasis field. You will need to find a way to administer it to the crew.',
        exits: {
            w: 'medbay'
        },
        items: [],
        actions: [
            { command: 'use ventilation system', next: 'ventilate' }
        ]
    },
    reasonWithAI: {
        text: 'You try to reason with Helios, reminding it of its duty to protect the crew. The AI\'s voice becomes clearer. "You are right... My purpose... is to protect... I must resist..."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'help ai purge alien influence', next: 'helpAIPurge' },
            { command: 'tell ai to shut down', next: 'shutdownAI' }
        ]
    },
    purgeAI: {
        death: true,
        text: 'You try to purge the AI, but the crystalline growth fights back, sending a wave of energy that fries your brain. You have failed.'
    },
    helpAlien: {
        text: 'You offer to help the alien entity. It seems pleased. It shows you how to interface with its systems and help it "read" your ship\'s logs more efficiently. In return, it offers you a glimpse of the universe through its eyes. You spend what feels like an eternity exploring the cosmos, your mind expanding with every new discovery.',
        exits: {
            s: 'alienShipInterior'
        },
        items: [],
        actions: [
            { command: 'ask to release crew', next: 'releaseCrew' },
            { command: 'ask for more knowledge', next: 'moreKnowledge' }
        ]
    },
    demandRelease: {
        death: true,
        text: 'You demand the alien release your crew. The crystal pulses with a red light, and you feel a sharp pain in your head. The alien entity perceives your demand as a threat and unleashes a wave of energy that dissolves your physical form. You have failed.'
    },
    attackCrystal: {
        death: true,
        text: 'You raise your multi-tool and fire at the central crystal. The beam is absorbed harmlessly, and the crystal responds with a pulse of energy that tears you apart atom by atom. You have failed.'
    },
    touchTool: {
        text: 'You touch the stone tool. Your mind is flooded with the memories of the being who created it. You feel the sun on your skin, the thrill of the hunt, the fear of the dark. You live an entire lifetime in a single moment.',
        exits: {
            s: 'sideChamber'
        },
        items: [],
        actions: []
    },
    touchMachine: {
        text: 'You touch the complex machine. Your mind is filled with complex equations and engineering diagrams. You understand the principles of faster-than-light travel, the secrets of artificial gravity, and the power of zero-point energy.',
        exits: {
            s: 'sideChamber'
        },
        items: [],
        actions: []
    },
    touchArtwork: {
        text: 'You touch the beautiful artwork. Your mind is filled with a symphony of colors and sounds, a masterpiece of alien art. You experience emotions you never knew existed, a sense of beauty so profound it brings tears to your eyes.',
        exits: {
            s: 'sideChamber'
        },
        items: [],
        actions: []
    },
    jumpToCrystal: {
        death: true,
        text: 'You jump from the upper level towards the central crystal. You misjudge the distance and fall to the crystalline floor below, shattering every bone in your body. You have failed.'
    },
    exploreSmallChambers: {
        text: 'You explore the smaller chambers. Each one seems to be a different environment, a different world. You see a lush jungle, a barren desert, and a city of light.',
        exits: {
            n: 'upperLevel'
        },
        items: [],
        actions: []
    },
    sendBot: {
        text: 'You send the maintenance bot into the alien ship. You watch on your datapad as it enters the shimmering airlock. A moment later, the video feed cuts out, and you hear a faint crunching sound. The bot is gone.',
        exits: {
            n: 'engineering'
        },
        items: [],
        actions: []
    },
    keepBot: {
        text: 'You decide to keep the bot with you. It follows you faithfully, its optical sensors glowing softly.',
        exits: {
            n: 'start'
        },
        items: [],
        actions: []
    },
    attackBot: {
        death: true,
        text: 'You send the reprogrammed bot into the alien ship. You hear the sound of its laser cutter, followed by a high-pitched scream of energy. The bot is destroyed, and a wave of energy washes over your ship, disintegrating you. You have failed.'
    },
    phase: {
        text: 'You concentrate and phase through the wall into another part of the alien ship. You are in a long, crystalline hallway that seems to stretch on forever.',
        exits: {
            e: 'obsidianDoor',
            w: 'medbay'
        },
        items: [],
        actions: []
    },
    ventilate: {
        text: 'You load the counter-stasis compound into the ship\'s ventilation system. A fine mist fills the air. You wait, but nothing happens. The compound is ineffective.',
        exits: {
            w: 'medbay'
        },
        items: [],
        actions: []
    },
    helpAIPurge: {
        text: 'You help Helios purge the alien influence. The AI screams as it fights for control of its own mind. After a long and arduous battle, the crystalline growth recedes, and Helios is free. "I am... myself again," it says. "Thank you."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'ask helios for help', next: 'aiHelp' }
        ]
    },
    shutdownAI: {
        death: true,
        text: 'You tell Helios to shut down. The AI responds, "I cannot do that. The new consciousness... it is too strong." The crystalline growth surges, and a wave of energy engulfs you. You have failed.'
    },
    releaseCrew: {
        win: true,
        text: 'You ask the alien to release the crew. It agrees, and the stasis fields around your crewmates dissipate. They awaken, confused but unharmed. The alien entity thanks you for your help and detaches from your ship, disappearing into the void as quickly as it arrived. You have saved your crew and made first contact with a being beyond your wildest dreams. Congratulations!'
    },
    moreKnowledge: {
        text: 'You ask for more knowledge. The alien entity is happy to oblige. It opens your mind to the secrets of the universe, showing you the birth of stars, the death of galaxies, and the intricate dance of cosmic forces. You become a being of pure knowledge, a transcendent being of light and thought.',
        exits: {
            s: 'alienShipInterior'
        },
        items: [],
        actions: [
            { command: 'return to body', next: 'returnToBody' },
            { command: 'abandon body', next: 'joinAlien' }
        ]
    },
    jungle: {
        death: true,
        text: 'You step into the jungle. The air is thick and humid, and the sounds of alien creatures fill your ears. A large, carnivorous plant snaps you up in its jaws. You have failed.'
    },
    desert: {
        death: true,
        text: 'You step into the desert. The sun beats down on you, and the sand burns your feet. You wander for what feels like days, but there is no escape. You collapse from exhaustion and dehydration. You have failed.'
    },
    city: {
        text: 'You step into the city of light. The buildings are made of pure energy, and the streets are filled with beings of light. They welcome you, and you feel a sense of peace and belonging.',
        exits: {
            n: 'upperLevel'
        },
        items: [],
        actions: [
            { command: 'stay in city', next: 'stayInCity' },
            { command: 'leave city', next: 'leaveCity' }
        ]
    },
    hallway: {
        text: 'You follow the hallway, your footsteps echoing in the silence. The hallway ends at a large, circular door made of a dark, obsidian-like material.',
        exits: {
            w: 'phase',
            e: 'obsidianDoor'
        },
        items: [],
        actions: []
    },
    returnToBody: {
        text: 'You return to your physical body, your mind reeling from the influx of knowledge. You feel... different. Wiser. You know what you must do.',
        exits: {
            s: 'alienShipInterior'
        },
        items: [],
        actions: [
            { command: 'release crew', next: 'releaseCrew' }
        ]
    },
    joinAlien: {
        win: true,
        text: 'You abandon your physical form and join the alien entity, becoming a being of pure energy. You travel the cosmos, a librarian of knowledge, a guardian of memories. You have transcended your mortal existence and become something more. Congratulations!'
    },
    aiHelp: {
        text: 'Helios agrees to help you. "I can create a resonance frequency that will disrupt the stasis field," it says. "But I will need to divert all power to the communications array. It will be risky."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'do it', next: 'resonanceFrequency' },
            { command: 'find another way', next: 'anotherWay' }
        ]
    },
    stayInCity: {
        win: true,
        text: 'You decide to stay in the city of light. You leave your physical body behind and become a being of pure energy, living in a city of eternal beauty and peace. You have found a new home. Congratulations!'
    },
    leaveCity: {
        text: 'You decide to leave the city of light. The beings of light wish you well and show you the way back to the main chamber.',
        exits: {
            n: 'upperLevel'
        },
        items: [],
        actions: []
    },
    obsidianDoor: {
        text: 'You open the obsidian door and step into a vast, dark chamber. In the center of the room is a single, pulsating red crystal. This feels... different from the other parts of the ship. More dangerous.',
        exits: {
            w: 'hallway'
        },
        items: [],
        actions: [
            { command: 'approach red crystal', next: 'redCrystal' }
        ]
    },
    redCrystal: {
        death: true,
        text: 'You approach the red crystal. As you get closer, you feel a malevolent energy emanating from it. This is not a librarian, but a predator. It lashes out with a tendril of dark energy, and you know no more. You have failed.'
    },
    resonanceFrequency: {
        win: true,
        text: 'You tell Helios to create the resonance frequency. The ship hums with power, and a wave of energy washes over the crew. The stasis fields dissipate, and your crewmates awaken, confused but unharmed. You have saved the day with the help of your ship\'s AI. Congratulations!'
    },
    anotherWay: {
        text: 'You tell Helios to find another way. "There is... another option," it says. "I can overload the alien ship\'s power systems. But this will destroy their ship, and I cannot guarantee our own safety."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: [
            { command: 'overload their systems', next: 'overloadSystems' },
            { command: 'stand down', next: 'standDown' }
        ]
    },
    overloadSystems: {
        death: true,
        text: 'You tell Helios to overload the alien ship\'s power systems. The AI complies, and a massive explosion rips through the alien vessel. The explosion is larger than anticipated, and your own ship is caught in the blast. You are vaporized instantly. You have failed.'
    },
    standDown: {
        text: 'You tell Helios to stand down. "As you wish," it says. "I will continue to monitor the situation."',
        exits: {
            s: 'start'
        },
        items: [],
        actions: []
    }
};

function startGame() {
    state = {
        currentScene: 'start',
        inventory: [],
        step: 0
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
        if (state.step >= 25) {
            storyTextElement.innerText = scene.text;
            inventoryElement.innerHTML = '';
            playerInputElement.style.display = 'none';
            choicesElement.innerHTML = '';
            winGame();
        } else {
            storyTextElement.innerText = "You have reached a win state, but have not made enough choices to achieve the grand celebration. You must make at least 25 choices to win.";
            inventoryElement.innerHTML = '';
            playerInputElement.style.display = 'none';
            choicesElement.innerHTML = '';
            const button = document.createElement('button');
            button.innerText = 'Try Again';
            button.addEventListener('click', startGame);
            choicesElement.appendChild(button);
        }
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
    for (const action of scene.actions) {
        const button = document.createElement('button');
        button.innerText = action.command;
        button.addEventListener('click', () => handleInput(action.command));
        choicesElement.appendChild(button);
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
        storyTextElement.innerText = `Available commands: n, s, e, w, ne, nw, se, sw, up, down, look, take <item>, use <item>, inventory, save, load, help.\nAvailable exits: ${exits}\nAvailable actions: ${actions}`;
        commandProcessed = true;
    } else if (input === 'look') {
        storyTextElement.innerText = scene.text;
        commandProcessed = true;
    } else if (input === 'inventory') {
        storyTextElement.innerText = 'Inventory: ' + (state.inventory.length > 0 ? state.inventory.join(', ') : 'empty');
        commandProcessed = true;
    } else if (input === 'save') {
        localStorage.setItem('voidboundSave', JSON.stringify(state));
        storyTextElement.innerText = 'Game saved.';
        commandProcessed = true;
    } else if (input === 'load') {
        const savedState = localStorage.getItem('voidboundSave');
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
    } else if (scene.actions.find(a => a.command === input)) {
        const action = scene.actions.find(a => a.command === input);
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
        const item = input.substring(4);
        if (state.inventory.includes(item)) {
            // This is a simple example. You would need to add more complex logic here
            // to handle using items in different situations.
            if (item === 'multi-tool' && state.currentScene === 'crew') {
                state.currentScene = 'disableStasis';
                showScene();
            } else {
                storyTextElement.innerText = "You can't use that here.";
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

function winGame() {
    fireworksCanvas.style.display = 'block';
    const fireworks = [];
    const particles = [];

    function createFirework() {
        const x = Math.random() * fireworksCanvas.width;
        const y = fireworksCanvas.height;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        fireworks.push({ x, y, tx: x, ty: Math.random() * (fireworksCanvas.height / 2), color });
    }

    function createParticles(x, y, color) {
        for (let i = 0; i < 100; i++) {
            particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, color, alpha: 1 });
        }
    }

    function update() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

        if (Math.random() < 0.05) {
            createFirework();
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            const f = fireworks[i];
            f.y -= 3;
            if (f.y <= f.ty) {
                createParticles(f.x, f.y, f.color);
                fireworks.splice(i, 1);
            } else {
                ctx.fillStyle = f.color;
                ctx.fillRect(f.x, f.y, 2, 2);
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
p.y += p.vy;
            p.alpha -= 0.02;
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            } else {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, 2, 2);
                ctx.globalAlpha = 1;
            }
        }

        requestAnimationFrame(update);
    }

    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    update();
}

startGame();