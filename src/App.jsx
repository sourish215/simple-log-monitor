import { useState } from "react";
import "./App.css";
import LogMonitor from "./components/LogMonitor";

function App() {
  return (
    <div className="container px-5 mx-auto">
      <LogMonitor />
    </div>
  );
}

export default App;
