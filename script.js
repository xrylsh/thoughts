// =====================================
// API
// =====================================

const API_URL =
    "https://thoughts-backend-3aof.onrender.com";


// =====================================
// AUTH ELEMENTS
// =====================================

const authScreen =
    document.getElementById("authScreen");

const writerScreen =
    document.getElementById("writerScreen");

const signupButton =
    document.getElementById("signupButton");

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const signupMessage =
    document.getElementById("signupMessage");

const loginMessage =
    document.getElementById("loginMessage");

const welcomeUser =
    document.getElementById("welcomeUser");


// =====================================
// AUTH HELPERS
// =====================================

function showWriter(user) {

    authScreen.classList.add("hidden");

    writerScreen.classList.remove("hidden");

    welcomeUser.textContent =
        user.email;

    localStorage.setItem(
        "unsaidUser",
        JSON.stringify(user)
    );

    loadFloatingThoughts();

}


function showLoginScreen() {

    writerScreen.classList.add("hidden");

    authScreen.classList.remove("hidden");

}


// =====================================
// SIGN UP
// =====================================

signupButton.addEventListener(
    "click",
    async function() {

        const email =
            signupEmail.value.trim();

        const password =
            signupPassword.value;


        if (!email || !password) {

            signupMessage.textContent =
                "Please enter your email and password.";

            return;

        }


        signupMessage.textContent =
            "Creating your account...";


        try {

            const response =
                await fetch(
                    API_URL + "/api/signup",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email: email,
                                password: password
                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                signupMessage.textContent =
                    data.message;

                return;

            }


            signupMessage.textContent =
                "Account created! Now log in. 🤍";


            loginEmail.value =
                email;


            loginPassword.value =
                "";


            signupPassword.value =
                "";


        } catch (error) {

            console.error(error);

            signupMessage.textContent =
                "Unable to connect to UNSAID.";

        }

    }
);


// =====================================
// LOGIN
// =====================================

loginButton.addEventListener(
    "click",
    async function() {

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;

        }


        loginMessage.textContent =
            "Logging in...";


        try {

            const response =
                await fetch(
                    API_URL + "/api/login",
                    {

                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email: email,
                                password: password
                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                loginMessage.textContent =
                    data.message;

                return;

            }


            loginMessage.textContent =
                "";


            showWriter(data.user);


        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                "Unable to connect to UNSAID.";

        }

    }
);


// =====================================
// LOGOUT
// =====================================

logoutButton.addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "unsaidUser"
        );


        showLoginScreen();


        loginEmail.value =
            "";

        loginPassword.value =
            "";

        loginMessage.textContent =
            "";

    }
);


// =====================================
// RESTORE LOGIN
// =====================================

const savedUser =
    localStorage.getItem(
        "unsaidUser"
    );


if (savedUser) {

    try {

        const user =
            JSON.parse(savedUser);

        showWriter(user);

    } catch (error) {

        localStorage.removeItem(
            "unsaidUser"
        );

    }

}


// =====================================
// WRITER
// =====================================

const startButton =
    document.getElementById("startButton");

const home =
    document.getElementById("home");

const writePage =
    document.getElementById("writePage");

const backButton =
    document.getElementById("backButton");


startButton.addEventListener(
    "click",
    function() {

        home.classList.add("hidden");

        writePage.classList.remove("hidden");

    }
);


backButton.addEventListener(
    "click",
    function() {

        writePage.classList.add("hidden");

        home.classList.remove("hidden");

    }
);


// =====================================
// CHARACTER COUNTER
// =====================================

const thought =
    document.getElementById("thought");

const counter =
    document.getElementById("counter");


thought.addEventListener(
    "input",
    function() {

        counter.textContent =
            thought.value.length +
            " / 500";

    }
);


// =====================================
// FEELINGS
// =====================================

const feelings =
    document.querySelectorAll(
        ".feeling"
    );


feelings.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                feelings.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );

            }
        );

    }
);


// =====================================
// YOUTUBE
// =====================================

const youtubeLink =
    document.getElementById(
        "youtubeLink"
    );

const loadSongButton =
    document.getElementById(
        "loadSongButton"
    );

const musicPlayer =
    document.getElementById(
        "musicPlayer"
    );

const youtubeFrame =
    document.getElementById(
        "youtubeFrame"
    );

const selectedSong =
    document.getElementById(
        "selectedSong"
    );

