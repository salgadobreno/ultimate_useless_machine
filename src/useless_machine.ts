export class EventHandler {
  private listeners: ((event: string, payload?: object) => void)[] = [];

  // Register a listener
  onEvent(callback: (event: string, payload?: object) => void) {
    this.listeners.push(callback);
    console.log(`registered onEvent, listenerCount: ${this.listeners.length}`);
  }

  // Remove a listener
  offEvent(callback: (event: string, payload?: object) => void) {
    console.log(this.listeners.length);
    this.listeners = this.listeners.filter((listener) => listener !== callback);
    console.log(this.listeners.length);
  }

  // Trigger the event
  triggerEvent(event: string, payload?: object) {
    this.listeners.forEach((callback) => callback(event, payload));
  }
}

enum Power {
  OFF,
  ON,
}

enum ToggleSwitchState {
  OFF,
  ON,
}

enum MicroSwitchState {
  OFF,
  ON,
}

enum MotorDirection {
  UP = 1,
  DOWN = -1
}

export enum Events {
  ToggleOn = "toggleOn",
  ToggleOff = "toggleOff",
  StateChanged = "changed"
}

type UselessMachineState = {
  toggleSwitch: ToggleSwitchState,
  microSwitch: MicroSwitchState,
  motorDirection: MotorDirection,
  armPosition: number
}

export type StateChangedEventPayload = {
  new: UselessMachineState
  prev: UselessMachineState,
}

export class UselessMachine {
  readonly eventHandler: EventHandler;
  armPosition: number;
  toggleSwitch: ToggleSwitchState;
  timeoutId: number | undefined;

  static readonly REVERSE_MOTOR_POS = 5;

  constructor() {
    this.eventHandler = new EventHandler();
    this.eventHandler.onEvent.bind(this);
    console.log("constructed");

    this.armPosition = 0;
    this.toggleSwitch = ToggleSwitchState.OFF;

    this.eventHandler.onEvent((event: string, payload?: object) => {
      if (event === Events.ToggleOn) {
        let prevState = this.getState();
        this.toggleSwitch = ToggleSwitchState.ON;
        console.log("Tic!");
        this.stateChanged(prevState);
      }
    });

    this.eventHandler.onEvent((event: string, payload?: object) => {
      if (event === Events.ToggleOff) {
        let prevState = this.getState();
        this.toggleSwitch = ToggleSwitchState.OFF;
        console.log("Tec!");
        this.stateChanged(prevState);
      }
    });

    this.eventHandler.onEvent((event: string, payload?: object) => {
      if (event === Events.StateChanged) {
        let StateChangedEventPayload = payload as StateChangedEventPayload;
        let prevState = StateChangedEventPayload.prev;
        let newState = StateChangedEventPayload.new;
        if (prevState.power != newState.power) {
          if (newState.power === Power.ON) {
            console.log("Brrrrr");
            this.timeoutId = window.setTimeout(() => {
              this.processMotor();
            }, 1000);
          } else {
            console.log("Fuennn");
            if (this.timeoutId != undefined) {
              console.log("Clearing timeouts");
              clearTimeout(this.timeoutId);
            }
          }
        }
      }
    });

    this.eventHandler.onEvent((event: string, payload?: object) => {
      if (event === Events.StateChanged) {
        let StateChangedEventPayload = payload as StateChangedEventPayload;
        let prevState = StateChangedEventPayload.prev;
        let newState = StateChangedEventPayload.new;
        if (prevState.armPosition != newState.armPosition) {
          if (newState.armPosition > prevState.armPosition && newState.armPosition == UselessMachine.REVERSE_MOTOR_POS) {
            this.eventHandler.triggerEvent(Events.ToggleOff);
          }
        }
      }
    });
  }


  async start() {
    console.log("Starting Machine");

    await new Promise<void>((resolve) => {
      this.eventHandler.onEvent(() => {
        resolve();
      });
    });
  }

  getState(): UselessMachineState {
    return {
      armPosition: this.armPosition,
      toggleSwitch: this.toggleSwitch,
      microSwitch: this.calcMicroSwitch(),
      motorDirection: this.calcMotorDirection(),
      power: this.calcPower(),
    };
  }

  calcMicroSwitch(): MicroSwitchState {
    let r = this.armPosition == 0 ? MicroSwitchState.ON : MicroSwitchState.OFF;

    return r;
  }

  calcMotorDirection(): MotorDirection {
    let r = this.toggleSwitch == ToggleSwitchState.ON ? MotorDirection.UP : MotorDirection.DOWN;

    return r;
  }

  calcPower(): Power {
    let r = this.calcMicroSwitch() == MicroSwitchState.OFF ||
      this.toggleSwitch == ToggleSwitchState.ON ? Power.ON : Power.OFF;

    return r;
  }

  stateChanged(prevState: UselessMachineState) {
    if (prevState != this.getState()) {
      let payload: StateChangedEventPayload = {
        prev: prevState,
        new: this.getState()
      };
      this.eventHandler.triggerEvent(Events.StateChanged, payload);
    }
  }

  processMotor() {
    console.log('processMotor');
    if (this.getState().power == Power.ON) {
      let prevState = this.getState();
      console.log("rrrr");

      this.armPosition = this.armPosition + this.getState().motorDirection;
      this.stateChanged(prevState);

      this.timeoutId = window.setTimeout(() => {
        this.processMotor();
      }, 1000);
    }
  }
}
