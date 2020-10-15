import Vue from "vue";

function delay(ms: number = 1000) {
  let ctr: any, rej: any;
  const p: any = new Promise((resolve, reject) => {
    ctr = setTimeout(resolve, ms);
    rej = reject;
  });

  p.cancel = () => {
    clearTimeout(ctr);
    rej(Error("Cancelled"));
  };
  return p;
}

/* View in fullscreen */
function openFullscreen(elem: any) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen(document) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function round(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function highestScore(stack: Object) {
  const indexOfMaxValue = Object.values(stack).reduce(
    (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
    0,
  );
  if (Object.values(stack)[indexOfMaxValue] < 0.6) {
    return 4; // return neutral value by default
  } else {
    return Object.keys(stack)[indexOfMaxValue];
  }
}

function keepProps(obj: object, keep: Array<string>) {
  /*   console.log(obj)
  console.log(keep) */
  const deepCopy = { ...obj };
  for (const prop in obj) {
    if (!keep.includes(prop)) {
      // delete obj[prop];
      Vue.delete(deepCopy, prop);
    }
  }
  return deepCopy;
}

export {
  delay,
  openFullscreen,
  closeFullscreen,
  keepProps,
  round,
  highestScore,
};
