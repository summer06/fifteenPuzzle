window.onload = function() {
    createPuzzle();
    choosePuzzle();
    startGame();
}

// puzzleSquence 用来记录当前拼图的状态，每个元素代表一块拼图元素，0代表白格
var puzzleSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
var whiteElementPos = 15;

// 动态创建拼图，并初始化为panda背景
function createPuzzle() {
    var box = document.createDocumentFragment();
    var mark = 1;
    for (var i = 1; i <= 4; i++) {
        for (var j = 1; j <= 4; j++) {
            var element = document.createElement("div");
            var classes = "element" +" panda" + " top" + i + " left" + j;
            element.setAttribute("class", classes);
            element.setAttribute("id", "element" + mark);
            if (mark == 16) {
                element.setAttribute("value", "0");
            } else {
                element.setAttribute("value", mark);
            }
            mark++;
            box.appendChild(element);
        }
    }
    document.getElementById("puzzle-area").appendChild(box);
}

// 点击拼图图片选项区的元素可以改变拼图背景
function choosePuzzle() {
    var choice = document.getElementsByClassName("choice");
    for (var i = 0; i < choice.length; i++) {
        choice[i].addEventListener("click", changePuzzle);
    }
}

// 改变拼图背景
function changePuzzle() {
    // 先恢复拼图的初始状态
    whiteElementPos = 15;
    var temp;
    for (temp = 0; temp < 15; temp++) {
        puzzleSequence[temp] = temp + 1;
    }
    puzzleSequence[temp] = 0;
    var puzzleElements = document.getElementsByClassName("element");
    // 为每一个元素换掉对应的class，以此实现改变拼图背景
    var count = 0;
    for (var i = 1; i <= 4; i++) {
        for (var j = 1; j <= 4; j++) {
            var a = puzzleElements[count].classList[1];
            var b = puzzleElements[count].classList[2];
            var c = puzzleElements[count].classList[3];
            puzzleElements[count].classList.remove(a);
            puzzleElements[count].classList.remove(b);
            puzzleElements[count].classList.remove(c);
            puzzleElements[count].classList.add(this.id);
            puzzleElements[count].classList.add("top" + i);
            puzzleElements[count].classList.add("left" + j);
            count++;
        }
    }
    var modle = document.getElementById("picture-reference");
    modle.removeAttribute("class");
    modle.setAttribute("class", this.id);
    // 改变拼图背景之后更新按钮为Start
    document.getElementById("start").innerHTML = "Start";   
}

// 开始按钮触发的事件以及按钮状态的改变
function startGame() {
    var start = document.getElementById("start");
    var puzzleElements = document.getElementsByClassName("element");
    var result = document.getElementById("result");
    start.addEventListener("click", function() {
        if (result.innerHTML == "You Win") {
            result.innerHTML = "";
        }
        if (start.innerHTML == "Start") {
            start.innerHTML = "Play Again"
            for (var i = 0; i < puzzleElements.length; i++) {
                puzzleElements[i].addEventListener("click", move);
            }
            reArrangePuzzle(puzzleElements);
        } else if (start.innerHTML == "Play Again") {
            reArrangePuzzle(puzzleElements);
        }
    });
    
}

