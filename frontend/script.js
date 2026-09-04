/* ==========================================================
   Fact + game data
   Each entry defines its own tiny game via renderGame(area, win)
   win() should be called exactly once, when the player succeeds.
   ========================================================== */

const FACTS = [
  {
    id: "space",
    title: "Space",
    sub: "tap fast",
    emoji: "🚀",
    color: "--coral",
    shape: "shape-fold",
    instructions: "Tap the rocket 18 times before the timer runs out.",
    fact: "A day on Venus is longer than its year: it takes about 243 Earth days to spin once, but only 225 to circle the Sun.",
    renderGame(area, win) {
      const target = 18;
      const seconds = 6;
      let count = 0;
      let timeLeft = seconds;
      let ticking = null;

      area.innerHTML = `
        <div class="tapper-count">0<span style="font-size:1.4rem;color:var(--ink-soft)"> / ${target}</span></div>
        <p class="tapper-timer">${timeLeft.toFixed(1)}s left</p>
        <button class="game-btn" id="tapBtn" type="button">Tap the rocket 🚀</button>
      `;
      const countEl = area.querySelector(".tapper-count");
      const timerEl = area.querySelector(".tapper-timer");
      const btn = area.querySelector("#tapBtn");

      const start = performance.now();
      ticking = setInterval(() => {
        const elapsed = (performance.now() - start) / 1000;
        timeLeft = Math.max(0, seconds - elapsed);
        timerEl.textContent = `${timeLeft.toFixed(1)}s left`;
        if (timeLeft <= 0) {
          clearInterval(ticking);
          if (count < target) {
            btn.disabled = true;
            btn.textContent = "Out of time — try again";
            setTimeout(() => this.renderGame(area, win), 900);
          }
        }
      }, 100);

      btn.addEventListener("click", () => {
        count++;
        countEl.innerHTML = `${count}<span style="font-size:1.4rem;color:var(--ink-soft)"> / ${target}</span>`;
        if (count >= target) {
          clearInterval(ticking);
          btn.disabled = true;
          btn.textContent = "Liftoff! 🚀";
          win();
        }
      });
    }
  },

  {
    id: "ocean",
    title: "Ocean",
    sub: "match pairs",
    emoji: "🌊",
    color: "--sky",
    shape: "shape-blob",
    instructions: "Flip the tiles two at a time and find all three matching pairs.",
    fact: "We've mapped less than a quarter of the ocean floor in detail — there are better maps of the Moon and Mars than of Earth's own seabed.",
    renderGame(area, win) {
      const icons = ["🐚", "🐠", "🌊"];
      let deck = [...icons, ...icons].map((icon, i) => ({ icon, i, flipped: false, matched: false }));
      deck.sort(() => Math.random() - 0.5);

      let openIndexes = [];
      let lock = false;

      area.innerHTML = `<div class="memory-grid"></div>`;
      const grid = area.querySelector(".memory-grid");

      function draw() {
        grid.innerHTML = "";
        deck.forEach((card, idx) => {
          const tile = document.createElement("button");
          tile.type = "button";
          tile.className = "memory-tile" + (card.flipped || card.matched ? " flipped" : "") + (card.matched ? " matched" : "");
          tile.textContent = card.flipped || card.matched ? card.icon : "";
          tile.addEventListener("click", () => flip(idx));
          grid.appendChild(tile);
        });
      }

      function flip(idx) {
        if (lock || deck[idx].flipped || deck[idx].matched) return;
        deck[idx].flipped = true;
        openIndexes.push(idx);
        draw();

        if (openIndexes.length === 2) {
          lock = true;
          const [a, b] = openIndexes;
          if (deck[a].icon === deck[b].icon) {
            deck[a].matched = true;
            deck[b].matched = true;
            openIndexes = [];
            lock = false;
            draw();
            if (deck.every(c => c.matched)) {
              setTimeout(win, 300);
            }
          } else {
            setTimeout(() => {
              deck[a].flipped = false;
              deck[b].flipped = false;
              openIndexes = [];
              lock = false;
              draw();
            }, 650);
          }
        }
      }

      draw();
    }
  },

  {
    id: "animals",
    title: "Animals",
    sub: "quick reflexes",
    emoji: "🦎",
    color: "--mint",
    shape: "shape-fold",
    instructions: "Click the critter the moment it pops up. Get 5 hits.",
    fact: "A shrimp's heart sits in its head, not its chest — most of its body is taken up by muscle for swimming.",
    renderGame(area, win) {
      const critters = ["🦎", "🐸", "🐹", "🦔"];
      const holeCount = 9;
      let hits = 0;
      const target = 5;
      let activeHole = null;
      let spawnTimer = null;
      let hideTimer = null;
      let running = true;

      area.innerHTML = `
        <div class="mole-grid"></div>
        <p style="font-weight:700;color:var(--ink-soft)">Hits: <span id="moleScore">0</span> / ${target}</p>
      `;
      const grid = area.querySelector(".mole-grid");
      const scoreEl = area.querySelector("#moleScore");

      const holes = [];
      for (let i = 0; i < holeCount; i++) {
        const hole = document.createElement("button");
        hole.type = "button";
        hole.className = "mole-hole";
        hole.innerHTML = `<span class="critter"></span>`;
        hole.addEventListener("click", () => {
          if (hole.classList.contains("up")) {
            hits++;
            scoreEl.textContent = hits;
            hole.classList.remove("up");
            if (hits >= target) {
              running = false;
              clearTimeout(spawnTimer);
              clearTimeout(hideTimer);
              win();
            }
          }
        });
        grid.appendChild(hole);
        holes.push(hole);
      }

      function spawn() {
        if (!running) return;
        if (activeHole) activeHole.classList.remove("up");
        const hole = holes[Math.floor(Math.random() * holes.length)];
        hole.querySelector(".critter").textContent = critters[Math.floor(Math.random() * critters.length)];
        hole.classList.add("up");
        activeHole = hole;
        hideTimer = setTimeout(() => {
          hole.classList.remove("up");
          spawnTimer = setTimeout(spawn, 250);
        }, 700);
      }
      spawnTimer = setTimeout(spawn, 500);
    }
  },

  {
    id: "history",
    title: "History",
    sub: "one quick question",
    emoji: "🏺",
    color: "--sun",
    shape: "shape-blob",
    instructions: "Answer correctly to open the trapdoor.",
    fact: "The Great Fire of London in 1666 tore through most of the city but only a handful of deaths were officially recorded.",
    renderGame(area, win) {
      const options = ["Colossus of Rhodes", "Great Pyramid of Giza", "Hanging Gardens", "Lighthouse of Alexandria"];
      const correct = "Great Pyramid of Giza";

      area.innerHTML = `
        <p class="quiz-question">Which ancient wonder still stands in Egypt today?</p>
        <div class="quiz-options"></div>
      `;
      const optWrap = area.querySelector(".quiz-options");
      options.forEach(opt => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          const allBtns = optWrap.querySelectorAll(".quiz-option");
          allBtns.forEach(b => b.disabled = true);
          if (opt === correct) {
            btn.classList.add("correct");
            setTimeout(win, 500);
          } else {
            btn.classList.add("wrong");
            setTimeout(() => {
              allBtns.forEach(b => { b.disabled = false; b.classList.remove("wrong"); });
            }, 700);
          }
        });
        optWrap.appendChild(btn);
      });
    }
  },

  {
    id: "body",
    title: "Human body",
    sub: "test your reflexes",
    emoji: "🫁",
    color: "--lilac",
    shape: "shape-fold",
    instructions: "Wait for the box to turn green, then click it as fast as you can.",
    fact: "Your nose can tell apart over a trillion different scents — far more than the handful of colors your eyes distinguish.",
    renderGame(area, win) {
      area.innerHTML = `
        <div class="reflex-box" id="reflexBox">Click to start</div>
      `;
      const box = area.querySelector("#reflexBox");
      let state = "idle"; // idle -> waiting -> go
      let goTime = 0;
      let timeout = null;

      box.addEventListener("click", () => {
        if (state === "idle") {
          state = "waiting";
          box.textContent = "Wait for green…";
          box.classList.remove("go", "early");
          const delay = 800 + Math.random() * 1800;
          timeout = setTimeout(() => {
            state = "go";
            goTime = performance.now();
            box.classList.add("go");
            box.textContent = "Click now!";
          }, delay);
        } else if (state === "waiting") {
          clearTimeout(timeout);
          state = "idle";
          box.classList.add("early");
          box.textContent = "Too soon — click to try again";
          setTimeout(() => box.classList.remove("early"), 400);
        } else if (state === "go") {
          const reaction = Math.round(performance.now() - goTime);
          box.textContent = `${reaction} ms — nice reflexes!`;
          box.classList.remove("go");
          setTimeout(win, 500);
        }
      });
    }
  },

  {
    id: "food",
    title: "Food",
    sub: "unscramble it",
    emoji: "🍯",
    color: "--peach",
    shape: "shape-blob",
    instructions: "Unscramble the letters to spell a food that never spoils.",
    fact: "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.",
    renderGame(area, win) {
      const word = "HONEY";
      let scrambled = word;
      while (scrambled === word) {
        scrambled = word.split("").sort(() => Math.random() - 0.5).join("");
      }

      area.innerHTML = `
        <p class="scramble-word">${scrambled}</p>
        <input class="scramble-input" id="scrambleInput" type="text" maxlength="5" placeholder="your guess" autocomplete="off" />
        <button class="game-btn small" id="scrambleBtn" type="button">Check</button>
      `;
      const input = area.querySelector("#scrambleInput");
      const btn = area.querySelector("#scrambleBtn");

      function check() {
        if (input.value.trim().toUpperCase() === word) {
          win();
        } else {
          input.style.borderColor = "var(--coral)";
          setTimeout(() => { input.style.borderColor = "var(--ink)"; }, 400);
        }
      }
      btn.addEventListener("click", check);
      input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
    }
  },

  {
    id: "internet",
    title: "Internet",
    sub: "tap in order",
    emoji: "🕸️",
    color: "--teal",
    shape: "shape-fold",
    instructions: "Tap the tiles from 1 to 9 in order, as quickly as you can.",
    fact: "The first-ever website is still online. It went live in 1991 and simply explained what the World Wide Web was.",
    renderGame(area, win) {
      const numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
      let next = 1;

      area.innerHTML = `<div class="seq-grid"></div>`;
      const grid = area.querySelector(".seq-grid");

      numbers.forEach(n => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "seq-tile";
        tile.textContent = n;
        tile.addEventListener("click", () => {
          if (n === next) {
            tile.classList.add("done");
            tile.disabled = true;
            next++;
            if (next > 9) {
              setTimeout(win, 300);
            }
          } else {
            grid.animate(
              [{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }],
              { duration: 200 }
            );
          }
        });
        grid.appendChild(tile);
      });
    }
  },

  {
    id: "nature",
    title: "Nature",
    sub: "beat the game",
    emoji: "🌱",
    color: "--blush",
    shape: "shape-blob",
    instructions: "Play rock, paper, scissors. Win one round to continue.",
    fact: "Bananas are naturally a little radioactive because of their potassium — though you'd need to eat several million at once for it to matter.",
    renderGame(area, win) {
      const choices = { rock: "🪨", paper: "📄", scissors: "✂️" };
      area.innerHTML = `
        <div class="rps-row">
          <button class="game-btn rps-btn" data-choice="rock">🪨</button>
          <button class="game-btn rps-btn" data-choice="paper">📄</button>
          <button class="game-btn rps-btn" data-choice="scissors">✂️</button>
        </div>
        <div class="rps-result" id="rpsResult"></div>
      `;
      const resultEl = area.querySelector("#rpsResult");

      function decide(user) {
        const keys = Object.keys(choices);
        const cpu = keys[Math.floor(Math.random() * keys.length)];
        let outcome;
        if (user === cpu) outcome = "draw";
        else if (
          (user === "rock" && cpu === "scissors") ||
          (user === "paper" && cpu === "rock") ||
          (user === "scissors" && cpu === "paper")
        ) outcome = "win";
        else outcome = "lose";

        resultEl.innerHTML = `<span>${choices[user]}</span><span class="rps-vs">vs</span><span>${choices[cpu]}</span>`;

        if (outcome === "win") {
          setTimeout(win, 700);
        } else {
          const msg = document.createElement("p");
          msg.style.fontWeight = "700";
          msg.style.color = "var(--ink-soft)";
          msg.textContent = outcome === "draw" ? "A draw — go again." : "The game wins that round — try again.";
          area.appendChild(msg);
          setTimeout(() => msg.remove(), 1200);
        }
      }

      area.querySelectorAll(".rps-btn").forEach(btn => {
        btn.addEventListener("click", () => decide(btn.dataset.choice));
      });
    }
  }
];

