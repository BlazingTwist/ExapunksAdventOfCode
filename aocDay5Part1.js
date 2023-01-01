// For the latest Axiom VirtualNetwork+ scripting documentation,
// please visit: http://www.zachtronics.com/virtualnetwork/
// noinspection DuplicatedCode

function getTitle() {
    return "Day 5.1 : Supply Stacks";
}

function getSubtitle() {
    return "Advent of Code 2022";
}

function getDescription() {
    return ""
        + "Find the problem description here https://adventofcode.com/2022/day/5\n"
        + "Create a File containing the topmost container of each stack in order and place it in your host.\n"
        + "Your host has a copy of the crane operator's *instructions* in File 300, and the keywords are available at the base of the Crane: #MOVE, #FROM"
        + " and #TOOO. Also, the ship has registers with the total number of stacks and containers.\n"
        + "To help you, the elves have placed a copy of the *starting state* for each stack in the container rooms. You can edit them however you want, just"
        + " make sure you dispose of them once you're done."
        ;
}

let currentTestRun = -1;
let rawData = null;
let fileData = null;
let expectedResult = null;
let error = null;

function initializeTestRun(testRun) {
    let recompute = currentTestRun !== testRun;
    currentTestRun = testRun;

    if (recompute) {
        error = null;
        rawData = getRawData(testRun);
        fileData = rawDataToFileData(rawData);
        expectedResult = getExpectedResult(rawData);
    }

    if (error != null) {
        printConsole(error);
        printConsole("This means that the testRun might be unsolvable.")
        printConsole("Please report this to the Level-Creator.")
    }

    let shipHost = createHost("Ship", 5, 1, 17, 2);
    let containers = [
        createHost("Stack1", 5, -3, 1, 2),
        createHost("Stack2", 7, -3, 1, 2),
        createHost("Stack3", 9, -3, 1, 2),
        createHost("Stack4", 11, -3, 1, 2),
        createHost("Stack5", 13, -3, 1, 2),
        createHost("Stack6", 15, -3, 1, 2),
        createHost("Stack7", 17, -3, 1, 2),
        createHost("Stack8", 19, -3, 1, 2),
        createHost("Stack9", 21, -3, 1, 2),
    ]
    let craneHost = createHost("Crane", 8, 5, 3, 3);
    createLink(shipHost, 800, craneHost, -1);
    for (let containerID in containers) {
        createLink(shipHost, 801 + parseInt(containerID), containers[containerID], -1);
    }

    let keywordRegisterMove = createRegister(craneHost, 10, 7, "MOVE");
    let keywordRegisterFrom = createRegister(craneHost, 10, 6, "FROM");
    let keywordRegisterTo = createRegister(craneHost, 10, 5, "TOOO");
    setRegisterReadCallback(keywordRegisterMove, function () {return "move"});
    setRegisterReadCallback(keywordRegisterFrom, function () {return "from"});
    setRegisterReadCallback(keywordRegisterTo, function () {return "to"});

    let registerNumContainers = createRegister(shipHost, 5, 2, "CTRS");
    let registerNumStacks = createRegister(shipHost, 6, 2, "STKS");
    setRegisterReadCallback(registerNumContainers, function () {
        return rawData.stacks.map(function (stack) {
            return stack.length;
        }).reduce(function (prev, cur) {
            return prev + cur;
        });
    });
    setRegisterReadCallback(registerNumStacks, function () {return rawData.stacks.length});

    let instructionFile = createNormalFile(getPlayerHost(), 300, FILE_ICON_TEXT, fileData.instructionFile);
    setFileColumnCount(instructionFile, 6);
    if (testRun > 2) {
        setFileInitiallyCollapsed(instructionFile);
    }

    requireCreateFile(getPlayerHost(), expectedResult, "Create File containing topmost container of each stack in your host.");

    let numStacks = fileData.stackFiles.length;
    for (let i = 0; i < numStacks; i++) {
        let containerFile = createNormalFile(containers[i], 801 + i, FILE_ICON_ARCHIVE, fileData.stackFiles[i]);
        requireDeleteFile(containerFile, "");
    }
    mergeRequirements(numStacks, "Delete the helper files.");
}

