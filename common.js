
module.exports.prefix = "$";

module.exports.exit = function (servbot) {
    servbot.client.destroy().then(response => console.log);
};

module.exports.full_replace = function (whole_string, substring, replace) {
    while (whole_string.includes(substring)) {
        whole_string = whole_string.replace(substring, replace);
    }
    return whole_string;
};

module.exports.user_is_charmed = function (servbot, msg) {
    let server_data = servbot.get_server_data(msg.channel);
    if (!("users" in server_data)) server_data["users"] = {};
    if (!(msg.author.id in server_data["users"])) server_data["users"][msg.author.id] = {"charmed": false};
    servbot.save_data();
    return server_data["users"][msg.author.id]["charmed"];
};

module.exports.channel_is_charmed = function (servbot, msg) {
    let channel_data = servbot.get_channel_data(msg.channel);
    if (!("charmed" in channel_data)) channel_data["charmed"] = false;
    servbot.save_data();
    return channel_data["charmed"];
};

module.exports.server_is_charmed = function (servbot, msg) {
    let server_data = servbot.get_server_data(msg.channel);
    if (!("charmed" in server_data)) server_data["charmed"] = false;
    servbot.save_data();
    return server_data["charmed"];
};

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
