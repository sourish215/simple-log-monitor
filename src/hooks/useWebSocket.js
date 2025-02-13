import { useState, useEffect, useRef } from "react";

const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("CONNECTING");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("OPEN");
    };
    socket.onclose = () => {
      setStatus("CLOSED");
    };
    socket.onerror = () => {
      setStatus("ERROR");
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      socket.close();
      setStatus("CLOSED");
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  };

  return { lastMessage: messages, sendMessage, readyState: status };
};

export default useWebSocket;
