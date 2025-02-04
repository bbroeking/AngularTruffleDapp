import pokemonData from '../data/pokemonData';
import positionData from '../data/positionData';
import stylingData from '../data/stylingData';
import typeColors from '../data/typeColors';
import statsAndMovesData from '../data/statsAndMovesData';
import effectivenessData from '../data/effectivenessData';
import Player from './player';

export default class PokemonBattle {
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dimensions = { width: canvas.width, height: canvas.height };
    this.player1 = new Player(prompt("Player 1, please enter your name") || "Player 1");
    this.player2 = new Player(prompt("Player 2, please enter your name") || "Player 2");
    // this.setAudio();
    this.currentPlayer = this.player1;

    // these are used for the animations
    this.frameCount = 0;
    this.currentLoopIndex1 = 0;
    this.currentLoopIndex2 = 0;

    // these are baselines used to indicate where on the canvas the pokemon should be placed
    this.xStart = positionData['pokemonXStart'] + positionData['pokemonXMargin'] + positionData['screenX'];
    this.yStart = positionData['pokemonYStart'] + positionData['screenY'];

    // these are used to display text on the right side of the screen
    this.turnCounter = 1;
    this.messages = {"Turn 1": []};

    this.paused = true;
    this.getYOffset();
    this.getAnimationInfo();
    this.background = this.setBackground();
    this.bindEventHandlers();

    // these are used to draw the elements onto the page
    this.drawBackground(this.background);
    // this.drawPikachu();
    this.drawTextbox();
    this.drawOptionsDisplay();
    this.instructionsDisplay();

