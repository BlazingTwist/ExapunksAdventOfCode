// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

const FILE_ICON_DATA = 0;
const FILE_ICON_TEXT = 1;
const FILE_ICON_USER = 2;
const FILE_ICON_ARCHIVE = 3;
const FILE_ICON_FOLDER = 4;
const FILE_ICON_SECURE = 5;
const FILE_ICON_MOVIE = 6;
const FILE_ICON_MUSIC = 7;

const LINK_ID_NONE = 0;

class Host {
}

class Link {
}

// @ts-ignore
class File {
}

class Register {
}

class Goal {
}

// @ts-ignore
class Window {
}

/**
 * Create a host in the network with the specified name, position, and size. The X coordinate increases toward the top-right corner of the screen, while the Y coordinate increases toward the top-left corner of the screen.
 *
 * Returns a host handle that can be passed to other API functions.
 */
function createHost(name: string, x: number, y: number, width: number, height: number): Host {
    return null;
}

/**
 * Create a link between the specified hosts using the specified link IDs. The two hosts must visibly align so that a link could be created, and must be spaced with exactly two grid units between them.
 *
 * Instead of a numeric value, you may use the constant LINK_ID_NONE to create a one-way or impassable link.
 *
 * Returns a link handle that can be passed to other API functions.
 */
function createLink(firstHostHandle: Host, firstID: number, secondHostHandle: Host, secondID: number): Link {
    return null;
}

/**
 * Change the link IDs of the specified link to the specified values.
 */
function modifyLink(linkHandle: Link, firstID: number, secondID: number) {
}

/**
 * Create a normal, movable file in the specified host with the specified ID, icon, and contents. The file's contents should be an array of integers and strings, which correspond to number and keyword values respectively.
 *
 * The allowed values for icon are FILE_ICON_DATA, FILE_ICON_TEXT, FILE_ICON_USER, FILE_ICON_ARCHIVE, FILE_ICON_FOLDER, FILE_ICON_SECURE, FILE_ICON_MOVIE, and FILE_ICON_MUSIC.
 *
 * Returns a file handle that can be passed to other API functions.
 */
function createNormalFile(hostHandle: Host, id: number, icon: number, contents: any[]): File {
    return null;
}

/**
 * Similar to createNormalFile, except that the created file cannot be moved out of its initial host. A file ID can only be used more than once in a network if all files with that ID are locked.
 *
 * Returns a file handle that can be passed to other API functions.
 */
function createLockedFile(hostHandle: Host, id: number, icon: number, contents: any[]): File {
    return null;
}

/**
 * Enable column mode for the specified file's display window, which will automatically wrap the file contents after the specified number of values.
 */
function setFileColumnCount(fileHandle: File, columnCount: number) {
}

/**
 * Set the specified file's display window to be initially collapsed when connecting to the network or switching to a different test run.
 */
function setFileInitiallyCollapsed(fileHandle: File) {
}

/**
 * Create a hardware register in the specified host with the specified position and name. A hardware register's name must consist of exactly four alphanumeric characters.
 * Returns a hardware register handle that can be passed to other API functions.
 */
function createRegister(hostHandle: Host, x: number, y: number, name: string): Register {
    return null;
}

/**
 * Set the specified function as the read callback for the specified hardware register. When an EXA attempts to read from the register the read callback will be called and whatever value it returns will be read by the EXA. A read callback should return either an integer or a string.
 */
function setRegisterReadCallback(registerHandle: Register, readCallback: Function) {
}

/**
 * Set the specified function as the write callback for the specified hardware register. When an EXA attempts to write to the register the write callback will be called and whatever value it wrote will be passed to the callback as either an integer or a string.
 */
function setRegisterWriteCallback(registerHandle: Register, writeCallback: Function) {
}

/**
 * Create a goal that requires a file with the specified contents to be created in the specified host. To require a file to be brought back to the player's host, use the result of getPlayerHost for the hostHandle argument.
 */
