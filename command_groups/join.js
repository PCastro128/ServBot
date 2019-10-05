const common = require("../common");
const command = require("../command");

let join_command = new command.Command("join",
    "Have ServBot join your voice channel.",
    `${common.prefix}join`,
    function (servbot, msg, args) {
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join()
                .then(connection => { servbot.voice_connect(connection).then(r => console.log).catch(r => console.log) })
                .catch(console.log);
        } else {
            msg.channel.send("Cannot join. You are not in a voice channel.");
        }
        return true;
    });

module.exports = join_command;