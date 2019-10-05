const common = require("../common");
const command = require("../command");

function get_subcommands() {
    let subcommands = new command.CommandGroup("Template help message.");

    subcommands.add_command(new command.Command("template",
        "template help message",
        `${common.prefix}template`,
        function (servbot, msg, args) {
            return false;
        }));

    return subcommands;
}

let template_command = new command.Command("template",
    "template help message",
    `${common.prefix}template`,
    function (servbot, msg, args) {
        return true;
    });
template_command.set_subcommands(get_subcommands());

module.exports = template_command;