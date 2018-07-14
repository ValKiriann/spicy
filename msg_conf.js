const chalk = require('chalk');

module.exports.warning = chalk.keyword('yellow');
module.exports.success = chalk.keyword('green');
module.exports.start = chalk.bgKeyword('white').keyword('blue');