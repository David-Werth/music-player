// Getting DOM elements

const songTitleElement = document.getElementById("song-title");
const artistNameElement = document.getElementById("artist-name");
const artworkElement = document.getElementById("artwork");
const playlistStatusElement = document.getElementById("playlist-status");
const progressBarElement = document.getElementById("progress-bar");
const playheadElement = document.getElementById("playhead");
const buttonsContainerElement = document.getElementById("buttons-container");
const backButtonElement = document.getElementById(
  "back-button-container"
).firstElementChild;
const playButtonElement = document.getElementById(
  "play-button-container"
).firstElementChild;
const forwardButtonElement = document.getElementById(
  "forward-button-container"
).firstElementChild;

// Song Data Array

const songsArr = [
  {
    song_title: "Alright",
    artist_name: "Sastruga",
    file: "mp3/Sastruga - Alright.mp3",
    artwork: "img/blue.jpg",
  },
  {
    song_title: "Searching",
    artist_name: "Sastruga",
    file: "mp3/Sastruga - Searching.mp3",
    artwork: "img/green.jpg",
  },
  {
    song_title: "Cassiopeia",
    artist_name: "Also Sastruga :)",
    file: "mp3/Sastruga - Cassiopeia.mp3",
    artwork: "img/red.jpg",
  },
];

// Setting general variables

let currentSong = 0;
let songElement;
let isPlaying = 0;
let songDuration;

let currentTime;
let totalLenght;
let position;

// Creating the HTML audio tag

const createSongElement = () => {
  songElement = document.createElement("audio");
  songElement.setAttribute("src", songsArr[currentSong].file);
  songElement.setAttribute("preload", "metadata");
};

createSongElement();

// Updating info about loaded song

const updateInfo = () => {
  songElement.addEventListener("loadedmetadata", function () {
    songDuration = songElement.duration;
  });
  songTitleElement.textContent = songsArr[currentSong].song_title;
  artistNameElement.textContent = songsArr[currentSong].artist_name;
  artworkElement.setAttribute("src", songsArr[currentSong].artwork);
  playlistStatusElement.textContent = currentSong + 1;
};

updateInfo();

// General playhead movement

const playheadMovement = () => {
  songElement.ontimeupdate = () => {
    currentTime = songElement.currentTime;
    totalLenght = 220 / songDuration;
    position = currentTime * totalLenght;
    playheadElement.style.transform = `translateX(${position - 5}px)`;
    continueToNext();
  };
};

// Playhead drag functionality

function isTouchEnabled() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

progressBarElement.addEventListener("mousedown", mouseDownListener);
window.addEventListener("mouseup", mouseUpListener);
progressBarElement.addEventListener("touchstart", mouseDownListener);
window.addEventListener("touchend", mouseUpListener);
progressBarElement.addEventListener("click", mouseMoveListener);

function mouseMoveListener(e) {
  const target = e.target;
  const rect = target.getBoundingClientRect();
  console.log(e);

  if (isTouchEnabled()) {
    const xMobile = e.touches[0].clientX - rect.left;
    songElement.currentTime = (songDuration / 220) * xMobile;
  } else {
    const xDesktop = e.clientX - rect.left;
    songElement.currentTime = (songDuration / 220) * xDesktop;
  }
}

function mouseDownListener() {
  buttonsContainerElement.style.pointerEvents = "none";
  window.addEventListener("mousemove", mouseMoveListener);
  window.addEventListener("touchmove", mouseMoveListener);
  songElement.volume = 0;
}

function mouseUpListener() {
  buttonsContainerElement.style.pointerEvents = "auto";
  window.removeEventListener("mousemove", mouseMoveListener);
  window.removeEventListener("touchmove", mouseMoveListener);
  songElement.volume = 1;
}

// Controls

const playSong = () => {
  if (isPlaying === 0) {
    isPlaying = 1;
    songElement.play();
    playButtonElement.classList.remove("la-play");
    playButtonElement.classList.add("la-pause");
  } else {
    isPlaying = 0;
    songElement.pause();
    playButtonElement.classList.add("la-play");
    playButtonElement.classList.remove("la-pause");
  }
  playheadMovement();
};

const nextSong = () => {
  songElement.pause();
  isPlaying = 0;
  if (currentSong < 2) {
    currentSong++;
  } else {
    currentSong = 0;
  }
  createSongElement();
  updateInfo();
  playSong();
};

const previousSong = () => {
  songElement.pause();
  isPlaying = 0;
  if (currentSong > 0) {
    currentSong--;
  } else {
    currentSong = 2;
    console.log(currentSong);
  }
  createSongElement();
  updateInfo();
  playSong();
};

const continueToNext = () => {
  if (currentTime === songDuration) {
    nextSong();
  }
};

// Event Listeners for controls

playButtonElement.addEventListener("click", playSong);
forwardButtonElement.addEventListener("click", nextSong);
backButtonElement.addEventListener("click", previousSong);

document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    playSong();
  }
};
