const common = require("./common");
const command = require("./command");
const creature_command = require("./command_groups/creature");
const combat_command = require("./command_groups/combat");
const charm_command = require("./command_groups/charm");
const join_command = require("./command_groups/join");

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
            msg.channel.send("Usage: " + cmd.usage); ///////////////////////////////////////// TO DO: REMOVE THIS LINE AND MODIFY CMD_GRP HELP/////////////
            command_help(servbot, msg, args.splice(1), cmd.subcommands);
        } else {  // subcommand doesn't have subcommands
            msg.channel.send("Could not find specified command.");
        }
    } else {  // subcommand doesn't exist
        msg.channel.send("Could not find specified command.");
    }
    return true;
}

module.exports.get_main_command_group = function (servbot) {
    let main_command_group = new command.CommandGroup("This is what you can do with Servbot:" +
        ` (prefix commands with ${common.prefix})`, true);

    main_command_group.add_command(new command.Command("help",
        "For more detailed help, type 'help [any command]'",
        `${common.prefix}help [any command]`,
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

    main_command_group.add_command(creature_command);
    main_command_group.add_command(combat_command);
    main_command_group.add_command(charm_command);
    main_command_group.add_command(join_command);

    main_command_group.add_command(new command.Command("say",
        "Make me say something.",
        `${common.prefix}say [text channel name] [message]`,
        function (servbot, msg, args) {
            if (args.length < 3) {
                return false;
            }
            for (let [_, channel] of msg.channel.guild.channels) {
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
                console.log(msg.content);
                // servbot.verify_channel_in_data(msg.channel);
                // msg.channel.send(`STORED DATA: ${JSON.stringify(servbot.servbot_data)}`);
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