    // this animates the pokemon
    this.drawPokemon();
  }

  // draws the pikachu in the background
  drawPikachu(){
    document.getElementById("pikachu").style.display = "inherit";
  }

  getYOffset(){
    const header = document.getElementById("header");
    const headerStyles = getComputedStyle(header);
    const topMargin = Number(headerStyles["margin-top"].slice(0, headerStyles["margin-top"].length-2));
    const height = Number(headerStyles["height"].slice(0, headerStyles["height"].length-2));
    const bottomMargin = Number(headerStyles["margin-bottom"].slice(0, headerStyles["margin-bottom"].length-2));
    this.headerY = topMargin + height + bottomMargin;
  }

  setAudio(){
    this.audio = document.getElementById("music");
    let audioNum = Math.floor(Math.random() * 19) + 1;
    if (audioNum === 16 || audioNum === 17) audioNum = 12; // i just really like audio sources 12 and 15
    if (audioNum === 18 || audioNum === 19) audioNum = 15;
    this.audio.src = "audio/audio" + audioNum.toString() + ".mp3";
    this.audio.pause(); // so that audio won't play while the user is reading the instructions
  }

  instructionsDisplay(){
    // draw background
    let frontPokemon = new Image();
    frontPokemon.src = this.src1[this.currentLoopIndex1];
    let backPokemon = new Image();
    backPokemon.src = this.src2[this.currentLoopIndex2];

    backPokemon.onload = () => {
      this.drawBackground(this.background);
      let pokemon1 = 'front' + this.firstPoke1;
      let pokemon2 = 'back' + this.firstPoke2;
      this.ctx.drawImage(frontPokemon, pokemonData[pokemon1]['x'], pokemonData[pokemon1]['y'], pokemonData[pokemon1]['width'], pokemonData[pokemon1]['height']);
      this.ctx.drawImage(backPokemon, pokemonData[pokemon2]['x'], pokemonData[pokemon2]['y'], pokemonData[pokemon2]['width'], pokemonData[pokemon2]['height']);
    
      // drawing the box
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(positionData['instructionXStart'], positionData['instructionYStart'], positionData['instructionWidth'], positionData['instructionHeight']);
      this.ctx.fillStyle = "#FFFBCE";
      this.ctx.fillRect(positionData['instructionXStart'] + 4, positionData['instructionYStart'] + 4, positionData['instructionWidth'] - 8, positionData['instructionHeight'] - 8);
      
      // writing the instructions
      this.ctx.fillStyle = "black";
      this.ctx.font = "20px Verdana";
      this.ctx.fillText("X", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 30);
      this.ctx.font = "bold 20px Verdana";
      this.ctx.fillText("Instructions", positionData['instructionXStart'] + 130, positionData['instructionYStart'] + 30);
      this.ctx.font = "14px Verdana";
      this.ctx.fillText("This Pokemon Battle Simulator randomly generates", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 60);
      this.ctx.fillText("two teams of six Pokemon.", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 80);
      this.ctx.fillText("Players will take turns selecting moves with", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 110);
      this.ctx.fillText("which to attack or other Pokemon to switch in.", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 130);
      this.ctx.fillText("Text commentary is shown on the right side.", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 160)
      this.ctx.fillText("A player is declared the winner once all of his", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 190);
      this.ctx.fillText("or her opponent's Pokemon have fainted!", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 210);
      this.ctx.fillText("Press the 'X' on the top left corner to close", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 240);
      this.ctx.fillText("this instructions pane.", positionData['instructionXStart'] + 15, positionData['instructionYStart'] + 260);
    }
  }

  getAnimationInfo(){
    this.firstPoke1 = this.player2.party[0].name
    this.firstPoke2 = this.player1.party[0].name
    this.cycleLoop1 = [...Array(pokemonData['front' + this.firstPoke1]['animationFrames']).keys()];
    this.cycleLoop2 = [...Array(pokemonData['back' + this.firstPoke2]['animationFrames']).keys()];
    this.src1 = this.cycleLoop1.map(num => num < 10 ? 
      "assets/images/pokemon/" + this.firstPoke1.toLowerCase() + "-front/frame_0"+ num.toString() + "_delay-" + pokemonData['front' + this.firstPoke1]['delay'] + ".gif" : 
      "assets/images/pokemon/" + this.firstPoke1.toLowerCase() + "-front/frame_"+ num.toString() + "_delay-" + pokemonData['front' + this.firstPoke1]['delay'] + ".gif");
    this.src2 = this.cycleLoop2.map(num => num < 10 ? 
      "assets/images/pokemon/" + this.firstPoke2.toLowerCase() + "-back/frame_0"+ num.toString() + "_delay-" + pokemonData['back' + this.firstPoke2]['delay'] + ".gif" : 
      "assets/images/pokemon/" + this.firstPoke2.toLowerCase() + "-back/frame_"+ num.toString() + "_delay-" + pokemonData['back' + this.firstPoke2]['delay'] + ".gif");
  }

  setBackground(){
    let arr = [...Array(8).keys()];
    const src = arr.map(num => "assets/images/backgrounds/background" + num.toString() + ".png");
    let background = new Image();
    background.src = src[Math.floor(Math.random() * src.length)];
    //background.src = "assets/images/backgrounds/background1.png";
    return background;
  }

  drawBackground(background){
    this.ctx.drawImage(background, 0, 0, positionData['backgroundWidth'], positionData['backgroundHeight']);
  }

  drawTextbox(){
    this.ctx.fillStyle = "black";

    // draw instructions button
    this.ctx.fillRect(positionData['textXStart'], 0, positionData['instructionButtonWidth'], positionData['instructionButtonHeight']);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(positionData['textXStart'] + 1, 1, positionData['instructionButtonWidth'] - 2, positionData['instructionButtonHeight'] - 2);
    this.ctx.font = "bold 12px Verdana";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Instructions", positionData['textXStart'] + 8 , 18);

    // draw textbox
    this.ctx.fillRect(positionData['textXStart'], positionData['textYStart'], positionData['textWidth'], positionData['textHeight']);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(positionData['textXStart'] + 1, positionData['textYStart'] + 1, positionData['textWidth'] - 2, positionData['textHeight'] - 2);
    this.messageDisplay();
  }

  drawPokemon(){
    // get image sources for the pokemon
    let frontPokemon = new Image();
    frontPokemon.src = this.src1[this.currentLoopIndex1];
    let backPokemon = new Image();
    backPokemon.src = this.src2[this.currentLoopIndex2];

    backPokemon.onload = () => {
      if (!this.paused){
        // frameCount used for animation
        this.frameCount++;
        if (this.frameCount > 1) {
          // clear battle page
          this.ctx.clearRect(0, 0, positionData['backgroundWidth'], positionData['backgroundHeight'] + 10);
          this.drawBackground(this.background);

          let pokemon1 = 'front' + this.firstPoke1;
          let pokemon2 = 'back' + this.firstPoke2;
          this.ctx.drawImage(frontPokemon, pokemonData[pokemon1]['x'], pokemonData[pokemon1]['y'], pokemonData[pokemon1]['width'], pokemonData[pokemon1]['height']);
          this.ctx.drawImage(backPokemon, pokemonData[pokemon2]['x'], pokemonData[pokemon2]['y'], pokemonData[pokemon2]['width'], pokemonData[pokemon2]['height']);
          this.currentLoopIndex2++;
          
          // reset animation counters
          if (this.currentLoopIndex2 >= this.cycleLoop2.length) {
            this.currentLoopIndex2 = 0;
          }
          this.currentLoopIndex1++;
          if (this.currentLoopIndex1 >= this.cycleLoop1.length) {
            this.currentLoopIndex1 = 0;
          }
          this.frameCount = 0;
        }
      }
      window.requestAnimationFrame(() => this.drawPokemon());
    }
  }

  drawOptionsDisplay(){
    this.turnDisplay();
    this.movesDisplay();
    this.switchDisplay();
  }

  messageDisplay(){
    this.ctx.clearRect(positionData['textXStart'] + 2, positionData['textYStart'] + 2, positionData['textWidth'] - 3, positionData['textHeight'] - 3);
    let y = 30 + positionData['textYStart'];
    this.ctx.fillStyle = "black";

    // iterate through and display stored messages, offsetting their y coordinate
    Object.keys(this.messages).forEach(turn => {
      this.ctx.font = "bold 20px Verdana";
      if (y <= 460) this.ctx.fillText(turn, positionData['textXStart'] + 20, y);
      y += 20;
      this.messages[turn].forEach(message => {
        this.ctx.font = "14px Verdana";
        if (y <= 460){
          this.ctx.fillText(message, positionData['textXStart'] + 20, y);
        }
        y += 20;
      })
      y += 10;
    })
    if (y > 460){
      // delete the oldest message if the y coordinate is too large
      delete this.messages[Object.keys(this.messages)[0]];
      this.messageDisplay();
    }
  }

  turnDisplay(){
    this.ctx.clearRect(positionData['turnDisplayX'], positionData['turnDisplayY'] - 30, positionData['turnDisplayWidth'], positionData['turnDisplayHeight'] * 2 + 10);
    this.ctx.font = "bold 22px Verdana";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(this.currentPlayer === this.player1 ? this.player1.name + "'s" : this.player2.name + "'s", positionData['turnDisplayX'], positionData['turnDisplayY']);
    let turnOrSwitch = this.currentPlayer.party[0].currentStats['hp'] <= 0 ? 'Switch!' : 'Turn!';
    this.ctx.fillText(turnOrSwitch, positionData['turnDisplayX'], positionData['turnDisplayY'] + positionData['turnDisplayHeight']);
  }

  movesDisplay(){
    this.ctx.clearRect(positionData['turnDisplayWidth'] + 20, positionData['moveYStart'], 2 * positionData['moveWidth'] + 2 * positionData['moveXMargin'], positionData['moveHeight'] + 50)
    this.pokemonMoves = statsAndMovesData[this.currentPlayer.party[0].name]['moves'];
    for (let i=0; i < Object.keys(this.pokemonMoves).length; i++){
        let typeColor = typeColors[this.pokemonMoves[Object.keys(this.pokemonMoves)[i]]['type']]
        let x = i % 2 === 0 ? positionData['moveXStart'] : positionData['moveXStart'] + positionData['moveWidth'] + 10;
        let y = i < 2 ? positionData['moveYStart'] : positionData['moveYStart'] + positionData['moveHeight'] + 10;
        this.ctx.fillStyle = typeColor;
        this.ctx.fillRect(x, y, positionData['moveWidth'], positionData['moveHeight']);
        this.ctx.fillStyle = typeColor === "black" ? "black" : "white";
        this.ctx.font = "bold 16px Verdana";
        this.ctx.textAlign = "center";
        this.ctx.fillText(Object.keys(this.pokemonMoves)[i], x + positionData['moveWidth'] / 2, y + positionData['moveHeight'] / 2 + 5);
    }
  }

  switchDisplay(){
    // this displays the icons of the six pokemon
    this.ctx.textAlign = "start";
    this.ctx.fillStyle = 'black';
    this.ctx.clearRect(positionData['pokemonXStart'], positionData['pokemonYStart'], positionData['pokemonWidth'] * 6 + positionData['pokemonXMargin'] * 5, positionData['pokemonHeight'] * 3);
    let x = [];
    for (let i = 0; i < 6; i++){
        x.push(positionData['pokemonXStart'] + positionData['pokemonXStart2'] * i);
    };
    for (let counter = 0; counter < 6; counter++){
      const y = positionData['pokemonYStart'];
      this.ctx.fillStyle = "black";

      this.ctx.fillRect(positionData['pokemonXMargin'] + x[counter], y, positionData['pokemonWidth'], positionData['pokemonHeight']);
      if (counter === 0){
          this.ctx.fillStyle = stylingData['selectedPokemon']
      } else {
          this.ctx.fillStyle = "white";
      }
      this.ctx.fillRect(positionData['pokemonXMargin'] + 1 + x[counter], y+1, positionData['pokemonWidth'] - 2, positionData['pokemonHeight'] - 2);
      
      // icons are 30x30ish
      let icon = new Image();
      icon.src = "assets/images/icons/" + this.currentPlayer.party[counter].name.toLowerCase() + ".png";
      icon.onload = () => {
        if (this.currentPlayer.faint && !counter){
          this.ctx.clearRect(positionData['pokemonXStart'], positionData['pokemonYStart'], positionData['pokemonWidth'] * 6 + positionData['pokemonXMargin'] * 5, positionData['pokemonHeight'] * 3);
          for (let i=0; i<6; i++){
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(positionData['pokemonXMargin'] + x[i], y, positionData['pokemonWidth'], positionData['pokemonHeight']);
            if (i === 0){
                this.ctx.fillStyle = stylingData['selectedPokemon']
            } else {
                this.ctx.fillStyle = "white";
            }
            this.ctx.fillRect(positionData['pokemonXMargin'] + 1 + x[i], y+1, positionData['pokemonWidth'] - 2, positionData['pokemonHeight'] - 2);
          }
        }
        this.ctx.drawImage(icon, positionData['pokemonXMargin'] + 2 + x[counter], y-5);
        this.ctx.font = "13px Verdana";
        this.ctx.fillStyle = "black";

        // Mr. Mime has to be hard coded cuz it's the only name with a space lol
        if (this.currentPlayer.party[counter].name === "Mrmime"){
            this.ctx.fillText("Mr. Mime", positionData['iconXStart'] + x[counter], positionData['iconYStart'] + y);
        } else {
            this.ctx.fillText(this.currentPlayer.party[counter].name, positionData['iconXStart'] + x[counter], positionData['iconYStart'] + y);
        };

        // draw HP bar
        this.ctx.fillText("HP: ", x[counter] + 20, positionData['hpYStart']);
        let percentHp = this.currentPlayer.party[counter].currentStats['hp'] / (statsAndMovesData[this.currentPlayer.party[counter].name]['hp'] * 2 + 141);
        let hpX;
        if (percentHp > 0 && percentHp < 0.25){
            // hpX = 0.45;
            this.ctx.fillStyle = "red";
        } else if (percentHp >= 0.25 && percentHp < 0.5){
            // hpX = 0.6;
            this.ctx.fillStyle = "yellow";
        } else if (percentHp >= 0.5 && percentHp < 0.75){
            // hpX = 0.8;
            this.ctx.fillStyle = "green";
        } else if (percentHp >= 0.75 && percentHp <= 1){
            // hpX = 1;
            this.ctx.fillStyle = "green";
        }
        hpX = 0.37 + 0.63 * percentHp;

        // this is the actual hp bar
        if (percentHp >= 0){
            this.ctx.beginPath();
            this.ctx.moveTo(x[counter] + positionData['hpBarXMargin'], positionData['hpBarYStart']);
            this.ctx.lineTo(x[counter] + positionData['moveWidth'] * hpX - 5, positionData['hpBarYStart']);
            this.ctx.quadraticCurveTo(x[counter] + positionData['moveWidth'] * hpX, positionData['hpBarYStart'] + 5, x[counter] + positionData['moveWidth'] * hpX - 5, positionData['hpBarYStart'] + 10);
            this.ctx.lineTo(x[counter] + positionData['hpBarXMargin'], positionData['hpBarYStart'] + 10);
            this.ctx.quadraticCurveTo(x[counter] + positionData['hpBarXMargin'] - 5, positionData['hpBarYStart'] + 5, x[counter] + positionData['hpBarXMargin'], positionData['hpBarYStart']);
            this.ctx.stroke();
            this.ctx.fill();
        }

        // display hp number
        this.ctx.fillStyle = "black";
        let currentHp = Math.round(this.currentPlayer.party[counter].currentStats['hp']);
        currentHp = currentHp < 0 ? 0 : currentHp;
        this.ctx.fillText(currentHp.toString() + "/" + this.currentPlayer.party[counter].fullHealth.toString(), x[counter] + positionData['hpBarXMargin'], positionData['hpBarYStart'] + 30)
      };
    }
  }

  bindEventHandlers() {
    this.canvas.addEventListener('click', e => {
      // this is the area with switch pokemon options
      if (e.pageX >= this.xStart && e.pageY + this.headerY >= this.yStart && e.pageX <= this.xStart + positionData['pokemonXStart2'] * 5 + positionData['pokemonWidth'] && e.pageY + this.headerY <= this.yStart + positionData['pokemonHeight']){
        this.switchHandler(e);
      } // this is the area with move options
      else if (e.pageX >= positionData['moveXStart'] && e.pageY + this.headerY >= positionData['moveClickY'] && e.pageX <= positionData['moveXStart'] + positionData['moveWidth'] * 2 + 10 && e.pageY + this.headerY <= positionData['moveClickY'] + positionData['moveHeight'] * 2 + 10){
          this.moveHandler(e);
      } // the instructions display
      else if (e.pageX >= positionData['screenX'] + positionData['textXStart'] && e.pageY + this.headerY >= positionData['screenY'] && e.pageX <= positionData['screenX'] + positionData['textXStart'] + positionData['instructionButtonWidth'] && e.pageY + this.headerY <= positionData['screenY'] + positionData['instructionButtonHeight']){
        this.paused = true;
        this.audio.pause();
        this.instructionsDisplay();
      } // the x button on the instructions display
      else if (e.pageX >= positionData['xXStart'] && e.pageY + this.headerY >= positionData['xYStart'] && e.pageX <= positionData['xXEnd'] && e.pageY + this.headerY <= positionData['xYEnd']){
        this.paused = false;
        this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
        this.drawTextbox();
        this.drawOptionsDisplay();
        this.audio.volume = 0.1;
        this.audio.play();
      };
    })
  }

  switchHandler(e){
    for (let i=1; i < 6; i++){
      if (e.pageX >=  this.xStart + positionData['pokemonXStart2'] * i && e.pageX <= this.xStart + positionData['pokemonXStart2'] * i + positionData['moveWidth']){
        if (this.currentPlayer.party[i].currentStats['hp'] > 0){
          this.currentPlayer.party[0].resetStats(); // stat changes are reset when a pokemon switches out
          this.currentPlayer.party.unshift(this.currentPlayer.party.splice(i,1)[0]); // "switching" moves the new pokemon to the front of a player's party
          this.messages["Turn " + this.turnCounter.toString()].push(this.currentPlayer.name + " sent out " + this.currentPlayer.party[0].name + "!");
          // update party order and display again
          this.currentPlayer.switched = true;
          if (!this.currentPlayer.faint){
            this.switchTurn();
          } else {
            let otherPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
            this.afterPokemonSwitch(); // refetches animation info
            this.messageDisplay();
            this.currentPlayer.faint = false;
            if (!this.checkFaint(otherPlayer.party[0], otherPlayer)){
              this.resetTurn();
              this.currentPlayer = this.player1;
              this.drawOptionsDisplay();
            };
          }
        } else {
          this.drawOptionsDisplay();
        }
      }
    }
  }

  moveHandler(e){
    // if player needs to switch, don't let them select a move
    if (this.currentPlayer.faint) return;

    // find which move was selected
    // in order of moves: top left, top right, bottom left, bottom right
    let move;
    let moveName;
    if (e.pageX >= positionData['moveXStart'] && e.pageY + this.headerY >= positionData['moveClickY'] && e.pageX <= positionData['moveXStart'] + positionData['moveWidth'] && e.pageY + this.headerY <= positionData['moveClickY'] + positionData['moveHeight']){
      moveName = Object.keys(this.pokemonMoves)[0];  
      move = Object.assign({}, {[moveName]: Object.values(this.pokemonMoves)[0]});
    } else if (e.pageX >= positionData['moveXStart'] + positionData['moveWidth'] + 10 && e.pageY + this.headerY >= positionData['moveClickY'] && e.pageX <= positionData['moveXStart'] + positionData['moveWidth'] * 2 + 10 && e.pageY + this.headerY <= positionData['moveClickY'] + positionData['moveHeight']){
      moveName = Object.keys(this.pokemonMoves)[1];  
      move = Object.assign({}, {[moveName]: Object.values(this.pokemonMoves)[1]});
    } else if (e.pageX >= positionData['moveXStart'] && e.pageY + this.headerY >= positionData['moveClickY'] + positionData['moveHeight'] + 10 && e.pageX <= positionData['moveXStart'] + positionData['moveWidth'] && e.pageY + this.headerY <= positionData['moveClickY'] + positionData['moveHeight'] + positionData['moveHeight'] * 2 + 10){
      moveName = Object.keys(this.pokemonMoves)[2];
      move = Object.assign({}, {[moveName]: Object.values(this.pokemonMoves)[2]});
    } else if (e.pageX >= positionData['moveXStart'] + positionData['moveWidth'] + 10 && e.pageY + this.headerY >= positionData['moveClickY'] + positionData['moveHeight'] + 10 && e.pageX <= positionData['moveXStart'] + positionData['moveWidth'] * 2 + 10 && e.pageY + this.headerY <= positionData['moveClickY'] + positionData['moveHeight'] + positionData['moveHeight'] * 2 + 10){
      moveName = Object.keys(this.pokemonMoves)[3];  
      move = Object.assign({}, {[moveName]: Object.values(this.pokemonMoves)[3]});
    };
    if (move){
      this.currentPlayer.move = move;
      this.switchTurn();
    }
  }

  switchTurn(){ // makes it the other player's turn
    if (this.currentPlayer === this.player2) this.finishTurn();
    if (!this.currentPlayer.faint){
      this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
      this.drawOptionsDisplay();
    }
  }

  afterPokemonSwitch(){
    // refetch animation info, switch turn upon pokemon switch
    if (this.player1.switched){
      this.currentLoopIndex2 = 0;
    }
    if (this.player2.switched){
      this.currentLoopIndex1 = 0;
    }
    this.getAnimationInfo();
  }

  handleMove(){
    let player1Poke = this.player1.party[0];
    let player2Poke = this.player2.party[0];
    if (this.player1.move && this.player2.move){
      // find out who goes first if both pokemon make a move
      let fasterPlayer;
      let slowerPlayer;
      let fasterPokemon;
      let slowerPokemon;
      let fasterMove;
      let slowerMove;
      if (Object.values(this.player1.move)[0]['priority'] && (!Object.values(this.player2.move)[0]['priority'] || Object.values(this.player1.move)[0]['priority'] > Object.values(this.player2.move)[0]['priority'])){
        fasterPokemon = player1Poke;
      } else if (Object.values(this.player2.move)[0]['priority'] && (!Object.values(this.player1.move)[0]['priority'] || Object.values(this.player2.move)[0]['priority'] > Object.values(this.player1.move)[0]['priority'])){
        fasterPokemon = player2Poke;
      } else if (player1Poke.currentStats['speed'] >= player2Poke.currentStats['speed']){
        fasterPokemon = player1Poke;
      } else if (player2Poke.currentStats['speed'] > player1Poke.currentStats['speed']){
        fasterPokemon = player2Poke;
      } else {
        fasterPokemon = Math.floor(Math.random() * 2) < 1 ? player1Poke : player2Poke;
      }
      if (fasterPokemon === player1Poke){
        slowerPokemon = player2Poke;
        fasterMove = this.player1.move;
        slowerMove = this.player2.move;
        fasterPlayer = this.player1;
        slowerPlayer = this.player2;
      } else {
        slowerPokemon = player1Poke;
        fasterMove = this.player2.move;
        slowerMove = this.player1.move;
        fasterPlayer = this.player2;
        slowerPlayer = this.player1;
      }
      this.messages["Turn " + this.turnCounter.toString()].push(fasterPlayer.name + "'s " + fasterPokemon.name + ' used ' + Object.keys(fasterMove)[0] + '!');
      
      // splash needs to be hard coded cuz its troll
      if (Object.keys(fasterMove)[0] === 'Splash'){
        this.messages["Turn " + this.turnCounter.toString()].push("But nothing happened!");
      } else {
        if (this.checkEffect(Object.values(fasterMove)[0], slowerPokemon) && !this.checkMiss(Object.values(fasterMove)[0], fasterPokemon)) this.calculateDamage(Object.values(fasterMove)[0], fasterPokemon, slowerPokemon);
        this.checkFaint(fasterPokemon); // if recoil
      }

      if (!this.checkFaint(slowerPokemon)){ // don't do the move if the pokemon has already fainted
        this.messages["Turn " + this.turnCounter.toString()].push(slowerPlayer.name + "'s " + slowerPokemon.name + ' used ' + Object.keys(slowerMove)[0] + '!');
        if (Object.keys(slowerMove)[0] === 'Splash'){
          this.messages["Turn " + this.turnCounter.toString()].push("But nothing happened!");
        } else {
          if (this.checkEffect(Object.values(slowerMove)[0], fasterPokemon) && !this.checkMiss(Object.values(slowerMove)[0], slowerPokemon)) this.calculateDamage(Object.values(slowerMove)[0], slowerPokemon, fasterPokemon);
        }
        this.checkFaint(slowerPokemon); // if recoil
        this.checkFaint(fasterPokemon);
      }
    } else if (this.player1.move){ // and player 2 switched
      this.messages["Turn " + this.turnCounter.toString()].push(this.player1.name + "'s " + player1Poke.name + ' used ' + Object.keys(this.player1.move)[0] + '!');
      if (this.checkEffect(Object.values(this.player1.move)[0], player2Poke) && !this.checkMiss(Object.values(this.player1.move)[0], player1Poke)) this.calculateDamage(Object.values(this.player1.move)[0], player1Poke, player2Poke);
      this.checkFaint(player1Poke, this.player1); // recoil check
      this.checkFaint(player2Poke, this.player2);
    } else if (this.player2.move){ // and player 1 switched
      this.messages["Turn " + this.turnCounter.toString()].push(this.player2.name + "'s " + player2Poke.name + ' used ' + Object.keys(this.player2.move)[0] + '!');
      if (this.checkEffect(Object.values(this.player2.move)[0], player1Poke) && !this.checkMiss(Object.values(this.player2.move)[0], player2Poke)) this.calculateDamage(Object.values(this.player2.move)[0], player2Poke, player1Poke);
      this.checkFaint(player2Poke, this.player2); // recoil check
      this.checkFaint(player1Poke, this.player1);
    }
  }

  checkMiss(move, poke){
    if (Math.random() * 100 > move['accuracy']){
      this.messages["Turn " + this.turnCounter.toString()].push(poke.name + "'s attack missed!");
      return true;
    }
    return false;
  }

  checkEffect(move, poke){
    let effect = true;
    poke.currentStats['types'].forEach(type => {
      if (effectivenessData[move['type']][type] === 0){ // some types do nothing against other types
        this.messages["Turn " + this.turnCounter.toString()].push("But it had no effect...");
        effect = false;
      }
    });
    return effect;
  }

  calculateDamage(move, attackingPoke, defendingPoke){
    let attack;
    let defense;
    let stab = 1;
    let effective = 1;

    // damage-dealing moves
    if (move['power'] > 0 || move['power'] === 'level'){
      // is the attack physical or special?
      if (move['category'] === 'physical'){
        attack = attackingPoke.currentStats['attack'];
        defense = defendingPoke.currentStats['defense'];
      } else {
        attack = attackingPoke.currentStats['spAtk'];
        defense = defendingPoke.currentStats['spDef'];
      }
      // is there stab?
      if (attackingPoke.currentStats['types'].includes(move['type'])) stab = 1.2;
      // calculate and apply damage
      let std = (Math.random() * 20 + 90) / 100;

      // super effective
      defendingPoke.currentStats['types'].forEach(type => {
        if (effectivenessData[move['type']][type]) effective = effective * effectivenessData[move['type']][type];
      });

      let damage = (42 * move['power'] * attack / defense / 50 + 2) * stab * std * effective;
      if (move['power'] === 'level') damage = 100;
      let damagePercent = Math.min(100.0, Math.round(1000 * (damage / defendingPoke.fullHealth)) / 10);
      
      // display how much damage was taken
      let percentHp = Math.round(1000 * defendingPoke.currentStats['hp'] / defendingPoke.fullHealth) / 10;
      defendingPoke.currentStats['hp'] -= damage;
      let printDamage = defendingPoke.currentStats['hp'] > 0 ? damagePercent : percentHp;
      
      if (effective > 1){
        this.messages["Turn " + this.turnCounter.toString()].push("It's super effective!");
      } else if (effective < 1 && effective > 0){
        this.messages["Turn " + this.turnCounter.toString()].push("It's not very effective...");
      } else if (!effective){
        this.messages["Turn " + this.turnCounter.toString()].push("But it had no effect...")
      }
      this.messages["Turn " + this.turnCounter.toString()].push("The opposing " + defendingPoke.name + " lost " + printDamage.toString() + "% of its health!")
      
      // calculate recoil
      if (move['recoil']){
        let recoil;
        if (move['recoil'] > 0){
          recoil = move['recoil'] * printDamage / 10000 * defendingPoke.fullHealth;
          let recoilPercent = Math.min(Math.round(1000 * attackingPoke.currentStats['hp'] / attackingPoke.fullHealth) / 10, Math.round(1000 * (recoil / attackingPoke.fullHealth)) / 10);
          this.messages["Turn " + this.turnCounter.toString()].push(attackingPoke.name + " lost " + recoilPercent.toString() + "% of its health due to recoil!");
          attackingPoke.currentStats['hp'] -= recoil;
        } else {
          recoil = Math.abs(move['recoil']) / 100 * damage;
          let recoilPercent = Math.min(Math.round(1000 * (attackingPoke.fullHealth - attackingPoke.currentStats['hp']) / 10), Math.round(1000 * (recoil / attackingPoke.fullHealth)) / 10);
          if (!recoilPercent){
            this.messages["Turn " + this.turnCounter.toString()].push(attackingPoke.name + " is at full health!");
          } else {
            this.messages["Turn " + this.turnCounter.toString()].push(attackingPoke.name + " restored " + recoilPercent.toString() + "% of its health!");
          }
          attackingPoke.currentStats['hp'] = Math.min(attackingPoke.currentStats['hp'] + recoil, attackingPoke.fullHealth);
        }
      }
    } 

    // stat-changing moves
    else {
      // is it on yourself or the other?
      let affected = move['self'] ? attackingPoke : defendingPoke;
      // go thru each stat change
      move['categories'].forEach((cat, idx) => {
        if (cat === 'hp'){ // raise hp
          if (affected.currentStats['hp'] === affected.fullHealth){
            this.messages["Turn " + this.turnCounter.toString()].push(affected.name + "'s health can't go any higher!");
          } else {
            let restoredHp = Math.min(50.0, Math.round(1000 * (affected.fullHealth - affected.currentStats['hp']) / 10));
            affected.currentStats['hp'] = Math.min(affected.currentStats['hp'] * (1 + move['multipliers'][0]), affected.fullHealth);
            this.messages["Turn " + this.turnCounter.toString()].push(affected.name + " restored " + restoredHp.toString() + "% of its health!");
          }
        } else { // change stats
          if (affected.statChanges[cat] === 6 && move['multipliers'][idx] > 0){ // can't go infinitely high
            this.messages["Turn " + this.turnCounter.toString()].push(affected.name + "'s " + cat + " can't go any higher!");
          } else if (affected.statChanges[cat] === -6 && move['multipliers'][idx] < 0){ // or infinitely low
            this.messages["Turn " + this.turnCounter.toString()].push("The opposing " + affected.name + "'s " + cat + " can't go any lower!");
          } else {
            affected.statChanges[cat] += move['multipliers'][idx];
            if (affected.statChanges[cat] > 6){ // same thing here
              affected.statChanges[cat] = 6;
            } else if (affected.statChanges[cat] < -6){
              affected.statChanges[cat] = -6;
            }
            let modifier = affected.statChanges[cat] >= 0 ? (2 + affected.statChanges[cat])/2 : 2/(2 - affected.statChanges[cat]);
            // apply the stat change
            affected.currentStats[cat] = statsAndMovesData[affected.name][cat] * modifier;
            let direction = move['multipliers'][idx] > 0 ? " rose!" : " fell!"
            if (move['self']){
              this.messages["Turn " + this.turnCounter.toString()].push(affected.name + "'s " + cat + direction);
            } else {
              this.messages["Turn " + this.turnCounter.toString()].push("The opposing " + affected.name + "'s " + cat + direction);
            }
          }
        }
      })
    }
  }

  checkFaint(faintPoke, player=null){
    // check if the pokemon's hp is 0
    if (faintPoke.currentStats['hp'] <= 0){
      let playerName = this.player1.party[0] === faintPoke ? this.player1.name : this.player2.name;
      let message = playerName + "'s " + faintPoke.name + " fainted!";
      if (!this.messages["Turn " + this.turnCounter.toString()].includes(message)) this.messages["Turn " + this.turnCounter.toString()].push(message);
      
      // if that was the player's last pokemon, the game is over
      this.checkGameOver();

      if (faintPoke === this.player1.party[0]) this.currentPlayer = this.player1;
      
      // this statement interrupts the turn loop in the case of recoil damage causing a pokemon to faint
      if (player){
        this.currentPlayer = player;
      }

      // this faint flag will prevent the game from advancing to the next turn until a new pokemon is switched in
      this.currentPlayer.faint = true;

      // here the user is able to switch to a different pokemon
      this.drawOptionsDisplay();
      return true;
    }
    return false;
  }

  resetTurn(){
    // reset all the flags, start the next turn
    this.player1.switched = false;
    this.player2.switched = false;
    this.player1.move = null;
    this.player2.move = null;
    this.player1.faint = false;
    this.player2.faint = false;
    this.turnCounter++;
    this.messages["Turn " + this.turnCounter.toString()] = [];
    this.messageDisplay();
  }

  finishTurn(){
    this.afterPokemonSwitch(); // reset animation info
    this.handleMove(); // handle move logic
    if (!this.currentPlayer.faint) this.resetTurn(); // start a new turn
    this.messageDisplay(); // display text
  }

  checkGameOver(){
    // check if a player has no more usable pokemon
    let player1Poke = Object.values(this.player1.party).filter(pokemon => pokemon.currentStats['hp'] > 0);
    let player2Poke = Object.values(this.player2.party).filter(pokemon => pokemon.currentStats['hp'] > 0);
    if (player1Poke.length === 0 || player2Poke.length === 0){
      if (player1Poke.length === 0){
        this.messages["Turn " + this.turnCounter.toString()].push(this.player2.name + " wins!")
      } else {
        this.messages["Turn " + this.turnCounter.toString()].push(this.player1.name + " wins!")
      }
      this.audio.pause();
      this.messageDisplay();
      return true;
    } else {
      return false;
    }
  }
}