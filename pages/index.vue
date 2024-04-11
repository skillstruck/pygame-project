<template>
    <div class="flex flex-col h-screen w-screen">
        <div class="w-full font-bold text-2xl px-4 py-2 border-b">Pygame Project</div>
        <div class="flex h-full">
            <!-- EDITOR COLUMN -->
            <div class="flex-grow w-[50vw] border-r flex flex-col">
                <div class="flex justify-between items-center px-4 h-[60px] flex-shrink-0 border-b">
                    <p class="font-bold text-xl">Editor</p>
                    <button @click="runCode()"
                        class="font-bold bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg">Run
                        code</button>
                </div>
                <!-- EDITOR TEXTAREA -->
                <textarea v-model="currentCode" @keydown="handleKeyDown"
                    class="h-full w-full flex-grow-1 p-4 font-mono bg-slate-800 text-white"
                    placeholder="Type code here..."></textarea>
            </div>
            <!-- OUTPUT COLUMN -->
            <div class="flex-grow w-[50vw] flex flex-col">
                <div class="flex justify-between items-center px-4 h-[60px] flex-shrink-0 border-b">
                    <p class="font-bold text-xl">Output</p>
                </div>
                <div class="flex-grow flex flex-col">
                    <LazyDisplay v-if="showDisplay" ref="display" class="h-[60%] w-full" />
                    <LazyTerminal @terminal_ready="setTerminalReady" @terminal_clear="terminalClear"
                        @launch_display="launchDisplay" @load_display="loadDisplay"
                        :class="`${showDisplay ? 'h-[40%]' : 'h-full'}`" ref="terminal" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const currentCode = ref(`# Simple pygame program

# Import and initialize the pygame library
import pygame
pygame.init()

# Set up the drawing window
screen = pygame.display.set_mode([400, 400])

# Run until the user asks to quit
running = True
while running:

    # Did the user click the window close button?
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Fill the background with white
    screen.fill((255, 255, 255))

    # Draw a solid blue circle in the center
    pygame.draw.circle(screen, (0, 0, 255), (250, 250), 75)

    # Flip the display
    pygame.display.flip()

# Done! Time to quit.
pygame.quit()`);
const showDisplay = ref(true);
const display = ref();
const terminal = ref();
let terminalReady = false;
let pendingExecute = false;

function runCode() {
    if (terminalReady) {
        pendingExecute = false;
        terminal.value.execute(currentCode.value);
    } else {
        pendingExecute = true;
    }
}

// event handlers
function setTerminalReady() {
    console.log('TERMINAL READY');
    terminalReady = true;
    if (pendingExecute) runCode();
}
function terminalClear() {
    console.log('TERMINAL CLEARED');
}
function launchDisplay() {
    display.value.launchDisplay();
}
function loadDisplay(value: boolean) {
    display.value.loadDisplay(value);
}
function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior (focus next element)
        const TAB_SIZE = 4;
        const tab = ' '.repeat(TAB_SIZE);
        // Get the textarea element
        const textarea = event.target as HTMLTextAreaElement;
        // Insert spaces where the cursor is
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + tab + textarea.value.substring(end);
        // Move the cursor to the right of the inserted tab
        textarea.selectionStart = textarea.selectionEnd = start + TAB_SIZE;
    }
}
</script>