// 移动拼图元素函数
function move() {
    var whitePuzzle = document.getElementById("element16");
    var puzzleNumber = this.getAttribute("value");
    var puzzleNumberInTheSequence;
    for (var i = 0; i < puzzleSequence.length; i++) {
        if (puzzleSequence[i] == parseInt(puzzleNumber)) {
            puzzleNumberInTheSequence = i;
            break;
        }
    } 
    //对被点击元素作判断，如果是可以移动的，就和白块对换位置
    var judgeResult = judge(puzzleNumberInTheSequence);
    if (judgeResult == true) {
        var thisTop = this.classList[2];
        var thisLeft = this.classList[3];
        this.classList.remove(thisTop);
        this.classList.remove(thisLeft);
        var whiteTop = whitePuzzle.classList[2];
        var whiteLeft = whitePuzzle.classList[3];
        this.classList.add(whiteTop);
        this.classList.add(whiteLeft);
        whitePuzzle.classList.remove(whiteTop);
        whitePuzzle.classList.remove(whiteLeft);
        whitePuzzle.classList.add(thisTop);
        whitePuzzle.classList.add(thisLeft);
        puzzleSequence[whiteElementPos] = parseInt(puzzleNumber);
        puzzleSequence[puzzleNumberInTheSequence] = 0;
        whiteElementPos = puzzleNumberInTheSequence;
    }
    // 每次移动判断当前拼图状态，如果判断为true，则显示“You Win”字样
    if (ifWin()) {
        document.getElementById("result").innerHTML = "You Win";
    }
}

// 判断拼图状态是否恢复为初始状态
function ifWin() {
    for (var i = 0; i < puzzleSequence.length - 1; i++) {
        if (puzzleSequence[i] != i + 1) {
            return false;
        }
    } return true;
}

// 判断当前位置旁边是否有可以用以交换的白块，有则返回true，否则false
function judge(pos) {
    if (whiteElementPos % 4 == 3) {
        if (whiteElementPos - 1 == pos || whiteElementPos + 4 == pos 
            || whiteElementPos - 4 == pos) {
            return true;
        }
    } else if (whiteElementPos % 4 == 0) {
        if (whiteElementPos - 4 == pos || whiteElementPos + 1 == pos 
            || whiteElementPos + 4 == pos) {
            return true;
        }
    } else {
        if (whiteElementPos - 4 == pos || whiteElementPos + 4 == pos 
            || whiteElementPos - 1 == pos || whiteElementPos + 1 == pos) {
            return true;
        } 
    }
    return false;
}

// 重新排列拼图
function reArrangePuzzle(puzzleElements) {
    // 先使板块恢复初始状态
    whiteElementPos = 15;
    var temp;
    for (temp = 0; temp < 15; temp++) {
        puzzleSequence[temp] = temp + 1;
    }
    puzzleSequence[temp] = 0;
    var count = 0;
    for (var i = 1; i <= 4; i++) {
        for (var j = 1; j <= 4; j++) {
            var b = puzzleElements[count].classList[2];
            var c = puzzleElements[count].classList[3];
            puzzleElements[count].classList.remove(b);
            puzzleElements[count].classList.remove(c);
            puzzleElements[count].classList.add("top" + i);
            puzzleElements[count].classList.add("left" + j);
            count++;
        }
    }

    //利用三轮换打乱算法打乱拼图
    //三轮换算法原理是逆序数的奇偶性，任取三个位置进行轮换，可保证拼图的可还原性 
    for (var i = 0; i < 25; i++) {
        var a = Math.floor(Math.random()*15);
        var b = Math.floor(Math.random()*15);
        var c = Math.floor(Math.random()*15);
        while (b == a) {
            b = Math.floor(Math.random()*15);
        }
        while (c == a || c == b) {
            c = Math.floor(Math.random()*15);
        }
        var temp = puzzleSequence[a];
        puzzleSequence[a] = puzzleSequence[b];
        puzzleSequence[b] = puzzleSequence[c];
        puzzleSequence[c] = temp;
    }

    var count = 0;
    for (var j = 1; j <= 4; j++) {
        for (var k = 1; k <= 4; k++) {
            for (var n = 0; n < puzzleElements.length; n++) {
                if (puzzleElements[n].getAttribute("value") 
                    == puzzleSequence[count].toString()) {
                    var class1 = puzzleElements[n].classList[2];
                    var class2 = puzzleElements[n].classList[3];
                    puzzleElements[n].classList.remove(class1);
                    puzzleElements[n].classList.remove(class2);
                    puzzleElements[n].classList.add("top" + j);
                    puzzleElements[n].classList.add("left" + k);
                    count++;
                    break;
                }
            }
        }
    }
}