const squares = document.querySelectorAll('.square');
const startButton = document.getElementById('startButton');
const startButtonREV = document.getElementById('startButtonREV');
const levelInput = document.getElementById('levelInput');
const sounds = document.getElementById('beep');
// const originalColor = squares.style.backgroundColor;
let sequence = [];
let playerSequence = [];
let level = 2;
let currentLevelRepeats = -1; // 記錄當前 level 重複次數
const maxRepeats = 3; // 每個 level 的最大重複次數
let extra = 0;
let canClick = false;
let REVERSE = false;

// 函数：将方块变为随机颜色
function changeSquareColor(square) {
    square.style.backgroundColor = 'rgb(00,227,227)';
}
function changeSquareColorNormal(square) {
    square.style.backgroundColor = 'gray';
}




// 檢查方塊是否重疊
function isOverlapping(square, otherSquare) {
    const rect1 = square.getBoundingClientRect();
    const rect2 = otherSquare.getBoundingClientRect();
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// 設置方塊隨機位置並避免重疊
function setRandomPosition(square) {
    const gameBoard = document.getElementById('gameBoard');
    const boardWidth = gameBoard.clientWidth - 100; // 減去方塊的寬度，避免超出邊界
    const boardHeight = gameBoard.clientHeight - 100; // 減去方塊的高度，避免超出邊界

    let randomLeft, randomTop, overlapping;

    do {
        randomLeft = Math.random() * boardWidth;
        randomTop = Math.random() * boardHeight;
        square.style.left = `${randomLeft}px`;
        square.style.top = `${randomTop}px`;

        overlapping = false;
        // 檢查這個方塊與已定位的其他方塊是否重疊
        squares.forEach(otherSquare => {
            if (square !== otherSquare && isOverlapping(square, otherSquare)) {
                overlapping = true;
            }
        });
    } while (overlapping); // 如果重疊，則重新生成位置
}

// 新增重置按鈕功能
const resetInputButton = document.getElementById('resetInputButton');
resetInputButton.addEventListener('click', () => {
    playerSequence = []; // 清空玩家的輸入
    canClick = true;     // 允許重新輸入
});

// 初始化時設置每個方塊的隨機位置
function randomizeSquaresPosition() {
    squares.forEach(square => {
        setRandomPosition(square);
    });
}

// 閃爍方塊
function flashSquare(square) {
    // square.classList.add('active');
    // setTimeout(() => {
    //     square.classList.remove('active');
    // }, 1000);
    square.style.backgroundColor = 'yellow';
    setTimeout(() => {
        square.style.backgroundColor = 'grey';
    }, 1000);
}
function flashSquareShort(square) {
    square.classList.add('active');
    setTimeout(() => {
        square.classList.remove('active');
    }, 200);
}

// 播放亮燈順序
function playSequence() {
    let i = 0;
    canClick = false;
    // alert(sequence);
    const interval = setInterval(() => {
        flashSquare(squares[sequence[i]]);
        i++;
        if (i >= sequence.length) {
            if (REVERSE){
                sequence.reverse();
            }
            if(level+1===7){
                extra = level * 150
            }
            clearInterval(interval);
            setTimeout(() => {
                sounds.play();
                squares.forEach(square => {
                    changeSquareColorNormal(square); // 變回灰色
                });
                canClick = true; // 所有亮燈播放完畢後才允許點擊
            }, 1500+extra);
        }
    }, 1800); // 每個亮燈間隔 1.8 秒
}

// 產生新順序
function newSequence() {
    const numLights = Math.min(level + 1, 9); // 確保不超過方塊數量
    let A = -1;
    let B = -1;
    let C = -1;
    while (sequence.length < numLights) {
        const randomIndex = Math.floor(Math.random()*12);
        if (randomIndex !== A && randomIndex !== B && randomIndex !== C){
            sequence.push(randomIndex);
            C = B
            B = A;
            A = randomIndex;
        }
        
    }
    // alert(sequence);
}

// 檢查玩家的輸入
// function checkPlayerInput(index) {
//     if (playerSequence[index] !== sequence[index]) {
//         // alert('遊戲結束！');
//         // resetGame();
//         const statusCell = document.getElementById((level + 1)+'level'+(currentLevelRepeats+1)+'Status');
//         statusCell.textContent = 'X';
//         alert('順序錯誤:(');
//         nextLevel();
//     } else if (playerSequence.length === sequence.length) {
//         // const statusCell = document.getElementById('${level + 1}level${currentLevelRepeats + 1}Status');
//         const statusCell = document.getElementById((level + 1)+'level'+(currentLevelRepeats+1)+'Status');
//         statusCell.textContent = 'O';
//         // alert('level通過這一關！進入下一關！level'+level);
//         alert('順序正確:)');
//         nextLevel();
//     }
// }
function checkPlayerInput() {
    let isCorrect = true;
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
            isCorrect = false;
            break;
        }
    }

    const statusCell = document.getElementById((level + 1) + 'level' + (currentLevelRepeats + 1) + 'Status');
    if (isCorrect) {
        statusCell.textContent = 'O';
        // alert('順序正確:)');
    } else {
        statusCell.textContent = 'X';
        // alert('順序錯誤:(');
    }
    
    nextLevel(); // 無論正確與否，進入下一關
}

