const os = require('os');
const fs = require('fs');

var goalPath = "./interface/goals.gfx";
var shinePath = "./interface/goals_shine.gfx";
var folderPath = "";

var mode = "";

var githubLink = "https://github.com/Yalu64/Hoi4-Focus-Icon-and-Shine-creator"


var folderArray = [];
var fileArray = [];
var oldFileArray = [];

var listenerStatus = false;

clearConsole();
//Checking platform - Window
if (!os.platform().includes('win')) {
    return errorExit('This Version of the script is only supported on windows machines!');
}

//File checks
async function run() {
    if (!(await checkIfFileExists(goalPath))) {
        await userInput('goals.gfx path (example: "interface/goals.gfx") - Include the .gfx on the end.')
        .then(async (input) => {
            goalPath = input;
        });
    }
    if (!(await checkIfFileExists(shinePath))) {
        await userInput('goals_shine.gfx path (example: "interface/goals_shine.gfx") - Include the .gfx on the end.')
        .then(async (input) => {
            shinePath = input;
        });
    }
    if (!(await checkIfFileExists(shinePath)) || !(await checkIfFileExists(goalPath))) {
        errorExit('Could not find gfx file/s! Make sure you follow the readme.txt file when using this script or check the Github page what is causing this error!\n\nERR CODE: INVALID GFX FILE\n' + (await checkIfFileExists(shinePath) ? '' : 'File "goals_shine.gfx" is missing!') + (await checkIfFileExists(goalPath) ? '' : '\nFile "goals.gfx" is missing!'));
    } else {
        await userInput('parent folder where the focus icons are located in - sub directories will be included! (example: "gfx/interface/goals")')
        .then(async (input) => {
            await checkIfFolderExists(input)
            .then(async (exists) => {
                if (exists) {  
                    folderPath = input; 
                    loopThroughAll()
    
                    startMenu();
                } else {
                    errorExit('Could not find folder "' + input + '"! Make sure you follow the readme.txt file when using this script or check the Github page what is causing this error!\n\nERR CODE: INVALID FOLDER\nFolder "' + input + '" does not exist!');
                }
            });
        });
    }

    
}

var currentItem = 1;

async function startMenu() {

    clearConsole();
    console.log('\x1b[35m---=< Main Menu >=---');
    console.log('\x1b[0m');
    if (currentItem == 1) console.log('\x1b[45m' + '1. Auto-Generate Focus Icons when new icons are copied into the folder')
    else console.log('\x1b[0m' + '1. Auto-Generate Focus Icons when new icons are copied into the folder')

    if (currentItem == 2) console.log('\x1b[45m' + '2. Manually Generate Focus Icons')
    else console.log('\x1b[0m' + '2. Manually Generate Focus Icons')

    if (currentItem == 3) console.log('\x1b[41m' + '3. Start Web GUI - available in a future version. You can check github for new releases! - ' + githubLink)
    else console.log('\x1b[0m' + '3. Start Web GUI')

    if (currentItem == 4) console.log('\x1b[45m' + '4. Github')
    else console.log('\x1b[0m' + '4. Github')

    if (currentItem == 5) console.log('\x1b[45m' + '5. Check for missing shines and gfx icons.')
    else console.log('\x1b[0m' + '5. Check for missing shines and gfx icons.')

    if (currentItem == 6) console.log('\x1b[45m' + '6. Exit')
    else console.log('\x1b[0m' + '6. Exit')

    console.log('\x1b[0m');
    console.log('\n\n Use the arrow keys to navigate and press enter to select an option!');
    console.log('\x1b[0m');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', function(key) {
        //Arrow up
        if (key === '\u001B\u005B\u0041') {
            if (currentItem > 1) currentItem--;
            //Kill old event listener
            process.stdin.removeAllListeners('data');
            startMenu();
        }
        //Arrow down
        if (key === '\u001B\u005B\u0042') {
            if (currentItem < 6) currentItem++;
            //Kill old event listener
            process.stdin.removeAllListeners('data');

            startMenu();
        }

        //Enter
        if (key === '\u000D') {
            //Kill old event listener
            process.stdin.removeAllListeners('data');
            switch (currentItem) {
                case 1:
                    autoGenerate();
                    break;
                case 2:
                    manuallyGenerate();
                    break;
                case 3:
                    startMenu();
                    break;
                case 4:
                    openGithub();
                    break;
                case 5:
                    checkExisting();
                    break;
                case 6:
                    clearConsole();
                    console.log('Goodbye!');
                    setTimeout(() => {
                        process.exit();
                    }, 2000);
                    break;
            }
        }
    });
}

