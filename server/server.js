const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const TailFollow = require("./tailFollow");
const config = require("./config/default");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Keep track of active connections
const activeConnections = new Set();

wss.on("connection", (ws) => {
  console.log("Connection established");
  activeConnections.add(ws);

  const tailFollow = new TailFollow(config.logFile.path, ws);

  tailFollow.start();

  ws.on("message", (message) => {
    const command = message.toString();

    // add pause/resume functionality here
    switch (command) {
      case "pause":
        tailFollow.stop();
        break;
      case "resume":
        tailFollow.watch();
        break;
      default:
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unknown command. Available commands: pause, resume",
          })
        );
    }
  });

  ws.on("close", () => {
    console.log("Disconnected");
    tailFollow.stop();
    activeConnections.delete(ws);
  });
});

// Graceful shutdown
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.log("Shutting down server...");

  // Close all WebSocket connections
  for (const ws of activeConnections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }

  // Close the server
  server.close(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
}

const port = config.server.port || 3002;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