function onCycleFinished() {
}

/** @typedef {Array<string>} Stack */
/** @typedef {{num: number, from: number, to: number}} Instruction */
/** @typedef {{stacks: Array<Stack>, instructions: Array<Instruction>}} RawData */

const sampleCases1 = {
    stacks: ["ZN", "MCD", "P"],
    instructions: [[1, 2, 1], [3, 1, 3], [2, 2, 1], [1, 1, 2]]
};
const sampleCases2 = {
    stacks: ["BGSC", "TMWHJNVG", "MQS", "BSLTWNM", "JZFTVGWP", "CTBGQHS", "TJPBW", "GDCZFTQM", "NSHBPF"],
    instructions: [[2, 4, 2], [6, 9, 7], [4, 7, 2], [2, 4, 1], [2, 6, 7], [1, 3, 8], [4, 7, 1], [2, 3, 2], [3, 8, 5], [3, 1, 4], [12, 2, 5], [2, 6, 8], [12, 5, 8], [3, 7, 9], [18, 8, 9], [2, 8, 6], [3, 2, 3], [14, 9, 4], [1, 1, 3], [7, 9, 3], [1, 2, 1], [8, 4, 5], [5, 6, 3], [2, 7, 9], [3, 4, 9], [4, 9, 6], [4, 6, 1], [8, 4, 6], [10, 1, 2], [13, 3, 2], [17, 5, 9], [2, 5, 1], [9, 9, 7], [1, 3, 6], [2, 1, 8], [11, 2, 4], [5, 6, 8], [1, 6, 3], [1, 1, 4], [3, 8, 6], [3, 2, 8], [9, 7, 9], [4, 4, 7], [1, 9, 5], [15, 9, 7], [7, 8, 3], [1, 5, 6], [2, 6, 9], [8, 2, 6], [3, 4, 3], [1, 2, 5], [4, 9, 3], [1, 3, 4], [13, 6, 2], [1, 5, 1], [4, 4, 9], [6, 3, 2], [11, 2, 7], [6, 3, 4], [3, 3, 2], [1, 3, 4], [1, 1, 3], [3, 9, 2], [1, 3, 1], [4, 7, 1], [1, 9, 5], [5, 1, 4], [11, 2, 4], [1, 5, 3], [1, 2, 3], [12, 4, 2], [2, 7, 2], [7, 4, 3], [5, 4, 1], [7, 7, 6], [4, 1, 8], [1, 8, 5], [8, 3, 2], [4, 7, 4], [13, 7, 1], [2, 8, 6], [5, 4, 9], [1, 3, 6], [1, 5, 8], [1, 2, 9], [4, 2, 6], [2, 8, 6], [10, 1, 3], [4, 9, 4], [2, 1, 3], [5, 2, 9], [4, 9, 2], [1, 1, 2], [13, 2, 4], [15, 4, 5], [3, 6, 8], [8, 3, 8], [1, 4, 2], [14, 5, 1], [1, 5, 4], [1, 4, 2], [8, 6, 7], [3, 6, 2], [2, 9, 1], [8, 8, 7], [9, 1, 5], [7, 5, 3], [14, 7, 9], [2, 2, 3], [7, 2, 1], [1, 6, 1], [4, 9, 2], [8, 3, 6], [2, 4, 3], [4, 3, 5], [5, 5, 7], [2, 6, 9], [6, 6, 2], [4, 2, 3], [1, 6, 2], [2, 7, 8], [13, 9, 5], [2, 7, 1], [14, 1, 5], [15, 5, 7], [3, 8, 7], [5, 3, 5], [6, 5, 7], [4, 1, 7], [1, 2, 5], [3, 2, 8], [11, 5, 2], [10, 7, 1], [1, 3, 4], [10, 2, 9], [1, 5, 8], [6, 7, 3], [1, 4, 6], [2, 3, 8], [1, 2, 1], [4, 3, 9], [3, 1, 6], [2, 7, 1], [1, 5, 6], [1, 3, 8], [4, 1, 4], [5, 2, 9], [3, 1, 4], [18, 9, 7], [4, 8, 4], [3, 1, 2], [1, 9, 7], [1, 4, 7], [1, 6, 2], [1, 2, 5], [25, 7, 3], [7, 4, 2], [8, 7, 9], [4, 8, 6], [1, 8, 5], [4, 6, 5], [2, 9, 5], [3, 5, 8], [4, 6, 4], [12, 3, 5], [11, 3, 2], [13, 5, 8], [4, 9, 6], [7, 4, 9], [2, 6, 2], [12, 2, 7], [1, 6, 3], [1, 5, 6], [2, 5, 3], [15, 8, 6], [4, 6, 7], [1, 5, 1], [10, 2, 8], [8, 8, 3], [8, 6, 8], [2, 7, 6], [9, 9, 7], [8, 8, 9], [1, 1, 3], [1, 2, 7], [7, 3, 1], [3, 8, 5], [3, 1, 6], [7, 9, 2], [2, 3, 7], [5, 7, 9], [17, 7, 5], [2, 7, 6], [10, 6, 3], [1, 1, 3], [6, 9, 3], [1, 2, 9], [2, 7, 9], [2, 9, 7], [1, 5, 8], [1, 8, 5], [6, 2, 5], [1, 6, 1], [5, 3, 5], [1, 6, 8], [1, 7, 9], [2, 9, 3], [15, 5, 2], [2, 1, 8], [2, 3, 7], [2, 8, 3], [3, 5, 9], [1, 8, 6], [1, 9, 6], [3, 7, 6], [17, 3, 4], [1, 1, 2], [6, 2, 9], [16, 4, 1], [4, 6, 8], [9, 5, 6], [8, 6, 2], [2, 9, 5], [2, 3, 5], [1, 6, 2], [1, 4, 8], [14, 1, 3], [8, 5, 3], [20, 3, 1], [1, 8, 2], [1, 9, 6], [1, 6, 7], [1, 7, 3], [22, 1, 2], [3, 3, 6], [27, 2, 8], [2, 2, 8], [2, 6, 9], [2, 9, 4], [2, 4, 8], [1, 1, 3], [14, 8, 5], [1, 3, 9], [3, 9, 2], [5, 2, 8], [10, 2, 9], [1, 6, 7], [1, 7, 5], [7, 5, 2], [2, 9, 2], [1, 6, 2], [2, 9, 5], [3, 5, 6], [6, 5, 3], [1, 5, 6], [4, 3, 9], [2, 9, 8], [3, 9, 5], [23, 8, 1], [2, 6, 1], [1, 5, 7], [2, 3, 5], [2, 9, 5], [4, 9, 7], [2, 9, 4], [1, 5, 4], [5, 8, 5], [2, 6, 2], [3, 7, 3], [1, 3, 4], [3, 2, 8], [4, 1, 6], [2, 6, 3], [4, 1, 2], [3, 8, 1], [13, 2, 5], [4, 3, 2], [14, 5, 7], [5, 2, 7], [18, 7, 9], [4, 4, 7], [2, 5, 4], [17, 9, 5], [1, 9, 1], [1, 7, 2], [5, 7, 2], [18, 1, 4], [1, 7, 3], [1, 3, 6], [2, 1, 3], [1, 6, 5], [2, 6, 8], [1, 8, 9], [1, 8, 3], [13, 4, 5], [1, 1, 6], [3, 2, 4], [1, 6, 1], [3, 2, 9], [3, 3, 1], [5, 4, 5], [30, 5, 3], [1, 4, 6], [1, 9, 8], [1, 9, 6], [21, 3, 7], [3, 1, 6], [1, 1, 4], [1, 9, 6], [1, 8, 2], [1, 3, 6], [1, 9, 3], [5, 4, 8], [1, 2, 4], [9, 5, 7], [2, 5, 9], [2, 8, 2], [2, 6, 3], [1, 4, 1], [4, 3, 8], [2, 9, 2], [4, 2, 6], [1, 1, 4], [2, 6, 9], [2, 5, 4], [1, 3, 1], [1, 1, 3], [2, 9, 1], [5, 3, 5], [1, 1, 8], [4, 6, 4], [5, 5, 6], [18, 7, 5], [1, 3, 4], [12, 7, 5], [15, 5, 6], [1, 5, 8], [1, 3, 7], [1, 1, 2], [1, 2, 4], [1, 7, 9], [2, 8, 2], [1, 2, 4], [4, 4, 2], [1, 2, 1], [1, 9, 8], [4, 6, 4], [3, 2, 6], [1, 2, 6], [8, 4, 3], [1, 1, 3], [6, 6, 1], [1, 3, 6], [5, 1, 7], [10, 5, 9], [3, 9, 8], [7, 6, 2], [1, 7, 8], [3, 5, 8], [3, 6, 2], [6, 8, 9], [1, 5, 3], [2, 3, 1], [2, 4, 8], [6, 6, 9], [1, 1, 4], [17, 9, 2], [1, 4, 1], [2, 7, 8], [1, 9, 8], [3, 8, 4], [3, 1, 4], [9, 8, 2], [1, 8, 4], [12, 2, 7], [4, 7, 4], [1, 8, 1], [10, 4, 2], [3, 3, 2], [1, 9, 7], [11, 7, 3], [1, 3, 1], [2, 3, 9], [1, 3, 7], [2, 1, 9], [1, 6, 5], [7, 3, 6], [1, 7, 3], [3, 3, 4], [1, 5, 7], [2, 4, 3], [2, 4, 8], [1, 7, 6], [2, 6, 8], [1, 9, 2], [1, 9, 5], [1, 5, 1], [1, 8, 6], [1, 3, 2], [4, 6, 1], [5, 1, 4], [11, 2, 4], [2, 8, 2], [1, 8, 9], [27, 2, 5], [4, 6, 3], [3, 2, 4], [2, 5, 9], [1, 5, 7], [2, 9, 5], [14, 4, 7], [2, 4, 7], [3, 4, 8], [4, 3, 1], [4, 1, 8], [2, 3, 9], [2, 9, 3], [7, 8, 9], [1, 3, 8], [2, 3, 2], [25, 5, 9], [1, 5, 8], [1, 8, 7], [26, 9, 1], [23, 1, 5], [7, 9, 7], [1, 9, 8], [1, 9, 2], [5, 7, 1], [20, 5, 6], [1, 7, 6], [2, 5, 3], [1, 8, 6], [21, 6, 8], [1, 6, 4], [1, 1, 7], [2, 1, 6], [1, 1, 3], [1, 2, 5], [1, 2, 6], [2, 7, 6], [6, 7, 9], [3, 1, 2], [17, 8, 1], [1, 4, 1], [2, 6, 9], [3, 8, 9], [2, 3, 7], [2, 9, 8], [4, 7, 3], [4, 3, 4], [2, 5, 8], [4, 8, 4], [3, 6, 8], [18, 1, 5], [1, 3, 4], [3, 2, 4], [5, 9, 1], [10, 7, 5], [5, 1, 3], [5, 3, 5], [5, 4, 3], [2, 4, 2], [5, 8, 3], [25, 5, 2], [3, 3, 6], [1, 1, 3], [3, 6, 7], [1, 4, 2], [1, 5, 8], [2, 4, 9], [1, 8, 1], [20, 2, 7], [10, 7, 1], [1, 1, 7], [4, 7, 8], [5, 5, 4], [4, 8, 6], [1, 1, 3], [5, 7, 4], [2, 1, 5], [4, 9, 1], [3, 2, 5], [5, 5, 1], [1, 9, 1], [11, 1, 3], [1, 6, 2], [7, 3, 5], [11, 3, 7], [1, 2, 6], [7, 7, 8], [1, 9, 1], [2, 3, 1], [1, 5, 3], [4, 1, 6], [4, 6, 3], [9, 4, 5], [2, 8, 2], [4, 6, 9], [3, 2, 4], [1, 8, 6]]
};

