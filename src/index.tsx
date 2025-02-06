import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as usm from "./useless_machine"

//class TToggle extends React.Component {
//  state = {
//    isChecked: false
//  };
//
//  checkHandler: (e: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
//    this.setState({ isChecked: e.target.checked });
//  }
//
//  render(): React.ReactNode {
//    return <div>
//      <input type="checkbox" id="checkbox" checked={this.state.isChecked} onChange={this.checkHandler} />
//      <label htmlFor='checkbox'>Press me</label>
//    </div>
//  }
//}

const fsm = new usm.UselessMachine();
const eventHandler = fsm.eventHandler;

fsm.start();

const Toggle: React.FC<{ checked: boolean, checkedChanged: Function }> = ({ checked, checkedChanged }) => {
  const checkHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("checkHandler");
    //if (e.target.checked === true) {
    //  eventHandler.triggerEvent(usm.Events.OnPressed);
    //}
    checkedChanged(e.target.checked);
  };

  return <div>
    <input type="checkbox" id="checkbox" checked={checked} onChange={checkHandler} />
    <label htmlFor='checkbox'>Press me</label>
  </div>
}

const App: React.FC = () => {
  const [fsmState, setFsmState] = useState({});
  const [checked, setChecked] = useState(false);

  eventHandler.onEvent((event, object?: object) => {
    if (event === usm.Events.StateChanged) {
      console.log("stateChanged")
      if (object != undefined) {
        setFsmState(object);
      }
    }
  });

  eventHandler.onEvent((event, object?: object) => {
    if (event === usm.Events.StateChanged) {
      //console.log("stateChanged")
      if (object != undefined) {
        setFsmState(object);
      }
    } else if (event === usm.Events.OffPressed) {
      setChecked(false);
    }
  });

  //eventHandler.onEvent((event, object?: object) => {
  //  if (event === usm.Events.OffPressed) {
  //    //console.log("stateChanged")
  //    if (object != undefined) {
  //      setFsmState(object);
  //    }
  //  }
  //});

  const checkedChanged = (checked: boolean) => {
    console.log("checkedChanged");
    setChecked(checked);
    if (checked === true) {
      eventHandler.triggerEvent(usm.Events.OnPressed);
    } else {
      eventHandler.triggerEvent(usm.Events.OffPressed);
    }
  }

  return (
    <div style={{ float: "left", border: "1px solid black" }}>
      <h1>Useless State Machine</h1>
      <Toggle checked={checked} checkedChanged={checkedChanged} />
      <div>{JSON.stringify(fsmState)}</div>
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
