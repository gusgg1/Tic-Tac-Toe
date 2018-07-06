(function() {

  const startScreen = document.querySelector('#start');
  const gameScreen = document.querySelector('#board');
  const endScreen = document.querySelector('.screen-win');
  const startBtn = document.querySelector('.button');
  const compBtn = startBtn.nextElementSibling;
  const input = document.querySelector('#name');
  const newGameBtn = endScreen.querySelectorAll('.button')[0];
  const homeBtn = newGameBtn.nextElementSibling;
  const boxes = document.querySelectorAll('.box');

  // Converting Nodelist into a HTML collection
  const boxesArray = Array.prototype.slice.call(document.querySelectorAll('.box'));

  const gameState = {
    active: "players active",
    inactive: 'players',
    board: Array(9),
    counter: 0,
    playing: true,
    computer: false
  }

  const player1 = {
    symbol: 'o',
    icon: document.querySelector('#player1'),
    image: "url('img/o.svg')",
    playing: false,
    square: 'box box-filled-1',
    name: input   
  }

  const player2 = {
    symbol: 'x',
    icon: document.querySelector('#player2'),
    image: "url('img/x.svg')",
    playing: false,
    square: 'box box-filled-2',
    name: 'Computer'     
  }

  const winning = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],  
  ];

  init();

  function init() {
    loadGame();
    whosTurn();
  }

  // ------------------------------------------
  //                 HANDLERS
  // ------------------------------------------


  startBtn.onclick = function() {
    if (player1.name.value !== '') {
      startScreen.style.display = 'none';
      gameScreen.style.display = '';
      attachName(player1);
    } else {
      input.style.border = 'solid red 1px';
    }
  }

  compBtn.onclick = function() {
    if (player1.name.value !== '') {
      gameState.computer = true;
      startScreen.style.display = 'none';
      gameScreen.style.display = '';
      attachName(player1);
      attachName(player2);
      makeMoveComp(boxes, gameState.board);
    } else {
      input.style.border = 'solid red 1px';
    }
  }

  homeBtn.onclick = function() {
    window.location.reload();
  }

  newGameBtn.onclick = function() {
    endScreen.style.display = 'none';
    player1.icon.className = gameState.inactive;
    player2.icon.className = gameState.inactive;  
    player1.playing = false;
    player2.playing = false;
    gameState.playing = true;
    gameState.board = Array(9);  
    gameState.counter = 0;
    whosTurn();    
    boxes.forEach(box => {
      box.className = 'box'
    });
    gameScreen.style.display = '';
    makeMoveComp(boxes, gameState.board);
  }


  // ------------------------------------------
  //                 HELPERS
  // ------------------------------------------

  function loadGame() {
    gameScreen.style.display = 'none';
    endScreen.style.display = 'none';
  }

  function attachName(player) {
    const div = document.createElement('div');
    div.textContent = player === player1 ? player.name.value : player.name;    
    div.style.fontWeight = 'bold';
    div.style.color = 'black';
    player.icon.appendChild(div);
  }

  function displaySymbol(e) {
    if (player1.playing && e.target.className !== player2.square) {
      e.target.style.backgroundImage = player1.image;
    } 
    if (player2.playing && e.target.className !== player1.square) {
      e.target.style.backgroundImage = player2.image;
    }
  }

  function noSymbol(e) {
    e.target.style.backgroundImage = '';    
  }
   
  function whosTurn() {
    const turn = Math.random() > 0.5;
    if (turn) {
      player1.playing = true;
      player1.icon.className = gameState.active;
    } else {
      player2.playing = true;
      player2.icon.className = gameState.active;
    }
  }

  function setState(li) {
    index = boxesArray.indexOf(li);
    gameState.board[index] = li.className;
  }

  function displayWinner(winner) {
    const message = document.querySelector('.message');
    gameScreen.style.display = 'none';
    winner ? message.textContent = 'Winner' : message.textContent = 'Tie'; 
    if (winner) {
      winner.includes(1) 
      ?
      endScreen.className = `screen screen-win screen-win-one`
      :
      endScreen.className = `screen screen-win screen-win-two`;
    } else {
      endScreen.className = 'screen screen-win screen-win-tie';
    }
    endScreen.style.display = '';     
  }

  function getWinner(winningState, board) {
    for (let i = 0; i < winningState.length; i++) {
      const indexA = winningState[i][0];
      const indexB = winningState[i][1];
      const indexC = winningState[i][2];
      
      if (board[indexA] === board[indexB] && board[indexB] === board[indexC]) {
        if (board[indexA]) {
          gameState.playing = false;
          displayWinner(board[indexA]);     
          return board[indexA];      
        }  
      } 
    }
    
    if (gameState.counter === gameState.board.length) {
      displayWinner();
    }
  }

  function playerOneMove(e) {
    e.target.className = player1.square;
    player1.playing = false;            
    player2.playing = true;        
    player1.icon.className = gameState.inactive;
    player2.icon.className = gameState.active;
    gameState.counter += 1;
  }

  function playerTwoMove() {
    player2.playing = false;
    player1.playing = true;
    player2.icon.className = gameState.inactive;
    player1.icon.className = gameState.active;
    gameState.counter += 1;
  }


  // ------------------------------------------
  //                     COMP.
  // ------------------------------------------
 
  function makeMoveComp(boardBoxes, stateBoard) {
    if (gameState.computer && gameState.playing) {
      let move = Math.floor(Math.random() * boardBoxes.length);
      if (player2.playing && gameState.counter !== 9) {
        while (boardBoxes[move].className !== 'box') {
          move = Math.floor(Math.random() * boardBoxes.length);
        }
        boardBoxes[move].className = player2.square;
        gameState.board[move] = player2.square;
        playerTwoMove();
        getWinner(winning, stateBoard);       
      }
    }
  }

  // ------------------------------------------
  //                 Listeners
  // ------------------------------------------

  boxes.forEach(box => {
    box.addEventListener('mouseover', displaySymbol);
    box.addEventListener('mouseout', noSymbol);

    box.addEventListener('click', function(e) {
      if (player1.playing && e.target.className === 'box') {
        playerOneMove(e);
        setState(e.target);
        getWinner(winning, gameState.board);
        makeMoveComp(boxes, gameState.board);
      }

      if (player2.playing && e.target.className === 'box') {
        e.target.className = player2.square;
        playerTwoMove();
        setState(e.target);
        getWinner(winning, gameState.board);
      }      
    });  
  });

})();