/**
 * @param {number} testRun
 * @return {RawData}
 */
function getRawData(testRun) {
    if (testRun === 1) {
        return sampleCaseToRawData(sampleCases1);
    } else if (testRun === 2) {
        return sampleCaseToRawData(sampleCases2);
    }

    /** @type {RawData} */
    let data = {};
    data.stacks = [];
    data.instructions = [];

    // used to ensure that no invalid moves are generated
    let numCardsOnStack = [];

    const minChar = "A".charCodeAt(0);
    const maxChar = "Z".charCodeAt(0);
    let numStacks = randomInt(3, 9);
    for (let i = 0; i < numStacks; i++) {
        /** @type {Stack} */
        let stack = [];
        let numCards = randomInt(1, 8);
        numCardsOnStack.push(numCards);
        for (let j = 0; j < numCards; j++) {
            stack.push(String.fromCharCode(randomInt(minChar, maxChar)));
        }
        data.stacks.push(stack);
    }

    let stackIndices = [];
    for (let i = 0; i < numStacks; i++) {
        stackIndices.push(i);
    }
    let numMoves = randomInt(10, 300);
    for (let i = 0; i < numMoves; i++) {
        let fromIndex = randomChoice(stackIndices.filter(function (idx) {
            return numCardsOnStack[idx] > 0;
        }));
        let availableToMove = numCardsOnStack[fromIndex];
        let numMove = availableToMove > 1 ? randomInt(1, availableToMove) : 1;
        let toIndex = randomInt(0, numStacks - 1);
        if (toIndex === fromIndex) {
            toIndex = (toIndex + 1) % numStacks;
        }
        data.instructions.push({num: numMove, from: fromIndex + 1, to: toIndex + 1});

        numCardsOnStack[fromIndex] -= numMove;
        numCardsOnStack[toIndex] += numMove;
    }

    let getMaxIndex = function () {
        return stackIndices.reduce(function (prev, next) {
            let prevVal = numCardsOnStack[prev];
            let nextVal = numCardsOnStack[next];
            return prevVal < nextVal ? next : prev;
        });
    }
    for (let i = 0; i < numCardsOnStack.length; i++) {
        if (numCardsOnStack[i] < 0) {
            error = "cannot have negative amount of crates on stack!";
        } else if (numCardsOnStack[i] === 0) {
            let maxIndex = getMaxIndex();
            numCardsOnStack[maxIndex] -= 1;
            numCardsOnStack[i] += 1;
            data.instructions.push({num: 1, from: maxIndex + 1, to: i + 1});
        }
    }

    return data;
}

