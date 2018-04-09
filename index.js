const TelegramBot = require('node-telegram-bot-api');
const bomgificate = require('bomgificate');
const weather = require('weather-js');
const axios = require("axios");
const engine = require('engine.io');

const bot = new TelegramBot(process.env.TOKEN, {polling: true});
const server = engine.listen(process.env.PORT);

let connections = [];

server.on('connection', async (socket) => {
    const notify = (type) => console.log(type, connections.length);
    connections.push({socket, busy: false});
    socket.on('close', () => {
        connections = connections.filter(c => c.socket !== socket);
        notify('disconnect');
    });
    notify('connect');
});

bot.onText(/^\/grass (.*)/, async ({chat}, match) => {
    if(connections.length === 0) {
        bot.sendMessage(chat.id, "Нет доступных грассхопперов");
        return;
    }
    function getFreeGrasshopperSocket(){
        const freeGrassWorkers = connections.filter(c => !c.busy);
        if(freeGrassWorkers.length === 0) return null;
        freeGrassWorkers[0].busy = true;
        return freeGrassWorkers[0].socket;
    }
    const socket = getFreeGrasshopperSocket();
    if(!socket) {
        bot.sendMessage(chat.id, "Нет свободных грассхопперов");
        return;
    }
    const request = match[1];   
    socket.send(`${request}`);
    socket.on('message', data => {
        bot.sendMessage(chat.id, `Готово: ${data}`);
    })
});

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
            const firstResult = result[0];
            bot.sendMessage(chatId, `Температура в ${firstResult.location.name}: ${firstResult.current.temperature} °${degreeType}`);
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
    const resp = match[1];
    try {
        const response = await axios.post("https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyA9tZHBZ4JEJ53Cguf24dvyEiln7s65jow",
            {longUrl: resp}, {headers: {'Content-Type': 'application/json'}});
        bot.sendMessage(msg.chat.id, response.data.id);
    } catch (e) {
        bot.sendMessage(msg.chat.id, 'Некорректная ссылка или ссылка уже укорочена!');
    }
});

bot.onText(/^\/wherevova/, (msg, match) => {
    const photo = `${__dirname}/data/vova.jpg`;
    const timeout = 3000;
    bot.sendMessage(msg.chat.id, 'Поиск...');
    setTimeout(() => {
        bot.sendPhoto(msg.chat.id, photo, {
            caption: "Вот же я!"
          });
    }, timeout);
});

bot.onText(/\/reverse (.+)/, (msg, match) => {
    function reverseStr(str) {
        let newStr = str.toLowerCase().split('').reverse().join();
        return newStr.charAt(0).toUpperCase() + newStr.substr(1);
    }
    const reversed = reverseStr(match[1]);
    bot.sendMessage(msg.chat.id, reversed);
});
