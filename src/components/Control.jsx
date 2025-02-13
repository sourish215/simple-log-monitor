import React from "react";
import { Switch, Button } from "@headlessui/react";

function Control({ isPaused, onPauseToggle, autoScroll, onAutoScrollToggle }) {
  return (
    <div className="flex w-fit items-center gap-x-2">
      <Switch
        checked={autoScroll}
        onChange={onAutoScrollToggle}
        className="cursor-pointer group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-black"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
      </Switch>
      {/* <input
        type="checkbox"
        checked={autoScroll}
        onChange={(e) => onAutoScrollToggle(e.target.checked)}
        className="cursor-pointer h-5 w-5 rounded border-gray-300 text-black focus:ring-black accent-black"
      /> */}
      <label htmlFor="autoScroll">Auto-scroll</label>
      <Button
        className={
          "cursor-pointer rounded ml-4 py-2 px-4 text-sm text-white w-24 " +
          (isPaused ? "bg-gray-300" : "bg-black")
        }
        onClick={onPauseToggle}
      >
        {!isPaused ? "Pause" : "Resume"}
      </Button>
    </div>
  );
}

export default Control;
