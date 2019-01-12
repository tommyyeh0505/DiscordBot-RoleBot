const Discord = require('discord.js');
const client = new Discord.Client();

const rollcallChannelId = "359197099717558272";
const testChannelId = "508391990145056789";

var commandsMap = new Map();

/**
 * A command is of type [string, cmdTypeEnum]
 * see ping example:
 */

let cmdPing = {commandStr: "!ping", forceMatchLength: true};

let exePing = function(message) {
    var args = message.content.split(' ');
    args.shift();

    if (args.length > 0) {
        message.channel.send("Ping does not support arguments").catch(err => console.log(err));
    }
    else {
        message.channel.send("pong").catch(err => console.log(err));
    }
};

commandsMap.set(cmdPing, exePing);

/** ///////////////////////////////////////
    Role calling */

var messageToListenOn;
var emojiToRollcallers;

let cmdNewRollcall = {commandStr: '=', forceMatchLength: false};

let exeNewRollcall = function(message) {
    // only allow in roll call channel
    if (message.channel.id !== rollcallChannelId && message.channel.id !== testChannelId) {
        return;
    }

    messageToListenOn = message.id;
    emojiToRollcallers = new Map();
};

commandsMap.set(cmdNewRollcall, exeNewRollcall);

/** ///////////////////////////////////////
 ping rollcallers */

let cmdCallRollcall = {commandStr: '!call', forceMatchLength: true};

let exeCallRollcall = function(message) {
    // only allow in roll call channel
    if ((message.channel.id !== rollcallChannelId) && (message.channel.id !== testChannelId)) {
        return;
    }

    var args = message.content.split(' ');
    args.shift();
    if (args.length !== 1) {
        message.channel.send("Usage: !call [emoji]").catch(err => console.log(err));
        return;
    }

    let emojiStr = args[0];
    let rollcallers = emojiToRollcallers.get(emojiStr);

    if (rollcallers === undefined || rollcallers.length <= 0){
        message.channel.send("Nobody rollcalled for " + emojiStr).catch(err => console.log(err));
        return;
    }

    var outMessage = emojiStr;
    for (let rollcaller of rollcallers) {
        outMessage += " " + rollcaller;
    }
    outMessage += " " + emojiStr;

    message.channel.send(outMessage).catch(err => console.log(err));
};

commandsMap.set(cmdCallRollcall, exeCallRollcall);

/** ///////////////////////////////////////
    main */

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//Function for collecting reactions into reactions array
client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.id === messageToListenOn) {
        let emojiString = reaction.emoji.toString();

        var rollcallers = [];
        if (emojiToRollcallers.has(emojiString)) {
            rollcallers = emojiToRollcallers.get(emojiString);
        }

        rollcallers.push(user);
        emojiToRollcallers.set(emojiString, rollcallers);
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.id === messageToListenOn) {
        let emojiString = reaction.emoji.toString();

        let rollcallers = emojiToRollcallers.get(emojiString);
        rollcallers = rollcallers.filter(function(value){
            return value.id !== user.id;
        });

        emojiToRollcallers.set(emojiString, rollcallers);
    }
});

client.on('message', message => {
    for (var [cmd, func] of commandsMap.entries())
    {
        if (message.content.substring(0, cmd.commandStr.length).toLowerCase() === cmd.commandStr.toLowerCase())
        {
            var args = message.content.split(' ');
            if (cmd.forceMatchLength && (args[0] !== cmd.commandStr)) {
                return;
            }

            func(message);
        }
    }
});

client.on('error', console.error);

client.login('NTA4MjAwMTE0MDEyMjkxMDcy.Dr-t3A.dLY5P27innq2VrwlKY1njOdmwKg');