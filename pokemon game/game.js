
let player1Health = 100;
let player2Health = 100;
let gameActive = false;
let player1Pokemon, player2Pokemon;

const cooldowns = {
  p1: [0, 0, 0, 0],
  p2: [0, 0, 0, 0]
};
const COOLDOWN_TIME = 5000; 
const pokemon = {
  charmander: {
    name: "Dharmander",
    image: "charmandar.gif",
    moves: ["Tackle", "Fire Charge", "Ember", "Flame Thrower"],
    attackAnimation: "fireball-pixel.gif"
  },
  pikachu: {
    name: "Nigachu",
    image: "pikachu.gif",
    moves: ["Tackle", "Thunder bolt", "Iron Tail", "Wild Charge"],
    attackAnimation: "nigach.gif" 
  }
};
const moveDamage = {
  "Tackle": 10,
  "Fire Charge": 15,
  "Ember": 12,
  "Flame Thrower": 18,
  "Thunder bolt": 16,
  "Iron Tail": 14,
  "Wild Charge": 20
};
function initGame() {
  document.getElementById("win-screen").style.display = "none";
  player1Pokemon = pokemon.charmander;
  player2Pokemon = pokemon.pikachu;
  document.getElementById("player1-pokemon").style.backgroundImage = `url(${player1Pokemon.image})`;
  document.getElementById("player2-pokemon").style.backgroundImage = `url(${player2Pokemon.image})`;
  document.querySelector("#player1-name .player-name").textContent = player1Pokemon.name;
  document.querySelector("#player2-name .player-name").textContent = player2Pokemon.name;
  for (let i = 0; i < 4; i++) {
    document.getElementById(`p1-move${i+1}`).textContent = `${player1Pokemon.moves[i]} (${["W","A","S","D"][i]})`;
    document.getElementById(`p2-move${i+1}`).textContent = `${player2Pokemon.moves[i]} (${["↑","←","↓","→"][i]})`;
  }
  player1Health = 100;
  player2Health = 100;
  cooldowns.p1 = [0, 0, 0, 0];
  cooldowns.p2 = [0, 0, 0, 0];
  updateHealthBars();
  updateCooldowns();

  document.getElementById("battle-screen").style.display = "none";
  document.getElementById("opening-screen").style.opacity = "1";
  document.getElementById("opening-screen").style.display = "flex";
  setTimeout(() => {
    document.getElementById("opening-screen").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("opening-screen").style.display = "none";
      document.getElementById("battle-screen").style.display = "block";
      gameActive = true;
      showMessage(`Go! ${player1Pokemon.name} vs ${player2Pokemon.name}!`);
    }, 1000);
  }, 2500);
}
function updateHealthBars() {
  document.getElementById("player1-health-fill").style.width = `${player1Health}%`;
  document.getElementById("player2-health-fill").style.width = `${player2Health}%`;
  if (player1Health < 30) {
    document.getElementById("player1-health-fill").style.backgroundColor = "#f44336";
  } else if (player1Health < 60) {
    document.getElementById("player1-health-fill").style.backgroundColor = "#ff9800";
  } else {
    document.getElementById("player1-health-fill").style.backgroundColor = "#4CAF50";
  }

  if (player2Health < 30) {
    document.getElementById("player2-health-fill").style.backgroundColor = "#f44336";
  } else if (player2Health < 60) {
    document.getElementById("player2-health-fill").style.backgroundColor = "#ff9800";
  } else {
    document.getElementById("player2-health-fill").style.backgroundColor = "#4CAF50";
  }
}
function updateCooldowns() {
  const now = Date.now();
  for (let i = 0; i < 4; i++) {
    const p1Button = document.getElementById(`p1-move${i+1}`);
    const p2Button = document.getElementById(`p2-move${i+1}`);

    p1Button.disabled = cooldowns.p1[i] > now;
    p2Button.disabled = cooldowns.p2[i] > now;

    if (p1Button.disabled) {
      const remaining = Math.ceil((cooldowns.p1[i] - now) / 1000);
      p1Button.textContent = `${player1Pokemon.moves[i]} (${remaining}s)`;
    } else {
      p1Button.textContent = `${player1Pokemon.moves[i]} (${["W","A","S","D"][i]})`;
    }

    if (p2Button.disabled) {
      const remaining = Math.ceil((cooldowns.p2[i] - now) / 1000);
      p2Button.textContent = `${player2Pokemon.moves[i]} (${remaining}s)`;
    } else {
      p2Button.textContent = `${player2Pokemon.moves[i]} (${["↑","←","↓","→"][i]})`;
    }
  }
}
function showMessage(message) {
  const messageLog = document.getElementById("message-log");
  messageLog.style.display = "block";
  messageLog.textContent = message;
  setTimeout(() => {
    messageLog.style.display = "none";
  }, 2000);
}
function playAttackAnimation(attacker, moveIndex) {
  const isPlayer1 = attacker === "p1";
  const attackElement = isPlayer1 ? "pokemon1-attack" : "pokemon2-attack";
  let attackImg;
  
  if (isPlayer1) {
    attackImg = pokemon.charmander.attackAnimation;
  } else {
    attackImg = pokemon.pikachu.attackAnimation;
  }
  const attackDiv = document.getElementById(attackElement);
  attackDiv.style.backgroundImage = `url(${attackImg})`;
  attackDiv.style.setProperty('--attack-distance', isPlayer1 ? '300px' : '-300px');
  attackDiv.style.display = "block";
  attackDiv.style.opacity = "1";
  attackDiv.style.animation = "none";
  void attackDiv.offsetWidth; 
  attackDiv.style.animation = "attack 0.5s forwards";
  setTimeout(() => {
    attackDiv.style.display = "none";
  }, 500);
}
function player1Attack(moveIndex) {
  if (!gameActive || cooldowns.p1[moveIndex] > Date.now()) return;
  const moveName = player1Pokemon.moves[moveIndex];
  const damage = moveDamage[moveName] || 10;
  cooldowns.p1[moveIndex] = Date.now() + COOLDOWN_TIME;
  updateCooldowns();
  playAttackAnimation("p1", moveIndex);
  setTimeout(() => {
    player2Health = Math.max(0, player2Health - damage);
    updateHealthBars();
    showMessage(`Player 1's ${player1Pokemon.name} used ${moveName}! (-${damage} HP)`);
    checkGameOver();
  }, 300);
}
function player2Attack(moveIndex) {
  if (!gameActive || cooldowns.p2[moveIndex] > Date.now()) return;
  const moveName = player2Pokemon.moves[moveIndex];
  const damage = moveDamage[moveName] || 10;
  cooldowns.p2[moveIndex] = Date.now() + COOLDOWN_TIME;
  updateCooldowns();
  playAttackAnimation("p2", moveIndex);
  setTimeout(() => {
    player1Health = Math.max(0, player1Health - damage);
    updateHealthBars();
    showMessage(`Player 2's ${player2Pokemon.name} used ${moveName}! (-${damage} HP)`);
    checkGameOver();
  }, 300);
}
function checkGameOver() {
  if (player1Health <= 0) {
    gameActive = false;
    showWinScreen("Player 2 wins!");
  } else if (player2Health <= 0) {
    gameActive = false;
    showWinScreen("Player 1 wins!");
  }
}
function showWinScreen(message) {
  document.getElementById("battle-screen").style.display = "none";
  document.getElementById("win-message").textContent = message;
  document.getElementById("win-screen").style.display = "flex";
}
document.getElementById("play-again-btn").onclick = function() {
  initGame();
};
for (let i = 0; i < 4; i++) {
  document.getElementById(`p1-move${i+1}`).onclick = () => player1Attack(i);
  document.getElementById(`p2-move${i+1}`).onclick = () => player2Attack(i);
}
document.addEventListener("keydown", (event) => {
  if (!gameActive) return;
  switch(event.key.toLowerCase()) {
    case "w": if (!document.getElementById("p1-move1").disabled) player1Attack(0); break;
    case "a": if (!document.getElementById("p1-move2").disabled) player1Attack(1); break;
    case "s": if (!document.getElementById("p1-move3").disabled) player1Attack(2); break;
    case "d": if (!document.getElementById("p1-move4").disabled) player1Attack(3); break;
  }
  switch(event.key) {
    case "ArrowUp": if (!document.getElementById("p2-move1").disabled) player2Attack(0); break;
    case "ArrowLeft": if (!document.getElementById("p2-move2").disabled) player2Attack(1); break;
    case "ArrowDown": if (!document.getElementById("p2-move3").disabled) player2Attack(2); break;
    case "ArrowRight": if (!document.getElementById("p2-move4").disabled) player2Attack(3); break;
  }
});
setInterval(updateCooldowns, 1000);
initGame();
