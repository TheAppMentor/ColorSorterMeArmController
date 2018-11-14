var socket = require('socket.io-client')('https://light-switch-socket-server.herokuapp.com/');
const Gpio = require('pigpio').Gpio;
const Promise = require('bluebird')

//const servoArmForBack = new Gpio(10, {mode: Gpio.OUTPUT});
const servoJaw = new Gpio(10, {mode: Gpio.OUTPUT});
const servoRotate = new Gpio(4, {mode: Gpio.OUTPUT});
const servoExtendArm = new Gpio(17, {mode: Gpio.OUTPUT});
const servoLiftLowerArm = new Gpio(27, {mode: Gpio.OUTPUT});

let jawFullOpenPos = 800
let jawFullClosePos = 1600

let armFullForward = 2400
let armFullRetract = 1700 

let armFullLower = 2400
let armFullLift = 1500  //(the Arm struggles to lift.. need to so something)

let armFullRotateLeft = 2200
let armFullRotateRight = 800

let increment = 75;

var jawServoPos = jawFullClosePos 
//var armRotateServoPos = armFullRotateRight + ((armFullRotateLeft - armFullRotateRight)/2.0)
var armRotateServoPos = armFullRotateRight 
var armExtendRetractServoPos = armFullRetract
var armLiftLowerServoPos = armFullLower 

var isRunning = true

// Set up the ON-OFF button
const button = new Gpio(18, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  alert: true
});
 
 
// Level must be stable for 10 ms before an alert event is emitted.
button.glitchFilter(100);
 
button.on('alert', (level, tick) => {
    console.log("IS RUNNING : " + isRunning)
    if (level === 0) {
        isRunning = !isRunning
    }
});

startRunLoop()

function startRunLoop(){
    
    console.log("Trying to start run loop : isRunning : " + isRunning)

    if (isRunning == true) {
        moveLimbsToOriginalPosition()
            .then((success) => {
                console.log(">>>>>>>>>>>>>>>>>> Staring Run <<<<<<<<<<<<<<<<<<<<<<")
                console.log("\n\n ========== Extend Arm Forward 100 %")
                if (success == true){
                    return openJaw(100)
                }
            })
            .then((success) => {
                console.log("\n\n ========== Extend Arm Forward 100 %")
                if (success == true){
                    return extendArmForward(100)
                }
            })
            .then((success) => {
                console.log("\n\n ========== Extend Arm Forward 100 %")
                if (success == true){
                    return closeJaw(100)
                }
            })
            .then((success) => {
                console.log("\n\n ========== Retract Arm Back 100 %")
                if (success == true){
                    return retractArmBack(100)
                }
            })
            .then((success) => {
                console.log("\n\n ========== Retract Arm Back 100 %")
                if (success == true){
                    return rotateArmLeft(25)
                }
            })
            .then((success) => {
                console.log("\n\n ========== Extend Arm Forward 100 %")
                if (success == true){
                    return extendArmForward(100)
                }
            })
            .then((success) => {
                socket.emit('takePic')
                return Promise.resolve(true)
            })
    } 
} 

/* 
    .then((success) => {
        console.log("\n\n ========== Retract Arm Back 100 %")
        if (success == true){
            return retractArmBack(100)
        }
    })
    .then((success) => {
        console.log("\n\n ========== Retract Arm Back 100 %")
        if (success == true){
            return rotateArmLeft(50)
        }
    })
 .then((success) => {
        console.log("\n\n ========== Extend Arm Forward 100 %")
        if (success == true){
            return extendArmForward(100)
        }
    })
 .then((success) => {
        console.log("\n\n ========== Extend Arm Forward 100 %")
        if (success == true){
            return openJaw(100)
        }
    })

    .then((success) => {
        console.log("\n\n ========== Lower Arm Down 100 % ")
        if (success == true){
            return lowerArmDown(100)
        }
    })
    .then((success) => {
        console.log("\n\n ========== Lift Arm Up 100 % ")
        if (success == true){
            return liftArmUp(100)
        }
    })
 .then((success) => {
        console.log("\n\n ========== Extend Arm Forward 100 %")
        if (success == true){
            return extendArmForward(100)
        }
    })
    .then((success) => {
        console.log("\n\n ========== Retract Arm Back 100 %")
        if (success == true){
            return retractArmBack(100)
        }
    })
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
        console.log("\n\n ========== Rotate Arm Left 100 % ")
        if (success == true){
            return rotateArmLeft(100)
        }
    })
    .then((success) => {
        console.log("\n\n ========== Rotate Arm Right 100 % ")
        if (success == true){
            return rotateArmRight(100)
        }
    })
    .then((success) => {
        console.log("\n\n ========== Open Jaw 100")
        if (success == true){
            return openJaw(100)
        }
    })
    .then((success) => {
        console.log("\n\n ========== Open Jaw 100")
        if (success == true){
            return closeJaw(100)
        }
    })
 */   

