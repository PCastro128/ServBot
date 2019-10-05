const Discord = require("discord.js");
const secret = require("./discord_secret");
const messages = require("./message_processor");
const commands = require("./command_definition");
const servbot_data = require("./servbot_data");
const path = require("path");

const ding_sound_path = path.join(path.dirname(__filename), "resources", "ding.mp3");

class ServBot {
    constructor(token) {
        this.client = new Discord.Client();
        this.main_commands = commands.get_main_command_group(this);
        this.client.login(token).then(response => console.log);
        this.servbot_data = {};
        this.load_data();
        this.data_lock = false;
        this.voice_connection = null;
        this.last_sound_played = 0;

        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.on("message", msg => {
            messages.process_message(this, msg);
        });

    }

    play_ding() {
        if (this.voice_connection) {
            console.log(ding_sound_path);
            let dispatcher = this.voice_connection.playFile(ding_sound_path);
            dispatcher.setVolume(1);
            dispatcher.resume();
            dispatcher.on("end", () => {
                this.voice_disconnect();
            })
        }
    }

    voice_disconnect() {
        this.voice_connection.disconnect();
        this.voice_connection = null;
    }

    async voice_connect(connection) {
        if (this.voice_connection) this.voice_disconnect();
        this.voice_connection = connection;
        this.last_sound_played = Date.now();
        let result = await new Promise((resolve, reject) => {
            if ((this.voice_connection === null) || (Date.now() - this.last_sound_played) > 300000) {
                resolve();
            } else {
                reject();
            }
        });
        if (this.voice_connection) this.voice_disconnect();
        return result;
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

    save_data() {
        servbot_data.save_data(this).then(r => console.log);
    }

    verify_channel_in_data(channel) {
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
