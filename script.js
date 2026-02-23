// Glow Follow Effect - adding some glow to buttons on hover
const buttons = document.querySelectorAll(".glow-btn");

buttons.forEach(button => {
    button.addEventListener("mousemove", e => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Setting custom properties for the glow position
        button.style.setProperty("--x", x + "px");
        button.style.setProperty("--y", y + "px");
    });
});

// Firefly animation - I wanted to make it look cool
const canvas = document.getElementById("fireflyCanvas");
const ctx = canvas.getContext("2d");

// Make canvas full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireflies = [];

// Creating 100 fireflies (might be overkill but looks nice)
for (let i = 0; i < 100; i++) {
    fireflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireflies.forEach(function(f) {
        // Move each firefly
        f.x += f.speedX;
        f.y += f.speedY;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd166";
        ctx.shadowColor = "#ffd166";
        ctx.shadowBlur = 15;
        ctx.fill();

        // Bounce off edges - keeps them in the canvas
        if (f.x < 0 || f.x > canvas.width) f.speedX *= -1;
        if (f.y < 0 || f.y > canvas.height) f.speedY *= -1;
    });

    requestAnimationFrame(animate);
}

animate();  // Start the animation

// Scroll Reveal - shows sections when you scroll to them
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.3  // Trigger when 30% visible
});

sections.forEach(function(section) {
    observer.observe(section);
});

// Game modal functions
function showStartScreen(container, title, startCallback) {
    container.innerHTML = "";

    const screen = document.createElement("div");
    screen.style.textAlign = "center";
    screen.style.animation = "fadeInGame 1s ease";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start Game";
    startBtn.className = "glow-btn";
    startBtn.style.marginTop = "20px";

    startBtn.onclick = function() {
        screen.style.opacity = "0";
        setTimeout(function() {
            startCallback();
        }, 500);
    };

    screen.appendChild(heading);
    screen.appendChild(startBtn);
    container.appendChild(screen);
}

function openGame(type) {
    const modal = document.getElementById("gameModal");
    const container = document.getElementById("gameContainer");

    modal.style.display = "flex";
    container.innerHTML = "";

    // Launch the correct game
    if (type === "firefly") {
        startFireflyGame(container);
    }
    if (type === "memory") {
        startMemoryGame(container);
    }
    if (type === "shadow") {
        startShadowGame(container);
    }
}

function closeGame() {
    document.getElementById("gameModal").style.display = "none";
}

// Firefly catching game
function startFireflyGame(container) {
    let score = 0;

    const scoreText = document.createElement("h3");
    scoreText.textContent = "Score: 0";
    container.appendChild(scoreText);

    const gameArea = document.createElement("div");
    gameArea.style.position = "relative";
    gameArea.style.height = "400px";
    gameArea.style.background = "#0a094d";
    gameArea.style.borderRadius = "15px";
    container.appendChild(gameArea);

    function spawnFirefly() {
        const firefly = document.createElement("div");
        firefly.style.position = "absolute";
        firefly.style.width = "20px";
        firefly.style.height = "20px";
        firefly.style.borderRadius = "50%";
        firefly.style.background = "#ffd166";
        firefly.style.boxShadow = "0 0 15px #ffd166";

        // Random position
        firefly.style.left = Math.random() * 90 + "%";
        firefly.style.top = Math.random() * 90 + "%";

        firefly.onclick = function() {
            score++;
            scoreText.textContent = "Score: " + score;
            firefly.remove();
        };

        gameArea.appendChild(firefly);

        // Remove after 2 seconds if not clicked
        setTimeout(function() {
            firefly.remove();
        }, 2000);
    }

    // Spawn a firefly every second
    setInterval(spawnFirefly, 1000);
}