async function checkIfFileExists(path) {
    const promise = new Promise((resolve, reject) => {
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                return resolve(false);
            }
            return resolve(true);
        });
    });
    return await promise.then();
}

async function checkIfFolderExists(path) {
    const promise = new Promise((resolve, reject) => {
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                return resolve(false);
            }
            return resolve(true);
        });
    });
    return await promise.then();
}

var inputMode = false;
async function userInput(what) {
    inputMode = true;
    const promise = new Promise((resolve, reject) => {
        //Make user input interface
        console.log('---=< Please Enter: ' + what + ' >=---');
        //Readline
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        //Ask for input
        readline.question('Enter: ', input => {
            inputMode = false;
            readline.close();
            return resolve(input);
        });
    });
    return await promise.then();
}

function errorExit(message) {
        clearConsole()
        console.error('\x1b[41m\x1b[37m---=< CRITICAL ERROR >=---')
        console.log('\x1b[0m\x1b[31m')
        console.error(message);
        console.error('\n\nPress any key to exit...');
        console.log('\x1b[0m')
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

process.on('exit', function(code) {
    console.log('\x1b[0m')
});

async function openGithub() {
    console.log('Use this link to open the Github page:')
    console.log('\x1b[36m' + githubLink);
    console.log('\x1b[0m');
    console.log('Press any key to go back to the main menu...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', function(key) {
        process.stdin.removeAllListeners('data');
        startMenu();
    });
}
async function loopThroughAll() {
    //Loop through all files in the folder and get file names
    folderArray = [];
    fileArray = [];

    folderArray.push(folderPath);
    readFolder(folderPath);
}

async function readFolder(path) {
    fs.readdir(path, async (err, files) => {
        if (err) {
            console.log('Could not read dir' + path);
            console.log(err);
        } else {
            files.forEach(file => {
                fs.stat(path + '/' + file, (err, stats) => {
                    if (stats.isDirectory()) {
                        folderArray.push(path + '/' + file);
                        readFolder(path + '/' + file);
                    } else {
                        fileArray.push(path + '/' + file);
                    }
                });
            });
        }
    });
}

//startListener()
async function startListener() {
    listenerStatus = true;
    while (listenerStatus) {
        if ((oldFileArray.length != fileArray.length) && oldFileArray != 0) {
            if (oldFileArray.length < fileArray.length) {
                console.log("\x1b[32m" + '[!] File change detected' + "\x1b[0m");
                var newFile = '';
                fileArray.forEach(element => {
                    if (!oldFileArray.includes(element)) {
                        newFile = element;
                        console.log("\x1b[32m" + '[+] New file found: ' + newFile + "\x1b[0m");
                        if (mode == "auto") {
                            generateGoal(newFile);
                        } else {
                            if ((fileArray.length - oldFileArray.length) > 1) {
                                console.log("\x1b[31m" + '[-] Multiple files detected! Please remove the files and import them one by one!' + "\x1b[0m");
                                return;
                            }
                            userInput('name of the icon (leave empty to use the file name, GFX_ will be automatically added)')
                            .then((input) => {
                                if (input == '') input = newFile;
                                generateGoal(newFile, input);
                                setTimeout(() => {
                                    manuallyGenerate();
                                }, 3000);                            
                            });
                        }
                    }
                });
            } else {
                console.log("\x1b[31m" + '[-] File deleted - You have to remove SpriteType from goals.gfx and goals_shine.gfx manually!' + "\x1b[0m");
            }
        }

        oldFileArray = fileArray;
        await loopThroughAll();
        await sleep(1000);
    }
}

async function stopListener() {
    listenerStatus = false;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkExisting() {
    clearConsole()
    var missingShine = [];
    var missingGoal = [];

    const gfx = fs.readFileSync(goalPath, 'utf8');
    const shine = fs.readFileSync(shinePath, 'utf8');
    var gfxArray = gfx.split('texturefile');
    var gfxArray2 = [];
    gfxArray.forEach(element => {
        gfxArray2.push(element.split('"')[1]);
    });

    gfxArray2.forEach(element => {
        if (element != undefined) {
            if (shine.includes(element)) {
                //console.log('Found ' + element + ' in shine');
            } else {
                missingShine.push(element);
                console.log('\x1b[31m -> ' + element + ' does not have a working shine! \x1b[0m');
            }
        }

    });

    fileArray.forEach(file => {
        if (file != undefined) {
            if (!gfx.includes(file)) {
                var name = 'GFX_' + file.split('/')[file.split('/').length - 1].split('.')[0].toUpperCase();
                if (!gfx.includes(name)) {
                    missingGoal.push(file);
                    console.log('\x1b[31m -> ' + file + ' does not have a working icon! \x1b[0m');
                }

            }
        }
    });
    

    if (missingShine.length == 0) {
        console.log('\x1b[32mAll shines are working!\x1b[0m');
    }
    if (missingGoal.length == 0) {
        console.log('\x1b[32mAll icons in gfx are working!\x1b[0m');
    }
    if (missingGoal.length == 0 && missingShine.length == 0) {
        //Enter key to go back to menu
        console.log('Press any key to go back to the main menu...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', function(key) {
            process.stdin.removeAllListeners('data');
            startMenu();
        });
    } else {
        console.log('Options will be displayed in 3s')
        setTimeout(() => {
            underMenuFix(missingGoal, missingShine,'Shines Missing or not working: ' + missingShine.length, 'Icons found without SpriteType in goals.gfx: ' + missingGoal.length);
        }, 3000);
    }

}

var underMenuItem = 1;
function underMenuFix(missingGoal, missingShine, msg1,msg2) {
    clearConsole();

    console.log(msg1);
    console.log(msg2);

    console.log('\x1b[35m---=< Available Options >=---');
    console.log('\x1b[0m');
    if (underMenuItem == 1) console.log('\x1b[45m' + '1. Create shines for missing icons - fixes missing shines')
    else console.log('\x1b[0m' + '1. Create shines for missing icons')

    if (underMenuItem == 2) console.log('\x1b[45m' + '2. Create goals.gfx and shine for all icons that currently don\'t have one - icons will be added to goals.gfx and shine')
    else console.log('\x1b[0m' + '2. Create goals.gfx and shine for all icons that currently don\'t have one')

    if (underMenuItem == 3) console.log('\x1b[45m' + '3. Exit to menu')
    else console.log('\x1b[0m' + '3. Exit to menu')

    console.log('\x1b[0m');
    console.log('\n\n Use the arrow keys to navigate and press enter to select an option!');
    console.log('\x1b[0m');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', function(key) {
        //Arrow up
        if (key === '\u001B\u005B\u0041') {
            if (underMenuItem > 1) underMenuItem--;
            //Kill old event listener
            process.stdin.removeAllListeners('data');
            underMenuFix(missingGoal, missingShine, msg1,msg2)
        }
        //Arrow down
        if (key === '\u001B\u005B\u0042') {
            if (underMenuItem < 3) underMenuItem++;
            //Kill old event listener
            process.stdin.removeAllListeners('data');

            underMenuFix(missingGoal, missingShine, msg1,msg2)
        }

        //Enter
        if (key === '\u000D') {
            //Kill old event listener
            process.stdin.removeAllListeners('data');
            switch (underMenuItem) {
                case 1:
                    clearConsole();
                    console.log('Creating shines for missing icons...');
                    console.log('\x1b[31mApp will automatically return to the menu when done!\x1b[0m')
                    setTimeout(() => {
                        missingShine.forEach(element => {
                            generateShine(element);
                        });
                    }, 3000);
                    setTimeout(() => {
                        startMenu();
                    }, 10000);
                    break;
                case 2:
                    clearConsole();
                    console.log('Creating icons...');
                    console.log('\x1b[31mApp will automatically return to the menu when done!\x1b[0m')
                    setTimeout(() => {
                        missingGoal.forEach(element => {
                            generateGoal(element);
                        });
                    }, 3000);
                    setTimeout(() => {
                        startMenu();
                    }, 10000);
                    break;
                case 3:
                    startMenu();
                    break;
            }
        }
    });
}

