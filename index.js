currentGuess = ""
guessIndex = 0;
gameFinished = false

seconds = 0

function refreshSeconds() {
    if (gameFinished) return
    seconds++;
    document.getElementById("time").innerHTML = "Time: " + parseTime(seconds)
}

setInterval(refreshSeconds, 1000)

word = "Words"

fetch("https://raw.githubusercontent.com/SecretAgent-YT/Wordle/main/words.txt")
    .then( function(response) {
        response.text().then( function(text) {
            var words = text.split("\r\n")
            word = words[Math.floor(Math.random()*words.length)]
        })
    })

document.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        if (!gameFinished) {
            submitGuess()
        } else {
            location.reload()
        }
    } else if (isLetter(event.key) && !gameFinished) {
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
        document.getElementById("result").innerHTML = "Result: <span class='correct'>Victory</span>"
    } else {
        document.getElementById("result").innerHTML = "Result: <span class='red'>Defeat</span>"
    }
    document.getElementById("popup").style.animation = "slideIn 1s"
    document.getElementById("word").innerHTML = "Word: " + word.toUpperCase()
    document.getElementById("time-result").innerHTML = "Time: " + parseTime(seconds)
    document.getElementById("guesses").innerHTML = "Guesses: " + guessIndex
}

function isLetter(char) {
    return (/[a-zA-Z]/).test(char)
}

function parseTime(seconds) {
    if (seconds < 60) {
        if (seconds < 10) return "00:0" + seconds
        return "00:" + seconds
    } else {
        if (seconds % 60 < 10) {
            return Math.floor(seconds / 60) + ":0" + seconds % 60
        }
        return Math.floor(seconds / 60) + ":" + seconds % 60
    }
}