
const commands = {
    'reverse': require('./commands/reverse').command,
    'hacker': require('./commands/hacker').command
};
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});
bot.onText(/^\/(\w+)(\s?(.*))?$/, async (msg, match) => {
    const commandName = match[1];
    const commandData = match[3];
    console.log(`Chat ${msg.chat.id}: [${commandName}] ${commandData}`);
    const command = commands[commandName];
    if(command) {
        command(bot, msg, commandData);
    } else {
        bot.sendMessage(msg.chat.id, '' + ['*Список команд:*\n```', ...Object.keys(commands).map(x => ` ${x}`)].join('\n') + '```', {parse_mode: 'Markdown'});
    }
});

const engine = require('engine.io');
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
