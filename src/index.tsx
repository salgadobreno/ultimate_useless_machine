import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import * as usm from "./useless_machine"

const fsm = new usm.UselessMachine();
const eventHandler = fsm.eventHandler;

fsm.start();

const EventLog: React.FC = () => {
  const [events, setEvents] = useState<string[][]>([]);

  // Memoize the event handler to prevent unnecessary re-renders
  const handleEvent = useCallback((event: string, object?: object) => {
    setEvents((prevEvents) => [[event, JSON.stringify(object)], ...prevEvents]);
  }, []);

  // Register the event listener when the component mounts
  useEffect(() => {
    eventHandler.onEvent(handleEvent);

    // Clean up the event listener when the component unmounts
    return () => {
      eventHandler.offEvent(handleEvent);
    };
  }, [handleEvent]); // Dependency is stable due to useCallback

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {index}. {event[0]}: {event[1]}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Toggle: React.FC<{ checked: boolean, checkedChanged: Function }> = ({ checked, checkedChanged }) => {
  const checkHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkedChanged(e.target.checked);
  };

  return <div>
    <input type="checkbox" id="checkbox" checked={checked} onChange={checkHandler} />
    <label htmlFor='checkbox'>Press me</label>
  </div>
}

const App: React.FC = () => {
  const [fsmState, setFsmState] = useState(fsm.getState());
  const [checked, setChecked] = useState(false);

  // Memoize the event handlers to prevent listener multiplication in rerenders
  const handleStateChanged = useCallback((event: string, object?: object) => {
    if (event === usm.Events.StateChanged && object !== undefined) {
      const stateChangedEvent = object as usm.StateChangedEventPayload;
      console.log(stateChangedEvent.new);
      setFsmState(stateChangedEvent.new);
    }
  }, []);

  const handleToggleOff = useCallback((event: string) => {
    if (event === usm.Events.ToggleOff) {
      setChecked(false);
    }
  }, []);

  // Register event listeners when the component mounts
  useEffect(() => {
    console.log("useEffect");
    eventHandler.onEvent(handleStateChanged);
    eventHandler.onEvent(handleToggleOff);

    // Clean up event listeners when the component unmounts
    return () => {
      console.log("drop");
      eventHandler.offEvent(handleStateChanged);
      eventHandler.offEvent(handleToggleOff);
    };
  }, [handleStateChanged, handleToggleOff]); // Dependencies are stable due to useCallback

  const checkedChanged = (checked: boolean) => {
    setChecked(checked);
    if (checked) {
      eventHandler.triggerEvent(usm.Events.ToggleOn);
    } else {
      eventHandler.triggerEvent(usm.Events.ToggleOff);
    }
  };

  return (
    <div style={{ float: "left", border: "1px solid black" }}>
      <h1>Useless State Machine</h1>
      <Toggle checked={checked} checkedChanged={checkedChanged} />
      <div>{JSON.stringify(fsmState)}</div>
      <div>
        <EventLog />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log("Initialized");
