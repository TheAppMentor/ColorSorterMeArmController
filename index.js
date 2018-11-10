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


moveLimbsToOriginalPosition()
.then((success) => {
    if (success == true){
        return openJaw(1)
    }
})
.then((success) => {
    if (success == true){
        return closeJaw(1)
    }
})
.then((success) => {
    if (success == true){
        return openJaw(0.5)
    }
})
.then((success) => {
    if (success == true){
        return closeJaw(0.5)
    }
})
function moveLimbsToOriginalPosition() {
    return new Promise((resolve, reject) => {
        servoJaw.servoWrite(jawFullClosePos)
        resolve(true)
    })
}

function closeJaw(percent){
    return new Promise((resolve, reject) => {

        var finalPulseWidth = jawFullClosePos * percent 

        var closeJawLoop = setInterval(() => {

            console.log("In Set interval")
            if (jawServoPos >= finalPulseWidth){
                clearInterval(closeJawLoop) 
                resolve(true)
            }

            servoJaw.servoWrite(jawServoPos);
            jawServoPos += increment;

        }, 150);
    })
}

function openJaw(percent){
    return new Promise((resolve, reject) => {

        var finalPulseWidth = jawFullOpenPos * percent 

        var openJawLoop = setInterval(() => {

            console.log("In Set interval")
            if (jawServoPos <= finalPulseWidth){
                console.log("Returning ")
                clearInterval(openJawLoop) 
                resolve(true)
            }

            servoJaw.servoWrite(jawServoPos);
            jawServoPos -= increment;

        }, 150);
    })
}
