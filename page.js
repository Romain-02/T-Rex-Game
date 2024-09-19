//paramètre pour le t-rex
let isJumping = false;
let isSneacked = false;
const rex = document.getElementById("rex");
let positionRex = rex.offsetTop
rex.style = positionRex + 'px'

//paramètre pour le saut du t-rex
let typeJump = "high"
const jumpHighDuration = 550; // Durée du grand saut en millisecondes
const multHighJump = 400; //multiplicateur pour le grand saut
const jumpLowDuration = 500; // Durée du petit saut en millisecondes
const multLowJump = 350; //multiplicateur pour le petit saut
let startTime;

//paramètre du jeu
const OBSTACLES_MAX = 5;
const FPS = 60;
let isFinished = false;

//paramètre pour les obstacles
let positionX = 380;
const POSITION_Y_MAX = "1050"; //endroit où apparaissent les obstacles sur l'horizontal
const POSITION_Y_MIN = "400"; //endroit où disparaissent les obstacles sur l'horizontal
let indexLastObstacle = 0;
let timeLastObstacle = performance.now();
let AVANCEMENT_OBSTACLE = 5.75;

//paramètre pour le score
let timeStart = performance.now();
let score = 0;
let multSpeed = 1;
const SPEED_GROUND_ANIMATION = 4;


imageObstacles = {
    simpleCactus: "./image/cactus1.png",
    cactuses: "./image/cactus2.png",
    bird: "./image/oiseau1.png"
}

document.addEventListener('keydown', actionPress);
document.addEventListener('keyup', actionUp);

let obstacles = initObstacle();

function restart(){
    obstacles = initObstacle();
    updatePosition();

    document.getElementById("gameOver").textContent = "";
    isFinished = false;

    document.getElementById("groundContainer").style.animationPlayState = "running";

    score = 0
    timeStart = performance.now();
    indexLastObstacle = 0;
    multSpeed = 1;
}

function actionUp(event){
    if(isSneacked){
        if(event.key == 'ArrowDown'){
            isSneacked = false;
            document.getElementById("rex").src = "./image/t-rex.png";
            document.getElementById("rex").style.width = "45px";
            document.getElementById("rex").style.height = "45px";
        }
    }
}

function actionPress(event){

    if(isFinished){
        restart();
    }else{
        if(!isJumping && !isSneacked){

            if(event.key == 'ArrowDown'){
                isSneacked = true;
                document.getElementById("rex").src = "./image/sneakTrex.png";
                document.getElementById("rex").style.width = "60px";
                document.getElementById("rex").style.height = "50px";
                document.getElementById("rex").style.top = positionX + 30 + 'px'
            }
            if(event.key == ' '){
                isJumping = true;
                startTime = performance.now()

                typeJump = "high";
                jumpRex(2)
            }else if(event.key == 'ArrowUp'){
                isJumping = true;
                startTime = performance.now()

                typeJump = "low";
                jumpRex(2)
            }
        }
    }
}

function jumpRex(timestamp) {
    let progress;
    if(typeJump == "high"){
        if(!isFinished){
            progress = (timestamp - startTime) / jumpHighDuration;
            const a = (progress - 0.5) * (progress - 0.5) 
                
            const height = (a * multHighJump) + 25 - multHighJump / 4;
            rex.style.top = positionRex + height + 'px';
        }
    } else{
        if(!isFinished){
            progress = (timestamp - startTime) / jumpLowDuration;
            const a = (progress - 0.5) * (progress - 0.5) 
                
            const height = (a * multLowJump) + 25 - multLowJump / 4;
            rex.style.top = positionRex + height + 'px';
        }
    }

    if (progress < 1) {
      requestAnimationFrame(jumpRex);
    } else {
      isJumping = false;
      rex.style = positionRex + 'px';
    }
}


function initObstacle(){
    let tab = [];
    for(let i = 0; i < OBSTACLES_MAX; i++){
        tab.push(
            {
                nom: "none",
                positionY: POSITION_Y_MAX,
                visible: false
            }
        )
        document.querySelectorAll(".obstacle")[i].style.visibility = "hidden";
    }
    return tab;
}

