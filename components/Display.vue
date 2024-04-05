<template>
    <div class="relative">
        <Loading v-show="loading" />
        <div id="screen" class="bg-slate-300 h-full"></div>
        <div class="absolute bottom-0 right-0 font-mono text-sm">{{ status }}</div>
    </div>
</template>

<script setup lang="ts">
import RFB from "@novnc/novnc/core/rfb";

const USER_ID = 37;
const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImlhdCI6MTcxMjM1MzE4N30.Q7qtXsUq4ZY-dOFNqSpHR_ZUDyoVbvF8Wm_C0Bj_wCI';
const JWT_SIGNING_KEY = 'local_2fCM8fHClBa2VB0W1h6SDqfrFQ4qxL';

const loading = ref(false);
let connected = false;
let rfb: RFB;
let status = 'Waiting...';

function focus() {
    rfb.focus();
}
function disconnect() {
    rfb.disconnect();
}
function updateStatus(status: string) {
    status = status;
}
function authenticate(e: any) {
    const auth = USER_TOKEN;
    rfb.sendCredentials({ password: auth });
}
function connect() {
    loading.value = true;
    updateStatus("Connecting...");
    const url = `${process.env.CONTAINER_SOCKET}/pygame/display?auth=${USER_TOKEN}`;
    rfb = new RFB(document.getElementById("screen"), url);
    rfb.addEventListener("connect", () => {
        connected = true;
        loading.value = false;
        updateStatus("Connected!");
        focus();
    });
    rfb.addEventListener("disconnect", () => {
        connected = false;
        loading.value = false;
        updateStatus("Disconnected.");
    });
    rfb.addEventListener("credentialsrequired", authenticate);
    rfb.addEventListener("securityfailure", (msg: string) => updateStatus(`${msg}`));
    rfb.scaleViewport = true;
    rfb.clipViewport = true;
    rfb.resizeSession = true;
}

function launchDisplay() {
    connect();
}

function loadDisplay(load: boolean) {
    loading.value = load;
}

onBeforeUnmount(() => {
    disconnect();
    rfb = null;
});

// expose functions
defineExpose({ launchDisplay, loadDisplay });
</script>