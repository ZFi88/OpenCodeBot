const faker = require('faker');

function hacker(bot, msg, commandData) {
    const phrase = faker.hacker.phrase();
    bot.sendMessage(msg.chat.id, phrase);
}

module.exports = {command: hacker};