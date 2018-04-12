function makeCommand(commands) {
    const commandList = Object.keys(commands);
    return function (bot, msg, commandData) {
        bot.sendMessage(msg.chat.id, '' + ['*Список команд:*\n```', ...commandList.map(x => ` ${x}`)].join('\n') + '```', {parse_mode: 'Markdown'});
    }
}

module.exports = {makeCommand};