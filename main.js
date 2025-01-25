var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class EventHandler {
    constructor() {
        this.listeners = [];
    }
    // Register a listener
    onEvent(callback) {
        this.listeners.push(callback);
    }
    // Trigger the event
    triggerEvent(event) {
        this.listeners.forEach((callback) => callback(event));
    }
}
class FSM {
    constructor() {
        this.eventHandler = new EventHandler();
        this.eventHandler.onEvent(this.processEvent.bind(this));
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Starting Machine");
            yield new Promise((resolve) => {
                this.eventHandler.onEvent(() => {
                    //console.log("New event");
                    resolve();
                });
            });
        });
    }
}
var State;
(function (State) {
    State[State["OFF"] = 0] = "OFF";
    State[State["ON"] = 1] = "ON";
})(State || (State = {}));
var MotorDirection;
(function (MotorDirection) {
    MotorDirection[MotorDirection["UP"] = 1] = "UP";
    MotorDirection[MotorDirection["DOWN"] = -1] = "DOWN";
})(MotorDirection || (MotorDirection = {}));
var Events;
(function (Events) {
    Events["OnPressed"] = "on";
    Events["OffPressed"] = "off";
    Events["StateChanged"] = "changed";
})(Events || (Events = {}));
class UselessMachine extends FSM {
    constructor() {
        super();
        this.state = State.OFF;
        this.motorDirection = MotorDirection.UP;
        this.armPosition = 0;
    }
    getState() {
        var state = {
            state: this.state,
            motorDirection: this.motorDirection,
            armPosition: this.armPosition
        };
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
        this.stateChanged();
        this.processState();
    }
    off() {
        console.log("Shutting down ..");
        if (this.timeoutId != undefined) {
            console.log("Clearing timeouts");
            clearTimeout(this.timeoutId);
        }
        this.state = State.OFF;
        this.stateChanged();
    }
    stateChanged() {
        this.eventHandler.triggerEvent(Events.StateChanged);
    }
    processEvent(event) {
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
            this.stateChanged();
        }
    }
}
UselessMachine.reverseMotorPos = 5;
function main() {
    let fsm = new UselessMachine();
    let eventHandler = fsm.eventHandler;
    eventHandler.onEvent((event) => {
        if (event === Events.StateChanged) {
            fsm.getState();
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
