const Discord = require('discord.js');
const client = new Discord.Client();
var roleCallId = 0;
var reactions = [];
const ayy = client.emojis.get("305818615712579584");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//Function for collecting reactions into reactions array
client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.emoji.name === "🐛") {
        reactions.push(user);
    }
});


client.on('message', message => {
  if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                message.channel.send("pong");
            break;
			
			//Sets rolecall
			case 'rolecall':
				//deletes previous rolecall message if set
				if(roleCallId != 0){
					message.channel.fetchMessage(roleCallId).then(
						msg => message.delete().then(msg => console.log("deleted")).catch(console.error));
				}
				message.channel.send("ROLE CALL");
				roleCallId = message.channel.lastMessage.id;
				message.channel.send("ID=" + roleCallId);

            break;
			
			//Triggers Rolecall
			case 'fire':
				
				
				message.channel.send("ID=" + roleCallId);
				message.channel.fetchMessage(roleCallId).then(msg => message.channel.send("Content = " + msg.content));
				//Needs a loop
				message.channel.send("User " + reactions[0] + " rolecalled 🐛");
              
            break;
			
         }
     }
});

client.login('NTA4MjAwMTE0MDEyMjkxMDcy.Dr70Tw.Zd0LmTF3og9b5VfIPZcAxvDmmGk');