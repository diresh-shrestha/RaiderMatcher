// jshint esversion: 8

const fs = require('fs');
const Discord = require('discord.js');
const { prefix, BOT_TOKEN } = require('./config.json');
const initialStart = require('./commands/initial-start');
require('./models/db');

const bot = new Discord.Client();

bot.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

const cooldowns = new Discord.Collection();
// dynamically retrieve all command files
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command);
}

bot.once('ready', () => {
  console.log('Ready!');
});
k
//I tried to re-create this functionality without creating a command but  finding a user based on their tag requires a message that they have not yet given.
bot.once('startup', () => {
  message.channel.send('Welcome to RaiderMatcher!');
  message.channel.send('To begin, enter: \"!add-student FirstName LastName\" (e.g. !add-student James Bond)');
  message.channel.send('To set your major, enter: \"!add-major Major\" (e.g. !add-major Computer Science)');
  message.channel.send('To set your classification, enter: \"!add-classification Classification\" (e.g. !add-classification Freshman)');
  message.channel.send('To add courses to your schedule, enter: \"!add-courses School CourseNumber\" (e.g. !add-courses CS 1411)');
  message.channel.send('For further help, enter: \"!help\" (e.g. !help)');
  message.channel.send('For help with a specific command, enter: \"!help Command\" (e.g. !help add-user)');
});

bot.on('message', (message) => {
  if (!message.guild.channels.cache.find((c) => c.name === 'Courses')) {
    //checks if there in an item in the channels collection that corresponds with the supplied parameters, returns a boolean
    message.guild.channels
      .create('Courses', {
        type: 'category',
        permissionsOverwrites: [
          {
            id: message.guild.id,
            deny: ['MANAGE_MESSAGES'],
            allow: ['SEND_MESSAGES'],
          },
        ],
      })
      .then((channel) => {
        // console.log(channel);
      });
  }
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!bot.commands.has(commandName)) return;

  const command =
    bot.commands.get(commandName) ||
    bot.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }
  // check if the cooldowens collections has the command set in it yuet.
  // if not, then add it
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  // a variable with the current timestamp
  const now = Date.now();
  // a variable that .get()s the Collection for the triggered command.
  const timestamps = cooldowns.get(command.name);
  // A variable that gets the necessary cooldown amount.
  const cooldownAmount = (command.cooldown || 3) * 1000;
  // check if the timestamps Collection has author ID in it yet.
  if (timestamps.has(message.author.id)) {
    // since the timestamps Collection has the author ID in it, you .get() it
    // and then sum it up with the cooldownAmount variable, in order to get
    // the correct expiration timestamp.'
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    // check to see if it's actually expired
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      // if expirationTime has not passed, return a message letting the user know
      // how much time is left until they can use that command again.
      return message.reply(
        `Please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply('There was an error trying to execute that command!');
  }
});

bot.login(BOT_TOKEN);

/* bot.on("guildMemberAdd", (member) => {
  studentsCreate({ name: member.username }).then((createdStudent) => {
    const createdStudentId = String(createdStudent._id);
    console.log("Student successfully added!");
    studentsReadOne(createdStudentId).then((response) => console.log(response));
  });
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.name;
  // Do nothing if the channel wasn't found on this server
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
}); */

/* bot.registerCommand('addMajor', (msg, args) => {

}) */

/*
const init_courses = () => {
  coursesCreate('CS 4352', 'Operating Systems');
  coursesCreate('CS 4354', 'Concepts of Database System');
  coursesCreate('CS 4366', 'Senior Capstone Project');
  coursesCreate('CS 4392', 'Computer Networks');
}

init_courses();
 */

// bot.connect();
