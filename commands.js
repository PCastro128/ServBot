const common = require("./common");

module.exports.command_welcome = function (client, msg, args) {
    if (msg.author.tag === "HeroShadow#1008") {
        msg.channel.send("Hello everyone! My name is ServBot. " +
            `I was created by ${msg.author} and I\'m here to help out! ` +
            "I\'m still a work in progress, so bear with me. And feature requests are welcome! " +
            `Type ${common.prefix}help for a list of my commands.`)
    }
};

module.exports.command_hello = function (client, msg, args) {
    msg.channel.send(`Hello, ${msg.author}!`)
};

module.exports.command_hey = function (client, msg, args) {
    msg.channel.send(`At your command, ${msg.author}!`)
};

module.exports.command_ping_pong = function (client, msg, args) {
    if (args[0] === "ping") {
        msg.channel.send("pong");
    } else {
        msg.channel.send("ping");
    }
};

module.exports.command_exit = function (client, msg, args) {
    if (msg.author.tag === "HeroShadow#1008") {
        msg.channel.send(`${msg.author}! Thou hast killed me!`);
        console.log("ServBot has successfully exited");
        common.exit(client);
    } else {
        msg.channel.send(`Hey! What do you think you're doing, ${msg.author}?`);
        console.log(`Exit unsuccessful. User ${msg.author.tag} is not allowed to use this command.`);
    }
};
