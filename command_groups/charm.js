const common = require("../common");
const command = require("../command");

function get_user_id(text) {
    if (text.startsWith("<@!") && text.endsWith(">")) {
        return text.replace("<@!", "").replace(">", "");
    } else {
        return "non_user";
    }
}

function get_subcommands() {
    let subcommands = new command.CommandGroup("Charm ServBot into subservience.");

    subcommands.add_command(new command.Command("server",
        "Charm ServBot on this server.",
        `${common.prefix}charm server`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let server_data = servbot.get_server_data(msg.channel);
            if (!("charmed" in server_data)) {
                server_data["charmed"] = false;
            }
            server_data["charmed"] = !server_data["charmed"];
            if (server_data["charmed"]) msg.channel.send("ServBot has been charmed on this server.");
            if (!server_data["charmed"]) msg.channel.send("ServBot has been uncharmed on this server.");
            servbot.save_data();
            return true;
        }));

    subcommands.add_command(new command.Command("channel",
        "Charm ServBot on this channel.",
        `${common.prefix}charm channel`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("charmed" in channel_data)) {
                channel_data["charmed"] = false;
            }
            channel_data["charmed"] = !channel_data["charmed"];
            if (channel_data["charmed"]) msg.channel.send("ServBot has been charmed on this channel.");
            if (!channel_data["charmed"]) msg.channel.send("ServBot has been uncharmed on this channel.");
            servbot.save_data();
            return true;
        }));

    subcommands.add_command(new command.Command("user",
        "Charm ServBot toward a user.",
        `${common.prefix}charm user [user]`,
        function (servbot, msg, args) {
            if (args.length < 2) return false;
            let server_data = servbot.get_server_data(msg.channel);
            if (!("users" in server_data)) server_data["users"] = {};
            let user_id = get_user_id(args[1]);
            if (user_id === "non_user") {
                msg.channel.send("Invalid user. Tag the user you want ServBot to be charmed toward.");
                return true;
            }

            if (!(user_id in server_data["users"])) server_data["users"][user_id] = {"charmed": false};

            server_data["users"][user_id]["charmed"] = !server_data["users"][user_id]["charmed"];
            if (server_data["users"][user_id]["charmed"]) {
                msg.channel.send(`ServBot has been charmed toward ${args[1]}.`)
            }
            if (!server_data["users"][user_id]["charmed"]) {
                msg.channel.send(`ServBot has been uncharmed toward ${args[1]}.`)
            }
            servbot.save_data();
            return true;
        }));

    subcommands.add_command(new command.Command("status",
        "View where/to whom ServBot is charmed.",
        `${common.prefix}charm status`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let server_data = servbot.get_server_data(msg.channel);
            let channel_data = servbot.get_channel_data(msg.channel);
            let user_id = msg.author.id;
            if (!("charmed" in server_data)) server_data["charmed"] = false;
            if (!("charmed" in channel_data)) channel_data["charmed"] = false;
            if (!("users" in server_data)) server_data["users"] = {};
            if (!(user_id in server_data["users"])) server_data["users"][user_id] = {"charmed": false};

            let output = [];
            output.push(`Charmed on this server: ${server_data["charmed"]}`);
            output.push(`Charmed on this channel: ${channel_data["charmed"]}`);
            output.push(`Charmed toward ${msg.author}: ${server_data["users"][user_id]["charmed"]}`);
            msg.channel.send(output.join("\n"));
            servbot.save_data();
            return true;
        }));

    return subcommands;
}

let charm_command = new command.Command("charm",
    "Charm ServBot toward a server, channel, or user.",
    `${common.prefix}charm [subcommand]`,
    function (servbot, msg, args) {
        return true;
    });
charm_command.set_subcommands(get_subcommands());

module.exports = charm_command;