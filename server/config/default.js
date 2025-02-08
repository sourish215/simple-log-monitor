const path = require("path");

module.exports = {
  server: {
    port: 3002,
  },
  logFile: {
    path: path.join(__dirname, "../logs/app.log"),
  },
};
