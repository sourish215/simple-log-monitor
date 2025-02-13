# Real-time Log Monitor

A real-time log monitoring system built with Node.js, Express, WebSocket, and React. This application allows you to monitor log files in real-time with features like pause/resume and auto-scroll functionality.

## Features

- 🔄 Real-time log monitoring using WebSocket
- ⏯️ Pause/Resume functionality
- 📜 Auto-scroll with toggle option
- 🎨 Clean, modern UI with Tailwind CSS
- 🔌 Custom WebSocket hook for real-time updates

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v14 or higher)
- pnpm (v6 or higher)

## Project Structure

```
log-monitor/
├── server/
│   ├── config/
│   │   └── default.js
│   ├── logs/
│   │   └── app.log
│   └── server.js
├── src/
│   ├── components/
│   │   ├── LogMonitor/
│   │   │   ├── index.jsx
│   │   │   ├── LogDisplay.jsx
│   │   │   └── Controls.jsx
│   │   └── ui/
│   │       ├── button/
│   │       ├── card/
│   │       └── switch/
│   ├── hooks/
│   │   └── useWebSocket.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd log-monitor
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure the log file path:

- Open `server/config/default.js`
- Update the `logFile.path` to point to your log file
- Default path is `server/logs/app.log`

## Running the Application

1. Start both the server and client:

```bash
pnpm start
```

This will:

- Start the backend server on port 3001
- Start the Vite dev server on port 3000
- Open http://localhost:3000 in your browser

## Development

### Testing the Log Monitor

To simulate log entries for testing:

```bash
# Single log entry
echo "Test log entry $(date)" >> server/logs/app.log

# Continuous log entries (every 2 seconds)
while true; do echo "New log entry $(date)" >> server/logs/app.log; sleep 2; done
```

### Available Scripts

- `pnpm start` - Start both server and client
- `pnpm run server` - Start only the backend server
- `pnpm run dev` - Start only the frontend development server
- `pnpm run build` - Build the frontend for production

## Components

### Backend

- Express server with WebSocket support
- Real-time file monitoring using `tail -f`
- Configurable server settings

### Frontend

- React components with hooks
- Custom WebSocket hook for real-time updates
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Node.js
- Styled with Tailwind CSS
- Real-time updates with WebSocket
