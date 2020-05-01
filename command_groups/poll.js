const common = require("../common");
const command = require("../command");
const emojiRegex = require("emoji-regex");

const numbered_emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

function add_numbered_reactions(message, start, end) {
    for (let i=start; i<=end; i++) {
        message.react(numbered_emojis[i]).then(null).catch(console.error);
    }
}

function add_reactions(message, emoji_list) {
    for (let i=0; i<=emoji_list.length; i++) {
        message.react(emoji_list[i]).then(null).catch(console.error);
    }
}

function get_subcommands() {
    let subcommands = new command.CommandGroup(`Create a new poll (Example: "$poll yesno This is a yes/no poll").`);

    subcommands.add_command(new command.Command("yesno",
        "Create a yes/no poll",
        `${common.prefix}poll yesno [question]`,
        function (servbot, msg, args) {
            if (args.length < 2) return false;
            let question = args.splice(1).join(" ");
            msg.channel.send(`Poll: ${question}\n`).then(message => add_reactions(message, ["✅", "❌"]));
            return true;
        }));

    subcommands.add_command(new command.Command("numbered",
        "Create a poll with options (min:2, max:10)",
        `${common.prefix}poll numbered [question]; [option 1]; [option 2]; ...`,
        function (servbot, msg, args) {
            if (args.length < 2) return false;
            let option_args = args.splice(1).join(" ").split(";");
            if (option_args.length < 2 || option_args.length > 10) return false;
            let question = option_args[0];
            let options = option_args.splice(1);
            let message_text = `Poll: ${question}\n`
            for (let i=0; i<options.length; i++) {
                message_text += `${i+1}. ${options[i].trim()}\n`
            }
            msg.channel.send(message_text).then(message => add_numbered_reactions(message,1, options.length));
            return true;
        }));

    subcommands.add_command(new command.Command("scale",
        "Create a poll in the form of a scale (i.e. from 1-5)",
        `${common.prefix}poll scale [scale start] [scale end] [question]`,
        function (servbot, msg, args) {
            if (args.length < 4) return false;
            console.log(args);
            let question = args.splice(3).join(" ");
            if (isNaN(parseInt(args[1])) || parseInt(args[1]) < 0) return false;
            if (isNaN(parseInt(args[2])) || parseInt(args[2]) > 10) return false;
            msg.channel.send(`Poll: ${question}\n`).then(message => add_numbered_reactions(message, parseInt(args[1]),
                parseInt(args[2])-parseInt(args[1])+1));
            return true;
        }));

    subcommands.add_command(new command.Command("custom",
        "Create a poll with custom emoji (unlimited options)",
        `${common.prefix}poll custom [question]; [emoji 1] [option 1]; [emoji 2] [option 2]; ...`,
        function (servbot, msg, args) {
            if (args.length < 2) return false;
            let option_args = args.splice(1).join(" ").split(";");
            console.log("1");
            if (option_args.length < 2) return false;
            console.log("1");
            let question = option_args[0];
            let options = option_args.splice(1);

            let emojis = [];
            let emoji, text, current_option, temp_emoji;
            let message_text = `Poll: ${question}\n`

            console.log("1");
            for (let i=0; i<options.length; i++) {
                let regex = emojiRegex();
                current_option = options[i].trim();
                emoji = current_option.split(" ")[0].trim();
                text = current_option.split(" ").splice(1).join(" ");

                console.log("1");
                console.log(`'${emoji}'`);
                temp_emoji = regex.exec(emoji)[0];
                if (emoji.replace(temp_emoji, "") !== "") return false;
                if (regex.exec(emoji)) return false;
                console.log("1");

                emojis.push(emoji);
                message_text += `${emoji} - ${text.trim()}\n`
            }

            console.log("1");
            msg.channel.send(message_text).then(message => add_reactions(message, emojis));
            return true;
        }));

    return subcommands;
}

let poll_command = new command.Command("poll",
    `Create a new poll. Type '${common.prefix}help poll' for more info.`,
    `${common.prefix}poll (subcommand)`,
    function (servbot, msg, args) {
        return false;
    });
poll_command.set_subcommands(get_subcommands());

module.exports = poll_command;