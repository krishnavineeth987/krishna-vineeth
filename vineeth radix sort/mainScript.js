const c0 = document.getElementById("can0");
const ctx = c0.getContext("2d");
ctx.font = '20px sans-serif';
ctx.textAlign = "center";

/* Canvas specs */
const width = c0.width;
const height = c0.height;
let border;

let algoInd = 4;
let onOff = false;
let indexLogger = 1;
let frameSaveArray = [];
let isSortingComplete = false;

let smoothAnimationFrameSaver = []; // OBS only for MergeSort and RadixSort

let randNum = () => ~~(Math.random() * 400) + 30;
function generateArr(count) { for(let i = 0; i < count; i++) stapleArr.push(randNum()); }

function frameDuoColorChanger(arr, indexOne, indexTwo, stapleColor, strawBool = false) {
  let frame = [];
  if(isRainbowModeOn) {
    for(let i = 0; i < arr.length; i++) { frame.push([arr[i], frameSaveArray[frameSaveArray.length - 1][i][1], (i == indexOne || i == indexTwo ? strawBool : false)]); }
  } else { 
    for(let i = 0; i < arr.length; i++) frame.push([arr[i], (sortedAlready.includes(i) ? "#00cc00" : "#0000ff"), strawBool]);
    frame[indexOne][1] = stapleColor;
    frame[indexTwo][1] = stapleColor;
  }
  return frame;
}

/* Staple specs*/
let stapleArr = [];
let sortedAlready = []; // OBS only for Bubble, Quick and HeapSort
let staplePerimeter = 2 * (8 - 4) * (8 - 4 + (4 == 7 ? 2 : 1));
let stapleWidth = ~~(staplePerimeter * .8);
let isStapleWideEnoughForNumberDisplay = 30 < stapleWidth;
let stapleMidForText = border + ~~(stapleWidth / 2);
let isRainbowModeOn = false;  // rainbow-mode
let comparisonIndicator = []; // rainbow-mode
let cIIndexSaver        = []; // rainbow-mode

function createArrayAndDrawIt(exp) {
  ctx.font = (exp < 4 ? 20 : 14) + 'px sans-serif';
  indexLogger = 1;
  isSortingComplete = false;

  frameSaveArray = [];
  stapleArr = [];

  sortedAlready = [];

  staplePerimeter = 2 * (8 - exp) * (8 - exp + (exp == 7 ? 2 : 1));
  stapleWidth = ~~(staplePerimeter * .8);
  isStapleWideEnoughForNumberDisplay = 30 < stapleWidth;
  generateArr(1 << exp);

  border = (width - staplePerimeter * stapleArr.length) >> 1;
  stapleMidForText = border + (stapleWidth >> 1);

  if(isRainbowModeOn) frameSaveArray.push(generateArrForRainbow(stapleArr, ~~(360 / (1 << exp))));
  else frameSaveArray.push(frameDuoColorChanger(stapleArr, 0, 0, "#0000ff"));
  draw(frameSaveArray[0], 0);

  smoothAnimationFrameSaver = [];

  let comparisonIndicator = [];
  let cIIndexSaver        = [];
}
createArrayAndDrawIt(4);

function arraySizeSilder(value) {
  if(!onOff) createArrayAndDrawIt(value);
  else alertToPause();
}

function alertToPause() {
  document.getElementsByClassName("btn")[0].className += " pulse";
  setTimeout(function () { document.getElementsByClassName("btn")[0].className = "btn"; }, 600);
}

