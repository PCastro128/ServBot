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

module.exports.save_data = async function (servbot) {
    await new Promise(((resolve, reject) => {  // Wait for data lock to release
        if (servbot.data_lock) {
            reject();
        } else {
            resolve();
        }
    }));
    servbot.data_lock = true;  // Acquire data lock
    let write_string = JSON.stringify(servbot.servbot_data, null, 4);
    fs.writeFile(data_file_path, write_string, {flag: "w"}, function (err) {
        servbot.data_lock = false;  // Release data lock
        if (err) throw err;
    });
};
