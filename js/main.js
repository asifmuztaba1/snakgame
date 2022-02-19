let direction={xdir:0,ydir:0};
let speed =10;
let lastPaintTime=0;
let snake=[
    {xdir:13,ydir:15}
];
let score=0,hscore=0;
let foodObject={xdir:8,ydir:10}
//////////////////////////////////////
var mainGameStartButton=document.getElementById("mainStartButton");
var playerOnCanvas=document.getElementById("playerOnCanvas");
var playGameWraper=document.getElementById("playGameWraper");
mainGameStartButton.onclick = function (){
    playGameWraper.style.display="none";
    playerOnCanvas.style.display="block";
    window.requestAnimationFrame(main);
}
function resetGame(){
    score=0;
    speed=10;
    initializeIMA();
}
function openModal(){
    var modal = document.getElementById("gameControllerModal");
    var span = document.getElementsByClassName("closeButton")[0];
    var startOver = document.getElementsByClassName("startButton")[0];
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        playGameWraper.style.display="flex";
        playerOnCanvas.style.display="none";
        window.location.reload();
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function main(currenttime){
    window.requestAnimationFrame(main);
    if((currenttime-lastPaintTime)/1000<1/speed){
        return;
    }
    lastPaintTime=currenttime;
    mainEngine();
}
function isCollide(snakeCollide) {
    for (let i = 1; i < snake.length; i++) {
        if(snakeCollide[i].xdir === snakeCollide[0].xdir && snakeCollide[i].ydir === snakeCollide[0].ydir){
            return true;
        }
    }
    if(snakeCollide[0].xdir >= 30 || snakeCollide[0].xdir <=0 || snakeCollide[0].ydir >= 30 || snakeCollide[0].ydir <=0){
        return true;
    }

    return false;
}
function mainEngine(){
    if(isCollide(snake)){
        direction =  {xdir: 0, ydir: 0};
        resetGame();
        openModal();
        snake = [{xdir: 13, ydir: 15}];
        score = 0;
    }
    if(snake[0].ydir === foodObject.ydir && snake[0].xdir ===foodObject.xdir){
        score += 1;
        speed++;
        if(score>hscore){
            hscore = score;
            localStorage.setItem("hiscore", JSON.stringify(hscore));
            hiscoreBox.innerHTML = "HiScore: " + hscore;
        }
        scoreBox.innerHTML = "Score: " + score;
        snake.unshift({xdir: snake[0].xdir + direction.xdir, ydir: snake[0].ydir + direction.ydir});
        let a = 2;
        let b = 16;
        foodObject = {xdir: Math.round(a + (b-a)* Math.random()), ydir: Math.round(a + (b-a)* Math.random())}
    }

    for (let i = snake.length - 2; i>=0; i--) {
        snake[i+1] = {...snake[i]};
    }

    snake[0].xdir += direction.xdir;
    snake[0].ydir += direction.ydir;
    board.innerHTML = "";
    snake.forEach((e, index)=>{
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.ydir;
        snakeElement.style.gridColumnStart = e.xdir;
        snakeElement.classList.add('head')
        board.appendChild(snakeElement);
    });
    //create food
    let food = document.createElement('div');
    food.style.gridRowStart = foodObject.ydir;
    food.style.gridColumnStart = foodObject.xdir;
    food.classList.add('food')
    board.appendChild(food);
}

window.addEventListener('keydown', e =>{
    direction = {xdir: 0, ydir: 1}
    switch (e.key) {
        case "ArrowUp":
            direction.xdir = 0;
            direction.ydir = -1;
            break;

        case "ArrowDown":
            direction.xdir = 0;
            direction.ydir = 1;
            break;

        case "ArrowLeft":
            direction.xdir = -1;
            direction.ydir = 0;
            break;

        case "ArrowRight":
            direction.xdir = 1;
            direction.ydir = 0;
            break;
        default:
            break;
    }

});
////////////////////////////////////////////////////////
var adContainer;
var adsLoaded = false;
var adDisplayContainer;
var adsLoader;
var adsManager;
var adContainer
var playButton = document.getElementById('startOverButton');
var modal = document.getElementById("gameControllerModal");
playButton.addEventListener('click', function(event) {
    adsLoaded = false;
    loadAds(event);
    modal.style.display="none";
});

function initializeIMA() {
    adContainer = document.getElementById('ad-container');
    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);
    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
        'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';
    adsRequest.linearAdSlotWidth = adContainer.clientWidth;
    adsRequest.linearAdSlotHeight = adContainer.clientHeight;
    adsRequest.nonLinearAdSlotWidth = adContainer.clientWidth;
    adsRequest.nonLinearAdSlotHeight = adContainer.clientHeight / 3;
    adsLoader.requestAds(adsRequest);
}

function loadAds(event) {
    if(adsLoaded) {
        return;
    }
    adsLoaded = true;
    event.preventDefault();
    adDisplayContainer.initialize();
    var width = adContainer.clientWidth;
    var height = adContainer.clientHeight;
    try {
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        adsManager.start();
    } catch (adError) {
        console.log("AdsManager could not be started");
    }
}
function onAdsManagerLoaded(adsManagerLoadedEvent) {
    adsManager = adsManagerLoadedEvent.getAdsManager(
        adContainer);
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
}

function onAdError(adErrorEvent) {
    console.log(adErrorEvent.getError());
    if(adsManager) {
        adsManager.destroy();
    }
}
