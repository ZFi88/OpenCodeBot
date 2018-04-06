const TelegramBot = require('node-telegram-bot-api');
const bomgificate = require('bomgificate');
const weather = require('weather-js');
const axios = require("axios");
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

bot.onText(/\/hello/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, `Привет! Я OpenCodeBot! Мой исходный код на GitHub - https://github.com/ZFi88/OpenCodeBot`);
});

bot.onText(/^\/weather ?(.*)?/, (msg, match) => {
    const chatId = msg.chat.id;
    const search = match[1];
    if (!search) {
        bot.sendMessage(chatId, `Погода в каком городе интересует? Например: /weatherMoscow`);
        return;
    }
    const degreeType = 'C';
    weather.find({search, degreeType}, (err, result) => {
        if (result.length === 0) {
            bot.sendMessage(chatId, `Не найдено: ${search}`);
        } else if (!err) {
            bot.sendMessage(chatId, `Температура в ${search}: ${result[0].current.temperature} °${degreeType}`);
        } else {
            bot.sendMessage(chatId, `Произошла ошибка: ${err}`);
        }
    });
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

bot.onText(/\/bomg (.+)/, (msg, match) => {
    bot.sendMessage(msg.chat.id, bomgificate(match[1]));
});

bot.onText(/^\/short (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    try {
        const response = await axios.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyA9tZHBZ4JEJ53Cguf24dvyEiln7s65jow",
            {longUrl: resp}, {headers: {'Content-Type': 'application/json'}});
        bot.sendMessage(msg.chat.id, response.data.id);
    } catch (e) {
        bot.sendMessage(msg.chat.id, 'Ссылка уже укорочена!');
        return;
    }

});