// Memory matching game
function startMemoryGame(container) {
    const symbols = ["🌿","🌿","🔥","🔥","🌙","🌙","🍃","🍃"];
    // Shuffle the cards
    symbols.sort(function() {
        return 0.5 - Math.random();
    });

    let first = null;
    let lock = false;

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
    grid.style.gap = "10px";
    container.appendChild(grid);

    symbols.forEach(function(symbol) {
        const card = document.createElement("div");
        card.textContent = "?";
        card.style.height = "80px";
        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.justifyContent = "center";
        card.style.fontSize = "30px";
        card.style.background = "#0a094d";
        card.style.borderRadius = "10px";
        card.style.cursor = "pointer";

        card.onclick = function() {
            if (lock || card.textContent !== "?") return;

            card.textContent = symbol;

            if (!first) {
                first = card;
            } else {
                // Check if cards match
                if (first.textContent === card.textContent) {
                    first = null;  // Match found!
                } else {
                    lock = true;
                    setTimeout(function() {
                        first.textContent = "?";
                        card.textContent = "?";
                        first = null;
                        lock = false;
                    }, 800);
                }
            }
        };

        grid.appendChild(card);
    });
}

// Shadow dodge game
function startShadowGame(container) {
    showStartScreen(container, "Shadow Dodge", function() {
        runGame();
    });

    function runGame() {
        container.innerHTML = "";
        let score = 0;
        let gameOver = false;

        const scoreText = document.createElement("h3");
        scoreText.textContent = "Score: 0";
        container.appendChild(scoreText);

        const gameArea = document.createElement("div");
        gameArea.style.position = "relative";
        gameArea.style.height = "400px";
        gameArea.style.background = "#08083b";
        gameArea.style.borderRadius = "15px";
        gameArea.style.overflow = "hidden";
        container.appendChild(gameArea);

        // Player circle
        const player = document.createElement("div");
        player.style.position = "absolute";
        player.style.width = "25px";
        player.style.height = "25px";
        player.style.borderRadius = "50%";
        player.style.background = "#ffd166";
        player.style.boxShadow = "0 0 20px #ffd166";
        player.style.bottom = "10px";
        player.style.left = "50%";
        player.style.transform = "translateX(-50%)";
        gameArea.appendChild(player);

        // Move player with mouse
        document.addEventListener("mousemove", function(e) {
            const rect = gameArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x > 0 && x < rect.width - 25) {
                player.style.left = x + "px";
            }
        });

        function spawnShadow() {
            if (gameOver) return;

            const shadow = document.createElement("div");
            shadow.style.position = "absolute";
            shadow.style.width = "30px";
            shadow.style.height = "30px";
            shadow.style.background = "#0a094d";
            shadow.style.top = "0px";
            shadow.style.left = Math.random() * 90 + "%";
            shadow.style.borderRadius = "8px";

            gameArea.appendChild(shadow);

            let fall = setInterval(function() {
                let top = parseInt(shadow.style.top);
                shadow.style.top = top + 5 + "px";

                const shadowRect = shadow.getBoundingClientRect();
                const playerRect = player.getBoundingClientRect();

                // Check collision - note: could probably optimize this
                if (
                    shadowRect.bottom >= playerRect.top &&
                    shadowRect.left < playerRect.right &&
                    shadowRect.right > playerRect.left
                ) {
                    gameOver = true;
                    clearInterval(fall);
                    showGameOver(container, score, function() {
                        startShadowGame(container);
                    });
                }

                // Shadow went past player
                if (top > 400) {
                    shadow.remove();
                    clearInterval(fall);
                    score++;
                    scoreText.textContent = "Score: " + score;
                }
            }, 30);
        }

        // Spawn shadows every 200ms - gets pretty hectic!
        setInterval(spawnShadow, 200);
    }
}

function showGameOver(container, score, restartCallback) {
    container.innerHTML = "";

    const screen = document.createElement("div");
    screen.style.textAlign = "center";
    screen.style.animation = "fadeInGame 1s ease";

    const heading = document.createElement("h2");
    heading.textContent = "Game Over";

    const scoreText = document.createElement("p");
    scoreText.textContent = "Final Score: " + score;
    scoreText.style.margin = "20px 0";

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Play Again";
    restartBtn.className = "glow-btn";

    restartBtn.onclick = function() {
        screen.style.opacity = "0";
        setTimeout(function() {
            restartCallback();
        }, 500);
    };

    screen.appendChild(heading);
    screen.appendChild(scoreText);
    screen.appendChild(restartBtn);
    container.appendChild(screen);
}

// TODO: Add cursor effect here - maybe later
// Could add some cool particle effect that follows the cursor around, maybe with a slight delay for a trailing effect
// learn to make difficulty ranging for the games ormaybe increase spawn rate or speed as score increases
// add timer on firefly game for an extra challenge
