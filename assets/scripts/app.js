const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'STRONG_PLAYER_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


function getMaxLifeValues(){
    const enteredValue = prompt('Maximum life for you and the monster', '100');
    let parsedValue = parseInt(enteredValue);
if (isNaN(parsedValue) || parsedValue <= 0) {
    throw {message: 'Invalid user input not a number'};
    //chosenMaxLife = 100;
}
return parsedValue;
}

let chosenMaxLife = getMaxLifeValues()
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife; // not a global value bc we will allow the user to set this value
let hasBonusLife = true;  // holds a boolean value
let battleLog = [];
let lastLoggedEntry;


adjustHealthBars(chosenMaxLife);

// writeToLog funct using a switch instead of an if statement
// function writeToLog(ev, val, monsterHealth, playerHealth) {
//     let logEntry = {
//         event: ev, // assigning value to key value pairs
//         value: val,
//         finalMonsterHealth: monsterHealth,
//         finalPlayerHealth: playerHealth
//     };

//     switch (ev) {
//         case LOG_EVENT_PLAYER_ATTACK:
//             logEntry.target = 'MONSTER';
//             break;
//         case LOG_EVENT_PLAYER_STRONG_ATTACK:
//             logEntry = {
//                 event: ev, // assigning value to key value pairs
//                 value: val,
//                 target: 'MONSTER',
//                 finalMonsterHealth: monsterHealth,
//                 finalPlayerHealth: playerHealth
//             };
//             break;
//         case LOG_EVENT_MONSTER_ATTACK:
//             logEntry = {
//                 event: ev, // assigning value to key value pairs
//                 value: val,
//                 target: 'PLAYER',
//                 finalMonsterHealth: monsterHealth,
//                 finalPlayerHealth: playerHealth
//             };
//             break;
//         case LOG_EVENT_PLAYER_HEAL:
//             logEntry = {
//                 event: ev, // assigning value to key value pairs
//                 value: val,
//                 target: 'PLAYER',
//                 finalMonsterHealth: monsterHealth,
//                 finalPlayerHealth: playerHealth
//             };
//             break;
//         case LOG_EVENT_GAME_OVER:
//             logEntry = {
//                 event: ev, // assigning value to key value pairs
//                 value: val,
//                 finalMonsterHealth: monsterHealth,
//                 finalPlayerHealth: playerHealth
//             };
//             break;
//         default: logEntry = {};  // default is added in case no case is met.
            

//     }

//     battleLog.push(logEntry);
// }

