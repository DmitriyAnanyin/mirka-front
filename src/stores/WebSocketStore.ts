import { defineStore } from 'pinia';

import { Ref, computed, ref } from 'vue';

import { useMessageStore, IMessage } from './modules/MessageStore';

type TStatus = 'online' | 'disconnected';

const messageStore = useMessageStore();

const SERVER_URL = 'ws://localhost:5000';

export const useWebsocketStore = defineStore('websocket', () => {
  const ws: Ref<WebSocket> = ref(new WebSocket(SERVER_URL));
  ws.value.onopen = onConnection;
  ws.value.onclose = onDisconnection;
  ws.value.onmessage = onMessage;

  const status: Ref<TStatus> = ref('disconnected');
  const nextMessageType: Ref<string> = ref('');
  const inputType: Ref<string> = ref('text');

  const getStatus = computed(() => status);
  const getInputType = computed(() => inputType);

  function setStatus(value: TStatus) {
    status.value = value;
  }

  function onMessage(response: { data: string }) {
    const data = JSON.parse(response.data);

    if (data.type === 'login') {
      nextMessageType.value = data.type;
    }

    if (data.type === 'password') {
      nextMessageType.value = data.type;
      inputType.value = 'password';
    }

    if (data.type === 'auth') {
      nextMessageType.value = '';
      inputType.value = 'text';
    }

    messageStore.setMessage(data as IMessage);
  }

  function onConnection() {
    setStatus('online');
  }

  function onDisconnection() {
    setStatus('disconnected');
    const interval = setInterval(() => {
      if (status.value === 'disconnected') {
        ws.value = new WebSocket(SERVER_URL);
        ws.value.onopen = onConnection;
        ws.value.onclose = onDisconnection;
        ws.value.onmessage = onMessage;
      } else {
        clearInterval(interval);
      }
    }, 5000);
  }

  function sendMessage(message: string) {
    send(nextMessageType.value || 'message', message);
  }

  function send(type: string, value: any) {
    const time = Date.now();
    ws.value.send(JSON.stringify({ type, time, value }));
  }

  return { getStatus, getInputType, sendMessage };
});
