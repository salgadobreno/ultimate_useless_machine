class EventHandler {
  private listeners: ((event: string) => void)[] = [];

  // Register a listener
  onEvent(callback: (event: string) => void) {
    this.listeners.push(callback);
  }

  // Trigger the event
  triggerEvent(event: string) {
    this.listeners.forEach((callback) => callback(event));
  }
}

abstract class FSM {
  readonly eventHandler: EventHandler;

  constructor() {
    this.eventHandler = new EventHandler();
    this.eventHandler.onEvent(this.processEvent.bind(this));
  }

  async start() {
    console.log("Starting Machine");

    await new Promise<void>((resolve) => {
      this.eventHandler.onEvent(() => {
        //console.log("New event");
        resolve();
      });
    });
  }
  abstract processEvent(event: string): void;
  abstract processState(): void;

}

enum State {
  OFF,
  ON,
}

enum MotorDirection {
  UP = 1,
  DOWN = -1
}

enum Events {
  OnPressed = "on",
  OffPressed = "off",
  StateChanged = "changed"
}

class UselessMachine extends FSM {
  state: State;
  motorDirection: MotorDirection;
  armPosition: number;
  timeoutId: number | undefined;

  static readonly reverseMotorPos = 5;

  constructor() {
    super();
    this.state = State.OFF;
    this.motorDirection = MotorDirection.UP;
    this.armPosition = 0;
  }

  getState(): void {
    var state = {
      state: this.state,
      motorDirection: this.motorDirection,
      armPosition: this.armPosition
    }

    console.log(state);
  }

  tick() {
    console.log("tick...");

    this.timeoutId = setTimeout(() => {
      this.processState();
    }, 1000);
  }

  on() {
    console.log("Brrrrr");
    this.state = State.ON;
    this.stateChanged()
    this.processState();
  }

  off() {
    console.log("Shutting down ..");

    if (this.timeoutId != undefined) {
      console.log("Clearing timeouts");
      clearTimeout(this.timeoutId);
    }
    this.state = State.OFF;
    this.stateChanged()
  }

  stateChanged() {
    this.eventHandler.triggerEvent(Events.StateChanged);
  }


  processEvent(event: string) {
    //console.log("UM processEvent: " + event);
    if (event === Events.OnPressed) {
      this.on();
    }
    //console.log("UselessMachine Processed event: " + event);
  }

  processState() {
    if (this.state === State.ON) {
      this.armPosition = this.armPosition + this.motorDirection;
      console.log("arm position:" + this.armPosition);

      if (this.armPosition == UselessMachine.reverseMotorPos) {
        this.motorDirection = MotorDirection.DOWN;
      }

      this.tick();

      if (this.armPosition == 0) {
        this.off();
      }
      this.stateChanged()
    }
  }

}

function main() {
  let fsm = new UselessMachine();
  let eventHandler = fsm.eventHandler;
  eventHandler.onEvent((event) => {
    if (event === Events.StateChanged) {
      fsm.getState()
    }
  });
  fsm.start();

  //Simulate events after 3 seconds
  setTimeout(() => {
    eventHandler.triggerEvent("event1");
  }, 3000);

  setTimeout(() => {
    eventHandler.triggerEvent("on");
  }, 3000);

  console.log("Initialized");
}

main();
