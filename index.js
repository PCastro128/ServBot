const Discord = require('discord.js');
const client = new Discord.Client();
const fileIO = require('fs');
const path = require('path');
const secret = require('./discord_secret');
// const database = require('./database');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    process_message(msg);
});

function process_message(msg) {
    if (msg.content === '##ping') {
        msg.channel.send('pong');
        console.log(msg);
        console.log('Ponged!');
    } else if (msg.content === '##pong') {
        msg.channel.send('ping');
    } else if (msg.content === '##exit' && msg.author.username === "HeroShadow") {
        msg.channel.send(`${msg.author}! Thou hast killed me!`);
        console.log('ServBot is now offline.');
        client.destroy();
    } else if (msg.content === '##hello') {
	            msg.channel.send(`Hello ${msg.author}! How are you?`);
    } else if (msg.content === '##hey') {
	            msg.channel.send(`At your command, ${msg.author}!`);
    } else if (msg.content === '##help') {
	            msg.channel.send('Here is what you can do:\n##hello\n##ping\n##hey\nMy only commands are for fun. Actually practical commands coming soon!');
    } else if(msg.content === "##welcome") {
        if (msg.author.username === "HeroShadow") {
            msg.channel.send('Hello everyone! My name is ServBot. ' +
                `I was created by ${msg.author} and I\'m here to help out! ` +
                'I\'m still a work in progress, so bear with me. And feature requests are welcome! ' +
	    	'Type ##help for a list of my commands')
        } else {
            console.log(`${msg.author.username}`)
        }
    } else if(msg.content.startsWith("##")) {
	msg.channel.send("*In a mocking tone:* " + msg.content);
    } else if(msg.content.toLowerCase().includes("servbot")) {
        name_mentioned(msg);
    }
}

function name_mentioned(msg) {
    if(msg.content.toLowerCase().includes("mock")) {
        msg.channel.send("*In a mocking tone:* " + msg.content);
    } else {
        if(msg.author.username === "111115tom") {
            msg.channel.send(full_replace(msg.content.toLowerCase(),"servbot", "russell"));
        } else {
            msg.channel.send(full_replace(msg.content.toLowerCase(),"servbot", `${msg.author}`));
        }
    }
}

function full_replace(whole_string, substring, replace) {
    while (whole_string.includes(substring)) {
        whole_string = whole_string.replace(substring, replace);
    }
    return whole_string;
}

function get_token() {
    const filePath = path.join(__dirname, '.secret_token');

    return fileIO.readFileSync(filePath).toString();
}


client.login(secret.token).then(r => console.log).catch(err => console.log);
