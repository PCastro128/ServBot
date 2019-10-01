const Discord = require("discord.js");
const secret = require("./discord_secret");
const messages = require("./message_processor");

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    messages.process_message(client, msg);
});


client.login(secret.token).then(r => console.log).catch(err => console.log);