function moveLimbsToOriginalPosition() {
    return new Promise((resolve, reject) => {
        console.log("Moving Limbs....  ") 

        closeJaw(100)
            .then((success) => {
                console.log("\n\n ========== Reset to Origin : Retract Arm Back 100 % ")
                if (success == true){
                    return retractArmBack(100)
                }
                Promise.reject("ERROR KA BACCHA")
            })
            .then((success) => {
                console.log("\n\n ========== Reset to Origin : Rotate Arm Right 100 % ")
                if (success == true){
                    return rotateArmRight(100)
                }
            }).then((success) => {
                console.log("\n\n ========== Reset to Origin : Finall Resolving")
                resolve(success)
            })
    })
}





//val = ((percent * (max - min) / 100) + min
function getPulseWidthForPercentage(startValue, endValue, percent) {
    var val = ((percent * (endValue - startValue) / 100)) + startValue; 
    console.log("Start : " + startValue +  "End Value : " + endValue + " Percent : " + percent + "  Final Value : " + val)
    return val 
}



//armFullLower = 2400
//armFullLift = 1500  //(the Arm struggles to lift.. need to so something)

// ======================== Arm Lift & Lower Helper Functions ==================== //

function liftArmUp(percent){

    return new Promise((resolve, reject) => {

        var finalPulseWidth = getPulseWidthForPercentage(armFullLower,armFullLift,percent)
        console.log("============ Lift Arm Up ======================")

        let liftArmUpLoop = setInterval(() => {
            console.log(" Func : Lift Arm Up : From : " +  armLiftLowerServoPos + " To  : "  + finalPulseWidth)
            if (armLiftLowerServoPos <= finalPulseWidth){
                clearInterval(liftArmUpLoop) 
                
                console.log(" >>>>>>>>>> Returning : armLiftLowerServoPos : " + armLiftLowerServoPos + "finalPulseWidth : " + finalPulseWidth)
                resolve(true)
            }

            servoLiftLowerArm.servoWrite(armLiftLowerServoPos);
            armLiftLowerServoPos -= increment;

        }, 150);
    })
}

function lowerArmDown(percent){

    return new Promise((resolve, reject) => {

        var finalPulseWidth = getPulseWidthForPercentage(armFullLift,armFullLower,percent)
        console.log("============ Lower Arm Down ======================")

        let lowerArmDownLoop = setInterval(() => {
            console.log(" Func : Lower Arm Down : From : " +  armLiftLowerServoPos + " To  : "  + finalPulseWidth)
            if (armLiftLowerServoPos >= finalPulseWidth){
                clearInterval(lowerArmDownLoop) 
                
                console.log(" >>>>>>>>>> Returning : armLiftLowerServoPos : " + armLiftLowerServoPos + "finalPulseWidth : " + finalPulseWidth)
                resolve(true)
            }

            servoLiftLowerArm.servoWrite(armLiftLowerServoPos);
            armLiftLowerServoPos += increment;

        }, 150);
    })
}






//armFullForward = 2500
// armFullRetract = 1800

// ======================== Arm Extend Retract Helper Functions ==================== //

function extendArmForward(percent){

    return new Promise((resolve, reject) => {

        var finalPulseWidth = getPulseWidthForPercentage(armFullRetract,armFullForward,percent)
        console.log("============ Extend Arm Forward ======================")

        let extendArmForwardLoop = setInterval(() => {
            console.log(" Func : Extend Arm Forward : From : " +  armExtendRetractServoPos + " To  : "  + finalPulseWidth)
            if (armExtendRetractServoPos >= finalPulseWidth){
                clearInterval(extendArmForwardLoop) 
                console.log(" >>>>>>>>>> Returning : armExtendRetractServoPos : " + armExtendRetractServoPos + "finalPulseWidth : " + finalPulseWidth)
                resolve(true)
            }

            servoExtendArm.servoWrite(armExtendRetractServoPos);
            armExtendRetractServoPos += increment;

        }, 150);
    })
}