function radixSort(arr) {
  let max = Math.max(...arr);
  function foga(t, arr, j) { for(let a of t) for(let i = 0; i < a.length; i++) arr[j++] = a[i] };
  let digit = (num, pos) => ~~((num % (pos * 10)) / pos);

  for(let i = 1; i <= max; i*=10) { rSort(arr, i); }

  function rSort(arr, keyPos) {
    let bucket = [[], [], [], [], [], [], [], [], [], []];
    let bucketRainbow = [[], [], [], [], [], [], [], [], [], []]; // Bucket for rainbowMode
    frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#0000ff"));
    
    let prevFrame = frameSaveArray[frameSaveArray.length - 1];
    for(let i = 0; i < arr.length; i++) {
      bucket[digit(arr[i], keyPos)].push(arr[i]);

      if(isRainbowModeOn) rainbowBucket(bucketRainbow, arr[i], prevFrame[i][1], digit(arr[i], keyPos));
      frameSaveArray.push(frameDuoColorChanger(arr, i, i, "#ff0000", true));
    }
    frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#0000ff"));

    if(isRainbowModeOn) {
      smoothAnimationFrameSaver.push(frameSaveArray.length, [0, stapleArr.length - 1]);
      frameSaveArray.push(rainbowFoga(bucketRainbow, arr.length));
    } else smoothAnimationFrameSaver.push(frameSaveArray.length, [0, stapleArr.length - 1]);
    foga(bucket.slice(), arr, 0);
  }
  frameSaveArray.push(frameDuoColorChanger(stapleArr, 0, 0, "#0000ff"));
}

function switchPlayButton(isOn) {
  document.getElementById("playToggler").className = (isOn ? "fa fa-pause" : "fa fa-play");
}

function turnOnOff(isInvokedFromToggler) {
  if(isInvokedFromToggler && !isLastDrawOn) {
    if(frameSaveArray.length == 1) chooseAlogrithm(algoInd, stapleArr);
    onOff = !onOff;
    switchPlayButton(onOff);
  }
  function forLoop(i) {
    indexLogger = i;
    if(smoothAnimationFrameSaver.includes(i) && onOff) {
      let elem = smoothAnimationFrameSaver[smoothAnimationFrameSaver.indexOf(i) + 1];
      smoothAnimation(frameSaveArray[i], elem[0], elem[1]);
    }
    else if(i < frameSaveArray.length && onOff) {
      draw(frameSaveArray[i], i);
      setTimeout(forLoop, frameSpeed, i + 1);
    }
    else if(frameSaveArray.length == i) {
      isSortingComplete = (isSortingComplete ? true : algoInd == 3 || algoInd == 2);
      lastDraw(stapleArr);
      isSortingComplete = true;
    }
  }
  if(!isLastDrawOn) setTimeout(forLoop, frameSpeed, indexLogger);
}

let frameSpeed = 350;
function frameRateSilder(value) {
  if(value == 1) frameSpeed = 350;
  else if(value == 2) frameSpeed = 150;
  else if(value == 3) frameSpeed = 70;
  else frameSpeed = 15;
}

function draw(arr, ind) {
  ctx.clearRect(0, 0, width, height);
  let elem;
  for(let i = 0; i < stapleArr.length * staplePerimeter; i += staplePerimeter) {
    elem = arr[Math.round(i / staplePerimeter)];  // CAUTION THIS
    ctx.fillStyle = elem[1];
    ctx.fillRect(i + border, height - elem[0], stapleWidth, elem[0]);

    if(isRainbowModeOn && elem[2]) rainbowCompareSticks(arr, Math.round(i / staplePerimeter), Math.round(i / staplePerimeter));
  }
  if(isStapleWideEnoughForNumberDisplay) {
    for(let i = 0; i < stapleArr.length * staplePerimeter; i += staplePerimeter) {
      elem = arr[Math.round(i / staplePerimeter)];  // CAUTION THIS
      applyText(elem[0].toString(), i, height - elem[0], elem[1]);
    }
  }
}

function smoothAnimation(arr, i1, i2) {
  isLastDrawOn = true;
  function forLoop(i, index) {
    ctx.fillStyle = (isRainbowModeOn ? arr[index][1] : "#0000ff");
    ctx.clearRect(i + border, 0, staplePerimeter, height);
    ctx.fillRect(i + border, height - arr[index][0], stapleWidth, arr[index][0]);
    if(isStapleWideEnoughForNumberDisplay) applyText(arr[index][0].toString(), i, height - arr[index][0], "#0000ff");
    if(index < i2) setTimeout(forLoop, frameSpeed / 2, i + staplePerimeter, index + 1);
    else {
      isLastDrawOn = false;
      indexLogger++;
      setTimeout(turnOnOff, 0, false);
    }
  }
  setTimeout(forLoop, 0, i1 * staplePerimeter, i1);
}

