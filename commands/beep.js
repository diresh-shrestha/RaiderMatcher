module.exports = {
    name: 'beep',
    description: 'Beep!',
    execute(msg, args) {
        msg.channel.send('Boop. ');
    }
};