function retractArmBack(percent){

    return new Promise((resolve, reject) => {

        var finalPulseWidth = getPulseWidthForPercentage(armFullForward,armFullRetract,percent)
        console.log("============ Retract Arm Back ======================")

        let retractArmBackLoop = setInterval(() => {
            console.log(" Func : Retract Arm Back : From : " +  armExtendRetractServoPos + " To  : "  + finalPulseWidth)
            if (armExtendRetractServoPos <= finalPulseWidth){
                clearInterval(retractArmBackLoop) 
                armExtendRetractServoPos = finalPulseWidth 
                console.log(" >>>>>>>>>> Returning : armExtendRetractServoPos : " + armExtendRetractServoPos + "finalPulseWidth : " + finalPulseWidth)
                resolve(true)
            }

            servoExtendArm.servoWrite(armExtendRetractServoPos);
            armExtendRetractServoPos -= increment;

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

        let rotateArmRightLoop = setInterval(() => {
            console.log(" Func : Rotate Arm Right : From : " +  armRotateServoPos + " To  : "  + finalPulseWidth)
            if (armRotateServoPos <= finalPulseWidth){
                console.log(" >>>>>>>>>> Returning : armRotateServoPos  : " + armRotateServoPos + "finalPulseWidth : " + finalPulseWidth)
                clearInterval(rotateArmRightLoop) 
                resolve(true)
            }

            servoRotate.servoWrite(armRotateServoPos);
            armRotateServoPos -= increment;

        }, 150);
    })
}








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
                console.log(" >>>>>>>>>> Returning : armRotateServoPos  : " + armRotateServoPos + "finalPulseWidth : " + finalPulseWidth)
                resolve(true)
            }

            servoRotate.servoWrite(armRotateServoPos);
            armRotateServoPos += increment;

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

        let rotateArmRightLoop = setInterval(() => {
            console.log(" Func : Rotate Arm Right : From : " +  armRotateServoPos + " To  : "  + finalPulseWidth)
            if (armRotateServoPos <= finalPulseWidth){
                console.log(" >>>>>>>>>> Returning : armRotateServoPos  : " + armRotateServoPos + "finalPulseWidth : " + finalPulseWidth)
                clearInterval(rotateArmRightLoop) 
                armRotateServoPos = finalPulseWidth
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
                jawServoPos = finalPulseWidth
                console.log("Close Jaw resolving...")
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


function dropInBox(color) {
   
    var rotateArm = 100

    if (color == "RED"){
       rotateArm = 50 
    }

    if (color == "YELLOW"){
       rotateArm = 75 
    }

    retractArmBack(100)
        .then((success) => {
            console.log("\n\n ========== Retract Arm Back 100 %")
            if (success == true){
                return rotateArmLeft(rotateArm)
            }
        })
        .then((success) => {
            console.log("\n\n ========== Retract Arm Back 100 %")
            if (success == true){
                return extendArmForward(100)
            }
        })
        .then((success) => {
            console.log("\n\n ========== Extend Arm Forward 100 %")
            if (success == true){
                return openJaw(100)
            }
        })
        .then((success) => {
            console.log("\n\n ========== Start Run Loop again")
            if (success == true){
                startRunLoop()
                Promise.resolve(true)
            }
        })
}


//var socket = require('socket.io-client')('https://light-switch-socket-server.herokuapp.com/');

socket.on('connect', function(){
    console.log("Raspberry Pi : Connect to Socket Server")

    socket.on('lightsOn', function(data){
        console.log("Lights ON...")
    });

    socket.on('lightsOff', function(data){
        console.log("Lights OFF... ")
    });

    socket.on('identifiedColor', function(data){
        console.log("We have the color now ... ")
    });
});

socket.on('COLORISRED', function(data){
    console.log("WE got back a COlor from the iphone : iTS RED!!")
    dropInBox("RED")
});

socket.on('COLORISYELLOW', function(data){
    console.log("WE got back a COlor from the iphone : iTS RED!!")
    dropInBox("YELLOW")
});
socket.on('time', function(data){
    console.log("WE got an event... ")
    //socket.emit('takePic')
});

socket.on('disconnect', function(){console.log("We got disconnectec.. ")});
