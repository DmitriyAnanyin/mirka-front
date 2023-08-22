import { defineStore } from 'pinia';
import { Ref, computed, ref } from 'vue';

export interface IMessage {
  type: string;
  time: number;
  value: string;
}

export const useMessageStore = defineStore('messageStore', () => {
  const messages: Ref<IMessage[]> = ref([]);

  const getMessages = computed(() => messages);

  function setMessage(message: IMessage) {
    messages.value.push(message);
  }
  function clearMessages() {
    messages.value = [];
  }

  return { getMessages, setMessage, clearMessages };
});
