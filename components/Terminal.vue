<template>
    <div>
        <div id="terminal" style="background-color: black;" class="h-full w-full"></div>
    </div>
</template>

<script setup lang="ts">
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const props = defineProps({
    mode: {
        type: String,
        default: 'python',
    }
});
const emit = defineEmits(['terminal_ready', 'terminal_clear', 'launch_display', 'load_display']);
const config = useRuntimeConfig();

const USER_ID = 37;
const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImlhdCI6MTcxMjM1MzE4N30.Q7qtXsUq4ZY-dOFNqSpHR_ZUDyoVbvF8Wm_C0Bj_wCI';
const JWT_SIGNING_KEY = 'local_2fCM8fHClBa2VB0W1h6SDqfrFQ4qxL';

let terminal: Terminal;
let fitAddon: FitAddon;
let loading = false;
let socket: WebSocket | null;
const files = [{
    ext: 'names.txt',
    content: 'Cameron\nJames\nHadley\nMegan\nHenry\nPaige\n',
}];

async function execute(code: string) {
    code = code;
    if (!socket) {
        socket = await createSocket();
    }
    listenSocket();
    await sendFiles();
    send("run", code);
    terminal.reset();
    loading = true;
    emit("load_display", true);
}

async function sendFiles() {
    send("files", JSON.stringify(files));
}

function send(event: string, data: any) {
    socket!.send(JSON.stringify({ event, data }));
}

function reset() {
    terminal.clear();
    send('reset', {});
}

function resize() {
    fitAddon.fit();
}

function handleMessage(message: { data: any; }) {
    const data = message.data;
    if (loading) {
        loading = false;
        emit("launch_display");
        emit("load_display", false);
    }
    terminal.write(typeof data === "string" ? data : new Uint8Array(data));
}

function handleClose() {
    terminal.write('Session has ended. Click "Run" to begin');
    socket = null;
}
function sendData(data: any) {
    listenSocket();
    if (socket!.readyState === 1) {
        socket!.send(data);
    }
}
function sendBinary(data: any) {
    listenSocket();
    if (socket!.readyState === 1) {
        const buffer = new Uint8Array(data.length);
        for (let i = 0; i < data.length; ++i) {
            buffer[i] = data.charCodeAt(i) & 255;
        }
        socket!.send(buffer);
    }
}
function listenSocket() {
    if (socket!.onmessage !== handleMessage) {
        if (socket!.onmessage) {
            emit('terminal_clear');
        }
        socket!.onmessage = handleMessage;
    }
}
function createSocket(): Promise<WebSocket> {
    const url = `${config.public.CONTAINER_SOCKET}/${props.mode}?auth=${USER_TOKEN}`;
    return new Promise((resolve, reject) => {
        const webSocket = new WebSocket(url);
        webSocket.onopen = () => {
            resolve(webSocket);
            setTimeout(() => {
                emit('terminal_ready');
            }, 300);
        };
        webSocket.onclose = () => {
            socket = null;
        };
        webSocket.onerror = err => {
            webSocket.close();
            terminal.write("Server is starting, please try again later\r\n");
            reject(err);
        };
    });
}
function destroySocket() {
    if (socket) {
        socket.close();
        terminal.clear();
        socket = null;
    }
}
function createTerminal() {
    terminal = new Terminal();
    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(document.getElementById('terminal')!);
    fitAddon.fit();
    window.addEventListener("resize", fitAddon.fit);
    terminal.onData(sendData);
    terminal.onBinary(sendBinary);
}

onMounted(async () => {
    createTerminal();
    if (socket) {
        emit('terminal_ready');
    } else {
        socket = await createSocket();
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", fitAddon.fit);
    if (socket) socket.close();
});

defineExpose({ execute });
</script>