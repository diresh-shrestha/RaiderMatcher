//const studentsReadOne = require('../controllers/student');
const { prefix } = require('../config.json');
const { User } = require('discord.js');
args = global.args;
module.exports =  {
    
    name: 'find-group',
    description: "finds a group from random users",
    aliases: ['findgroup', 'findGroup', 'FindGroup'],
    args: true,
    async execute(message){
        const members = await message.guild.members.fetch();
        const randMember = members.filter(member => !member.user.bot).random(3); 


        if (message.content.toLowerCase().startsWith(prefix + "find-group") ){
            message.channel.send(" Your group consists of: " + randMember);
            
          
        }
    }

}




