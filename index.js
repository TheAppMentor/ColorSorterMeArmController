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

var jawServoPos = jawFullClosePos 

moveLimbsToOriginalPosition()
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
.then((success) => {
    if (success == true){
        return openJaw(1)
    }
})

function moveLimbsToOriginalPosition() {
    return new Promise((resolve, reject) => {
        servoJaw.servoWrite(jawFullClosePos)
        resolve(true)
    })
}


//let jawFullOpenPos = 800
//let jawFullClosePos = 1600

function closeJaw(percent){
    return new Promise((resolve, reject) => {

        var finalPulseWidth = (jawFullClosePos - ((jawFullClosePos - jawFullOpenPos) * percent))

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
    
        var correctedPercent = 1 + percent 
        if (percent == 1) {
            correctedPrecent = percent
        }

        var finalPulseWidth = jawFullOpenPos * correctedPercent 

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