async function autoGenerate() {
    clearConsole();
    console.log("\x1b[33m" + 'Starting listener...');
    startListener();
    console.log("\x1b[32m" + 'Listener started! Waiting for new icons to be imported');
    console.log("\x1b[0m")
    console.log('Press any key to stop the listener and return to the main menu!');
    console.log('Imported icons will be automatically added to goals.gfx and shine!');
    console.log("\x1b[31m" + 'The name of the icon will be the same as the file name just with GFX_ in front of it! - Rename your icons before importing them. Duplicated icons will be skipped and not added! Deleting icons will not remove them from goals.gfx or goals_shine.gfx. You manually have todo that.');
    console.log("\x1b[0m")

    mode = "auto";

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', function(key) {
        process.stdin.removeAllListeners('data');
        stopListener();
        startMenu();
    });
}

async function manuallyGenerate() {
    stopListener();
    clearConsole();
    console.log("\x1b[33m" + 'Starting listener...');
    startListener();
    console.log("\x1b[32m" + 'Listener started! Waiting for new icons to be imported');
    console.log("\x1b[0m")
    console.log('Press any key to stop the listener and return to the main menu!');
    console.log('You can set the icon name manually.');
    console.log("\x1b[31m" + 'Duplicated icons will be skipped and not added! Deleting icons will not remove them from goals.gfx or goals_shine.gfx. You manually have todo that.\n\nYou can only import one icon at a time!');
    console.log("\x1b[0m")

    mode = "manual";

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', function(key) {
        if (!inputMode) {
            process.stdin.removeAllListeners('data');
            stopListener();
            startMenu();
        }

    });
}