function requireCreateFile(hostHandle: Host, contents: any[], description: string) {
}

/**
 * Create a goal that requires the specified file to be moved to the specified host.
 */
function requireMoveFile(fileHandle: File, hostHandle: Host, description: string) {
}

/**
 * Create a goal that requires the specified file to be changed to have the specified contents.
 */
function requireChangeFile(fileHandle: File, contents: any[], description: string) {
}

/**
 * Create a goal that requires the specified file to be moved to the specified host and changed to have the specified contents.
 */
function requireMoveAndChangeFile(fileHandle: File, hostHandle: Host, contents: any[], description: string) {
}

/**
 * Create a goal that requires the specified file to be deleted from the network.
 */
function requireDeleteFile(fileHandle: File, description: string) {
}

/**
 * Create a custom goal that can be marked as completed or failed from a hardware register callback.
 *
 * Returns a custom goal handle that can be passed to other API functions.
 */
function requireCustomGoal(description: string): Goal {
    return null;
}

/**
 * Mark the specified custom goal as completed.
 */
function setCustomGoalCompleted(goalHandle: Goal) {
}

/**
 * Mark the specified custom goal as failed.
 */
function setCustomGoalFailed(goalHandle: Goal) {
}

/**
 * Merge the requirementCount most recently created requirements into a single requirement. Merged requirements will display the progress of their sub-requirements as a fraction (such as "4/6").
 */
function mergeRequirements(requirementCount: number, description: string) {
}

/**
 * Create an input / output table with the specified title and position, in addition to a goal with the specified description that requires all output columns in the table to be completed correctly.
 *
 * A network may only contain a single input/output table.
 */
function createTable(title: string, x: number, y: number, description: string) {
}

/**
 * Add an input column to the input / output table with the specified label and input values. When an EXA reads from the specified register, it will read the next input value from this column.
 */
function addTableInput(label: string, values: any[], registerHandle: Register) {
}

/**
 * Add an output column to the input / output table with the specified label and expected values. When an EXA writes to the specified register, it will append the output value to this column and compare it to the corresponding expected value.
 */
function addTableOutput(label: string, values: any[], registerHandle: Register) {
}

/**
 * Create an output window with the specified title, position, and size. Output windows can display arbitrary text, and are typically used to provide additional feedback in networks utilizing hardware registers.
 *
 * Returns an output window handle that can be passed to other API functions.
 */
function createWindow(title: string, x: number, y: number, width: number, height: number): Window {
    return null;
}

/**
 * Print the specified line of text to the specified window. Lines that are longer than the window is wide will be automatically truncated.
 */
function printWindow(windowHandle: Window, text: string) {
}

/**
 * Clear the contents of the specified window.
 */
function clearWindow(windowHandle: Window) {
}

/**
 * Returns a random number between min and max, inclusive.
 */
function randomInt(min: number, max: number): number {
    return 0;
}

/**
 * Returns a boolean that is true with the specified probability, where a value of 0 will always return false and a value of 1 will always return true.
 */
function randomBool(probability: number): boolean {
    return true;
}

/**
 * Returns a random value from the specified array.
 */
function randomChoice(choices: any[]): any {
    return null;
}

/**
 * Returns a random name.
 */
function randomName(): string {
    return "";
}

/**
 * Returns a random residential address.
 */
function randomAddress(): string {
    return "";
}

/**
 * Returns a host handle for the player's host, which is created automatically and cannot be altered.
 */
function getPlayerHost(): Host {
    return null;
}

/**
 * Returns an array of keywords generated by splitting the specified multi-word string on spaces (which are omitted) and punctuation (which are included). Useful for creating the contents of text-based files.
 */
function convertTextToKeywords(text: string): string[] {
    return [];
}

/**
 * Open the in-network debug console and print the textual representation of the specified object to it.
 *
 * The debug console is only intended for debugging scripts and displaying errors. If you want to display information about the network you should use output windows instead of the debug console.
 */
function printConsole(object: any) {
}
