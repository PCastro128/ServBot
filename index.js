const Discord = require("discord.js");
const secret = require("./discord_secret");
const messages = require("./message_processor");
const commands = require("./command_definition");
const servbot_data = require("./servbot_data");

class ServBot {
    constructor(token) {
        this.client = new Discord.Client();
        this.main_commands = commands.get_main_command_group(this);
        this.client.login(token).then(response => console.log);
        this.servbot_data = {};
        this.load_data();

        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.on("message", msg => {
            messages.process_message(this, msg);
        });

    }

    get_servbot_data(channel) {
        this.verify_channel_in_data(channel);
        return this.servbot_data;
    }

    get_server_data(channel) {
        this.verify_channel_in_data(channel);
        return this.servbot_data[channel.guild.id];
    }

    get_channel_data(channel) {
        this.verify_channel_in_data(channel);
        return this.servbot_data[channel.guild.id][channel.id];
    }

    load_data() {
        servbot_data.load_data(this);
    }

    update_data(data_obj=null) {
        this.servbot_data = data_obj;
        this.save_data()
    }

    save_data() {
        servbot_data.save_data(this.servbot_data);
    }

    verify_channel_in_data(channel) {
        console.log(JSON.stringify(this.servbot_data));
        console.log(channel.guild.id);
        if (!(channel.guild.id in this.servbot_data)) {
            console.log("New server recorded");
            this.servbot_data[channel.guild.id] = {};
        }
        if (!(channel.id in this.servbot_data[channel.guild.id])) {
            console.log("New channel recorded");
            this.servbot_data[channel.guild.id][channel.id] = {};
        }
        this.save_data();
    }
}

const servbot = new ServBot(secret.token);
