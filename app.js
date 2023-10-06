const $clearFacts = $("#clearFactsButton");
const $facts = $("#facts");
const $draw = $("#drawButton");
const $auto = $("#autoDrawButton");
const $resetButton = $("#resetButton");
const $pile = $("#cardPile");

// Part One: Number Facts

function factNum(num){
    axios.get(`http://numbersapi.com/${num}?json`)
    .then(res => {
        console.log(res.data);
    })
    .catch(err => {
        console.log("Error", err);
    })
}


function factNums(numsArr){
    axios.get(`http://numbersapi.com/${numsArr}?json`)
    .then(res => {
        let facts = Object.values(res.data);
        facts.forEach(fact => $facts.append(`<li>${(fact)}</li>`))
    })
    .catch(err => console.log("Error", err))

}

function favNum(favNum){
    let numsPromises = [];

    for (let i = 0; i < 4; i++){
        numsPromises.push(
            axios.get(`http://numbersapi.com/${favNum}?json`)
        );
    };

    Promise.all(numsPromises)
    .then((resArr) => resArr.forEach(resObj => $facts.append(`<li>${(resObj.data.text)}</li>`)))
    .catch(err => console.log("Error", err))
}

$clearFacts.on("click", function(){
    $facts.empty();
})

// Part 2: Deck of Cards

function getCard(){
    axios.get(`https://deckofcardsapi.com/api/deck/new/draw/?count=1`)
    .then(res => console.log(res.data.cards[0].value + " of " + res.data.cards[0].suit))
    .catch(err => console.log("Error", err))
}

function getTwoCards(){
    values = [];
    suits = [];

    axios.get(`https://deckofcardsapi.com/api/deck/new/draw/?count=1`)
    .then(res => {
        values.push(res.data.cards[0].value)
        suits.push(res.data.cards[0].suit)
        return axios.get(`https://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`)
    })
    .then(res => {
        values.push(res.data.cards[0].value)
        suits.push(res.data.cards[0].suit)
    })
    .then(() => {
        for (i=0; i< values.length; i++){
            console.log(values[i] + " of " + suits[i])
        }
    })
    .catch(err => console.log("Error", err))
}

let deckID;

function loadDeck(){
    axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => deckID = res.data.deck_id)
    .catch(err => console.log("Error", err))
}

function nextCard(){
    $auto.attr("disabled","");
    axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(res => {
        console.log(res.data.cards[0].value + " of " + res.data.cards[0].suit)
        if (res.data.remaining == 0){
            console.log("Finished.");
            $draw.attr("disabled","");
        } 
        else {
            console.log(`${res.data.remaining} cards remaining.`)
            $pile.prepend(
                `<img class="cards" src="images/${res.data.cards[0].value.toLowerCase()}_of_${res.data.cards[0].suit.toLowerCase()}.png" />`
            )
        }
    })
    .catch(err => console.log("Error", err))
}

function autoDraw(){
    $draw.attr("disabled","");
    count = 0;
    const intID = setInterval(function(){
        if (count == 52){
            clearInterval(intID) 
         } else {
            nextCard();
            count ++;
         }
    }, 100)
}


$draw.on("click", function(){
    nextCard();
})

$auto.on("click", function(){
    autoDraw();
})

$resetButton.on("click", function(){
    location.reload();
})

$(window).on("load", loadDeck());

// Further Study: Pokemon

function getAllPokemon(){
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then(res => console.log(res))
    .catch(err => console.log("Error", err))
}

function random3Pokemon(){
    let pokeNames = [];
    let pokeText = [];
    for (let i = 0; i < 3; i++){
        let randNum = Math.floor(Math.random()*1000+1);
        axios.get(`https://pokeapi.co/api/v2/pokemon/${randNum}`)
        .then(res => {
            pokeNames.push(res.data.name)
            return axios.get(`${res.data.species.url}`)
        })
        .then (res => {
            const entries = res.data.flavor_text_entries;
            for (let j = 0; j < entries.length; j++){
                if (entries[j].language.name == 'en'){
                    pokeText.push(entries[j].flavor_text)
                    break;
                } 
            }
        })
        .then(() => {
                $("#pokemon").append(`<li>${pokeNames[i]}: ${pokeText[i]}</li>`);
        })
        .catch(err => console.log("Error", err))
    }
}