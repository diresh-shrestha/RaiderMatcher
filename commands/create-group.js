const studentsReadOne = require('../controllers/student');

module.exports = {
  name: 'create-group',
  description: "Creates a group from supplied tags",
  aliases: ['creategroup', 'createGroup', 'CreateGroup'],
  usage: '@DiscordTag1 @DiscordTag2',
  args: true,
  execute(message, args) {
  	var channelName = message.author.username.substring(0, 3);
  	const names = message.mentions.users.array();

  	// Loop iterates through mentions and adds usernames to channel name
  	for(i = 0; names[i]; i++) {
  		channelName += names[i].username.substring(0, 3);
  	}

  	// Channel names are always lower case, so we have to check names this way
  	channelName = channelName.toLowerCase();

  	// Checks if channel already exists
  	if (!message.guild.channels.cache
  			.some((channel) => channel.name === channelName)) {

  		// Creates the new channel if it doesn't exist, and locks all users out of channel
  		message.guild.channels
  			.create(channelName, {reason: 'A new group has been formed!',
  									type: 'text',
  					permissionOverwrites: [{
  										   	id: message.guild.id,
  										   	deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
  										   }]
  			})
  			.then(r => {

  				// Explicitly allows the message author to use the channel
  				r.updateOverwrite(message.author.id, { 'VIEW_CHANNEL': true,
  													   'SEND_MESSAGES': true });

  				// Explicitly allows those mentioned to use the channel
  				for (i of names) {
  					r.updateOverwrite(i.id, { 'VIEW_CHANNEL': true,
  											  'SEND_MESSAGES': true });
  				};
  			});

  		// Tell group their channel name
  		message.channel.send('Your group has been formed and ' +
  							 	'may now use ' + channelName +
  						 		' to collaborate.');
  		return;
  	}
  	// Alerts users if their group already exists
  	message.channel.send('This group already exists.');
  },
};
