const $clearFacts = $("#clearFactsButton");
const $facts = $("#facts");
const $draw = $("#drawButton");
const $auto = $("#autoDrawButton");
const $resetButton = $("#resetButton");
const $pile = $("#cardPile");

// Part One: Number Facts

async function factNum(num){
    try {
        const res = await axios.get(`http://numbersapi.com/${num}?json`);
        console.log(res.data);
    } catch (e) {
        console.log("Error", e);
    }
}

async function factNums(numsArr){
    try{
        const res = await axios.get(`http://numbersapi.com/${numsArr}?json`)
        const facts = Object.values(res.data);
        facts.forEach(fact => $facts.append(`<li>${(fact)}</li>`))
    } catch (e) {
        console.log("Error", e)
    }
}

async function favNum(favNum){
    let numsPromises = [];

    for (let i = 0; i < 4; i++){
        numsPromises.push(
            await axios.get(`http://numbersapi.com/${favNum}?json`)
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

async function getCard(){
    try {
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/draw/?count=1`)
        console.log(res.data.cards[0].value + " of " + res.data.cards[0].suit)
    } catch (e) {
        console.log("Error", e)
    }
}

async function getTwoCards(){
    values = [];
    suits = [];
    try {
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/draw/?count=1`)
        values.push(res.data.cards[0].value)
        suits.push(res.data.cards[0].suit)
        const res2 = await axios.get(`https://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`)
        values.push(res2.data.cards[0].value)
        suits.push(res2.data.cards[0].suit)
        for (i=0; i< values.length; i++){
            console.log(values[i] + " of " + suits[i])
        }
    } catch (e) {
        console.log("Error", e)
    }
}

let deckID;

async function loadDeck(){
    try {
        const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        deckID = res.data.deck_id
    } catch (e) {
        console.log("Error", e)
    }    
}

async function nextCard(){
    try {
        $auto.attr("disabled","");
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
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
    } catch (e) {
        console.log("Error", e)
    }    
}

async function autoDraw(){
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

async function getAllPokemon(){
    try{
        const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000")
        console.log(res)
    } catch (e) {
        console.log("Error", e)
    }   
}

async function random3Pokemon(){
    $("#pokemon").empty()

    const namePromises = [];
    const textPromises = [];

    async function getData(){
        let randNum = Math.floor(Math.random()*1000 + 1)
        let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randNum}`)
        namePromises.push(res)
        let res2 = await axios.get(`${res.data.species.url}`)
        textPromises.push(res2)
    }

    for (let i = 0; i < 3; i++){
        await getData();
        function appendData(){
            let name = namePromises[i].data.name;
            console.log(name);
            let entry = textPromises[i].data.flavor_text_entries.find(entry => entry.language.name =="en");
            let text = entry.flavor_text;
            $("#pokemon").append(`<li>${name}: ${text}</li>`)
        }
        appendData();
    }
}


// testing for fun

// class Pokemon {
//     constructor(id){
//       this.id = id;
//       this.type = [];
//       this.hunger = 0;
//     }
//     async getInfo() {
//       let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.id}`)
//       this.name = res.data.name;
//       for (let type of res.data.types) {
//         this.type.push(type.type.name)
//       }
//     }
//     feed(num){
//         this.hunger += num;
//         console.log(`${this.name} has been fed!`)
//         console.log(this.hunger)
//     }
//   }
  
//   const p = new Pokemon(69)