async function generateShine(path) {
    //Fetch data from goals.gfx
    var goalsData = fs.readFileSync(goalPath, 'utf8');
    //Filter data to find the lines for the path
    if (!goalsData.includes(path)) {
        console.log('Could not find path in goals.gfx - ERROR SHINE NOT CREATED!');
    }

    let goal1 = goalsData.split('= {');
    let goal2 = [];
    var GoalName = '';
    goal1.forEach(element => {
        goal2.push(element.split('}')[0]);
    });
    goal2.forEach(element => {
        if (element.includes(path)) {
            GoalName = element.split('name = "')[1].split('"')[0]
        }
    });

    var shineData = fs.readFileSync(shinePath, 'utf8');
    if (shineData.includes(GoalName) && shineData.includes(path)) {
        console.log('Shine already exists! returning to menu');
        return setTimeout(() => {
            startMenu();
        }, 2000);
    }

    let newShine = `
    SpriteType = {
        name = "${GoalName}_shine"
        texturefile = "${path}"
        effectFile = "gfx/FX/buttonstate.lua"
        animation = {
            animationmaskfile = "${path}"
            animationtexturefile = "gfx/interface/goals/shine_overlay.dds" 
            animationrotation = -90.0		
            animationlooping = no			
            animationtime = 0.75			
            animationdelay = 0			
            animationblendmode = "add"       
            animationtype = "scrolling"     
            animationrotationoffset = { x = 0.0 y = 0.0 }
            animationtexturescale = { x = 1.0 y = 1.0 } 
        }

        animation = {
            animationmaskfile = "${path}"
            animationtexturefile = "gfx/interface/goals/shine_overlay.dds"
            animationrotation = 90.0		
            animationlooping = no			
            animationtime = 0.75				
            animationdelay = 0			
            animationblendmode = "add"     
            animationtype = "scrolling"      
            animationrotationoffset = { x = 0.0 y = 0.0 }
            animationtexturescale = { x = 1.0 y = 1.0 } 
        }
        legacy_lazy_load = no
    }
    `;	

    //Remove last } from shineData
    const lastBraceIndex = shineData.lastIndexOf('}');
  
    // Remove the last closing brace
    const modifiedContent = shineData.slice(0, lastBraceIndex) + shineData.slice(lastBraceIndex + 1);
  
    
    var newShineData = modifiedContent;
    //Add new shine to shineData
    newShineData += newShine;
    //Add last } to shineData
    newShineData += '\n}';
    //Write new shine to file
        
   fs.writeFileSync(shinePath, newShineData);

    console.log('\x1b[32m[+] Shine created for ' + GoalName + '!\x1b[0m');
}
function generateGoal(path, customName) {
    var name = 'GFX_' + path.split('/')[path.split('/').length - 1].split('.')[0].toUpperCase();
    if (customName) name = 'GFX_' +  customName
    var goalsData = fs.readFileSync(goalPath, 'utf8');
    if (goalsData.includes(name)) return console.log("\x1b[31m" + '[!]Could not create Goal! Goal or shine with that name already exists.' + "\x1b[0m");
    var string = `
    SpriteType = {
		name = "${name}"
		texturefile = "${path}"
	}
    `;
    const lastBraceIndex = goalsData.lastIndexOf('}');
  
    // Remove the last closing brace
    const modifiedContent = goalsData.slice(0, lastBraceIndex) + goalsData.slice(lastBraceIndex + 1);
  
    
    var newGoalData = modifiedContent;
    newGoalData += string;
    newGoalData += '\n}';
        
   fs.writeFileSync(goalPath, newGoalData);

    console.log('\x1b[32m[+] Focus icon created for ' + name + '!\x1b[0m');
    console.log('To use the icon in a focus add this to the Focus: icon = ' + name + '');
    generateShine(path);
}

function clearConsole() {
    console.clear()
}

run()
