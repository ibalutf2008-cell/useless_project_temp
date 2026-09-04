 /* ==========================================================
   Fact + interaction data
   Each entry defines its own tiny animated interaction via
   renderGame(area, win). win() should be called exactly once,
   when the player has uncovered the fact.
   ========================================================== */

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rectsOverlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function shakeEl(el) {
  el.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
    { duration: 300 }
  );
}

const FACTS = [
  {
    id: "pringles",
    title: "Pringles",
    sub: "guess where",
    emoji: "🥫",
    color: "--coral",
    shape: "shape-fold",
    instructions: "The inventor of Pringles was buried somewhere a little unusual. Click an object to guess where.",
    fact: "The inventor of Pringles, Fredric Baur, loved his can design so much that some of his ashes were buried inside an actual Pringles can.",
    renderGame(area, win) {
      const options = shuffled([
        { emoji: "⚱️", correct: false },
        { emoji: "🥫", correct: true },
        { emoji: "📦", correct: false },
        { emoji: "🎁", correct: false },
        { emoji: "🏺", correct: false },
        { emoji: "🧳", correct: false },
      ]);

      area.innerHTML = `<div class="guess-grid"></div>`;
      const grid = area.querySelector(".guess-grid");

      options.forEach(opt => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "guess-option";
        btn.textContent = opt.emoji;
        btn.addEventListener("click", () => {
          if (opt.correct) {
            grid.querySelectorAll(".guess-option").forEach(b => b.disabled = true);
            btn.classList.add("right");
            setTimeout(win, 650);
          } else {
            btn.classList.add("wrong");
            setTimeout(() => btn.classList.remove("wrong"), 350);
          }
        });
        grid.appendChild(btn);
      });
    }
  },

  {
    id: "shrimp",
    title: "Shrimp",
    sub: "find the heart",
    emoji: "🦐",
    color: "--peach",
    shape: "shape-blob",
    instructions: "A shrimp's heart isn't where you'd expect. Click around its body until you find it.",
    fact: "A shrimp's heart is tucked away in its head, not its chest — most of its long body is really just tail muscle.",
    renderGame(area, win) {
      const zones = [
        { left: "22%", top: "58%", correct: true },
        { left: "40%", top: "72%", correct: false },
        { left: "55%", top: "50%", correct: false },
        { left: "68%", top: "32%", correct: false },
        { left: "80%", top: "18%", correct: false },
      ];

      area.innerHTML = `
        <div class="find-wrap">
          <span class="find-subject">🦐</span>
        </div>
      `;
      const wrap = area.querySelector(".find-wrap");

      zones.forEach(zone => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "find-zone";
        btn.style.left = zone.left;
        btn.style.top = zone.top;
        btn.addEventListener("click", () => {
          if (btn.classList.contains("tried")) return;

          const bubble = document.createElement("span");
          bubble.className = "find-bubble";
          bubble.style.left = zone.left;
          bubble.style.top = zone.top;

          if (zone.correct) {
            bubble.textContent = "found it! ❤️";
            wrap.appendChild(bubble);
            wrap.querySelectorAll(".find-zone").forEach(z => z.disabled = true);
            setTimeout(win, 700);
          } else {
            bubble.textContent = "nope";
            btn.classList.add("tried");
            wrap.appendChild(bubble);
            setTimeout(() => bubble.remove(), 900);
          }
        });
        wrap.appendChild(btn);
      });
    }
  },

  {
    id: "cloud",
    title: "Clouds",
    sub: "weigh it",
    emoji: "☁️",
    color: "--sky",
    shape: "shape-fold",
    instructions: "Drag the cloud onto the scale to see how much it really weighs.",
    fact: "An average fluffy cumulus cloud weighs around a million tonnes — all that water is just spread out enough to float.",
    renderGame(area, win) {
      area.innerHTML = `
        <div class="drag-wrap">
          <div class="drag-item" id="dragCloud">☁️</div>
          <div class="drop-zone" id="dropZone">
            <span class="scale-icon">⚖️</span>
            <span class="scale-reading" id="scaleReading">0 tonnes</span>
          </div>
        </div>
      `;
      const wrap = area.querySelector(".drag-wrap");
      const cloud = area.querySelector("#dragCloud");
      const zone = area.querySelector("#dropZone");
      const reading = area.querySelector("#scaleReading");

      cloud.style.left = "6px";
      cloud.style.top = "6px";

      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;
      let solved = false;

      cloud.addEventListener("pointerdown", e => {
        if (solved) return;
        dragging = true;
        cloud.classList.add("dragging");
        cloud.setPointerCapture(e.pointerId);
        const r = cloud.getBoundingClientRect();
        offsetX = e.clientX - r.left;
        offsetY = e.clientY - r.top;
      });

      cloud.addEventListener("pointermove", e => {
        if (!dragging) return;
        const wrapRect = wrap.getBoundingClientRect();
        const x = e.clientX - wrapRect.left - offsetX;
        const y = e.clientY - wrapRect.top - offsetY;
        cloud.style.left = `${x}px`;
        cloud.style.top = `${y}px`;

        const overlap = rectsOverlap(cloud.getBoundingClientRect(), zone.getBoundingClientRect());
        zone.classList.toggle("active", overlap);
      });

      cloud.addEventListener("pointerup", e => {
        if (!dragging) return;
        dragging = false;
        cloud.classList.remove("dragging");

        const overlap = rectsOverlap(cloud.getBoundingClientRect(), zone.getBoundingClientRect());
        if (overlap) {
          solved = true;
          cloud.style.pointerEvents = "none";
          const zoneRect = zone.getBoundingClientRect();
          const wrapRect = wrap.getBoundingClientRect();
          cloud.style.left = `${zoneRect.left - wrapRect.left + zoneRect.width / 2 - 30}px`;
          cloud.style.top = `${zoneRect.top - wrapRect.top - 10}px`;

          let shown = 0;
          const target = 1000000;
          const steps = 24;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            shown = Math.round((target / steps) * step);
            reading.textContent = `${shown.toLocaleString()} tonnes`;
            if (step >= steps) {
              clearInterval(timer);
              reading.textContent = "≈ 1,000,000 tonnes";
              setTimeout(win, 500);
            }
          }, 35);
        } else {
          zone.classList.remove("active");
          cloud.style.left = "6px";
          cloud.style.top = "6px";
        }
      });
    }
  },

  {
    id: "comet",
    title: "Comets",
    sub: "give it a sniff",
    emoji: "☄️",
    color: "--teal",
    shape: "shape-blob",
    instructions: "Click the comet to take a sniff. Three whiffs should tell you what it smells like.",
    fact: "Comets often smell like rotten eggs, thanks to sulphur compounds mixed into their icy dust.",
    renderGame(area, win) {
      const needed = 3;
      let count = 0;

      area.innerHTML = `
        <div class="sniff-wrap">
          <button class="sniff-target" id="sniffTarget" type="button">☄️<span class="stink">💨</span></button>
          <p class="sniff-count" id="sniffCount">Whiffs: 0 / ${needed}</p>
        </div>
      `;
      const target = area.querySelector("#sniffTarget");
      const countEl = area.querySelector("#sniffCount");

      target.addEventListener("click", () => {
        count++;
        countEl.textContent = `Whiffs: ${Math.min(count, needed)} / ${needed}`;
        target.classList.remove("puff");
        void target.offsetWidth;
        target.classList.add("puff");

        if (count >= needed) {
          target.disabled = true;
          setTimeout(win, 500);
        }
      });
    }
  },

  {
    id: "platypus",
    title: "Platypus",
    sub: "rub it down",
    emoji: "🦫",
    color: "--mint",
    shape: "shape-fold",
    instructions: "Platypuses don't sweat the usual way. Press and drag back and forth across it until it starts to sweat.",
    fact: "Platypuses don't have regular sweat glands — the milk-making glands on their belly ooze milk that looks just like sweat, since mother platypuses have no nipples.",
    renderGame(area, win) {
      const target = 100;
      let progress = 0;
      let rubbing = false;
      let lastX = 0;
      let lastY = 0;
      let solved = false;

      area.innerHTML = `
        <div class="rub-wrap">
          <div class="rub-target" id="rubTarget">🦫<span class="drop">🥛</span></div>
          <div class="rub-bar-track"><div class="rub-bar-fill" id="rubFill"></div></div>
        </div>
      `;
      const rubTarget = area.querySelector("#rubTarget");
      const fill = area.querySelector("#rubFill");

      rubTarget.addEventListener("pointerdown", e => {
        if (solved) return;
        rubbing = true;
        lastX = e.clientX;
        lastY = e.clientY;
        rubTarget.setPointerCapture(e.pointerId);
      });

      rubTarget.addEventListener("pointermove", e => {
        if (!rubbing || solved) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.hypot(dx, dy);
        lastX = e.clientX;
        lastY = e.clientY;
        progress = Math.min(target, progress + dist * 0.5);
        fill.style.width = `${progress}%`;

        if (progress >= target) {
          solved = true;
          rubTarget.classList.add("sweating");
          setTimeout(win, 700);
        }
      });

      rubTarget.addEventListener("pointerup", () => { rubbing = false; });
      rubTarget.addEventListener("pointerleave", () => { rubbing = false; });
    }
  },

  {
    id: "lightning",
    title: "Lightning",
    sub: "pick a number",
    emoji: "⚡",
    color: "--sun",
    shape: "shape-blob",
    instructions: "How many Suns stacked together would you need to match the heat of one lightning bolt?",
    fact: "A single lightning bolt can reach around 30,000°C — roughly five times hotter than the surface of the Sun.",
    renderGame(area, win) {
      const choices = [2, 5, 10, 20];
      const correct = 5;

      area.innerHTML = `
        <p class="quiz-question">🌡️ Guess the number of Suns:</p>
        <div class="quiz-options"></div>
      `;
      const wrap = area.querySelector(".quiz-options");

      choices.forEach(n => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option sun-option";
        btn.innerHTML = `<span class="sun-icons">${"☀️".repeat(Math.min(n, 6))}${n > 6 ? "…" : ""}</span><span>${n} Suns</span>`;
        btn.addEventListener("click", () => {
          const all = wrap.querySelectorAll(".quiz-option");
          if (n === correct) {
            all.forEach(b => b.disabled = true);
            btn.classList.add("correct");
            setTimeout(win, 550);
          } else {
            btn.classList.add("wrong");
            setTimeout(() => btn.classList.remove("wrong"), 350);
          }
        });
        wrap.appendChild(btn);
      });
    }
  },

  {
    id: "phobia",
    title: "Long words",
    sub: "spell the fear",
    emoji: "😱",
    color: "--lilac",
    shape: "shape-fold",
    instructions: "Tap the pieces in order, left to right, to spell out the fear of long words.",
    fact: "The fear of long words has a wonderfully ironic name: Hippopotomonstrosesquippedaliophobia.",
    renderGame(area, win) {
      const chunks = ["HIPPO", "POTOMONSTRO", "SESQUIPPEDALIO", "PHOBIA"];
      const order = shuffled(chunks.map((text, i) => ({ text, i })));
      let next = 0;

      area.innerHTML = `
        <p class="word-build" id="wordBuild">&nbsp;</p>
        <div class="chunk-grid" id="chunkGrid"></div>
      `;
      const wordBuild = area.querySelector("#wordBuild");
      const grid = area.querySelector("#chunkGrid");

      order.forEach(chunk => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chunk-tile";
        btn.textContent = chunk.text;
        btn.addEventListener("click", () => {
          if (chunk.i === next) {
            btn.classList.add("done");
            wordBuild.textContent = chunks.slice(0, next + 1).join("");
            next++;
            if (next >= chunks.length) {
              setTimeout(win, 700);
            }
          } else {
            shakeEl(btn);
          }
        });
        grid.appendChild(btn);
      });
    }
  },

  {
    id: "headbang",
    title: "Headaches",
    sub: "bang it out",
    emoji: "🤕",
    color: "--blush",
    shape: "shape-blob",
    instructions: "Click your head against the wall and watch the calories add up.",
    fact: "Banging your head against a wall burns about 150 calories an hour — not that we'd recommend testing that math yourself.",
    renderGame(area, win) {
      const target = 150;
      const perClick = 15;
      let count = 0;

      area.innerHTML = `
        <div class="bang-wrap">
          <div class="bang-scene">
            <button class="bang-head" id="bangHead" type="button">🤕</button>
            <span class="bang-wall">🧱</span>
          </div>
          <p class="calorie-counter" id="calorieCounter">0 / ${target} calories</p>
          <div class="calorie-track"><div class="calorie-fill" id="calorieFill"></div></div>
        </div>
      `;
      const head = area.querySelector("#bangHead");
      const counter = area.querySelector("#calorieCounter");
      const fill = area.querySelector("#calorieFill");

      head.addEventListener("click", () => {
        count = Math.min(target, count + perClick);
        counter.textContent = `${count} / ${target} calories`;
        fill.style.width = `${(count / target) * 100}%`;
        head.classList.remove("hit");
        void head.offsetWidth;
        head.classList.add("hit");

        if (count >= target) {
          head.disabled = true;
          setTimeout(win, 500);
        }
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