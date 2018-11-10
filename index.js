const Gpio = require('pigpio').Gpio;
 
const motor = new Gpio(10, {mode: Gpio.OUTPUT});


let jawFullOpenPos = 800
let jawFullClosePos = 1700






let pulseWidth = 800;
//let increment = 100;
let increment = 50;

//  motor.servoWrite(11000);
  //motor.servoWrite(11000);
  //motor.servoWrite(11000);

setInterval(() => {
    console.log("Pulse Width : " + pulseWidth)
    motor.servoWrite(pulseWidth);
 
  pulseWidth += increment;

  if (pulseWidth >= 1600) {
      increment = -100;
    } else if (pulseWidth <= 800) {
        increment = 50;
    }
}, 150);

// Pulse Width = 11000 ms => 90 deg Right
// Pulse Width < 11000  ms => 0 deg 
// Pulse Width > 11000 ms => 180 deg Right