function updatePosition(){
    let obstacle;
    for(let i = 0; i < OBSTACLES_MAX; i++){
        obstacle = document.querySelectorAll(".obstacle")[i];

        //on fait avancer les obstacles sur le dino
        if(obstacles[i].visible){
            obstacles[i].positionY -= (AVANCEMENT_OBSTACLE * multSpeed);
            obstacle.style.left = obstacles[i].positionY + 'px'; 

            //faire éventuellement disparaître des obstacles
            if(obstacles[i].positionY <= POSITION_Y_MIN){
                obstacle.style.visibility = "hidden";
                obstacles[i].visible = false;
            }
        }else{
            //ajouter éventuellement obstacle
            createObstacle();
        }
    }
}

function setPositionObstacle(index){

    if(obstacles[index].nom == "cactuses"){
        document.querySelectorAll(".obstacle")[index].style.top = positionX + 10 + 'px'
        document.querySelectorAll(".obstacle")[index].style.width = '60px';
        document.querySelectorAll(".obstacle")[index].style.height = '90px';
    } else {
        document.querySelectorAll(".obstacle")[index].style.top = positionX + 'px'
        document.querySelectorAll(".obstacle")[index].style.width = '45px';
        document.querySelectorAll(".obstacle")[index].style.height = '50px';
        if(obstacles[index].nom == "bird"){
            if(Math.random() > 0.7){
                document.querySelectorAll(".obstacle")[index].style.top = positionX + 10 + 'px';
            } else{
                document.querySelectorAll(".obstacle")[index].style.top = positionX - 20 + 'px';
            }
        }
    }
}

function createObstacle(){
    //on regarde si le dernier obstacle est apparu il y a plus de 1 secondes et que le prochaine obstacle n'existe pas déjà
    if(performance.now() - timeLastObstacle > (1000 / (multSpeed * multSpeed)) && !obstacles[(indexLastObstacle+1)%5].visible){
        
        if(Math.floor(performance.now() % 50) == Math.floor(Math.random() * 100 % 50)){
            
            indexLastObstacle = (indexLastObstacle+1)%5;

            let obstacle = document.querySelectorAll(".obstacle")[indexLastObstacle];
            let name;
            let number = Math.random();

            if(number * multSpeed < 0.6){
                name = "simpleCactus";
            } else if(number * multSpeed < 0.9){
                name = "cactuses";
            }else{
                name = "bird";
            }

            obstacles[indexLastObstacle] = {
                nom: name,
                positionY: POSITION_Y_MAX,
                visible: true,
            };

            obstacle.style.backgroundImage = "url('" + imageObstacles[obstacles[indexLastObstacle].nom] + "')";
            obstacle.style.left = obstacles[indexLastObstacle].positionY + 'px';
            obstacle.style.visibility = "visible";

            setPositionObstacle(indexLastObstacle);

            //actualise le temps auquel est apparu le dernier obstacle
            timeLastObstacle = performance.now();
        }
    }
}

function isColliding(){
    for(let i = 0; i < OBSTACLES_MAX; i++){
        let obstacle = document.querySelectorAll(".obstacle")[i];
        if(obstacles[i].visible == true && rex.offsetTop + rex.height >= obstacle.offsetTop && obstacle.offsetLeft > 450 && obstacle.offsetLeft < 500){
            if(obstacles[i].nom == "bird" && document.querySelectorAll(".obstacle")[i].offsetTop <= 380 && isSneacked){
                console.log("nor");
                return false;
            }
            return true;
        }
    }
    return false;
}

function gameOver(){
    if(!isFinished){
        document.getElementById("gameOver").textContent = "Game Over";
        isFinished = true;
        document.getElementById("groundContainer").style.animationPlayState = "paused";
    }
}

function updateScore(){
    score = Math.floor((performance.now() - timeStart) / 100 * multSpeed);
    document.getElementById("score").textContent = "score : " + score;
}

function updateSpeed(){
    if(score < 2000){
        multSpeed = 1 + score / 2000;
        document.getElementById("groundContainer").style.animationDuration = SPEED_GROUND_ANIMATION / (1 + (multSpeed - 1)/2.5) + "s";
    }
}

function gameLoop() {
  
    // Vérifier si le T-Rex touche un obstacle
    if (isFinished || isColliding()) {
        // Arrêter le jeu et afficher l'écran de game over
        gameOver();
    } else {
        // Mettre à jour la position du T-Rex et des obstacles
        updatePosition();
        // Mettre à jour le score
        updateScore();
        //mettre à jour la vitesse du jeu
        updateSpeed();
    }
  
    // Appeler la fonction de boucle de jeu à nouveau après un certain temps
    setTimeout(gameLoop, 1000 / FPS); // FPS = nombre d'images par seconde
}
  
// Démarrer la boucle de jeu
gameLoop();

