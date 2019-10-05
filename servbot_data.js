const fs = require("fs");
const path = require("path");

const data_file_path = path.join(path.dirname(__filename), "data.json");

module.exports.load_data = function (servbot) {
    fs.readFile(data_file_path, "utf8", function (err, data) {
        if (err) throw err;
        servbot.servbot_data = JSON.parse(data);
        console.log("Successfully loaded data.");
    })
};

module.exports.save_data = function (data_obj) {
    let write_string = JSON.stringify(data_obj);
    fs.writeFile(data_file_path, write_string, "utf8", function (err) {
        if (err) throw err;
    })
};
