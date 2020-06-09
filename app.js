// Game values
const min = 0,
  max = 9,
  winningNum = getRandomNum(min, max),
  attempts = [];

let guessesLeft = 3;

// UI Elements
const game = document.querySelector("#game"),
  minNum = document.querySelector(".min-num"),
  maxNum = document.querySelector(".max-num"),
  guessBtn = document.querySelector("#guess-btn"),
  guessInput = document.querySelector("#guess-input"),
  message = document.querySelector(".message"),
  playAgain = document.querySelector(".play-again");

// Assign UI min and max
minNum.textContent = min;
maxNum.textContent = max;

// Play again event listener
game.addEventListener("mousedown", function (e) {
  if (e.target.className === "play-again") {
    window.location.reload();
  }
});

// Listen for guess
guessBtn.addEventListener("click", function (guessed) {
  let guess = parseInt(guessInput.value);

  // Validate
  if (isNaN(guess) || guess < min || guess > max) {
    setMessage(`Please enter a number between ${min} and ${max}`, "red");
  } else {
    // Check if won
    if (guess === winningNum) {
      gameOver(true, `${winningNum} is correct, You Win!`);
    } else {
      if (repeatedNumber(guess)) {
        setMessage(
          `Number ${guess} has been already picked, try another`,
          "red"
        );
        // Clear input
        guessInput.value = "";
        return;
      }
      // Wrong number
      guessesLeft -= 1;

      if (guessesLeft === 0) {
        // Game over - lost

        gameOver(
          false,
          `Game Over, you lost. The correct number was ${winningNum}`
        );
      } else {
        // Game continues - answer wrong

        // change border color
        guessInput.style.borderColor = "red";

        // Tell user its the wrong number
        setMessage(
          `${guess} is not correct, ${guessesLeft} guesses left`,
          "red"
        );

        // Store in SessionStorage
        addGuessedNumber(guessInput.value);

        // Clear input
        guessInput.value = "";
      }
    }
  }
});

// Store guessed number
function addGuessedNumber(guessed) {
  attempts.push(guessed);
}

// Repeated number
function repeatedNumber(guess) {
  let isRepeated = false;
  attempts.forEach((element) => {
    if (parseInt(element) === guess) {
      isRepeated = true;
    }
  });
  return isRepeated;
}

// Game Over
function gameOver(won, msg) {
  let color;
  won === true ? (color = "#5F9EA0") : (color = "red");

  // Disable input
  guessInput.disabled = true;
  // change border color
  guessInput.style.borderColor = "#5F9EA0";
  // change text color
  message.style.color = color;

  // Set message
  setMessage(msg);

  // Play again?
  guessBtn.value = "Play Again";
  guessBtn.className += "play-again";
}

// Remove from LS
function removeGuessedFromSS(guessItem) {
  let guessBtn;
  if (sessionStorage.getItem("guessBtn") === null) {
    guessBtn = [];
  } else {
    guessBtn = JSON.parse(localStorage.getItem("guessBtn"));
  }

  guessBtn.forEach(function (guessBtn, index) {
    if (guessItem.textContent === guessed) {
      guessBtn.splice(index, 1);
    }
  });

  sessionStorage.setItem("guessBtn", JSON.stringify(guessBtn));
}

// Get Winning Number
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Set Message
function setMessage(msg, color) {
  message.style.color = color;
  message.textContent = msg;
}
