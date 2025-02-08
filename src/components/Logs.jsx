import React, { useEffect, useRef } from "react";

function Logs({ autoScroll, logs }) {
  const logContainerRef = useRef(null);
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [autoScroll, logs]);
  return (
    <div
      ref={logContainerRef}
      className="p-4 h-96 rounded-sm text-sm font-mono text-left overflow-y-auto bg-gray-200"
    >
      {logs.map((log, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {log}
        </div>
      ))}
    </div>
  );
}

export default Logs;
