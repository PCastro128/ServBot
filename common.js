
module.exports.prefix = "##";

module.exports.exit = function (client) {
    client.destroy().then(response => console.log);
};

module.exports.full_replace = function (whole_string, substring, replace) {
    while (whole_string.includes(substring)) {
        whole_string = whole_string.replace(substring, replace);
    }
    return whole_string;
};
