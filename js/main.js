function CheckerPiece(id, color) {
  var self = this;
  self.id = id,
  self.color = color,
  self.addChecker = function(tile) {
    var checker = document.createElement('div');
    checker.className = "checker checker--" + this.color;
    checker.id = this.color + this.id;
    checker.draggable = "true";
    tile.appendChild(checker);
    self.element = checker;

  },
  self.location = function(){
    return [Number(self.element.parentNode.attributes.x.value), Number(self.element.parentNode.attributes.y.value)];
  },
  self.isKing = false,
  self.tempLocation = []
}

var redTeam = [];
var blueTeam = [];
var redCounter = 0;
var blueCounter = 0;
var turnData = {
  teamTurn: 'red'
};

boardSetup();
document.getElementById('turnInfo').innerHTML = ' '+turnData.teamTurn;
dragged = '';
document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged.element
      redTeam.forEach(function(checker) {
        if (event.target == checker.element && turnData.teamTurn === 'red') {
          dragged = checker;
        }      
      })
      blueTeam.forEach(function(checker) {
        if (event.target == checker.element && turnData.teamTurn === 'blue') {
          dragged = checker;
        }      
      })
}, false);


document.addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

//Checker movement
//If tile is playable highlight color to green
document.addEventListener("dragenter", function( event ) {
    // highlight potential drop target when the draggable element enters it
    // check drop location for all drags
    if ( dragged !== '' ) {
      if (checkDropLocation(event) == true && event.target.classList[0] == 'tile') {
        //logic for diagonal move
        var dropLoc = [event.target.attributes.x.value, event.target.attributes.y.value];
        //if there is a temp location, check if you can jump from that location
        if ( dragged.tempLocation.length > 0 ) {
          if ((jumpCheck(dropLoc, dragged.color, dragged.tempLocation, dragged.isKing) !== undefined ) )  {
          event.target.className += " tile--green";
          }
        }
        //check if it just a move, not a jump
        else if ( moveDiagonal(dropLoc, dragged) == true  ) {
          event.target.className += " tile--green";
        }
        
        //check if it is a jump
        else if ( (jumpCheck(dropLoc, dragged.color, dragged.location(), dragged.isKing) !== undefined ) ) {
          event.target.className += " tile--green";
          dragged.tempLocation[0] = Number(event.target.attributes.x.value);
          dragged.tempLocation[1] = Number(event.target.attributes.y.value);
        }
      }
    }
}, false);


//reset after hightlight
document.addEventListener("dragleave", function( event ) {
    // reset background of potential drop target when the draggable element leaves it
    if ( dragged !== '' ) {
      if ( event.target.classList[0] == "tile" && (jumpCheck([event.target.attributes.x.value, event.target.attributes.y.value], dragged.color, dragged.location(), dragged.isKing) === undefined )) {
        event.target.classList.remove("tile--green");
      }
    }
}, false);

document.addEventListener("drop", function( event ) {
    var greenTiles = document.getElementsByClassName('tile--green');
    // prevent default action (open as link for some elements)
    event.preventDefault();
    if ( dragged !== '' ) {
    // move dragged.element elem to the selected drop target
      if ( checkDropLocation(event) != false && dragged.element.parentNode != event.target && dragged.element != event.target ) {
        var dropLoc = [event.target.attributes.x.value, event.target.attributes.y.value];
        if ( moveDiagonal(dropLoc, dragged) == true ) {
          dragged.element.parentNode.removeChild(dragged.element);
          event.target.appendChild(dragged.element);
          switchTeamTurn(dragged.color);
        }
        else if ( (jumpCheck(dropLoc, dragged.color, dragged.location(), dragged.isKing) !== undefined ) ) {
          var jumped = jumpCheck(dropLoc, dragged.color, dragged.location(), dragged.isKing);
          dragged.element.parentNode.removeChild(dragged.element);
          removeCheckerFromTeam(jumped);
          event.target.appendChild(dragged.element);
          switchTeamTurn(dragged.color);
        }
        else if (greenTiles.length > 1) {
          var jumped = jumpCheck(dragged.tempLocation, dragged.color, dragged.location(), dragged.isKing);
          removeCheckerFromTeam(jumped);
          var jumped = jumpCheck(dropLoc, dragged.color, dragged.tempLocation, dragged.isKing);
          removeCheckerFromTeam(jumped);
          event.target.appendChild(dragged.element);
          switchTeamTurn(dragged.color);
        }
      }
      
      if ( greenTiles.length > 0 ) {
        for (var i = 0; i <= greenTiles.length; i++) {
          greenTiles[0].classList.remove('tile--green');
        }
      }
      if ( dragged.color === 'red' && dragged.location()[1] === 7 ) {
        dragged.isKing = true;
        dragged.element.className = 'checker checker--red checker--king';
      }
      else if ( dragged.color === 'blue' && dragged.location()[1] === 0 ) {
        dragged.isKing = true;
        dragged.element.className = 'checker checker--blue checker--king';
      }
      dragged.tempLocation.length = 0;
      dragged = '';
    }
}, false);

