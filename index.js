//I deeply apologize for the state of this code



//Canvas setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

setInterval(update, 16);

window.onresize = ()=>{
   canvas.width = window.innerWidth - 5;
   canvas.height = window.innerHeight - 5;
}


//Card setup

var centerSquares;
var commonSquares;
var uncommonSquares;
var rareSquares;

function card(cardTitle, cardDesc="") {
   return {title:cardTitle, desc:cardDesc};
}

function resetCardOptions() {
   centerSquares = [
      card("Default\nPony", "The majority of elements and Colors on a character are unchanged")
   ];

   commonSquares = [
      card("Twilight\nSparkle"),
      card("Fluttershy"),
      card("Rainbow\nDash"),
      card("Applejack"),
      card("Pinkie Pie"),
      card("Rarity"),
      card("Princess\nCelestia"),
      card("Princess\nLuna"),
      card("Princess\nCadance"),
      card("Discord"),
      card("Spike", "The Dragon"),
      card("Starlight\nGlimmer"),
      card("Sunset\nShimmer"),
      card("Derpy"),
      card("Cutie Mark\nCrusader (any)", "Apple Bloom, Sweetie Belle, or Scootaloo."),
      card("Shining\nArmor")
   ];

   uncommonSquares = [
      card("E-Daters", "Or someponies who look like they are at least."),
      card("Void Thing", "The vast majority of a character's elements are pure black"),
      card("Trend", "A group of people all doing something. (Ex: Bread Line)"),
      card("Item Stash", "A large collection of the same item placed down."),
      card("Camoflauge", "A character designed to blend into the ground, water, etc."),
      card("Bat Pony", "A character with bat pony traits, bat wings, etc. Flutterbat is included."),
      card("Any Mane 6\n(Emo)", "Twilight Sparkle, Rainbow Dash, Pinkie Pie, Rarity, Applejack, or Fluttershy, but they're emo."),
      card("Zebra Pony", "Any zebra character."),
      card("3+ MLP\nDoppelgangers", "Three or more of the same MLP charcter in a group together."),
      card("Statue", "Someone who is pretending to be a statue."),

      card("Angel Dust\n(Hazbin)"),
      card("Charlie\n(Hazbin)"),
      card("Lucifer\n(Hazbin)"),
      card("Alastor\n(Hazbin)"),
      card("Any Sin\n(Helluva)", "Mammon, Beelzebub, or Asmodeus. Lucifer does not count."),
      card("Any of The\nVees (Hazbin)", "Vox, Velvette, or Valentino."),

      card("Pokemon", "Any Pokemon."),
      card("Hatsune\nMiku"),
      card("Undertale or\nDeltarune", "Any Undertale or Deltarune character."),
      card("TADC", "Any The Amazing Digital Circus character."),
      card("Murder\nDrones", "Any Murder Drones Character."),
   ];

   rareSquares = [
      card("Pie Family", "Any member of the Pie family, excluding Pinkie Pie"),
      card("Apple\nFamily", "Any member of the Apple family, exculding Applejack and Apple Bloom"),
      card("Octavia\n/ Vinyl", "Octavia Melody or Vinyl Scratch/DJ Pon3"),
      card("Lyra /\nBon Bon", "Lyra Heartstrings or Bon Bon (aka Sweetie Drops)"),
      card("Cutie Mark\nCrusaders (all)", "Apple Bloom, Sweetie Belle, AND Scootaloo. They do not need to be together, but all must be seen."),
      card("The Great and\nPowerful Trixie"),
      card("Zecora"),
      card("Queen\nChrysalis"),
      card("Garfield", "ANY character from Garfield."),
      card("Cheese\nSandwich")
   ];
}

//Basic vector class
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return V(this.x, this.y);
    }

    //Operations between a vector and a constant
    add(n) {
        return V(this.x + n, this.y + n);
    }
    sub(n) {
        return V(this.x - n, this.y - n);
    }
    multi(n) {
        return V(this.x * n, this.y * n);
    }
    div(n) {
        return V(this.x / n, this.y / n);
    }

    //Operations between two vectors
    vAdd(vector) {
        return V(this.x + vector.x, this.y + vector.y);
    }
    vSub(vector) {
        return V(this.x - vector.x, this.y - vector.y);
    }
    vMulti(vector) {
        return V(this.x * vector.x, this.y * vector.y);
    }
    vDiv(vector) {
        return V(this.x / vector.x, this.y / vector.y);
    }

    floor() {
        return V(Math.floor(this.x), Math.floor(this.y));
    }

    round() {
        return V(Math.round(this.x), Math.round(this.y));
    }

    ceil() {
        return V(Math.ceil(this.x), Math.ceil(this.y));
    }

    equals(vector) {
        return this.x == vector.x && this.y == vector.y;
    }

    shake(magnitude) {
        return V(this.x + (Math.random()*2-1)*magnitude, this.y + (Math.random()*2-1)*magnitude);
    } 
    
}

//Short vector creator because I can't be bothered to write 9 extra characters
function V(x,y) {
    if (y == undefined) y = x;
    return new Vector(x,y);
}

//General variables
var mousePos = V(0);
var clicked = false;

var globalDesc = "";
var cards;
var startTime;

//Bingo square class
class BingoSquare {
   constructor(data, size, color='white') {
      this.data = data
      this.size = size
      this.color = color
   }

