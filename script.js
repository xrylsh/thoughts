// =====================================
// API
// =====================================

const API_URL = "https://thoughts-backend-3aof.onrender.com";

// Sends JSON to the backend. Never throws on bad/HTML responses,
// and tells the user when the free server is waking up.
async function postJson(path, body, messageEl) {
    const wakeTimer = setTimeout(function () {
        messageEl.textContent =
            "Waking up the server... this can take up to a minute. ☕";
    }, 4000);

    try {
        const response = await fetch(API_URL + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json().catch(function () {
            return {};
        });

        return { ok: response.ok, status: response.status, data: data };
    } finally {
        clearTimeout(wakeTimer);
    }
}

// =====================================
// AUTH ELEMENTS
// =====================================

const authScreen = document.getElementById("authScreen");
const writerScreen = document.getElementById("writerScreen");
const signupButton = document.getElementById("signupButton");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signupMessage = document.getElementById("signupMessage");
const loginMessage = document.getElementById("loginMessage");
const welcomeUser = document.getElementById("welcomeUser");

// =====================================
// AUTH HELPERS
// =====================================

function showWriter(user) {
    authScreen.classList.add("hidden");
    writerScreen.classList.remove("hidden");
    welcomeUser.textContent = user.email;
    localStorage.setItem("unsaidUser", JSON.stringify(user));
    loadFloatingThoughts();
}

function showLoginScreen() {
    writerScreen.classList.add("hidden");
    authScreen.classList.remove("hidden");
    showAuthView("login");
}

// =====================================
// AUTH VIEWS (Log in first, Sign up on its own view)
// =====================================

const authCard = document.querySelector(".auth-card");
const authTitle = authCard.querySelector("h1");
const authDescription = authCard.querySelector(".auth-description");
const authSections = authCard.querySelectorAll(".auth-section");
const signupSection = authSections[0];
const loginSection = authSections[1];

const AUTH_TEXT = {
    login: {
        title: "Welcome back",
        description: "Log in to keep your thoughts with you."
    },
    signup: {
        title: "Join UNSAID",
        description: "Create an account to keep your thoughts with you."
    }
};

function showAuthView(view) {
    const isSignup = view === "signup";

    signupSection.classList.toggle("hidden", !isSignup);
    loginSection.classList.toggle("hidden", isSignup);

    authTitle.textContent = AUTH_TEXT[view].title;
    authDescription.textContent = AUTH_TEXT[view].description;
}

// "Don't have an account? Sign up" under the login form
const goSignup = document.createElement("p");
goSignup.className = "auth-switch";
goSignup.innerHTML =
    'Don\'t have an account? ' +
    '<button type="button" class="auth-switch-link" data-view="signup">Sign up</button>';
loginSection.appendChild(goSignup);

// "Already have an account? Log in" under the sign up form
const goLogin = document.createElement("p");
goLogin.className = "auth-switch";
goLogin.innerHTML =
    'Already have an account? ' +
    '<button type="button" class="auth-switch-link" data-view="login">Log in</button>';
signupSection.appendChild(goLogin);

authCard.addEventListener("click", function (event) {
    const link = event.target.closest("[data-view]");

    if (!link) return;

    signupMessage.textContent = "";
    loginMessage.textContent = "";

    showAuthView(link.dataset.view);

    (link.dataset.view === "signup" ? signupEmail : loginEmail).focus();
});

showAuthView("login");


// =====================================
// SIGN UP
// =====================================

signupButton.addEventListener("click", async function () {
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (!email || !password) {
        signupMessage.textContent = "Please enter your email and password.";
        return;
    }

    signupMessage.textContent = "Creating your account...";
    signupButton.disabled = true;

    try {
        const result = await postJson(
            "/api/signup",
            { email: email, password: password },
            signupMessage
        );

        if (!result.ok) {
            signupMessage.textContent =
                result.data.message || "Sign up failed (" + result.status + ").";
            return;
        }

        signupMessage.textContent = "";
        signupPassword.value = "";

        showAuthView("login");

        loginEmail.value = email;
        loginPassword.value = "";
        loginMessage.textContent = "Account created! Now log in. 🤍";
        loginPassword.focus();
    } catch (error) {
        console.error(error);
        signupMessage.textContent = "Unable to connect to UNSAID.";
    } finally {
        signupButton.disabled = false;
    }
});

// =====================================
// LOGIN
// =====================================

loginButton.addEventListener("click", async function () {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        loginMessage.textContent = "Please enter your email and password.";
        return;
    }

    loginMessage.textContent = "Logging in...";
    loginButton.disabled = true;

    try {
        const result = await postJson(
            "/api/login",
            { email: email, password: password },
            loginMessage
        );

        if (!result.ok) {
            loginMessage.textContent =
                result.data.message || "Login failed (" + result.status + ").";
            return;
        }

        if (!result.data.user) {
            console.log("Unexpected response:", result.data);
            loginMessage.textContent = "Server didn't return a user.";
            return;
        }

        loginMessage.textContent = "";
        showWriter(result.data.user);
    } catch (error) {
        console.error(error);
        loginMessage.textContent = "Unable to connect to UNSAID.";
    } finally {
        loginButton.disabled = false;
    }
});

