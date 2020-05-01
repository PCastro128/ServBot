const common = require("../common");
const command = require("../command");

function get_subcommands() {
    let subcommands = new command.CommandGroup("Use the this command to manage creatures on the channel.");

    subcommands.add_command(new command.Command("create",
        "Create a creature",
        `${common.prefix}creature create [creature name]`,
        function (servbot, msg, args) {
            if (args.length < 2) return false;
            let creature_name = args.splice(1).join(" ");
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("creatures" in channel_data)) {
                channel_data["creatures"] = [];
            }
            channel_data["creatures"].push(creature_name);
            msg.channel.send(`Successfully created creature ${creature_name}`);
            servbot.save_data();
            return true;
        }));

    subcommands.add_command(new command.Command("delete",
        "Delete a creature",
        `${common.prefix}creature delete [creature name]`,
        function (servbot, msg, args) {
            if (args.length < 2) return false;
            let creature_name = args.splice(1).join(" ");
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("creatures" in channel_data)) channel_data["creatures"] = [];
            let creature_index = channel_data["creatures"].indexOf(creature_name);
            if (creature_index > -1) {
                channel_data["creatures"].splice(creature_index, 1);
                msg.channel.send(`Successfully deleted creature ${creature_name}`);
                servbot.save_data();
            } else {
                msg.channel.send("Creature not found.");
            }
            return true;
        }));

    subcommands.add_command(new command.Command("list",
        "Show all creatures on this channel.",
        `${common.prefix}creature list`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("creatures" in channel_data)) {
                channel_data["creatures"] = [];
            }
            if (channel_data["creatures"].length === 0) {
                msg.channel.send("There are no creatures on this channel.")
            } else {
                let output_string = "These are the creatures on the channel:";
                for (let i=0; i<channel_data["creatures"].length; i++) {
                    output_string += `\n-${channel_data["creatures"][i]}`;
                }
                msg.channel.send(output_string);
            }
            return true;
        }));

    return subcommands;
}

let creature_command = new command.Command("creature",
    "RPG: Manage creatures.",
    `${common.prefix}creature (subcommand)`,
    function (servbot, msg, args) {
        return false;
});
creature_command.set_subcommands(get_subcommands());

module.exports = creature_command;