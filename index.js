// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

let deckId = ""
let computerScore = 0
let myScore = 0
const mainDiv = document.getElementById("main-div")
const newDeckBtn = document.getElementById("new-deck")
const drawBtn = document.getElementById("draw")
const remainText = document.getElementById("remain")
const cardsDiv = document.getElementsByClassName("cards")
const winerH1 = document.getElementById("winer-h1")
const computerText = document.getElementById("computer-score")
const userText = document.getElementById("user-score")

function load(){
    winerH1.textContent = "Game of War"
    computerText.textContent = "Computer score: 0"
    userText.textContent = "Your score: 0"
    cardsDiv[0].children[1].innerHTML = ``
    cardsDiv[0].children[2].innerHTML = ``
}

function getNewDeck(){
    load()
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            drawBtn.disabled = false
            remainText.textContent = `Remaining cards: ${data.remaining}`
        })
}


function getResults(data){
    const card1 = data[0].value
    const card2 = data[1].value
    let cardValues = ["2", "3", "4", "5", "6", "7", "8", "9",
        "10", "JACK", "QUEEN", "KING", "ACE"]
    if(cardValues.indexOf(card1) > cardValues.indexOf(card2)){
        winerH1.textContent = "Computer wins!"
        computerScore++
        computerText.textContent = `Computer score: ${computerScore}`
    }
    else if(cardValues.indexOf(card1) < cardValues.indexOf(card2)){
        winerH1.textContent = "You win!"
        myScore++
        userText.textContent = `Your score: ${myScore}`
    }
    else{
        winerH1.textContent = "War!"
    }
}

newDeckBtn.addEventListener("click", getNewDeck)
drawBtn.addEventListener("click", function(){
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data =>{
            remainText.textContent = `Remaining cards: ${data.remaining}`
            cardsDiv[0].children[1].innerHTML = `<img src="${data.cards[0].image}">`
            cardsDiv[0].children[2].innerHTML = `<img src="${data.cards[1].image}">`
            getResults(data.cards)
            if(data.remaining === 0){
                if(computerScore > myScore){
                    winerH1.textContent = "The computer won the game!"
                }
                else if(computerScore < myScore){
                    winerH1.textContent = "You won the game!"
                }
                else{
                    winerH1.textContent = "It's a tie game!"
                }
                drawBtn.disabled = true
            }
        })
})