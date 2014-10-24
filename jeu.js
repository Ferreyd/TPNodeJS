var canvas, ctx, mousePos;


// Autres joueurs
var tousLesMonstres = {};

function init() {
  console.log("init");
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext('2d');
  
  // Les écouteurs
  canvas.addEventListener("mousedown", traiteMouseDown);
  canvas.addEventListener("mousemove", traiteMouseMove);
  
  anime();

}

function addMonstre(username, monstre) {
  console.log("on ajoute le monstre " + username);
  tousLesMonstres[username] = monstre;
}

function traiteMouseDown(evt) {
  console.log("mousedown");
}

function traiteMouseMove(evt) {
  console.log("mousemove");
  
  mousePos = getMousePos(canvas, evt);
  //console.log(mousePos.x + " " + mousePos.y); 
  
  tousLesMonstres[username].x = mousePos.x;
  tousLesMonstres[username].y = mousePos.y; 

  console.log("On envoie sendPos");
  var pos = {'user':username, 'pos':mousePos}
  socket.emit('sendpos', pos);
}

function updateMonstreNewPos(newPos) {
  tousLesMonstres[newPos.user].x = newPos.pos.x;
  tousLesMonstres[newPos.user].y = newPos.pos.y;
}
// Mise à jour du tableau quand un joueur arrive
// ou se deconnecte
function updateMonstres(monstres) {
  tousLesMonstres = monstres;
}

function drawMonstre(monstre) {
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 10;
  ctx.strokeRect(monstre.x, monstre.y, 100, 100);
}

function drawTousLesMonstres() {
  for(var key in tousLesMonstres) {
    drawMonstre(tousLesMonstres[key]);
  }
}

function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
   };
}

function anime() {
  if(username != undefined ) {
    // 1 On efface l'écran
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2 On dessine des objets
    drawTousLesMonstres();
    
    // 3 On déplace les objets
    /*monstre.x += monstre.v;
    if(monstre.x >= canvas.width-100) {
      monstre.v = -monstre.v;
    }
    if(monstre.x <= 0) {
      monstre.v = -monstre.v;
    }
    */
    
    
  }
      // 4 On rappelle la fonction d'animation à 60 im/s

  requestAnimationFrame(anime);
}