function lastDraw(arr) {
  isLastDrawOn = true;
  ctx.fillStyle = "#00cc00";
  function forLoop(i) {
    let stapleSize = arr[i / staplePerimeter];
    ctx.clearRect(i + border, 0, staplePerimeter, height);
    ctx.fillRect(i + border, height - stapleSize, stapleWidth, stapleSize);
    if(isStapleWideEnoughForNumberDisplay) applyText(stapleSize.toString(), i, height - stapleSize, "#00cc00");
    if(i < (stapleArr.length - 1) * staplePerimeter) setTimeout(forLoop, frameSpeed / 5, i + staplePerimeter);
    else resetButton();
  }
  if((algoInd <= 1 || algoInd == 4) && !isRainbowModeOn) setTimeout(forLoop, frameSpeed / 5, 0);
  if(isSortingComplete || isRainbowModeOn) resetButton();
}

let isLastDrawOn = false;
function resetButton() {
  onOff = false;
  isLastDrawOn = false;
  switchPlayButton(onOff);
}

function applyText(num, xCord, yCord, afterColor) {
  ctx.fillStyle = "#fff";
  ctx.fillText(num, xCord + stapleMidForText, yCord + 25);
  ctx.fillStyle = afterColor;
}

let placeStaple = (returnArr, arr, s, ind) => (returnArr[ind] == undefined ? ind : placeStaple(returnArr, arr, s, arr.indexOf(s, ind + 1)));

function chooseAlogrithm(algoIndex, arr) {
  switch(algoIndex) {
    case 0:
      bubbleSort(arr);
    break;
    case 1:
      mergeSort(arr);
    break;
    case 2:
      quickSort(arr);
    break;
    case 3:
      heapSort(arr);
    break;
    case 4:
      radixSort(arr);
    break;
    default:
      console.log("ERROR!!!");
    break;
  }
}

function changeAlgorithm(chosenAlgoInd) {
  if(algoInd != chosenAlgoInd && !onOff) {
    algoInd = chosenAlgoInd;
    for(let i = 0; i < 5; i++) document.getElementsByClassName('order')[i].className = 'order' + (i == algoInd ? " active" : "");
    arraySizeSilder(~~Math.log2(stapleArr.length));
  } else if(algoInd != chosenAlgoInd) alertToPause();
}

function mergeSort(arr) {
  function mSort(arr, temp, leftStart, rightEnd) {
    if(leftStart < rightEnd) {
      let mid = (leftStart + rightEnd) >> 1;
      mSort(arr, temp, leftStart, mid);
      mSort(arr, temp, mid + 1, rightEnd);
      merge(arr, temp, leftStart, mid, rightEnd);
    }
  }

  function merge(arr, temp, left, mid, right) {
    let i = left;
    let j = mid + 1;
    let index = left;
    let frame;

    if(isRainbowModeOn) frame = rainbowMerge(arr.slice(), left, mid, right);
  
    while(i <= mid && j <= right) {
      frameSaveArray.push(frameDuoColorChanger(arr, i, j, "#ff0000", true));

      if(arr[i] < arr[j]) {
        temp[index] = arr[i];
        i++;
      } else {
        temp[index] = arr[j];
        j++;
      }
      index++;
    }
  
    if(mid < i) {
      temp.splice(index, right - index + 1, ...arr.slice(j, right + 1));
    } else {
      temp.splice(index, right - index + 1, ...arr.slice(i, mid + 1));
    }
    arr.splice(left, right - left + 1, ...temp.slice(left, right + 1));
    smoothAnimationFrameSaver.push(frameSaveArray.length, [left, right]);

    if(isRainbowModeOn) frameSaveArray.push(frame);
    else frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#0000ff", false));
  }

  mSort(arr, new Array(arr.length), 0, arr.length - 1);
  frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#0000ff", false));
}

function createPrevArray(len) {
  let prevFrame = frameSaveArray[frameSaveArray.length - 1];
  let frame = new Array(len);
  for(let i = 0; i < len; i++) frame[i] = [prevFrame[i][0], prevFrame[i][1], prevFrame[i][2]];

  return frame;
}

