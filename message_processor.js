const common = require("./common");

function general_message(servbot, msg) {
    if (msg.content.toLowerCase().includes("servbot") && !msg.content.toLowerCase().includes("!r")) {
        if (common.user_is_charmed(servbot, msg) ||
            common.channel_is_charmed(servbot, msg) ||
            common.server_is_charmed(servbot, msg)) {

            msg.channel.send("Sorry for intruding, but did you mention my name? If not, include '!r' +" +
                "in you message next time so I don't interrupt you.");
            console.log(`${msg.author.tag} just mentioned my name, and I politely responded.`);
        // } else if (msg.channel.guild.id === "414234574248345612") {
        //     servbot.play_ding();
        } else {
            msg.channel.send(common.full_replace(msg.content.toLowerCase(), "servbot", `${msg.author}`));
            console.log(`${msg.author.tag} just mentioned my name, and I repeated what they said`);
        }
    }
}

function invalid_command(servbot, msg) {
    if (common.user_is_charmed(servbot, msg) ||
        common.channel_is_charmed(servbot, msg) ||
        common.server_is_charmed(servbot, msg)) {

        msg.channel.send("My deepest apologies, but the command you entered isn't valid. " +
            "Are you sure you typed the command right and have the right arguments?");
    } else {
        let message_text = msg.content.replace(common.prefix, "");
        msg.channel.send("*In a mocking tone:* " + message_text);
    }
}

function get_command(msg_text) {
    msg_text = msg_text.replace(common.prefix, "");
    let command_name = "";
    if (msg_text) {
        command_name = msg_text.split(" ")[0];
    }
    let command_args = msg_text.split(" ");
    return [command_name, command_args];
}

module.exports.process_message = function (servbot, msg) {
    if (msg.author !== servbot.client.user) {
        if (msg.content.startsWith(common.prefix)) {
            let command_args = get_command(msg.content)[1];
            if (!servbot.main_commands.execute_command(servbot, msg, command_args)) {
                invalid_command(servbot, msg);
                console.log(`${msg.author.tag} tried to use an invalid command`);
            } else {
                console.log(`${msg.author.tag} executed command: ${msg.content}`);
            }
        } else {
            general_message(servbot, msg);
        }
    }
};
