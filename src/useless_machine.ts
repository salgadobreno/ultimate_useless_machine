export class EventHandler {
  private listeners: ((event: string, payload?: object) => void)[] = [];

  // Register a listener
  onEvent(callback: (event: string, payload?: object) => void) {
    this.listeners.push(callback);
  }

  // Trigger the event
  triggerEvent(event: string, payload?: object) {
    this.listeners.forEach((callback) => callback(event, payload));
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

export enum Events {
  OnPressed = "on",
  OffPressed = "off",
  StateChanged = "changed"
}

export class UselessMachine extends FSM {
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

  getState(): object {
    let state = {
      state: this.state,
      motorDirection: this.motorDirection,
      armPosition: this.armPosition
    };
    //console.log("state: " + JSON.stringify(state));
    return state
  }

  tick() {
    console.log("tick...");

    this.timeoutId = window.setTimeout(() => {
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
    this.eventHandler.triggerEvent(Events.StateChanged, this.getState());
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
        this.eventHandler.triggerEvent(Events.OffPressed)
      }

      this.tick();

      if (this.armPosition == 0) {
        this.off();
      }
      this.stateChanged()
    }
  }
}
