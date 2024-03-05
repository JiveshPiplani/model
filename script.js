// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
document.querySelector('model-viewer').addEventListener('progress', onProgress);


function Sync(selector, audioSelector) {
  var modelViewer = document.querySelector(selector);
  var sound = document.querySelector(audioSelector);
  var playRequest = document.querySelector("#overlay");

  sound.addEventListener("timeupdate", () => {
    modelViewer.currentTime = sound.currentTime;
    console.log("modelViewer time: " + modelViewer.currentTime);
  });

  sound.addEventListener("pause", () => {
    modelViewer.pause();
  });

  sound.addEventListener("play", () => {
    modelViewer.play();

    playRequest.classList.add("hide");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") {
      sound.pause();
    }
  });

  var promise = sound.play();
  if (promise !== undefined) {
    promise
      .then(_ => {
        console.log("Autoplay has worked");
        playRequest.classList.add("hide");
      })
      .catch(error => {
        // Show a "Play" button so that user can start playback.
        console.log("Autoplay has not worked");

        // show the modal dialogue to play this
        playRequest.classList.remove("hide");
      });
  }

  /*
  // this was needed because modelViewer.currentTime does not update when paused
  // https://github.com/google/model-viewer/issues/1113
  function enforceTime() {
    if (modelViewer === undefined)
      modelViewer = document.querySelector(selector);

    if (sound.paused) modelViewer.currentTime = sound.currentTime;

    // need to enforce play
    if (modelViewer.paused && typeof modelViewer.play === "function")
      modelViewer.play();

    requestAnimationFrame(enforceTime);
  }

  requestAnimationFrame(enforceTime);
  */
}

function playNow() {
  var playRequest = document.querySelector("#overlay");
  playRequest.classList.add("hide");

  var sound = document.querySelector("#sound");
  sound.play();
}

function jumpTo(time) {
  var sound = document.querySelector("#sound");
  sound.currentTime = time;
}

window.addEventListener("load", () => {
  Sync("#model-viewer", "#sound");
});
