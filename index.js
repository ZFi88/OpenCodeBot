
const commands = {
    'reverse': require('./commands/reverse').command,
    'hacker': require('./commands/hacker').command,
};
commands['start'] = require('./commands/start').makeCommand(commands);
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});
bot.onText(/^\/(\w+)(\s?(.*))?$/, async (msg, match) => {
    const commandName = match[1];
    const commandData = match[3];
    console.log(`Chat ${msg.chat.id}: [${commandName}] ${commandData}`);
    const command = commands[commandName];
    if(command) {
        command(bot, msg, commandData);
    }
});
