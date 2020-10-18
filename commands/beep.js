module.exports = {
  name: 'beep',
  description: 'Beep!',
  cooldown: 5,
  execute(msg, args) {
    msg.channel.send('Boop. ');
  },
};
