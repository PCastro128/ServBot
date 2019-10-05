const common = require("../common");
const command = require("../command");

function get_combat_order(channel_data) {
    let creatures = channel_data["combat"]["creatures"];
    let turn = channel_data["combat"]["turn"];
    let output = [];
    for (let i=0; i<creatures.length; i++) {
        let line = `${creatures[i][0]}) ${creatures[i][1]}`;
        if (i === turn) {
            line = `**${line}**`;
        }
        output.push(line);
    }
    return output.join("\n");
}

function increment_turn(channel_data) {
    let current_turn = channel_data["combat"]["turn"];
    channel_data["combat"]["turn"] = (current_turn + 1) % channel_data["combat"]["creatures"].length;
}

function get_subcommands() {
    let subcommands = new command.CommandGroup("Use the this command to manage combat on the channel.");

    subcommands.add_command(new command.Command("start",
        "Start combat.",
        `${common.prefix}combat start`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("creatures" in channel_data)) channel_data["creatures"] = [];
            if (!("combat" in channel_data)) channel_data["combat"] = {"active": false, "turn": 0, "creatures": []};

            if (channel_data["creatures"].length === 0) {
                msg.channel.send("Combat can't start. There are no creatures on this channel.");
                return true;
            }

            channel_data["combat"]["active"] = true;
            channel_data["combat"]["turn"] = 0;
            for (let i=0; i<channel_data["creatures"].length; i++) {
                let initiative = Math.floor(Math.random() * 30) + 1;
                channel_data["combat"]["creatures"].push([initiative, channel_data["creatures"][i]]);
            }
            channel_data["combat"]["creatures"].sort(function (first, second) {
                return second[0] - first[0];
            });

            msg.channel.send(`Successfully started combat.\n\nCombat order:\n${get_combat_order(channel_data)}`);
            servbot.save_data();
            return true;
        }));

    subcommands.add_command(new command.Command("end",
        "End combat.",
        `${common.prefix}combat end`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("creatures" in channel_data)) channel_data["creatures"] = [];
            if (!("combat" in channel_data)) channel_data["combat"] = {"active": false, "turn": 0, "creatures": []};

            if (channel_data["combat"]["active"]) {
                channel_data["combat"]["active"] = false;
                channel_data["combat"]["turn"] = 0;
                channel_data["combat"]["creatures"] = [];
                msg.channel.send(`Combat stopped.`);
            } else {
                msg.channel.send(`Combat is already stopped.`);
            }

            servbot.save_data();
            return true;
        }));

    subcommands.add_command(new command.Command("order",
        "Show the combat turn order.",
        `${common.prefix}combat order`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("creatures" in channel_data)) channel_data["creatures"] = [];
            if (!("combat" in channel_data)) channel_data["combat"] = {"active": false, "turn": 0, "creatures": []};

            if (channel_data["combat"]["active"]) {
                msg.channel.send(`Combat turn order:\n${get_combat_order(channel_data)}`);
            } else {
                msg.channel.send(`Combat is not active.`);
            }

            servbot.save_data();
            return true;
        }));

    subcommands.add_command(new command.Command("turn",
        "Take the current turn in combat.",
        `${common.prefix}combat turn`,
        function (servbot, msg, args) {
            if (args.length > 1) return false;
            let channel_data = servbot.get_channel_data(msg.channel);
            if (!("creatures" in channel_data)) channel_data["creatures"] = [];
            if (!("combat" in channel_data)) channel_data["combat"] = {"active": false, "turn": 0, "creatures": []};

            if (channel_data["combat"]["active"]) {
                increment_turn(channel_data);
                let turn = channel_data["combat"]["turn"];
                msg.channel.send(`Turn taken.\nNext up: ${channel_data["combat"]["creatures"][turn][1]}`);
            } else {
                msg.channel.send(`Combat is not active.`);
            }

            servbot.save_data();
            return true;
        }));

    return subcommands;
}

let combat_command = new command.Command("combat",
        "RPG: Manage combat.",
        `${common.prefix}combat [subcommand]`,
        function (servbot, msg, args) {
            return true;
        });
combat_command.set_subcommands(get_subcommands());


module.exports = combat_command;