const container = document.querySelector(".container"),
  musicImg = container.querySelector(".image-area img"),
  musicName = container.querySelector(".song-details .name"),
  musicArtist = container.querySelector(".song-details .artist"),
  mainAudio = container.querySelector("#main-audio"),
  playpauseBtn = container.querySelector(".play-pause"),
  nextBtn = container.querySelector("#next"),
  prevBtn = container.querySelector("#prev"),
  progressArea = container.querySelector(".progress-area"),
  progressBar = container.querySelector(".progress-bar"),
  musicList = container.querySelector(".music-list"),
  moreMusicBtn = container.querySelector("#more-music"),
  closemoreMusic = container.querySelector("#close");





let musicIndex = 1;



window.addEventListener("load", () => {
  loadMusic(musicIndex);
})

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[musicIndex - 1].name;
  musicArtist.innerText = allMusic[musicIndex - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `Music/${allMusic[indexNumb - 1].src}.mp3`;

}
//play music function
function playMusic() {
  container.classList.add("paused");
  playpauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//play music function
function pauseMusic() {
  container.classList.remove("paused");
  playpauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//Next Music Functtion
function nextMusic() {
  musicIndex++;//increment of musicIndex by 1
  // if music is greater then array length then play first music
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

//prev Music Functtion
function prevMusic() {
  musicIndex--;//increment of musicIndex by 1
  // if music is lees then array length then play first music 
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

//play or music button event
playpauseBtn.addEventListener("click", () => {
  const isMusicPaused = container.classList.contains("paused")

  isMusicPaused ? pauseMusic() : playMusic();
});
//next music button
nextBtn.addEventListener("click", () => {
  nextMusic();
});

//prev music button
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//update progressbar width according to music curren time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = container.querySelector(".current-time"),
    musicDuration = container.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {

    //update song total duration
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {//if sec less then 10 than add 0  before it
      totalSec = `0${totalSec}`;
    }

    musicDuration.innerText = `${totalMin}:${totalSec}`;

  });


  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {//if sec less then 10 than add 0  before it
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`

});

//update playing song current width acoordin to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
});

//chnage loop, shufle, repeat icon onclick
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "playlist loopes");
      break;
  }
});

//above we just chnage icon . now list's work on what to do after song ended
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.randomm() * allMusic.length) + 1);
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      break;
  }

});
//show te music the list onclick music icon

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});



const ulTag = container.querySelector("ul");

//let create li tags to array length for list


for (let i = 0; i < allMusic . length; i++) {
  let liTag = `<li  li-index="${i +1}">
    <div class="row">
      <span>${allMusic[i].name}</span>
      <p>${allMusic[i].artist}</p>
    </div>
    <audio class="${allMusic[i].src} " src="Music/${allMusic[i].src}.mp3"></audio>
    <span id="${allMusic[i].src}" class="audio-duration">1:45</span>
   </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () =>{

    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {//if sec less then 10 than add 0  before it
      totalSec = `0${totalSec}`;
    }

    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;

  });
  
}
//play particular song from the list tag
const allLiTags = ulTag.querySelectorAll("li");
for (let j = 0; j < allLiTags.length; j++){

  //if  there is li tag is equal to the li index then this music is playing and w'll style it
  //adding onclick attribute in all li tags
  if(allLiTags[j].getAttribute("li-index") ==musicIndex){
    allLiTags[j].classList.add("playing");
  }
  allLiTags[j].setAttribute("onclick","clicked(this)");
}
//let play song onclick
function clicked(element){
  //getting li index of particular clicked tag
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
}

