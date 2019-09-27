const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    process_message(msg);
});

function process_message(msg) {
    if (msg.content === 'ping') {
        msg.channel.send(`pong - ${msg.author}`);
        console.log(msg);
        console.log('Ponged!');
    } else if (msg.content === '##exit') {
        msg.channel.send(`${msg.author}! Thou hast killed me!`);
        console.log('ServBot is now offline.');
        client.destroy();
    } else if(msg.content === "##welcome") {
        if (msg.author.username === "HeroShadow") {
            msg.channel.send('Hello everyone! My name is ServBot. ' +
                `I was created by ${msg.author} and I\'m here to help out! ` +
                'I\'m still a work in progress, so bear with me. And feature requests are welcome!')
        } else {
            console.log(`${msg.author.username}`)
        }
    }
}

function get_token() {
    const fs = require('fs'),
        path = require('path'),
        filePath = path.join(__dirname, '.secret_token');

    return fs.readFileSync(filePath).toString();
}

client.login(get_token());