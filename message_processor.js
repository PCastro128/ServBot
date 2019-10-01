const common = require("./common");
const commands = require("./commands");

const FUNCTION_MAPPER  = {
    "help": [command_help, "Lists this menu."],
    "hello": [commands.command_hello, "Say hello to ServBot!"],
    "hey": [commands.command_hey, "Call ServBot's attention."],
    "ping": [commands.command_ping_pong, "Play ping pong with ServBot."],
    "pong": [commands.command_ping_pong, "X"],
    "welcome": [commands.command_welcome, "Welcomes ServBot to the chat (admin only)."],
    "exit": [commands.command_exit, "Destroy this instance of ServBot (admin only)."]
};

function command_help(client, msg, args) {
    let send_string = "Here is what you can do with ServBot:";
    for (let command_name in FUNCTION_MAPPER) {
        if (FUNCTION_MAPPER[command_name][1] !== "X") {
            send_string += "\n" + common.prefix + command_name + "  --  " + FUNCTION_MAPPER[command_name][1];
        }
    }
    msg.channel.send(send_string);
}

function command_default(client, msg) {
    if (msg.content.toLowerCase().includes("servbot")) {
        msg.channel.send(common.full_replace(msg.content.toLowerCase(), "servbot", `${msg.author}`));
        console.log(`${msg.author.tag} just mentioned my name, and I repeated what they said`);
    }
}

function invalid_command(client, msg) {
    let message_text = msg.content.replace("##", "");
    msg.channel.send("*In a mocking tone:* " + message_text);
}

function get_command(msg_text) {
    msg_text = msg_text.replace("##", "");
    let command_name = "";
    let command_args = [];
    if (msg_text) {
        command_name = msg_text.split(" ")[0];
    }
    if (msg_text.includes(" ")) {
        command_args = msg_text.split(" ");
    }
    return [command_name, command_args];
}

module.exports.process_message = function (client, msg) {
    if (msg.author !== client.user) {
        if (msg.content.startsWith("##")) {
            let command_name = get_command(msg.content)[0];
            let command_args = get_command(msg.content)[1];
            if (command_name in FUNCTION_MAPPER) {
                FUNCTION_MAPPER[command_name][0](client, msg, command_args);
                console.log(`${msg.author.tag} used command '${command_name}'`);
            } else {
                console.log(`${msg.author.tag} tried to use an invalid command`);
                invalid_command(client, msg);
            }
        } else {
            command_default(client, msg);
        }
    }
};