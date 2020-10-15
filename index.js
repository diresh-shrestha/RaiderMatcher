const Eris = require('eris');
const config = require('./config.json');

const bot = new Eris.CommandClient(
  config.BOT_TOKEN,
  {},
  {
    description: 'A bot for college students to find classmates and form teams',
    owner: 'Diresh',
    prefix: config.prefix,
  },
);

bot.on('ready', () => {
  console.log('Ready!');
});

bot.registerCommand('ping', 'Pong!', {
  description: 'Pong!',
  fullDescription: 'Can be used to check if bot is up',
});

bot.registerCommandAlias('Ping', 'ping');

bot.registerCommand('pong', ['Pang!', 'Peng!', 'Ping!', 'Pung!'], {
  description: 'Ping!',
  fullDescription: 'Also used to check if bot is up.',
});

const echoCommand = bot.registerCommand(
  'echo',
  (msg, args) => {
    if (args.length === 0) {
      return 'Invalid input';
    }
    const text = args.join(' ');
    return text;
  },
  {
    description: 'Make the bot echo something',
    fullDescription: 'The bot will echo whatever is after the command label.',
    usage: '<text>',
  },
);

echoCommand.subcommand(
  'reverse',
  (msg, args) => {
    if (args.length === 0) {
      return 'Invalid input';
    }
    let text = args.join(' ');
    text = text.split('').reverse().join('');
    return text;
  },
  {
    description: 'Make the bot say something in reverse',
    fullDescription:
      'The bot will echo, in reverse, whatever is after the command.',
    usage: '<text>',
  },
);

echoCommand.registerSubcommandAlias('backwards', 'reverse');

bot.connect();