// =====================================
// LOGOUT
// =====================================

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("unsaidUser");

    document.querySelectorAll(".floating-thought").forEach(function (el) {
        el.remove();
    });

    showLoginScreen();

    loginEmail.value = "";
    loginPassword.value = "";
    loginMessage.textContent = "";
});

// =====================================
// WRITER
// =====================================

const startButton = document.getElementById("startButton");
const home = document.getElementById("home");
const writePage = document.getElementById("writePage");
const backButton = document.getElementById("backButton");

startButton.addEventListener("click", function () {
    home.classList.add("hidden");
    writePage.classList.remove("hidden");
});

backButton.addEventListener("click", function () {
    writePage.classList.add("hidden");
    home.classList.remove("hidden");
});

// =====================================
// CHARACTER COUNTER
// =====================================

const thought = document.getElementById("thought");
const counter = document.getElementById("counter");

thought.addEventListener("input", function () {
    counter.textContent = thought.value.length + " / 500";
});

// =====================================
// FEELINGS
// =====================================

const feelings = document.querySelectorAll(".feeling");

feelings.forEach(function (button) {
    button.addEventListener("click", function () {
        feelings.forEach(function (item) {
            item.classList.remove("selected");
        });
        button.classList.add("selected");
    });
});

// =====================================
// YOUTUBE
// =====================================

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

    videoIdInput.value = videoId;
    songInput.value = link;

    youtubeFrame.src =
        "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";

    musicPlayer.classList.remove("hidden");
    selectedSong.textContent = "🎧 Your selected YouTube song";
});

function getYouTubeVideoId(url) {
    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname.replace(/^www\./, "");

        if (host === "youtu.be") {
            return parsedUrl.pathname.substring(1) || null;
        }

        if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            if (parsedUrl.pathname.startsWith("/shorts/") || parsedUrl.pathname.startsWith("/embed/")) {
                return parsedUrl.pathname.split("/")[2] || null;
            }
            return parsedUrl.searchParams.get("v");
        }

        return null;
    } catch (error) {
        return null;
    }
}

// =====================================
// SEND THOUGHT
// =====================================

const sendButton = document.getElementById("sendButton");
const message = document.getElementById("message");

sendButton.addEventListener("click", async function () {
    const selectedFeeling = document.querySelector(".feeling.selected");

    if (thought.value.trim() === "") {
        message.textContent = "Write your thought first. 💭";
        return;
    }

    if (songInput.value.trim() === "") {
        message.textContent = "Add a song that represents your thought. 🎧";
        return;
    }

    if (!selectedFeeling) {
        message.textContent = "Choose a feeling first. 🤍";
        return;
    }

    const thoughtText = thought.value.trim();
    const feelingText = selectedFeeling.textContent.trim();
    const songText = songInput.value;
    const videoId = videoIdInput.value;

    message.textContent = "Sending your thought...";
    sendButton.disabled = true;

    try {
        const result = await postJson(
            "/api/thoughts",
            {
                thought: thoughtText,
                feeling: feelingText,
                song: songText,
                videoId: videoId
            },
            message
        );

        if (!result.ok) {
            message.textContent =
                result.data.message || "Something went wrong.";
            return;
        }

        // Show the card only after it was really saved
        document.getElementById("cardThought").textContent = thoughtText;
        document.getElementById("cardFeeling").textContent = feelingText;
        document.getElementById("cardSong").textContent = songText;
        document.getElementById("thoughtCard").classList.remove("hidden");

        message.textContent = "Your thought is now out there. 🕊️";
    } catch (error) {
        console.error(error);
        message.textContent = "Unable to save your thought.";
    } finally {
        sendButton.disabled = false;
    }
});

// =====================================
// FLOATING THOUGHTS
// =====================================

function loadFloatingThoughts() {
    fetch(API_URL + "/api/thoughts")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!Array.isArray(data)) return;

            document.querySelectorAll(".floating-thought").forEach(function (el) {
                el.remove();
            });

            data.forEach(function (item, index) {
                createFloatingThought(item.thought, index);
            });
        })
        .catch(function (error) {
            console.error("Floating thoughts error:", error);
        });
}

