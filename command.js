
class CommandGroup {
    constructor(help, is_main_group=false) {
        this.group_help = help;
        this.command_list = [];
        this.is_main_group = is_main_group;
    }
    add_command(command) {
        this.command_list.push(command);
    }
    get help() {
        let command_help_lines = [this.group_help];
        for (let i=0; i<this.command_list.length; i++) {
            if (this.command_list[i].help_msg !== "X") {
                command_help_lines.push(this.command_list[i].help);
            }
        }
        return command_help_lines.join("\n");
    }
    has_command(command_name) {
        for (let i=0; i<this.command_list.length; i++) {
            if (this.command_list[i].name === command_name) return true;
        }
        return false;
    }
    get_command(command_name) {
        for (let i=0; i<this.command_list.length; i++) {
            if (this.command_list[i].name === command_name) return this.command_list[i];
        }
    }
    execute_command(client, msg, args) {
        if (this.has_command(args[0])) {
            return this.get_command(args[0]).execute(client, msg, args);
        } else {
            return false;
        }
    }
}

class Command {
    constructor(name, help, usage, callback) {
        this.name = name;
        this.help_msg = help;
        this.usage = usage;
        this.callback = callback;
        this.has_subcommands = false;
        this.subcommands = null;
    }
    get help() {
        return this.name + "  --  " + this.help_msg;
    }
    set_subcommands(command_group) {
        this.has_subcommands = true;
        this.subcommands = command_group;
    }
    execute(client, msg, args) {
        if (this.has_subcommands && args.length > 1) {
            return this.subcommands.execute_command(client, msg, args.splice(1));
        } else {
            if (!this.callback(client, msg, args) && this.usage !== "") {
                msg.channel.send("Invalid usage of command. Use the help command for more info. \nUsage: " + this.usage);
            }
            return true;
        }
    }
}

module.exports.Command = Command;
module.exports.CommandGroup = CommandGroup;
