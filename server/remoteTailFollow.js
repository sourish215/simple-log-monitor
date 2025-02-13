const { Client } = require("ssh2");
const readline = require("readline");

class RemoteTailFollow {
  constructor(config, ws, options = {}) {
    this.config = {
      host: config.host,
      port: config.port || 22,
      username: config.username,
      password: config.password, // or privateKey
      filePath: config.filePath, // path to file on remote server
    };
    this.ws = ws;
    this.options = {
      initialLines: options.initialLines || 10,
      pollingInterval: options.pollingInterval || 1000,
      bufferSize: options.bufferSize || 1024 * 8,
    };
    this.currentPosition = 0;
    this.isWatching = false;
    this.sshClient = new Client();
  }

  async connectSSH() {
    return new Promise((resolve, reject) => {
      this.sshClient
        .on("ready", () => resolve())
        .on("error", (err) => reject(err))
        .connect(this.config);
    });
  }

  async showInitialLines() {
    return new Promise((resolve, reject) => {
      this.sshClient.exec(
        `tail -n ${this.options.initialLines} ${this.config.filePath}`,
        (err, stream) => {
          if (err) return reject(err);

          let data = "";
          stream
            .on("data", (chunk) => {
              data += chunk;
            })
            .on("end", () => {
              const lines = data.toString().split("\n");
              lines.forEach((line) => {
                if (line.trim()) this.ws.send(line);
              });
              resolve();
            })
            .on("error", (err) => reject(err));
        }
      );
    });
  }

  async getFileSize() {
    return new Promise((resolve, reject) => {
      this.sshClient.exec(
        `stat -f %z ${this.config.filePath}`,
        (err, stream) => {
          if (err) return reject(err);

          let size = "";
          stream
            .on("data", (data) => {
              size += data;
            })
            .on("end", () => {
              resolve(parseInt(size.trim(), 10));
            })
            .on("error", (err) => reject(err));
        }
      );
    });
  }

  async readNewContent(newFileSize) {
    if (!this.isWatching) return;

    const length = newFileSize - this.currentPosition;
    const command = `dd if=${this.config.filePath} bs=1 skip=${this.currentPosition} count=${length} 2>/dev/null`;

    return new Promise((resolve, reject) => {
      this.sshClient.exec(command, (err, stream) => {
        if (err) return reject(err);

        let data = "";
        stream
          .on("data", (chunk) => {
            data += chunk;
          })
          .on("end", () => {
            resolve(data.toString());
          })
          .on("error", (err) => reject(err));
      });
    });
  }

  async watch() {
    this.isWatching = true;

    while (this.isWatching) {
      try {
        const size = await this.getFileSize();

        if (size < this.currentPosition) {
          this.currentPosition = 0;
        }

        if (size > this.currentPosition) {
          const newContent = await this.readNewContent(size);
          this.ws.send(newContent);
          this.currentPosition = size;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, this.options.pollingInterval)
        );
      } catch (e) {
        console.log(`Error while watching file: ${e.message}`);
      }
    }
  }

  async start() {
    try {
      await this.connectSSH();
      await this.showInitialLines();
      await this.watch();
    } catch (e) {
      console.log(`Error while starting: ${e.message}`);
      this.stop();
    }
  }

  stop() {
    this.isWatching = false;
    this.sshClient.end();
  }
}

module.exports = RemoteTailFollow;
