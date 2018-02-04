
// App is wrapped in a self-invoking function:
(function() {

  // Game variables
  const game = {
    board: document.querySelector('#board'),
    startScreen: document.querySelector('#start'),
    startBtn: document.querySelector('.button'),
    ulBox: document.querySelector('.boxes'),
    boxes: document.querySelectorAll('.box'),
    endScreen: document.querySelector('#finish'),
    message: document.querySelector('.message'),
    newGameBtn: document.querySelectorAll('.button')[1], 

    active: 'players active',
    inactice: 'players',
    tileTaken: 'filled',
    tieScreen: 'screen screen-win screen-win-tie',
    winner: false
  };

  // Adding input field dynamically
  game.nameField = function(el, type, placeholder) {
    const header = document.querySelectorAll('header')[0];
    const element = document.createElement(el);
    element.type = type;
    element.placeholder = placeholder;
    header.appendChild(element);
  };

  // Hiding board and end-screen
  game.homePage = function() {
    this.board.style.display = 'none';
    this.endScreen.style.display = 'none';
    this.startBtn.textContent = 'Player vs Computer';
  };

  game.start = function() {
    const nameField = document.querySelector('input');
    if (nameField.value !== '') {
      this.startScreen.style.display = 'none';
      this.board.style.display = '';
    }
  };

  game.whosTurn = function() {
    let turn = Math.floor(Math.random() * 2);
    if (turn === 0) {
      player1.square.className = game.active;
      player1.turn = true;
    } else {
      player2.square.className = game.active;
      player2.turn = true;
    }
  };

  // Exceeds: Asking user for their name before game starts 
  game.nameField('input', 'text', 'Please enter your name');

  // player1 variables
  const player1 = {
    square: document.querySelector('#player1'),
    img: "url('img/o.svg')",
    turn: false,
    filled: "box box-filled-1",
    screen: 'screen screen-win screen-win-one',
    name: document.querySelector('input')
  };

  // Attaching player name to board
  player1.playerName = function() {
    const div = document.createElement('div');
    div.textContent = player1.name.value;
    div.style.fontWeight = 'bold';
    div.style.color = 'black';
    player1.square.appendChild(div);
  };

  // player2 variables
  const player2 = {
    square: document.querySelector('#player2'),
    img: "url('img/x.svg')",
    turn: false,
    filled: "box box-filled-2",
    screen: 'screen screen-win screen-win-two'
  };

  // Attaching "Computer" to board
  player2.computerName = function() {
    const div = document.createElement('div');
    div.textContent = 'Computer';
    div.style.fontWeight = 'bold';
    div.style.color = 'black';
    player2.square.appendChild(div);
  };


  // Hovering state ------------------------------------------------------------
  // Displaying the player icon when player hoevers over the board
  function hoverOver(e, turn, img) {
    if (turn === true && e.target.className === 'box') {
      let box = e.target;
      box.style.backgroundImage = img;
    }
  }
  function hoverOut(e, turn) {
    if (turn === true) {
      let box = e.target;
      box.style.backgroundImage = '';
    }    
  }

  const player1HoverIn = e => {
    hoverOver(e, player1.turn, player1.img);
  }
  const player1HoverOut = e => {
    hoverOut(e, player1.turn);
  }

  const player2HoverIn = e => {
    hoverOver(e, player2.turn, player2.img);
  }
  const player2HoverOut = e => {
    hoverOut(e, player2.turn);
  }


  // Click event handlers -----------------------------------------------------
  function activeTurnPlayer1(e) {
    e.target.className = player1.filled;
    player1.turn = false;
    player2.turn = true;
    player2.square.className = game.active;
    player1.square.className = game.inactice;  
  }

  // Picking a random box / tile from board
  function randomMove() {
    let randomMove = Math.floor(Math.random() * game.boxes.length); 
    return randomMove;
  }

  // checking for a box that is not taken by any player
  function availableMove() {
    let available = false;
    for (let i = 0; i < game.boxes.length; i++) {
      if (game.boxes[i].className === 'box') {
        available = true;
      }
    }
    return available;
  }

  // Exceeds: one side of the game is programatically controlled
  function computerPlay() {
    if (player2.square.className === game.active) {
      let box = randomMove();
      let possibleMove = availableMove();
      while (game.boxes[box].className.includes(game.tileTaken) && possibleMove) {
        box = randomMove();
      }
      if (game.boxes[box].className === 'box') {
        game.boxes[box].className = player2.filled;     
      }
      player2.square.className = game.inactice;
      player1.square.className = game.active; 
      player1.turn = true;
      player2.turn = false;
    }
  }


  // Winning logic --------------------------------------------------------
  function endGame(playerScreen, message) {
    game.board.style.display = 'none';  
    game.endScreen.style.display = '';
    game.endScreen.className = playerScreen;
    game.message.textContent = message;
  }

  const whoWins = (playerFilled, playerScreen, message) => {
    if ( game.boxes[0].className === playerFilled && game.boxes[1].className === playerFilled && game.boxes[2].className === playerFilled || 
      game.boxes[3].className === playerFilled && game.boxes[4].className === playerFilled && game.boxes[5].className === playerFilled ||
      game.boxes[6].className === playerFilled && game.boxes[7].className === playerFilled && game.boxes[8].className === playerFilled ||
      game.boxes[0].className === playerFilled && game.boxes[3].className === playerFilled && game.boxes[6].className === playerFilled ||
      game.boxes[1].className === playerFilled && game.boxes[4].className === playerFilled && game.boxes[7].className === playerFilled ||
      game.boxes[2].className === playerFilled && game.boxes[5].className === playerFilled && game.boxes[8].className === playerFilled ||
      game.boxes[0].className === playerFilled && game.boxes[4].className === playerFilled && game.boxes[8].className === playerFilled ||
      game.boxes[2].className === playerFilled && game.boxes[4].className === playerFilled && game.boxes[6].className === playerFilled ) {
      endGame(playerScreen, message);
      game.winner = true;
    }
  };

  // Defining a tie
  const tie = () => { 
    let tile = 0;
    let moves = availableMove();
    for (let i = 0; i < game.boxes.length; i++) {
      if (game.boxes[i].className.includes(game.tileTaken)) {
        tile++;
        if (tile === 9 && !game.winner && !moves) {
          endGame(game.tieScreen, 'It is a tie!');
        }
      }
    }  
  };

  // Exceeds: display the player’s name if they win the game
  const playerOneWins = () => {
    whoWins(player1.filled, player1.screen, (player1.name.value + ' wins!'));
  };

  const playerTwoWins = () => {
    if (!game.winner) {
      whoWins(player2.filled, player2.screen, 'Computer wins!');
    }
  };


  // Starting a new game after winner or tie -----------------------------------
  const starNewGame = () => {
    game.endScreen.style.display = 'none';
    player1.square.className = game.inactice;
    player2.square.className = game.inactice;
    game.winner = false;
    game.whosTurn();  
    for (let i = 0; i < game.boxes.length; i++) {
      game.boxes[i].className = 'box';
    }
    game.board.style.display = '';  
  };

  
  // --------------------------------------------------------------------------

    // When page loads board is hidden
    game.homePage();
  
    // Clicking on button: starts game, displays player and computer names
    game.startBtn.addEventListener('click', () => {
      game.start();
      player1.playerName(); // Player's name appears on the boardscreen\
      if (player1.name.value !== '') {
        player2.computerName();
      }
    });
  
    // Randomly selecting who starts the game 
    game.whosTurn();
  
    // hovering listeners
    game.ulBox.addEventListener('mouseover', player1HoverIn);
    game.ulBox.addEventListener('mouseout', player1HoverOut);
    game.ulBox.addEventListener('mouseover', player2HoverIn);
    game.ulBox.addEventListener('mouseout', player2HoverOut);
  
    // player's click listener
    game.ulBox.addEventListener('click', (e) => {
      if (player1.turn === true && e.target.className === 'box') {
        activeTurnPlayer1(e);
      }
    });
  
    // computer playing
    setInterval(computerPlay, 1);
  
    // triggering: display tie or winners
    setInterval(playerTwoWins, 1);
    setInterval(tie, 1000);
    game.ulBox.addEventListener('click', playerOneWins);
  
    game.newGameBtn.addEventListener('click', starNewGame);

})();


  
