function createFloatingThought(text, index) {
    const floating = document.createElement("div");

    floating.classList.add("floating-thought");
    floating.textContent = text;
    floating.classList.add(Math.random() > 0.5 ? "from-left" : "from-right");

    floating.style.top = Math.floor(Math.random() * 80 + 10) + "%";
    floating.style.animationDuration = Math.floor(Math.random() * 10 + 15) + "s";
    floating.style.animationDelay = index * 2 + "s";

    document.body.appendChild(floating);
}

// =====================================
// TOP BAR (About, Help, Report, Account)
// =====================================

// Reports open in the person's email app, addressed to this email.
// Change it to your own email.
const SUPPORT_EMAIL = "your-email@example.com";

(function setupTopBar() {

    document.body.insertAdjacentHTML("afterbegin", `
        <header class="top-bar">
            <span class="top-brand">UNSAID</span>

            <nav class="top-nav" aria-label="Main">
                <button type="button" class="nav-link" data-open="about">About</button>
                <button type="button" class="nav-link" data-open="help">Help</button>
                <button type="button" class="nav-link" data-open="report">Report</button>

                <button type="button" id="signInLink" class="nav-link nav-signin">Sign in</button>

                <div id="accountWrap" class="account-wrap hidden">
                    <button type="button" id="accountButton" class="account-button"
                            aria-haspopup="true" aria-expanded="false" aria-label="Account">
                        <span id="accountInitial" class="account-initial">U</span>
                        <span class="account-label">Account</span>
                    </button>

                    <div id="accountMenu" class="account-menu">
                        <p class="account-caption">Signed in as</p>
                        <div id="accountSlot"></div>
                    </div>
                </div>
            </nav>
        </header>

        <div id="modalOverlay" class="modal-overlay">
            <div id="infoModal" class="info-modal" role="dialog" aria-modal="true" aria-label="About">

                <button type="button" id="modalClose" class="modal-close"
                        aria-label="Close">✕</button>

                <div class="modal-pane" data-pane="about">
                    <h2 class="modal-title">About</h2>
                    <p>UNSAID is a place for the words you never got to say. Write a
                    thought, pick a feeling, attach the song that says it better, and let it go.</p>
                    <p>Every thought is shared anonymously and drifts across the screen
                    for everyone who opens the app.</p>

                    <h3>How to share a thought</h3>
                    <ol>
                        <li>Press <strong>Write your thought</strong>.</li>
                        <li>Type what you never said (up to 500 characters).</li>
                        <li>Choose the feeling that fits.</li>
                        <li>Paste a YouTube link and press <strong>Load Song</strong>.</li>
                        <li>Press <strong>Send It</strong>.</li>
                    </ol>

                    <div class="modal-important">
                        <h3>Important</h3>
                        <p>Thoughts are public. Don't include real names, phone numbers,
                        addresses, or anything that could identify you or someone else.</p>
                        <p>Be kind. Thoughts that attack or harass a person aren't welcome here.</p>
                    </div>
                </div>

                <div class="modal-pane" data-pane="help">
                    <h2 class="modal-title">Help</h2>

                    <details>
                        <summary>Can people see who wrote a thought?</summary>
                        <p>No. A thought is saved with its text, feeling and song only.
                        Your email is used to log in and is never shown with it.</p>
                    </details>

                    <details>
                        <summary>Can I delete a thought?</summary>
                        <p>Not yet. Once it's sent, it stays, so read it once more
                        before you press Send It.</p>
                    </details>

                    <details>
                        <summary>My song won't load</summary>
                        <p>Paste a link to a single video, like a youtube.com/watch link
                        or a youtu.be link. Some videos can't be played outside YouTube,
                        so try another upload of the same song.</p>
                    </details>

                    <details>
                        <summary>Logging in takes a long time</summary>
                        <p>The server sleeps when nobody is using it, so the first
                        request can take up to a minute. Wait for it, then try again.</p>
                    </details>

                    <h3>Need someone to talk to?</h3>
                    <p>If things feel heavy, you don't have to carry them alone. In the
                    Philippines, the NCMH Crisis Hotline is free and open 24/7:</p>
                    <ul class="hotline-list">
                        <li><a href="tel:1553">1553</a> (landline, toll-free)</li>
                        <li><a href="tel:+639178998727">0917 899 8727</a> (Globe / TM)</li>
                        <li><a href="tel:+639190571553">0919 057 1553</a> (Smart / TNT)</li>
                    </ul>
                    <p>In an emergency, call <a href="tel:911">911</a>.</p>
                </div>

                <div class="modal-pane" data-pane="report">
                    <h2 class="modal-title">Report a bug</h2>
                    <p>Something not working? Tell us what happened and what you were doing.</p>
                    <textarea id="reportText" class="report-text" maxlength="1000"
                              placeholder="When I pressed Send It, ..."></textarea>
                    <button type="button" id="reportButton" class="report-button">Send report</button>
                    <p id="reportMessage" class="report-message"></p>
                </div>

                <p class="modal-footer">Some things are easier to say through a song.</p>
            </div>
        </div>
    `);

    // Move the email + log out button into the account menu
    document.getElementById("accountSlot").append(welcomeUser, logoutButton);

    const signInLink = document.getElementById("signInLink");
    const accountWrap = document.getElementById("accountWrap");
    const accountButton = document.getElementById("accountButton");
    const accountMenu = document.getElementById("accountMenu");
    const accountInitial = document.getElementById("accountInitial");

    const modalOverlay = document.getElementById("modalOverlay");
    const infoModal = document.getElementById("infoModal");
    const modalClose = document.getElementById("modalClose");
    const panes = document.querySelectorAll(".modal-pane");

    const reportText = document.getElementById("reportText");
    const reportButton = document.getElementById("reportButton");
    const reportMessage = document.getElementById("reportMessage");

    const titles = { about: "About", help: "Help", report: "Report a bug" };
    let lastTrigger = null;


    // ----- account menu -----

    function openAccount() {
        accountMenu.classList.add("open");
        accountButton.setAttribute("aria-expanded", "true");
    }

    function closeAccount() {
        accountMenu.classList.remove("open");
        accountButton.setAttribute("aria-expanded", "false");
    }

    accountButton.addEventListener("click", function () {
        if (accountMenu.classList.contains("open")) {
            closeAccount();
        } else {
            openAccount();
        }
    });

    document.addEventListener("click", function (event) {
        if (!accountWrap.contains(event.target)) {
            closeAccount();
        }
    });

    logoutButton.addEventListener("click", closeAccount);


    // ----- sign in shortcut (when logged out) -----

    signInLink.addEventListener("click", function () {
        showAuthView("login");
        loginEmail.focus();
        loginEmail.scrollIntoView({ block: "center", behavior: "smooth" });
    });


    // ----- modal -----

    function openModal(name, trigger) {
        lastTrigger = trigger;
        closeAccount();

        panes.forEach(function (pane) {
            pane.classList.toggle("active", pane.dataset.pane === name);
        });

        infoModal.setAttribute("aria-label", titles[name] || "UNSAID");
        modalOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
        infoModal.scrollTop = 0;
        modalClose.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove("open");
        document.body.style.overflow = "";

        if (lastTrigger) {
            lastTrigger.focus();
        }
    }

    document.querySelectorAll("[data-open]").forEach(function (button) {
        button.addEventListener("click", function () {
            openModal(button.dataset.open, button);
        });
    });

    modalClose.addEventListener("click", closeModal);

    modalOverlay.addEventListener("click", function (event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        if (modalOverlay.classList.contains("open")) {
            closeModal();
        } else {
            closeAccount();
        }
    });


    // ----- report a bug -----

    reportButton.addEventListener("click", function () {
        const text = reportText.value.trim();

        if (!text) {
            reportMessage.textContent = "Describe the problem first.";
            return;
        }

        if (SUPPORT_EMAIL.indexOf("example.com") !== -1) {
            reportMessage.textContent = "Reports aren't set up yet.";
            return;
        }

        const account =
            writerScreen.classList.contains("hidden")
                ? "not logged in"
                : welcomeUser.textContent;

        const body =
            text +
            "\n\n---\nAccount: " + account +
            "\nBrowser: " + navigator.userAgent;

        window.location.href =
            "mailto:" + SUPPORT_EMAIL +
            "?subject=" + encodeURIComponent("UNSAID bug report") +
            "&body=" + encodeURIComponent(body);

        reportMessage.textContent =
            "Opening your email app. If nothing opens, send it to " +
            SUPPORT_EMAIL + ".";
    });


    // ----- show Sign in or Account depending on login state -----

    function updateTopBar() {
        const loggedIn = !writerScreen.classList.contains("hidden");

        signInLink.classList.toggle("hidden", loggedIn);
        accountWrap.classList.toggle("hidden", !loggedIn);

        if (loggedIn) {
            accountInitial.textContent =
                (welcomeUser.textContent.trim().charAt(0) || "U").toUpperCase();
        } else {
            closeAccount();
        }
    }

    new MutationObserver(updateTopBar).observe(
        writerScreen,
        { attributes: true, attributeFilter: ["class"] }
    );

    updateTopBar();

})();

// =====================================
// RESTORE LOGIN (runs last, after everything is defined)
// =====================================

const savedUser = localStorage.getItem("unsaidUser");

if (savedUser) {
    try {
        showWriter(JSON.parse(savedUser));
    } catch (error) {
        localStorage.removeItem("unsaidUser");
    }
}
