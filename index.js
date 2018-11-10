const Gpio = require('pigpio').Gpio;
const Promise = require('bluebird')

const servoArmForBack = new Gpio(10, {mode: Gpio.OUTPUT});
const servoJaw = new Gpio(14, {mode: Gpio.OUTPUT});


let jawFullOpenPos = 800
let jawFullClosePos = 1700

let armFullForward = 2500
let armFullRetract = 1800

let armFullLower = 2500
let armFullLift = 2000  //(the Arm struggles to lift.. need to so something)

let armFullRotateLeft = 2500
let armFullRotateRight = 1500

let increment = 50;

function openJaw(percent = 1){
    let finalPusleWidth = jawFullOpenPos * percent 

    setInterval(() => {

        if (finalPulseWidth >= jawFullOpenPos){
            return 
        }

        jawFullOpenPos.servoWrite(pulseWidth);
        pulseWidth += increment;
    }, 150);
}
