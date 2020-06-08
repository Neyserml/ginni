const chalk = require('chalk');

module.exports = function printStatus(path, statusCode) {
  const response200 = [200, 201, 202, 203, 204, 205, 206, 207, 207, 304];
  const nameStatucCode = ` ${statusCode} `;
  if (response200.indexOf(statusCode) > -1) {
    console.log(chalk.inverse.bold.green(nameStatucCode) + ' ' + path);
  } else if (statusCode === 404 || statusCode === 500) {
    console.error(chalk.inverse.bold.red(nameStatucCode) + ' ' + chalk.red(path));
  } else {
    console.error(chalk.inverse.bold.yellow(nameStatucCode) + ' ' + chalk.yellow(path));
  }
  console.log('');
};
