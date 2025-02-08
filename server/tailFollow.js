const fs = require("fs");
const readline = require("readline");

class TailFollow {
  constructor(filePath, ws, options = {}) {
    this.filePath = filePath; // file path to the locally hosted file
    this.ws = ws;
    this.options = {
      initialLines: options.initialLines || 10,
      pollingInterval: options.pollingInterval || 1000,
      bufferSize: options.bufferSize || 1024 * 8,
    };
    this.currentPosition = 0;
    this.isWatching = false;
  }

  async showInitialLines() {
    const fileStream = fs.createReadStream(this.filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const lines = [];
    for await (const line of rl) {
      lines.push(line);
      if (lines.length > this.options.initialLines) {
        lines.shift();
      }
    }

    lines.forEach((line) => this.ws.send(line));

    this.currentPosition = (await fs.promises.stat(this.filePath)).size;
  }

  async readNewContent(newFileSize) {
    if (!this.isWatching) {
      return;
    }

    return new Promise((resolve, reject) => {
      const buffer = Buffer.alloc(newFileSize - this.currentPosition);

      fs.open(this.filePath, "r", (err, fd) => {
        if (err) {
          return reject(err);
        }

        fs.read(
          fd,
          buffer,
          0,
          buffer.length,
          this.currentPosition,
          (err, bytesRead, buffer) => {
            fs.close(fd, (err) => {
              if (err) {
                console.log(`Error closing file: ${err.message}`);
              }
            });

            if (err) {
              return reject(err);
            }

            resolve(buffer.toString("utf8", 0, bytesRead));
          }
        );
      });
    });
  }

  async watch() {
    this.isWatching = true;

    // Dynamic polling settings
    const minInterval = 100; // Minimum 100ms
    const maxInterval = 5000; // Maximum 5s
    const defaultInterval = this.options.pollingInterval;
    let currentInterval = defaultInterval;

    // Update frequency tracking
    const updateWindow = 10000; // 10 second window
    const updates = [];

    while (this.isWatching) {
      try {
        const currentTime = Date.now();
        const size = (await fs.promises.stat(this.filePath)).size;

        // Clean old updates outside window
        while (updates.length > 0 && updates[0] < currentTime - updateWindow) {
          updates.shift();
        }

        if (size < this.currentPosition) {
          this.currentPosition = 0;
        }

        if (size > this.currentPosition) {
          const newContent = await this.readNewContent(size);
          this.ws.send(newContent);
          this.currentPosition = size;
          updates.push(currentTime);
        }

        // Adjust polling interval based on update frequency
        const updateRate = updates.length / (updateWindow / 1000); // updates per second

        if (updateRate > 2) {
          // More than 2 updates per second
          currentInterval = Math.max(currentInterval * 0.5, minInterval);
        } else if (updateRate < 0.2) {
          // Less than 1 update per 5 seconds
          currentInterval = Math.min(currentInterval * 1.5, maxInterval);
        }

        await new Promise((resolve) => setTimeout(resolve, currentInterval));
      } catch (e) {
        console.log(`Error while watching file: ${e.message}`);
        // Reset interval on error
        currentInterval = defaultInterval;
        await new Promise((resolve) => setTimeout(resolve, currentInterval));
      }
    }
  }

  async start() {
    try {
      await fs.promises.access(this.filePath, fs.constants.R_OK);

      await this.showInitialLines();

      this.watch();
    } catch (e) {
      console.log(`Error while starting: ${e.message}`);
    }
  }

  stop() {
    this.isWatching = false;
  }
}

module.exports = TailFollow;
