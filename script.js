const startButton = document.getElementById("startButton");

const home = document.getElementById("home");
const writePage = document.getElementById("writePage");

const thought = document.getElementById("thought");
const counter = document.getElementById("counter");

const feelings = document.querySelectorAll(".feeling");

const sendButton = document.getElementById("sendButton");
const song = document.getElementById("song");
const message = document.getElementById("message");


// Open writing page

startButton.addEventListener("click", function() {

    home.classList.add("hidden");

    writePage.classList.remove("hidden");

});


// Character counter

thought.addEventListener("input", function() {

    counter.textContent = thought.value.length + " / 500";

});


// Feeling buttons

feelings.forEach(function(button) {

    button.addEventListener("click", function() {

        feelings.forEach(function(item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

    });

});

// Send button

sendButton.addEventListener("click", function() {

    const selectedFeeling = document.querySelector(".feeling.selected");

    if (thought.value.trim() === "") {

        message.textContent = "Write your thought first. 💭";

        return;
    }

    if (song.value.trim() === "") {

        message.textContent = "Add a song that represents your thought. 🎧";

        return;
    }

    if (!selectedFeeling) {

        message.textContent = "Choose a feeling first. 🤍";

        return;
    }


    // Get the information

    const thoughtText = thought.value;

    const feelingText = selectedFeeling.textContent;

    const songText = song.value;


    // Put information inside the card

    document.getElementById("cardThought").textContent = thoughtText;

    document.getElementById("cardFeeling").textContent = feelingText;

    document.getElementById("cardSong").textContent = songText;


    // Show the card

    document.getElementById("thoughtCard").classList.remove("hidden");

    fetch("https://thoughts-backend-3aof.onrender.com/api/thoughts")
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        thought: thought.value,
        feeling: selectedFeeling.textContent,
        song: song.value,
        videoId: videoIdInput.value
    })
})
.then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log("SAVED:", data);
})
.catch(function(error) {
    console.log("ERROR:", error);
});

    message.textContent = "Your thought is now out there. 🕊️";

});

const songOptions = document.querySelectorAll(".song-option");

songOptions.forEach(function(button) {

    button.addEventListener("click", function() {

        songOptions.forEach(function(item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        const title = button.querySelector("strong").textContent;
        const artist = button.querySelector("small").textContent;

        song.value = title + " — " + artist;

    });

});

function loadFloatingThoughts() {

   fetch("https://thoughts-backend-3aof.onrender.com/api/thoughts", {
    
    .then(function(response) {
        return response.json();
    })

    .then(function(data) {

        data.forEach(function(item, index) {

            createFloatingThought(
                item.thought,
                index
            );

        });

    })

    .catch(function(error) {

        console.error("Floating thoughts error:", error);

    });
}


function createFloatingThought(text, index) {

    const thought = document.createElement("div");

    thought.classList.add("floating-thought");

    thought.textContent = text;

    const fromLeft = Math.random() > 0.5;

    if (fromLeft) {
        thought.classList.add("from-left");
    } else {
        thought.classList.add("from-right");
    }

    thought.style.top =
        Math.floor(Math.random() * 80 + 10) + "%";

    thought.style.animationDuration =
        Math.floor(Math.random() * 10 + 15) + "s";

    thought.style.animationDelay =
        (index * 2) + "s";

    document.body.appendChild(thought);
}


loadFloatingThoughts();

// ===============================
// YOUTUBE MUSIC
// ===============================

const youtubeLink = document.getElementById("youtubeLink");
const loadSongButton = document.getElementById("loadSongButton");

const musicPlayer = document.getElementById("musicPlayer");
const youtubeFrame = document.getElementById("youtubeFrame");

const selectedSong = document.getElementById("selectedSong");

const songInput = document.getElementById("song");
const videoIdInput = document.getElementById("videoId");


loadSongButton.addEventListener("click", function () {

    const link = youtubeLink.value.trim();

    if (!link) {
        alert("Please paste a YouTube link.");
        return;
    }

    const videoId = getYouTubeVideoId(link);

    if (!videoId) {
        alert("That doesn't look like a valid YouTube link.");
        return;
    }

    // Save the video ID
    videoIdInput.value = videoId;

    // Save the original YouTube link
    songInput.value = link;

    // Create the YouTube embed
    youtubeFrame.src =
        "https://www.youtube.com/embed/" +
        videoId +
        "?autoplay=1&rel=0";

    // Show player
    musicPlayer.classList.remove("hidden");

    // Display selected song
    selectedSong.textContent = "🎧 Your selected YouTube song";

});


function getYouTubeVideoId(url) {

    try {

        const parsedUrl = new URL(url);

        // Normal YouTube URL
        if (parsedUrl.hostname.includes("youtube.com")) {

            return parsedUrl.searchParams.get("v");
        }

        // Short YouTube URL
        if (parsedUrl.hostname === "youtu.be") {

            return parsedUrl.pathname.substring(1);
        }

        return null;

    } catch (error) {

        return null;

    }

}