const songInput =
    document.getElementById(
        "song"
    );

const videoIdInput =
    document.getElementById(
        "videoId"
    );


loadSongButton.addEventListener(
    "click",
    function() {
        const link =
            youtubeLink.value.trim();


        if (!link) {

            alert(
                "Please paste a YouTube link."
            );

            return;

        }


        const videoId =
            getYouTubeVideoId(link);


        if (!videoId) {

            alert(
                "That doesn't look like a valid YouTube link."
            );

            return;

        }


        videoIdInput.value =
            videoId;

        songInput.value =
            link;


        youtubeFrame.src =
            "https://www.youtube.com/embed/" +
            videoId +
            "?autoplay=1&rel=0";


        musicPlayer.classList.remove(
            "hidden"
        );


        selectedSong.textContent =
            "🎧 Your selected YouTube song";

    }
);


// =====================================
// YOUTUBE ID
// =====================================

function getYouTubeVideoId(url) {

    try {

        const parsedUrl =
            new URL(url);


        if (
            parsedUrl.hostname.includes(
                "youtube.com"
            )
        ) {

            return parsedUrl
                .searchParams
                .get("v");

        }


        if (
            parsedUrl.hostname ===
            "youtu.be"
        ) {

            return parsedUrl
                .pathname
                .substring(1);

        }


        return null;

    } catch (error) {

        return null;

    }

}


// =====================================
// SEND THOUGHT
// =====================================

const sendButton =
    document.getElementById(
        "sendButton"
    );

const message =
    document.getElementById(
        "message"
    );


sendButton.addEventListener(
    "click",
    async function() {

        const selectedFeeling =
            document.querySelector(
                ".feeling.selected"
            );


        if (
            thought.value.trim() === ""
        ) {

            message.textContent =
                "Write your thought first. 💭";

            return;

        }


        if (
            songInput.value.trim() === ""
        ) {

            message.textContent =
                "Add a song that represents your thought. 🎧";

            return;

        }


        if (!selectedFeeling) {

            message.textContent =
                "Choose a feeling first. 🤍";

            return;

        }


        const thoughtText =
            thought.value.trim();

        const feelingText =
            selectedFeeling.textContent.trim();

        const songText =
            songInput.value;

        const videoId =
            videoIdInput.value;


        // Display card

        document.getElementById(
            "cardThought"
        ).textContent =
            thoughtText;


        document.getElementById(
            "cardFeeling"
        ).textContent =
            feelingText;


        document.getElementById(
            "cardSong"
        ).textContent =
            songText;


        document.getElementById(
            "thoughtCard"
        ).classList.remove(
            "hidden"
        );


        message.textContent =
            "Sending your thought...";


        try {

            const response =
                await fetch(
                    API_URL +
                    "/api/thoughts",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                thought:
                                    thoughtText,

                                feeling:
                                    feelingText,

                                song:
                                    songText,

                                videoId:
                                    videoId

                            })
                            }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    "Something went wrong.";

                return;

            }


            message.textContent =
                "Your thought is now out there. 🕊️";


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to save your thought.";

        }

    }
);


// =====================================
// FLOATING THOUGHTS
// =====================================

function loadFloatingThoughts() {

    fetch(
        API_URL +
        "/api/thoughts"
    )

    .then(
        function(response) {

            return response.json();

        }
    )

    .then(
        function(data) {

            data.forEach(
                function(item, index) {

                    createFloatingThought(
                        item.thought,
                        index
                    );

                }
            );

        }
    )

    .catch(
        function(error) {

            console.error(
                "Floating thoughts error:",
                error
            );

        }
    );

}


// =====================================
// CREATE FLOATING THOUGHT
// =====================================

function createFloatingThought(
    text,
    index
) {

    const floating =
        document.createElement(
            "div"
        );


    floating.classList.add(
        "floating-thought"
    );


    floating.textContent =
        text;


    const fromLeft =
        Math.random() > 0.5;


    if (fromLeft) {

        floating.classList.add(
            "from-left"
        );

    } else {

        floating.classList.add(
            "from-right"
        );

    }


    floating.style.top =
        Math.floor(
            Math.random() * 80 + 10
        ) + "%";


    floating.style.animationDuration =
        Math.floor(
            Math.random() * 10 + 15
        ) + "s";


    floating.style.animationDelay =
        (index * 2) + "s";


    document.body.appendChild(
        floating
    );

}