const Gpio = require('pigpio').Gpio;
const Promise = require('bluebird')

//const servoArmForBack = new Gpio(10, {mode: Gpio.OUTPUT});
const servoJaw = new Gpio(10, {mode: Gpio.OUTPUT});
const servoRotate = new Gpio(4, {mode: Gpio.OUTPUT});


let jawFullOpenPos = 800
let jawFullClosePos = 1600

let armFullForward = 2500
let armFullRetract = 1800

let armFullLower = 2500
let armFullLift = 2000  //(the Arm struggles to lift.. need to so something)

let armFullRotateLeft = 2200
let armFullRotateRight = 1500

let increment = 50;

var jawServoPos = jawFullClosePos 
var armRotateServoPos = armFullRotateRight + ((armFullRotateLeft - armFullRotateRight)/2.0)

moveLimbsToOriginalPosition()
    .then((success) => {
        console.log("\n\n ========== Open Jaw 100 %")
        if (success == true){
            return openJaw(100)
        }
    })
    .then((success) => {
        console.log("\n\n ========== Close Jaw 100 %")
        if (success == true){
            return closeJaw(100)
        }
    })
    .then((success) => {
    console.log("\n\n ========== Rotate Arm Left 50 % ")
    if (success == true){
        return rotateArmLeft(50)
    }
})
    .then((success) => {
    console.log("\n\n ========== Rotate Arm Left 50 % ")
    if (success == true){
        return rotateArmLeft(100)
    }
})
.then((success) => {
    //console.log("\n\n ========== Rotate Arm Right 100 % ")
    //if (success == true){
        //return rotateArmRight(100)
    //}
})
/*
    .then((success) => {
    console.log("\n\n ========== Open Jaw 1.0")
    if (success == true){
        return openJaw(1)
    }
})
*/
function moveLimbsToOriginalPosition() {
    return new Promise((resolve, reject) => {
       console.log("Moving Limbs....  ") 
        //servoJaw.servoWrite(jawFullClosePos)
        closeJaw(100)
        rotateArmLeft(50)
        resolve(true)
    })
}





//val = ((percent * (max - min) / 100) + min
function getPulseWidthForPercentage(startValue, endValue, percent) {
    var val = ((percent * (endValue - startValue) / 100)) + startValue; 
    console.log("Start : " + startValue +  "End Value : " + endValue + " Percent : " + percent + "Final Value : " + val)
    return val 
}


//let jawFullOpenPos = 800
//let jawFullClosePos = 1600
getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,100)
getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,10)
getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,25)
getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,50)
getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,75)
getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,90)
getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,100)




// ======================== Base Rotate Helper Functions ==================== //

//let armFullRotateLeft = 2500
//let armFullRotateRight = 1500

function rotateArmLeft(percent){

    return new Promise((resolve, reject) => {

        var finalPulseWidth = getPulseWidthForPercentage(armFullRotateRight,armFullRotateLeft,percent)
        console.log("============ Rotate Arm Left ======================")

        let rotateArmLeftLoop = setInterval(() => {
            console.log(" Func : Rotate Arm Left : From : " +  armRotateServoPos + " To  : "  + finalPulseWidth)
            if (armRotateServoPos >= finalPulseWidth){

                clearInterval(rotateArmLeftLoop) 
                resolve(true)
            }

            servoRotate.servoWrite(armRotateServoPos);
            armRotateServoPos -= increment;

        }, 150);
    })
}


//let armFullRotateLeft = 2500
//let armFullRotateRight = 1500
function rotateArmRight(percent){

    return new Promise((resolve, reject) => {

        console.log("============ Rotate Arm Right ======================")
        var finalPulseWidth = getPulseWidthForPercentage(armFullRotateLeft,armFullRotateRight,percent)
        //var finalPulseWidth = armFullRotateRight + ((armFullRotateLeft - armFullRotateRight) * (1 - percent)) 

        let rotateArmLeftLoop = setInterval(() => {
            console.log(" Func : Rotate Arm Right : From : " +  armRotateServoPos + " To  : "  + finalPulseWidth)
            if (armRotateServoPos <= finalPulseWidth){

                clearInterval(rotateArmLeftLoop) 
                resolve(true)
            }

            servoRotate.servoWrite(armRotateServoPos);
            armRotateServoPos -= increment;

        }, 150);
    })
}

// ======================== JAW Helper Functions ==================== //

//let jawFullOpenPos = 800
//let jawFullClosePos = 1600

function closeJaw(percent){
    return new Promise((resolve, reject) => {
        console.log("============ Close Jaw ======================")
        var finalPulseWidth = getPulseWidthForPercentage(jawFullOpenPos,jawFullClosePos,percent)
        
        //var finalPulseWidth = (jawFullClosePos - ((jawFullClosePos - jawFullOpenPos) * percent))

        let closeJawLoop = setInterval(() => {

            console.log(" Func : Close Jaw : From : " +  jawServoPos + " To  : "  + finalPulseWidth)
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
    
        var finalPulseWidth = getPulseWidthForPercentage(jawFullClosePos,jawFullOpenPos,percent)
        
        console.log("============ Open Jaw ======================")

        let openJawLoop = setInterval(() => {

            console.log(" Func : Open Jaw : From : " +  jawServoPos + " To  : "  + finalPulseWidth)
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
