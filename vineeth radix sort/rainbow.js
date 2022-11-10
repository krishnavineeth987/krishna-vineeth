function generateArrForRainbow(arr, hueIncrement) {
  let arrHolder = arr.slice();
  let returnArr = new Array(arr.length);
  arrHolder = arrHolder.sort((a, b) => a - b);

  let hue = 0;
  let len = arrHolder.length;
  for(let i = 0; i < len; i++) {
    let staple = arrHolder.slice(i, i + 1)[0];
    let ins = placeStaple(returnArr, arr, staple, arr.indexOf(staple));
    returnArr[ins] = [staple, ("hsl(" + hue + ", 80%, 50%)"), false];
    hue += (hueIncrement + i % 2);
  }

  return returnArr;
}

function toggleRainbow() { 
  if(!onOff) {
    isRainbowModeOn = !isRainbowModeOn;
    if(isRainbowModeOn) document.getElementById("rainbowSelectParagraph").style.background = "blue";
    else document.getElementById("rainbowSelectParagraph").style.background = "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)";
    arraySizeSilder(~~Math.log2(stapleArr.length));
  } else alertToPause();
}

function rainbowCompareSticks(arr, indexOne, indexTwo) {
  ctx.fillStyle = "#000";
  ctx.fillRect(indexOne * staplePerimeter + border + (stapleWidth >> 1) - 2, 0, 2, height - arr[indexOne][0]);
  ctx.fillRect(indexTwo * staplePerimeter + border + (stapleWidth >> 1) - 2, 0, 2, height - arr[indexTwo][0]);
}

function rainbowFoga(bucket, arrLen) {
  let index = 0;
  let frame = new Array(arrLen);

  for(let i = 0; i < bucket.length; i++) {
    for(let j = 0; j < bucket[i].length; j++) {
      frame[index++] = bucket[i][j];
    }
  }

  return frame;
}

function rainbowBucket(bucketRainbow, num, prevFrameNumColor, ind) {
  bucketRainbow[ind].push([num, prevFrameNumColor, false]);
}

function rainbowMerge(arr, left, mid, right) {
  let prevFrame = frameSaveArray[frameSaveArray.length - 1];
  let frame = createPrevArray(arr.length);

  let i = left;
  let j = mid + 1;
  let index = left;
  while(i <= mid && j <= right) {
    if(arr[i] < arr[j]) {
      frame[index] = [arr[i], prevFrame[i][1], false];
      i++;
    } else if(arr[i] > arr[j]) {
      frame[index] = [arr[j], prevFrame[j][1], false];
      j++;
    } else {
      let isGreater = parseInt(prevFrame[i][1].substring(4, 7)) < parseInt(prevFrame[j][1].substring(4, 7));
      frame[index] = [arr[j], (isGreater ? prevFrame[i][1] : prevFrame[j][1]), false];
      i += (isGreater ? 1 : 0);
      j += (isGreater ? 0 : 1);
    }
    index++;
  }

  if(mid < i) frame.splice(index, right - index + 1, ...prevFrame.slice(j, right + 1));
  else        frame.splice(index, right - index + 1, ...prevFrame.slice(i, mid + 1));

  return frame;
}

function rainbowSwitchWithoutLogic(indexOne, indexTwo) {
  let frame = createPrevArray(stapleArr.length);
  [frame[indexOne], frame[indexTwo]] = [frame[indexTwo], frame[indexOne]];
  return frame;
}

function rainbowSwitchStaples(indexOne, indexTwo) {
  let frame = createPrevArray(stapleArr.length);
  let isGreater = parseInt(frame[indexTwo][1].substring(4, 7)) < parseInt(frame[indexOne][1].substring(4, 7));
  if(isGreater) [frame[indexOne], frame[indexTwo]] = [frame[indexTwo], frame[indexOne]];

  return frame;
}

function rainbowSortStabilityCorrection() {
  let duplicate = [];
  let count = 5;
  let c = 0;
  for(let i = 0; i < stapleArr.length - 1; i++) if(stapleArr[i] == stapleArr[i + 1]) duplicate.push(i);
  while(0 < --count) {
    strike = [0];
    for(let i of duplicate) {
      frameSaveArray.push(frameDuoColorChanger(stapleArr, i, i + 1, "#ff0000", true));
      frameSaveArray.push(rainbowSwitchStaples(i, i + 1));
    }
    if(100 < c) {
      console.log("BREAK!!!");
      break;
    }
    c++;
  }
}