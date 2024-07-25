const cardImages = [
    "cicekler/1.png", 'cicekler/2.png', 'cicekler/3.png', 'cicekler/4.png',
    'cicekler/5.png', 'cicekler/6.png', 'cicekler/7.png', 'cicekler/8.png',
    'cicekler/1.png', 'cicekler/2.png', 'cicekler/3.png', 'cicekler/4.png',
    'cicekler/5.png', 'cicekler/6.png', 'cicekler/7.png', 'cicekler/8.png'
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer;
let timeElapsed = 0;
let flipTimeout;

const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const newGameButton = document.getElementById('new-game');

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back"><img src="${image}" alt="Card Image"></div>
        </div>`;
    card.addEventListener('click', onCardClick);
    return card;
}

function initializeGame() {
    //kartlarin kopyasini olusturduk ,bu kopyayi shuffle fonksiyonuna gonderdik
    cards = shuffle([...cardImages]);
    //gameboard'taki icerigi bosalttik
    gameBoard.innerHTML = '';
    //her gorsel icin kart olusturduk
    cards.forEach(image => {
        const card = createCard(image);
        //karti gameboarda ekler
        gameBoard.appendChild(card);
    });
    resetGame();
}

function onCardClick(event) {
    //tikladiğimiz kart tutuluyor
    const card = event.currentTarget;
    //2den az kart cevrilmis ve daha once cevrilmemisse
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        //flipped sinifini ekledik
        card.classList.add('flipped');
        //cevrilmis kartlari tutan diziye CARD'i ekledik
        flippedCards.push(card);
        //cevrilmis kart iki taneyse flipTimeout sifirla ayni mi kontrol et
        if (flippedCards.length === 2) {
            clearTimeout(flipTimeout);
            checkForMatch();
        } else {
            //bir tane cevrilmis kart varsa flipTimeout baslat
            startFlipTimeout();
        }
    }
}

function checkForMatch() {
    //cevrilmis kartları card1,card2 diye tanimladik
    const [card1, card2] = flippedCards;
    //kartin arka yuzu ayni mi
    if (card1.querySelector('.card-back img').src === card2.querySelector('.card-back img').src) {
        //eslesmis cift sayisini bir artir
        matchedPairs++;
        //eslesmis kartlari sifirla
        flippedCards = [];
        //8 tane eslesmis kart varsa
        if (matchedPairs === 8) {
            //sureyi durdur
            clearInterval(timer);
            //sureye gore mesaji goster
            setTimeout(displayMessage, 500);
        }
        //karlar eslesmezse
    } else {
        //karlar flipped sinifindan kaldirilir(1000 milisaniye icinde)
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            //flippedCards dizisi bosaltilir
            flippedCards = [];
        }, 1000);
    }
}

function displayMessage() {
    let message;
    if (timeElapsed <= 40) {
        message = 'Great job! You are lucky and fast.';
    } else if (timeElapsed <= 50) {
        message = 'Well done! You scored the same as my little bro.';
    } else {
        message = "Don't worry, The flowers are very similar.";
    }
    messageElement.textContent = message;
}

function updateTimer() {
    //sure bir artiyor
    timeElapsed++;
    //dakika hesabi
    const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
    //saniye hesabi
    const seconds = String(timeElapsed % 60).padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
}

function resetGame() {
     clearInterval(timer);
    //kartlarin cevrilme suresi sifirlanir
    clearTimeout(flipTimeout);
    //gecen sureyi sifirlar
    timeElapsed = 0;
    timerElement.textContent = '00.00';
    //yeni zamanlayici cagrildi
    timer = setInterval(updateTimer, 1000);
    //eslesmis kartlar sifirlandi
    matchedPairs = 0;
    messageElement.textContent = '';
    //fonksiyon cagrilip oyunu yeniden baslatir
    initializeGame();
}
//ikinci karti secme icin sure hesaplamasi
function startFlipTimeout() {
      // 3 saniye kontrolu
     flipTimeout = setTimeout(() => { if 
     (flippedCards.length === 1) { 
      flippedCards[0].classList.remove('flipped'); flippedCards = []; 
      shuffleCards(); } }, 3000); } 
      
      
      
      function shuffleCards() { 
        // Sadece eslesmemis kartlari sectik
        const unmatchedCards = Array.from(document.querySelectorAll('.card')).filter(card => !card.classList.contains('flipped') && !card.classList.contains('matched'));
         // Kartlari DOM'dan gecici olarak kaldir 
        unmatchedCards.forEach(card => gameBoard.removeChild(card)); 
        // Kartlari karistir 
        const shuffledCards = unmatchedCards.sort(() => Math.random() - 0.5);
         // Karismis kartlari yeniden DOM'a ekle
         shuffledCards.forEach(card => gameBoard.appendChild(card)); }


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

newGameButton.addEventListener('click', resetGame);


initializeGame();