/**
 * @param {{stacks: Array<String>, instructions: Array<Array<number>>}} sampleData
 * @return {RawData}
 */
function sampleCaseToRawData(sampleData) {
    /** @type {RawData} */
    let result = {};
    result.stacks = sampleData.stacks.map(function (stack) {
        return stack.split('');
    });
    result.instructions = sampleData.instructions.map(function (instruction) {
        /** @type {Instruction} */
        return {
            num: instruction[0],
            from: instruction[1],
            to: instruction[2],
        };
    })
    return result;
}

/**
 * @param {RawData} rawData
 * @return {{stackFiles: Array<Array<string|number>>, instructionFile: Array<string|number>}}
 */
function rawDataToFileData(rawData) {
    let result = {};
    result.stackFiles = rawData.stacks;
    result.instructionFile = [];
    for (let i = 0; i < rawData.instructions.length; i++) {
        let instruction = rawData.instructions[i];
        result.instructionFile.push("move", instruction.num, "from", instruction.from, "to", instruction.to);
    }
    return result;
}

/**
 * @param {RawData} rawData
 * @return {Array<string>}
 */
function getExpectedResult(rawData) {
    let stacks = rawData.stacks.map(function (stack) {
        return stack.map(function (x) {
            return x;
        });
    });
    for (let i = 0; i < rawData.instructions.length; i++) {
        let instruction = rawData.instructions[i];
        for (let j = 0; j < instruction.num; j++) {
            let movedElement = stacks[instruction.from - 1].pop();
            if (movedElement == null) {
                error = "moved element was null! instruction: " + JSON.stringify(instruction);
            }
            stacks[instruction.to - 1].push(movedElement);
        }
    }
    return stacksToResult(stacks);
}

/**
 * @param {Array<Stack>} stacks
 * @return {Array<String>}
 */
function stacksToResult(stacks) {
    return stacks.map(function (stack) {
        if (stack.length <= 0) {
            error = "empty stack?!";
        }
        return stack[stack.length - 1];
    });
}
