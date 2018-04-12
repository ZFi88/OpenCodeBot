function reverse(bot, msg, commandData) {
    if(!commandData) {
        bot.sendMessage(msg.chat.id, 'Подайте строку для переворачивания');
        return;
    }
    const reversed = reverseStr(commandData);
    bot.sendMessage(msg.chat.id, reversed);
}

function reverseStr(str) {
    let newStr = str.toLowerCase().split('').reverse().join('');
    return newStr.charAt(0).toUpperCase() + newStr.substr(1);
}

module.exports = {command: reverse};