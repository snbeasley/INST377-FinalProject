document.addEventListener("DOMContentLoaded", () => {
  const showStoryButton = document.querySelector("#show-story");
  const showParagraphsButton = document.querySelector("#show-paragraphs");
  const storyContent = document.querySelector(".story-content");
  const paragraphsContent = document.querySelector(".paragraphs-content");

  showStoryButton.addEventListener("click", () => {
    storyContent.style.display = "block";
    paragraphsContent.style.display = "none";
  });

  showParagraphsButton.addEventListener("click", () => {
    storyContent.style.display = "none";
    paragraphsContent.style.display = "block";
  });

  // Star background
  const createStar = () => {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    document.body.appendChild(star);
  };

  for (let i = 0; i < 200; i++) {
    createStar();
  }

  // Add the following code at the end of your scripts.js file
const ttsButton = document.querySelector("#tts-button");

let isSpeaking = false;

const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.volume = .5
    window.speechSynthesis.speak(utterance);
};

const stop = () => {
    window.speechSynthesis.cancel();
};

ttsButton.addEventListener("click", () => {
    if (!isSpeaking) {
        ttsButton.textContent = "Stop";
        isSpeaking = true;
        const activeContent =
            paragraphsContent.style.display === "block"
                ? paragraphsContent
                : storyContent;
        speak(activeContent.textContent);
    } else {
        ttsButton.textContent = "Read aloud";
        isSpeaking = false;
        stop();
    }
});


const backgroundNoise = document.getElementById("background-noise");
backgroundNoise.volume = 0.03; // Set the volume to a low level 
backgroundNoise.play(); // Start playing the background noise

const toggleMusicButton = document.getElementById("toggle-music");
let musicPlaying = true;

toggleMusicButton.addEventListener("click", () => {
  if (musicPlaying) {
    backgroundNoise.pause(); // Stop the background noise
    toggleMusicButton.textContent = "Play Music";
  } else {
    backgroundNoise.play(); // Start playing the background noise
    toggleMusicButton.textContent = "Stop Music";
  }
  musicPlaying = !musicPlaying;
});




});