/* ==========================================================
   View wiring
   ========================================================== */
const homeView = document.getElementById("homeView");
const gameView = document.getElementById("gameView");
const factGrid = document.getElementById("factGrid");
const backBtn = document.getElementById("backBtn");
const gameEmoji = document.getElementById("gameEmoji");
const gameTitle = document.getElementById("gameTitle");
const gameInstructions = document.getElementById("gameInstructions");
const gameArea = document.getElementById("gameArea");
const gamePanel = document.getElementById("gamePanel");
const gameStatus = document.getElementById("gameStatus");
const factReveal = document.getElementById("factReveal");
const factText = document.getElementById("factText");
const nextFactBtn = document.getElementById("nextFactBtn");

function buildGrid() {
  FACTS.forEach(fact => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `fact-card ${fact.shape}`;
    card.style.setProperty("--card-color", `var(${fact.color})`);
    card.style.setProperty("--tilt", `${(FACTS.indexOf(fact) % 2 === 0 ? -1 : 1) * (1.5 + (FACTS.indexOf(fact) % 3))}deg`);
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <span class="fact-card-emoji">${fact.emoji}</span>
      <div>
        <p class="fact-card-title">${fact.title}</p>
        <p class="fact-card-sub">${fact.sub}</p>
      </div>
    `;
    card.addEventListener("click", () => openGame(fact));
    factGrid.appendChild(card);
  });
}

function openGame(fact) {
  homeView.classList.add("hidden");
  gameView.classList.remove("hidden");
  gamePanel.classList.remove("hidden");
  factReveal.classList.add("hidden");
  gameStatus.textContent = "";

  gameEmoji.textContent = fact.emoji;
  gameEmoji.style.setProperty("--topic-color", `var(${fact.color})`);
  gameArea.style.setProperty("--topic-color", `var(${fact.color})`);
  gameTitle.textContent = fact.title;
  gameInstructions.textContent = fact.instructions;
  gameArea.innerHTML = "";

  fact.renderGame(gameArea, () => revealFact(fact));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const CONFETTI_COLORS = ["--coral", "--sky", "--mint", "--sun", "--lilac", "--peach", "--teal", "--blush"];

function burstConfetti(container) {
  const count = 16;
  for (let i = 0; i < count; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti-bit";
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 60 + Math.random() * 70;
    bit.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    bit.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    bit.style.setProperty("--r", `${Math.random() * 360}deg`);
    bit.style.background = `var(${CONFETTI_COLORS[i % CONFETTI_COLORS.length]})`;
    bit.style.animationDelay = `${Math.random() * 80}ms`;
    container.appendChild(bit);
    setTimeout(() => bit.remove(), 1100);
  }
}

function revealFact(fact) {
  gameStatus.textContent = "Solved!";
  factText.textContent = fact.fact;
  factReveal.classList.remove("hidden");
  factReveal.querySelector(".fact-reveal-card").style.setProperty("--topic-color", `var(${fact.color})`);
  burstConfetti(factReveal.querySelector(".fact-reveal-card"));
}

backBtn.addEventListener("click", () => {
  gameView.classList.add("hidden");
  homeView.classList.remove("hidden");
});

nextFactBtn.addEventListener("click", () => {
  gameView.classList.add("hidden");
  homeView.classList.remove("hidden");
});

buildGrid();