function quickSort(arr) {
  qSort(arr, 0, arr.length - 1);

  function qSort(arr, low, high) {
    if (low < high) {
      let pi = partition(arr, low, high);

      qSort(arr, low, pi - 1);
      qSort(arr, pi + 1, high);
    }
  }

  function partition(arr, low, high) {
    let pivot = arr[high];

    let i = low - 1;

    for (let j = low; j < high; j++) {
      frameSaveArray.push(frameDuoColorChanger(arr, j, high, "#ff0000", true));
      if (arr[j] <= pivot) {

        i++;

        [arr[i], arr[j]] = [arr[j], arr[i]];
        if(isRainbowModeOn) frameSaveArray.push(rainbowSwitchStaples(i, j));
        else frameSaveArray.push(frameDuoColorChanger(arr, i, j, "#cc00ff", false));
      }
    }
    [arr[high], arr[i + 1]] = [arr[i + 1], arr[high]];

    if(isRainbowModeOn) {
      frameSaveArray.push(rainbowSwitchStaples(i + 1, high));
    } else frameSaveArray.push(frameDuoColorChanger(arr, high, i + 1, "#cc00ff", false));

    sortedAlready.push(i + 1);
    if(i + 1 - low == 1) sortedAlready.push(low);
    if(i + 2 == high) sortedAlready.push(high);

    return i + 1;
  }
  frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#00cc00", false));
  if(isRainbowModeOn) rainbowSortStabilityCorrection();
  frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#00cc00", false));
}

function heapSort(arr) {
  let n = arr.length;

  for (let i = ~~(n / 2) - 1; i >= 0; i--) heapifyElement(arr, n, i);

  for (let i = n - 1; i >= 0; i--) {
    [arr[i], arr[0]] = [arr[0], arr[i]];
    if(isRainbowModeOn) frameSaveArray.push(rainbowSwitchWithoutLogic(i, 0));
    else frameSaveArray.push(frameDuoColorChanger(arr, 0, i, "#cc00ff", false));
    sortedAlready = [i, ...sortedAlready];

    heapifyElement(arr, i, 0);
  }

  function heapifyElement(arr, n, idx) {
    let largestIndex = idx;
    let l = 2 * idx + 1;
    let r = 2 * idx + 2;

    if (l < n && arr[largestIndex] < arr[l]) {
      frameSaveArray.push(frameDuoColorChanger(arr, l, largestIndex, "#ff0000", true));
      largestIndex = l;
    }

    if (r < n && arr[largestIndex] < arr[r]) {
      frameSaveArray.push(frameDuoColorChanger(arr, l, largestIndex, "#ff0000", true));
      largestIndex = r;
    }

    if (largestIndex != idx) {
      [arr[idx], arr[largestIndex]] = [arr[largestIndex], arr[idx]];
      if(isRainbowModeOn) frameSaveArray.push(rainbowSwitchWithoutLogic(idx, largestIndex));
      else frameSaveArray.push(frameDuoColorChanger(arr, l, largestIndex, "#cc00ff", false));

      heapifyElement(arr, n, largestIndex);
    }
  }
  frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#00cc00", false));
  if(isRainbowModeOn) rainbowSortStabilityCorrection();
  frameSaveArray.push(frameDuoColorChanger(arr, 0, 0, "#00cc00", false));
}

function bubbleSort(arr) {
  let unsortedLen = arr.length;
  let sorted = false;
  
  while(!sorted && 0 < unsortedLen--) {
    sorted = true;
    for(let i = 0; i < unsortedLen; i++) {
      frameSaveArray.push(frameDuoColorChanger(arr, i, i + 1, "#ff0000", true));
      if(arr[i + 1] < arr[i]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];

        if(isRainbowModeOn) frameSaveArray.push(rainbowSwitchWithoutLogic(i + 1, i));
        else frameSaveArray.push(frameDuoColorChanger(arr, i, i + 1, "#cc00ff", false));

        sorted = false;
      }
    }
    frameSaveArray.push(frameDuoColorChanger(arr, unsortedLen, unsortedLen, "#00cc00", false));
    sortedAlready.push(unsortedLen);
  }
}