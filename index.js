const Gpio = require('pigpio').Gpio;
const Promise = require('bluebird')

//const servoArmForBack = new Gpio(10, {mode: Gpio.OUTPUT});
const servoJaw = new Gpio(10, {mode: Gpio.OUTPUT});


let jawFullOpenPos = 800
let jawFullClosePos = 1600

let armFullForward = 2500
let armFullRetract = 1800

let armFullLower = 2500
let armFullLift = 2000  //(the Arm struggles to lift.. need to so something)

let armFullRotateLeft = 2500
let armFullRotateRight = 1500

let increment = 50;

closeJaw(1)
//openJaw(1)

var jawServoPos = jawFullClosePos 


function closeJaw(percent = 1){
    console.log("IN Close JAwe function")   
    var finalPulseWidth = jawFullClosePos * percent 

    var closeJawLoop = setInterval(() => {

        console.log("In Set interval")
        if (jawServoPos >= jawFullClosePos){
        console.log("Returning ")
          clearInterval(closeJawLoop) 
        }

        servoJaw.servoWrite(jawServoPos);
        jawServoPos += increment;
    
    }, 150);
}

function openJaw(percent = 1){
    
    console.log("IN Open Jaw function")   

    var finalPulseWidth = jawFullOpenPos * percent 

    var openJawLoop = setInterval(() => {

        console.log("In Set interval")
        if (jawServoPos <= jawFullOpenPos){
        console.log("Returning ")
          clearInterval(openJawLoop) 
        }

        servoJaw.servoWrite(jawServoPos);
        jawServoPos -= increment;
    
    }, 150);
}
