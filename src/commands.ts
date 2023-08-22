export interface ICommand {
  name: string;
  description: string;
}
export const COMMANDS = [
  { name: 'help', description: 'Список комманд' },
  { name: 'full-screen', description: 'Полноэкранный режим' },
  { name: 'full-screen hide', description: 'Выйти из полноэкранного режима' },
  { name: 'clear', description: 'Очистить сообщения' },
  { name: 'sign-in', description: 'Авторизация' },
  { name: 'chat @<username>', description: 'Чат с пользователем' },
];