   pos = V(0);
   scale = V(0);
   active = true;

   touchingMouse() {
      var offset = mousePos.vSub(this.pos);
      if (offset.x < this.scale.x && offset.y < this.scale.y && offset.x >= 0 && offset.y >= 0) {
         return true;
      }
      return false;
   }

   draw(position, scale, offset) {
      //Alter if already clicked
      if (!this.active) {
         c.globalAlpha = .3;
      }

      //Draw Background
      var drawPos = position.vMulti(scale).vAdd(offset);
      var drawSize = this.size.vMulti(scale);
      c.fillStyle = this.color;
      drawRect(drawPos, drawSize);

      //Save card information
      this.pos = drawPos;
      this.scale = drawSize;

      //Draw text in a super long and annoying way
      let lines = this.data.title.split("\n");

      c.fillStyle = "black";

      
      for (let l=0; l<lines.length; l++) {
         let text = lines[l]
         c.font = '1pt Pixelify Sans'
         let widthBase = c.measureText(text + "  ").width;
         let fontSize = Math.floor(drawSize.x / widthBase);
         c.font = fontSize + 'pt Pixelify Sans'

         c.fillText(" " + text + " ", drawPos.x, drawPos.y + (drawSize.y* (l+1) / (lines.length+1)) + fontSize / 3, drawSize.x);
      }

      c.globalAlpha = 1;

      //Check if clicked
      if (this.touchingMouse()) {
         if (clicked)
            this.active = !this.active;
         globalDesc = this.data.desc;
      }
   }
}

//Generate a new board
function generateBoard() {
   cards = [];
   startTime = Date.now()

   resetCardOptions();
   let commonLeft = 12;
   let uncommonLeft = 12;

   let rareCards = [];
   for (let i=0; i<6; i++) {
      let id = Math.floor(Math.random()*rareSquares.length);
      data = rareSquares[id];
      rareSquares.splice(id, 1);
      rareCards.push(new BingoSquare(data, V(1/8), "#fff9cc"))
   }
   let rareCardCount = 0;


   for (let i=0; i<7; i++) {
      cards.push([]);
      for (let j=0; j<7; j++) {
         if (i > 0 && i < 6 && j > 0 && j < 6) {
            let data = centerSquares[0];
            let color = "";
            if (i == j && i == 3) {
               data = centerSquares[Math.floor(Math.random()*centerSquares.length)];
               color = 'white';
         
            } else {
               let common = Math.random() < commonLeft / (commonLeft + uncommonLeft);
               if (common) {
                  let id = Math.floor(Math.random()*commonSquares.length);
                  data = commonSquares[id];
                  commonSquares.splice(id, 1);
                  commonLeft --;
                  color = '#ffccf6';
               } else {
                  let id = Math.floor(Math.random()*uncommonSquares.length);
                  data = uncommonSquares[id];
                  uncommonSquares.splice(id, 1);
                  uncommonLeft --;
                  color = '#b5ffe1';

               }
            }


            cards[i].push(new BingoSquare(data, V(1/8), color));
         } else {

            cards[i].push(rareCards[rareCardCount % rareCards.length]);
            rareCardCount++;
         }
      }
   }
}

generateBoard();


//Check mouse stuff
window.addEventListener('mousemove', (event) => {
   mousePos = V((event.clientX-5),(event.clientY-5));
});

window.addEventListener('mousedown', (event)=>{
   clicked = true;
});


//Draw a circle at a set location
function drawCircle(pos, rad) {
   c.beginPath();
   c.ellipse(pos.x, pos.y, rad, rad, 0, 0, 2 * Math.PI);
   c.fill();
}

//RectangEL
function drawRect(pos, size) {
   c.fillRect(pos.x, pos.y, size.x, size.y);
}


//Draw single line
function drawLine(pos1, pos2) {
   c.beginPath();
   c.moveTo(pos1.x, pos1.y);
   c.lineTo(pos2.x, pos2.y);
   c.stroke();
}

//Draw single line
function drawLine(pos, size) {
    c.beginPath();
    c.fillRect(pos.x, pos.y, size.x, size.y)
 }


//Update frame
function update() {
   //Reset frame
   c.fillStyle = "black";
   drawRect(V(0), V(canvas.width, canvas.height))

   //Set some variables
   let scale = Math.min(canvas.width, canvas.height);
   let offset = scale * 0.2;
   scale *= 0.8;
   globalDesc = "";

   for (let i=0; i<cards.length; i++) {
      for (let j=0; j<cards[i].length; j++) {
         try { //I don't think I need a try here anymore
            cards[i][j].draw(V(i/7, j/7), V(scale, scale), V(canvas.width / 2 - scale / 2, offset/2));
         } catch (error) {
            console.log("oops")
         }
      }
   }

   //Draw text
   c.font = Math.floor(scale/30) + 'pt Pixelify Sans';
   c.fillStyle = 'white'
   c.fillText((Date.now() - startTime) / 1000, scale/80, scale/30)

   if (globalDesc != "") {
      
      c.textAlign = 'center'
      c.fillText(globalDesc, canvas.width/2, scale/12, canvas.width);
      c.textAlign = 'left'
   }

   //Reset click
   if (clicked) {
      clicked = false;
   }

}