// writeToLog funct using an if statement
function writeToLog(ev, val, monsterHealth, playerHealth){
let logEntry = {
    event: ev, // assigning value to key value pairs
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
};
     if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';  // assigning a new key value to logEntry

    } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev, // assigning value to key value pairs
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: ev, // assigning value to key value pairs
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev, // assigning value to key value pairs
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
        } else if (ev === LOG_EVENT_GAME_OVER) {
            logEntry = {
                event: ev, // assigning value to key value pairs
                value: val,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
        }
        battleLog.push(logEntry);

    }

    function reset() {
        currrentMonsterHealth = chosenMaxLife;
        currentPlayerHealth = chosenMaxLife;
        resetGame(chosenMaxLife);
    }

    function endRound() {
        const initialPlayerHealth = currentPlayerHealth;
        const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
        currentPlayerHealth -= playerDamage;
        writeToLog(LOG_EVENT_MONSTER_ATTACK,
            playerDamage,
            currentMonsterHealth,
            currentPlayerHealth);

        if (currentPlayerHealth <= 0 && hasBonusLife) {
            hasBonusLife = false;
            removeBonusLife();
            currentPlayerHealth = initialPlayerHealth;
            setPlayerHealth(initialPlayerHealth);
            alert('you would be dead but the bonus life saved you!');
        }
        if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
            alert('You won!');
            writeToLog(LOG_EVENT_GAME_OVER,
                'PLAYER WON',
                currentMonsterHealth,
                currentPlayerHealth);
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
            alert('You lost!')
            writeToLog(LOG_EVENT_GAME_OVER,
                'PLAYER LOST',
                currentMonsterHealth,
                currentPlayerHealth);
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
            alert('You have a draw!');
            writeToLog(LOG_EVENT_GAME_OVER,
                'A DRAW, NO ONE WON',
                currentMonsterHealth,
                currentPlayerHealth);
        }

        if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
            reset();
        }
    }

    function attackMonster(mode) {
        const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
        const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
        // if (mode === MODE_ATTACK) {
        //     maxDamage = ATTACK_VALUE;
        //     logEvent = LOG_EVENT_PLAYER_ATTACK;
        // } else if (mode === MODE_STRONG_ATTACK) {
        //     maxDamage = STRONG_ATTACK_VALUE;
        //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
        // }
        const damage = dealMonsterDamage(maxDamage);
        currentMonsterHealth -= damage;

        writeToLog(logEvent,
            damage,
            currentMonsterHealth,
            currentPlayerHealth);


        endRound();
    }


    function attackHandler() {    /// handler or onAttack to indicate that somene has clicked
        attackMonster('ATTACK');
        // const damage = dealMonsterDamage (ATTACK_VALUE);
        // currentMonsterHealth -= damage;
        // const playerDamage = dealPlayerDamage (MONSTER_ATTACK_VALUE);
        // currentPlayerHealth-= playerDamage;
        // if (currentMonsterHealth <=0 && currentPlayerHealth >0){
        // alert ('You won!');
        // } else if (currentPlayerHealth <=0 && currentMonsterHealth >0) {
        // alert ('You lost!')
        // } else if (currentPlayerHealth <=0 && currentMonsterHealth <=0) {
        // alert ('You have a draw!')
        // }
    }

    function strongAttackHandler() {
        attackMonster('STRONG_ATTACK');
        // const damage = dealMonsterDamage (STRONG_ATTACK_VALUE);
        // currentMonsterHealth -= damage;
        // const playerDamage = dealPlayerDamage (MONSTER_ATTACK_VALUE);
        // currentPlayerHealth-= playerDamage;
        // if (currentMonsterHealth <=0 && currentPlayerHealth >0){
        // alert ('You won!');
        // } else if (currentPlayerHealth <=0 && currentMonsterHealth >0) {
        // alert ('You lost!')
        // } else if (currentPlayerHealth <=0 && currentMonsterHealth <=0) {
        // alert ('You have a draw!')
        // }
    }

    function healPlayerHandler() {
        let healValue;
        if (currentPlayerHealth >= chosenMaxLife + HEAL_VALUE) {
            alert('You can\'t heal more than your max intitial health.');
            healValue = chosenMaxLife - currentPlayerHealth;
        }
        else {
            healValue = HEAL_VALUE;
        }
        increasePlayerHealth(healValue);
        currentPlayerHealth += healValue;
        writeToLog(LOG_EVENT_PLAYER_HEAL,
            healValue,
            currentMonsterHealth,
            currentPlayerHealth);
        endRound();
    };

    function printLogHandler() {  
        
      for (let i = 0; i<battleLog.length; i++){  
     console.log(battleLog[i]);
     }

  let j = 0;
  outerWhile: do {
    console.log ('outer', j);
    innerFor: for (let k = 0; k<5; k++){ 
     if (k ===3){
        break outerWhile;
       //continue outerWhile;  // will create an infinite loop ; careful with continue
     }   
        console.log('inner' , k)
    }
    j++;
 } while (j <3);
   
//  using a for of loop the disadvantage to this approach is that you don't get the index number
let i = 0;

    for (const logEntry of battleLog){ 
        if (!lastLoggedEntry && lastLoggedEntry !==0 || lastLoggedEntry < i){
            console.log(`#${i}`);
            for (const key in logEntry){  /// for in loop for an object variable
                console.log(`${key} => ${logEntry[key]}`);    
        } 
        lastLoggedEntry = i;
        break;
     };
     i++;
     
    }
   
}

    attackBtn.addEventListener('click', attackHandler)
    strongAttackBtn.addEventListener('click', strongAttackHandler);
    healBtn.addEventListener('click', healPlayerHandler);
    logBtn.addEventListener('click', printLogHandler);