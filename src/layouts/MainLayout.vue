<template>
  <div class="column justify-between q-px-sm" style="overflow: hidden">
    <div ref="status" class="row justify-end">
      status:
      <span
        :class="[getStatus === 'online' ? 'text-positive' : 'text-negative']"
      >
        {{ getStatus }}
      </span>
    </div>

    <div ref="content" class="content">
      <ul>
        <li v-for="(message, index) of getMessages" :key="index">
          {{ message.value }}
        </li>
      </ul>
    </div>

    <form ref="form" @submit.prevent="onSubmitMessage">
      <div class="row no-wrap items-center">
        <span>></span>
        <input
          ref="input"
          v-model="message"
          class="input full-width"
          :type="getInputType"
          @blur="inputFocus"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref, nextTick, watch } from 'vue';

import { useWebsocketStore } from 'src/stores/WebSocketStore';
import { useMessageStore } from 'src/stores/modules/MessageStore';

import { COMMANDS, ICommand } from 'src/commands';

const { getStatus, getInputType, sendMessage } = useWebsocketStore();
const { getMessages, setMessage, clearMessages } = useMessageStore();

const message: Ref<string> = ref('');

const status: Ref<any> = ref(null);
const content: Ref<any> = ref(null);
const form: Ref<any> = ref(null);
const input: Ref<any> = ref(null);

watch(
  () => getMessages,
  async () => {
    await nextTick();
    scrollContentToBottom();
  },
  { deep: true }
);

onMounted(async () => {
  await nextTick();
  setContentHeight();
  inputFocus();
});

function scrollContentToBottom() {
  console.log(content.value);

  content.value.scrollTo({
    top: content.value.scrollHeight,
    behavior: 'smooth',
  });
}

function setContentHeight() {
  const statusHeight = status.value.clientHeight;
  const formHeight = form.value.clientHeight;
  content.value.style.height = `calc(100vh - ${statusHeight}px - ${formHeight}px)`;
}

function inputFocus() {
  setInterval(() => {
    if (input.value) {
      input.value.focus();
    }
  }, 1000);
}

function help() {
  COMMANDS.forEach((command: ICommand) => {
    setMessage({
      type: 'message',
      time: 0,
      value: `${command.name} -> ${command.description}`,
    });
  });
}

function fullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  }
}

function hideFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

function clientMessageHandling() {
  if (message.value === 'help') {
    help();
    return true;
  }
  if (message.value === 'full-screen') {
    fullScreen();
    return true;
  }
  if (message.value === 'full-screen hide') {
    hideFullScreen();
    return true;
  }
  if (message.value === 'clear') {
    clearMessages();
    return true;
  }

  return false;
}

function onSubmitMessage() {
  const isMessageForClient = clientMessageHandling();

  if (isMessageForClient) {
    message.value = '';
    return;
  }

  try {
    sendMessage(message.value);
    message.value = '';
  } catch (error) {}
}
</script>

<style lang="scss">
.content {
  overflow-y: scroll;
}
.input {
  padding-left: 5px;
}
</style>