// 玩家點擊方塊
squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        if (!canClick) return; // 只有當允許點擊時才響應
        flashSquareShort(square); // 點擊後讓方塊閃爍
        playerSequence.push(index);
        // checkPlayerInput(playerSequence.length - 1);
    });
});

const confirmButton = document.getElementById('confirmButton');
confirmButton.addEventListener('click', () => {
    if (playerSequence.length === sequence.length) {
        checkPlayerInput(); // 只有玩家輸入完畢後才檢查答案
    } else {
        // alert('尚未完成輸入！');
        const statusCell = document.getElementById((level + 1) + 'level' + (currentLevelRepeats + 1) + 'Status');
        statusCell.textContent = 'X';
        nextLevel(); // 無論正確與否，進入下一關
    }
});


// 開始下一關
// function nextLevel() {
//     level++;
//     playerSequence = [];
//     sequence = []
//     newSequence();
//     playSequence();
// }
function nextLevel() {
    currentLevelRepeats++;
    playerSequence = []; // 清空玩家的輸入
    sequence = []
    squares.forEach(square => {
        changeSquareColorNormal(square); // 随机改变每个方块的颜色
    });
    if (currentLevelRepeats < maxRepeats) {
        playerSequence = []; // 清空玩家的輸入
        sequence = []
        newSequence(); // 生成新序列
        startButton.disabled = true;
        startButtonREV.disabled = true;
        playSequence(); // 播放新序列
        startButton.disabled = false;
        startButtonREV.disabled = false;
    } else {
        level++; // 進入下一個 level
        if (level === 9){
            alert('完成測驗!!!')
        } else {
            randomizeSquaresPosition();
            currentLevelRepeats = 0; // 重置當前 level 重複次數
            playerSequence = []; // 清空玩家的輸入
            sequence = []
            newSequence(); // 生成新序列
            startButton.disabled = true;
            startButtonREV.disabled = true;
            playSequence(); // 播放新序列
            startButton.disabled = false;
            startButtonREV.disabled = false;
        }
        
    }
}

// 重置遊戲
function resetGame() {
    for(let l = 4; l <= 9; l++){
        for(let s = 1; s < 4; s++){
            const statusCell = document.getElementById(l+'level'+s+'Status');
            statusCell.textContent = ' ';
        }
    }
    sequence = [];
    playerSequence = [];
    level = 2;
    currentLevelRepeats = -1;
    canClick = false;
}

// 開始遊戲按鈕
startButton.addEventListener('click', () => {
    resetGame();
    randomizeSquaresPosition(); // 每次開始時隨機定位方塊
    REVERSE = false;
    // resetGame2();
    nextLevel();
})

startButtonREV.addEventListener('click', () => {
    resetGame();
    randomizeSquaresPosition(); // 每次開始時隨機定位方塊
    REVERSE = true;
    nextLevel();
});
