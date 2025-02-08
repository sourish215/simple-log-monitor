const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const TailFollow = require("./tailFollow");
const config = require("./config/default");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Connection established");

  const tailFollow = new TailFollow(config.logFile.path, ws);

  tailFollow.start();

  ws.on("message", (message) => {
    const command = message.toString();

    // add pause/resume functionality here
    if (command == "pause") {
      tailFollow.stop();
    } else if (command == "resume") {
      tailFollow.watch();
    }
  });

  ws.on("close", () => {
    console.log("Disconnected");
    tailFollow.stop();
  });
});

server.listen(config.server.port, () => {
  console.log("Server listening on port 3002");
});