function checkDropLocation (dropLocation) {
  if ( ( dropLocation.target.classList[0] == "tile" && dropLocation.target.childElementCount > 0 ) || ( dropLocation.target.classList[0] == 'checker' ) || ( dropLocation.target.classList[0] != "tile" )) {
    return false;
  } else {
    return true;
  }
}

function tileOccuppied(tileLocation) {
  if (tileLocation.childElementCount > 0) {
    return true;
  }
}

function moveDiagonal (dropLocation, checker) {
  var checkerCurrentXLocation = Number(checker.location()[0]);
  var checkerCurrentYLocation = Number(checker.location()[1]);

  var targetXLocation = dropLocation[0];
  var targetYLocation = dropLocation[1];
  if ( checker.isKing === true ) {
    if ( ((checkerCurrentYLocation + 1 == targetYLocation) || (checkerCurrentYLocation - 1 == targetYLocation)) &&
          ((checkerCurrentXLocation + 1 == targetXLocation) || (checkerCurrentXLocation - 1)  == targetXLocation)) {
      return true;
    }
  }
  else if ( checker.color === 'red') {
    //check if movement is up one, over one
    if ( ( checkerCurrentYLocation + 1 == targetYLocation ) &&
        ( checkerCurrentXLocation - 1 == targetXLocation || (checkerCurrentXLocation + 1 == targetXLocation) ) ) {
      return true;
    }
  }
  else if ( checker.color === 'blue' ){
    if ( ( checkerCurrentYLocation - 1 == targetYLocation ) &&
      ( checkerCurrentXLocation - 1 == targetXLocation || (checkerCurrentXLocation + 1 == targetXLocation ) ) ) {
      return true;
    }
  }
}

function getJumpedTile(dropLocation, currentLocation) {
  var jumpedTile = [];
  var targetXLocation = Number(dropLocation[0]);
  var targetYLocation = Number(dropLocation[1]);

  if ( currentLocation[0] + 2 === targetXLocation ) {
    jumpedTile[0] = currentLocation[0] + 1;
  }
  else if ( currentLocation[0] - 2 === targetXLocation ) {
    jumpedTile[0] = currentLocation[0] - 1;
  }
  else {
    return false;
  }

  if ( currentLocation[1] + 2 === targetYLocation ) {
    jumpedTile[1] = currentLocation[1] + 1;

  }
  else if ( currentLocation[1] - 2 === targetYLocation ) {
    jumpedTile[1] = currentLocation[1] - 1;
  }
  else {
    return false;
  }
  
  return jumpedTile;

}

function enemyCheckerOnTile(teamColor, tileLocation) {
  var match;
  if (teamColor == "red") {
    for (var i = 0; i < blueTeam.length; i++) {
      if ( blueTeam[i].location()[0] === tileLocation[0] && blueTeam[i].location()[1] === tileLocation[1]) {
        match = blueTeam[i]
      }
    }
  }
  else if (teamColor == "blue") {
    for (var i = 0; i < redTeam.length; i++) {
      if ( redTeam[i].location()[0] === tileLocation[0] && redTeam[i].location()[1] === tileLocation[1]) {
        match = redTeam[i];
      }
    }
  }

  return match;

}

function adjacentChecker(color, location) {
  var matches = {};
  if (color == "red") {
    for (var i = 0; i < blueTeam.length; i++) {
      if (blueTeam[i].location()[0] === location[0] + 1 && blueTeam[i].location()[1] === location[1] + 1) {
        matches.xPlusOne = blueTeam[i];
      } else if (blueTeam[i].location()[0] === location[0] - 1 && blueTeam[i].location()[1] === location[1] + 1) {
        matches.xMinusOne = blueTeam[i];
      }
    }
  }
  else {
    for (var i = 0; i < redTeam.length; i++) {
      if (redTeam[i].location()[0] === location[0] + 1 && redTeam[i].location()[1] === location[1] - 1) {
        matches.xPlusOne = redTeam[i];
      } else if ( redTeam[i].location()[0] === location[0] - 1 && redTeam[i].location()[1] === location[1] - 1 ) {
        matches.xMinusOne = redTeam[i];
      }
    }
  }
  return matches;
}

