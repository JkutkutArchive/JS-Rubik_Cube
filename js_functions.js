
// launchFullScreen(document.documentElement); // the whole page


/**
 * Get the equivalent coordinates of a 1920x1080 canvas with the current window size.
 * @param {number[]} arr - array with 2n elements.
 * @returns {number[]} array with the fixed coordinates.
 */
function relativePos(arr){
    let newArr = [];
    for(let i = 0; i < arr.length; i += 2){
        newArr.push(arr[i] * mainCanvasWidth / 1920);
        newArr.push(arr[i + 1] * mainCanvasHeight / 1080);
    }
    return newArr;
}




function launchFullScreen(element) {
    if(element.requestFullScreen) {
      element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }