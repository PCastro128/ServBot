const common = require("./common");
const command = require("./command");

function command_help(servbot, msg, args, cmd_group=null) {
    if (cmd_group === null) {
        cmd_group = servbot.main_commands;
    }

    if (args.length === 1) {  // help for this command group
        msg.channel.send(cmd_group.help);
    } else if (cmd_group.has_command(args[1])) {  // help for subcommand
        let cmd = cmd_group.get_command(args[1]);
        if (args.length === 2 && !cmd.has_subcommands) {  // help for subcommand, which is command

            if (cmd.help_msg !== "X") {
                msg.channel.send(`${cmd.help}\nUsage: ${cmd.usage}`);
            } else {
                msg.channel.send("There is no help message for this command.")
            }

        } else if (cmd.has_subcommands) {  // help for subcommand, which has subcommands
            command_help(servbot, msg, args.splice(1), cmd.subcommands);
        } else {  // subcommand doesn't have subcommands
            msg.channel.send("Could not find specified command.");
        }
    } else {  // subcommand doesn't exist
        msg.channel.send("Could not find specified command.");
    }
    return true;
}

function get_creature_subcommands() {
    let subcommands = new command.CommandGroup("Use the creature command to manage creatures.");

    subcommands.add_command(new command.Command("create",
        "Create a creature",
        `${common.prefix}creature create (creature name)`,
        function (servbot, msg, args) {
            console.log(args);
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
        `${common.prefix}creature delete (creature name)`,
        function (servbot, msg, args) {
            console.log(args);
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
            console.log(args);
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

module.exports.get_main_command_group = function (servbot) {
    let main_command_group = new command.CommandGroup("This is what you can do with Servbot:" +
        ` (prefix commands with ${common.prefix})`, true);

    main_command_group.add_command(new command.Command("help",
        "For more detailed help, type 'help (any command)'",
        `${common.prefix}help (any command)`,
        command_help));

    main_command_group.add_command(new command.Command("hello",
        "Say hello to ServBot!",
        `${common.prefix}hello`,
        function (servbot, msg, args) {
            msg.channel.send(`Hello, ${msg.author}!`);
            return true;
        }));

    main_command_group.add_command(new command.Command("hey",
        "Call ServBot's attention.",
        `${common.prefix}hey`,
        function (servbot, msg, args) {
            msg.channel.send(`At your command, ${msg.author}!`);
            return true;
        }));

    main_command_group.add_command(new command.Command("ping",
        "Play ping pong with ServBot.",
        `${common.prefix}ping or ${common.prefix}pong`,
        command_ping_pong));

    main_command_group.add_command(new command.Command("pong",
        "X",
        "",
        command_ping_pong));

    let creature_command_obj = new command.Command("creature",
        "RPG: Manage creatures.",
        `${common.prefix}creature`,
        function (servbot, msg, args) {
            return true;
        });
    creature_command_obj.set_subcommands(get_creature_subcommands());
    main_command_group.add_command(creature_command_obj);


    main_command_group.add_command(new command.Command("combat",
        "RPG: Manage combat.",
        `${common.prefix}combat`,
        unimplemented));

    main_command_group.add_command(new command.Command("say",
        "Make me say something.",
        `${common.prefix}say (text channel name) (message)`,
        function (servbot, msg, args) {
            if (args.length < 3) {
                return false;
            }
            for (let [_, channel] of msg.channel.client.channels) {
                if (channel.type === "text" && channel.name === args[1]) {
                    channel.send(args.splice(2).join(" "));
                    return true;
                }
            }
            return false;
        }));

    main_command_group.add_command(new command.Command("code",
        "Do you want to see what I really look like?",
        `${common.prefix}code`,
        function (servbot, msg, args) {
            msg.channel.send("ServBot's source code: https://github.com/ShadowPerson/ServBot");
            return true;
        }));

    main_command_group.add_command(new command.Command("debug",
        "X",
        "",
        function (servbot, msg, args) {
            if (msg.author.tag === "HeroShadow#1008") {
                servbot.verify_channel_in_data(msg.channel);
                msg.channel.send(`STORED DATA: ${JSON.stringify(servbot.servbot_data)}`);
            }
            return true;
        }));

    main_command_group.add_command(new command.Command("welcome",
        "Welcomes ServBot to the chat (admin only).",
        `${common.prefix}welcome`,
        function (servbot, msg, args) {
            if (msg.author.tag === "HeroShadow#1008") {
                msg.channel.send("Hello everyone! My name is ServBot. " +
                    `I was created by ${msg.author} and I\'m here to help out! ` +
                    "I\'m still a work in progress, so bear with me. And feature requests are welcome! " +
                    `Type ${common.prefix}help for a list of my commands.`)
            }
            return true;
        }));

    main_command_group.add_command(new command.Command("exit",
        "Destroy this instance of ServBot (admin only).",
        `${common.prefix}exit`,
        function (servbot, msg, args) {
            if (msg.author.tag === "HeroShadow#1008") {
                msg.channel.send(`${msg.author}! Thou hast killed me!`);
                console.log("ServBot has successfully exited");
                common.exit(servbot);
            } else {
                msg.channel.send(`Hey! What do you think you're doing, ${msg.author}?`);
                console.log(`Exit unsuccessful. User ${msg.author.tag} is not allowed to use this command.`);
            }
            return true;
        }));

    return main_command_group;
};

function command_ping_pong(servbot, msg, args) {
    if (args[0] === "ping") {
        msg.channel.send("pong");
    } else {
        msg.channel.send("ping");
    }
    return true;
}

function unimplemented(servbot, msg, args) {
    msg.channel.send("This command hasn't been implemented yet.");
    return true;
}