function jumpCheck (dropLocation, color, currentLocation, isKing) {
  var targetXLocation = dropLocation[0];
  var targetYLocation = dropLocation[1];
  if (isKing === true) {
    var jumpedTile = getJumpedTile([targetXLocation, targetYLocation], currentLocation)
    if (jumpedTile !== false) {
      if (enemyCheckerOnTile(color, jumpedTile) !== undefined) {
        return enemyCheckerOnTile(color, jumpedTile);
      }
    }
  }
  else if (color == 'red') {
    //check if movement is up two, over two
    if ( ( currentLocation[1] + 2 == targetYLocation ) &&
         ( currentLocation[0] - 2 == targetXLocation ) ) {
      if ( adjacentChecker(color, currentLocation).xMinusOne != undefined ) {
        return adjacentChecker(color, currentLocation).xMinusOne;
      }
    }
    else if ( ( currentLocation[1] + 2 == targetYLocation ) &&
              ( currentLocation[0] + 2 == targetXLocation ) ) {
      if (adjacentChecker(color, currentLocation).xPlusOne != undefined) {
        return adjacentChecker(color, currentLocation).xPlusOne;
      }
    }
  } 
  else if (color == 'blue') {
    if ( ( currentLocation[1] - 2 == targetYLocation ) &&
         ( currentLocation[0] - 2 == targetXLocation ) ) {
      if ( adjacentChecker(color, currentLocation).xMinusOne != undefined ) {
        return adjacentChecker(color, currentLocation).xMinusOne;
      }
    }
    else if ( ( currentLocation[1] - 2 == targetYLocation ) &&
              ( currentLocation[0] + 2 == targetXLocation ) ) {
      if (adjacentChecker(color, currentLocation).xPlusOne != undefined) {
        return adjacentChecker(color, currentLocation).xPlusOne;
      }
    }
  }
}

function removeCheckerFromTeam(checker) {
  if (checker.color === 'red') {
    redTeam.forEach(function(redChecker, index) {
      if (checker.id === redChecker.id) {
        redTeam.splice(index, 1);
      }
    })
  } else {
    blueTeam.forEach(function(blueChecker, index) {
      if (checker.id === blueChecker.id) {
        blueTeam.splice(index, 1);
      }
    })
  }
  return checker.element.parentNode.removeChild(checker.element);
}

//Ridiculously long board setup
function boardSetup() {
  var rows = document.getElementsByClassName("row");
  for (var x = 0; x < rows.length; x++) {
    var tiles = rows[x].getElementsByClassName('tile');

    for (var y = 0; y < tiles.length; y++) {
      if (x < 3) {
        if (x % 2 === 0 && y % 2 === 0) {
          var redChecker = new CheckerPiece(redCounter, "red");
          redChecker.addChecker(tiles[y]);
          redTeam.push(redChecker);
          redCounter++;
        }
        else if (x % 2 != 0 && y % 2 !== 0) {
          var redChecker = new CheckerPiece(redCounter, "red");
          redChecker.addChecker(tiles[y]);
          redTeam.push(redChecker);
          redCounter++;
        }
      }
      else if (x > 4) {
        if (x % 2 != 0 && y % 2 != 0) {
          var blueChecker = new CheckerPiece(blueCounter, "blue");
          blueChecker.addChecker(tiles[y]);
          blueTeam.push(blueChecker);
          blueCounter++;
        }
        else if (x % 2 == 0 && y % 2 == 0 ) {
          var blueChecker = new CheckerPiece(blueCounter, "blue");
          blueChecker.addChecker(tiles[y]);
          blueTeam.push(blueChecker);
          blueCounter++;
        }
      }
    }
  }
}

function switchTeamTurn(currentTeam) {
  if (currentTeam === 'red') {
    turnData.teamTurn = 'blue'
  } else {
    turnData.teamTurn = 'red'
  }
  document.getElementById('turnInfo').innerHTML = ' '+turnData.teamTurn;
}

function addChecker(tile, color) {
  var checker = document.createElement('div');
  checker.className = "checker checker--" + color;
  checker.draggable = "true";
  tile.appendChild(checker);

  return checker;
}

//Logic:
//-game over / winner
//-team turn
//-who starts?
