const path = require('path');

const options = {
    "path": path.join(__dirname)
};
const nconfig = require('nconfig')(options);

const config = nconfig.loadSync('config');

console.log(config);

module.exports = config;