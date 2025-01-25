Event-driven Useless State Machine with TypeScript.

> A useless machine or useless box is a device whose only function is to turn itself off.

[Useless Machine](https://en.wikipedia.org/wiki/Useless_machine)

```
[13:16:37]buzaga:.../sda8/Projects/ultimate_useless_machine$ npm start

> ultimate_useless_machine@1.0.0 start
> tsc && node main.js

Starting Machine
Initialized
Brrrrr
{ state: 1, motorDirection: 1, armPosition: 0 }
arm position:1
tick...
{ state: 1, motorDirection: 1, armPosition: 1 }
arm position:2
tick...
{ state: 1, motorDirection: 1, armPosition: 2 }
arm position:3
tick...
{ state: 1, motorDirection: 1, armPosition: 3 }
arm position:4
tick...
{ state: 1, motorDirection: 1, armPosition: 4 }
arm position:5
tick...
{ state: 1, motorDirection: -1, armPosition: 5 }
arm position:4
tick...
{ state: 1, motorDirection: -1, armPosition: 4 }
arm position:3
tick...
{ state: 1, motorDirection: -1, armPosition: 3 }
arm position:2
tick...
{ state: 1, motorDirection: -1, armPosition: 2 }
arm position:1
tick...
{ state: 1, motorDirection: -1, armPosition: 1 }
arm position:0
tick...
Shutting down ..
Clearing timeouts
{ state: 0, motorDirection: -1, armPosition: 0 }
{ state: 0, motorDirection: -1, armPosition: 0 }
```
