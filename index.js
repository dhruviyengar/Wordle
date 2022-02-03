currentGuess = ""
guessIndex = 0;
gameFinished = false

word = "Words"

fetch("https://raw.githubusercontent.com/SecretAgent-YT/Wordle/main/words.txt")
    .then( function(response) {
        response.text().then( function(text) {
            var words = text.split("\r\n")
            word = words[Math.floor(Math.random()*words.length)]
        })
    })

document.addEventListener("keypress", (event) => {
    if (gameFinished) return
    if (event.key == "Enter") {
        submitGuess()
    } else if (isLetter(event.key)) {
        addLetter(event.key.toUpperCase())
    }
}, false)

document.addEventListener("keydown", (event) => {
    if (gameFinished) return
    if (event.key == "Backspace") removeLetter()
}, false)

function addLetter(letter) {
    if (currentGuess.length >= 5) return
    currentGuess += letter;
    updateCurrentGuess()
}

function removeLetter() {
    currentGuess = currentGuess.slice(0, -1)
    updateCurrentGuess()
}

function updateCurrentGuess() {
    if (currentGuess == "") {
        document.getElementById("currentGuess").innerHTML = "...";
        return
    }
    document.getElementById("currentGuess").innerHTML = currentGuess;
}

function submitGuess() {
    if (currentGuess.length < 5 || guessIndex == 6) return
    guessIndex++;
    for (var i = 0; i < currentGuess.length; i++) {
        char = currentGuess.charAt(i);
        if (word.charAt(i).toUpperCase() == char) {
            document.getElementById("guess" + guessIndex).innerHTML += "<span class='correct'>" + char + "</span>";
        } else if (word.includes(char.toLowerCase())) {
            document.getElementById("guess" + guessIndex).innerHTML += "<span class='contains'>" + char + "</span>";
        } else {
            document.getElementById("guess" + guessIndex).innerHTML += "<span class='wrong'>" + char + "</span>";
        }
    }
    if (currentGuess == word.toUpperCase()) {
        endGame(true)
    } else if (guessIndex == 6) {
        endGame(false)
    }
    currentGuess = "";
    updateCurrentGuess()
}

function endGame(won) {
    gameFinished = true
    document.getElementById("popup").style.display = "block";
    if (won) {
        document.getElementById("result").innerHTML = "Result: Victory"
    } else {
        document.getElementById("result").innerHTML = "Result: Defeat"
    }
    document.getElementById("word").innerHTML = "Word: " + word.toUpperCase()
}

function isLetter(char) {
    return (/[a-zA-Z]/).test(char)
}

