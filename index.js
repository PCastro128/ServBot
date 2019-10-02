const Discord = require("discord.js");
const secret = require("./discord_secret");
const messages = require("./message_processor");
const commands = require("./command_definition");

const client = new Discord.Client();

class ServBot {
    constructor(token) {
        this.client = new Discord.Client();
        this.main_commands = commands.get_main_command_group(this);
        this.client.login(token).then(response => console.log);

        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.on("message", msg => {
            messages.process_message(this, msg);
        });

    }
}

const servbot = new ServBot(secret.token);
