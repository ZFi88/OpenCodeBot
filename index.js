const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, {polling: true});

bot.onText(/\/hello/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, `Привет! Я OpenCodeBot! Мой исходный код на GitHub - https://github.com/ZFi88/OpenCodeBot`);
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, `Вы написали - \"${resp}\"`);
});
bot.onText(/\/what/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Я нужен для того, чтобы вы научились меня писать на JS`);
});
