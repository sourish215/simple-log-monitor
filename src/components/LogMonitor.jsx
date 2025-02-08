import React, { useState, useEffect } from "react";
import Control from "./Control";
import Logs from "./Logs";
import useWebSocket from "react-use-websocket";

function LogMonitor() {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3002"
  );

  useEffect(() => {
    if (readyState) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [readyState]);

  useEffect(() => {
    if (lastMessage != null) {
      setLogs((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  function handlePauseToggle() {
    setIsPaused(!isPaused);
    sendMessage(!isPaused ? "pause" : "resume");
  }
  return (
    <div className="max-w-4xl mx-auto shadow p-6 rounded-md">
      <div className="flex mb-4 items-center justify-between ">
        <span>Status: {isConnected ? "Connected" : "Disconnected"}</span>
        <Control
          isPaused={isPaused}
          onPauseToggle={handlePauseToggle}
          autoScroll={autoScroll}
          onAutoScrollToggle={setAutoScroll}
        />
      </div>
      <Logs logs={logs} autoScroll={autoScroll} />
    </div>
  );
}

export default LogMonitor;
