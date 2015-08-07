var rows = document.getElementsByClassName("row");

function addChecker(tile, color) {
  var checker = document.createElement('div');
  checker.className = "checker checker--" + color;
  checker.draggable = "true";
  tile.appendChild(checker);

  return checker;
}

function CheckerPiece(id, color) {
  var self = this;
  self.id = id,
  self.color = color,
  self.addChecker = function(tile) {
    var checker = document.createElement('div');
    checker.className = "checker checker--" + this.color;
    checker.draggable = "true";
    tile.appendChild(checker);
    self.element = checker;

  },
  self.location = function(){
    return [Number(self.element.parentNode.attributes.x.value), Number(self.element.parentNode.attributes.y.value)];
  }
}

var redTeam = [];
var blueTeam = [];
var redCounter = 0;
var blueCounter = 0;
//Ridiculously long board setup
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

document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged.element elem
    for (var x = 0; x < redTeam.length; x++) {
      if (event.target == redTeam[x].element) {
        dragged = redTeam[x];
      }
    }
    for (var x = 0; x < blueTeam.length; x++) {
     if (event.target == blueTeam[x].element) {
        dragged = blueTeam[x];
      }
    }
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
    if (checkDropLocation(event) != false && event.target.classList[0] == 'tile') {
      //logic for diagonal move
      if ( moveDiagonal(event, dragged) == true  ) {
          event.target.style.background = "green";
      }
      // logic for jump will go here
      else if ( (jumpDiagonal(event, dragged) == true ) ) {
        event.target.style.background = "green";
      }
    }
}, false);


//reset after hightlight
document.addEventListener("dragleave", function( event ) {
    // reset background of potential drop target when the draggable element leaves it
    if ( event.target.classList[0] == "tile" ) {
        event.target.style.background = "";
    }
}, false);

document.addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged.element elem to the selected drop target
    if ( checkDropLocation(event) != false && dragged.element.parentNode != event.target && dragged.element != event.target ) {
      if ( moveDiagonal(event, dragged) == true ) {
        event.target.style.background = "";
        dragged.element.parentNode.removeChild(dragged.element);
        event.target.appendChild(dragged.element);
      }
      else if ( jumpDiagonal(event, dragged) == true ) {
        if (Number(event.target.attributes.x.value) > dragged.location()[0]) {
          var jumped = adjacentChecker(dragged).xPlusOne
          removeCheckerFromTeam(jumped);
        }
        else if (Number(event.target.attributes.x.value) < dragged.location()[0]) {
          var jumped = adjacentChecker(dragged).xMinusOne;
          removeCheckerFromTeam(jumped);
        }
        event.target.style.background = "";
        dragged.element.parentNode.removeChild(dragged.element);
        event.target.appendChild(dragged.element);
      }
    }
}, false);

function checkDropLocation (dropLocation) {
  if ( ( dropLocation.target.classList[0] == "tile" && dropLocation.target.childElementCount > 0 ) || ( dropLocation.target.classList[0] == 'checker' ) || ( dropLocation.target.classList[0] != "tile" )) {
    return false
  }
}

function tileOccuppied(tileLocation) {
  if (tileLocation.childElementCount > 0) {
    return true;
  }
}

function moveDiagonal (dropLocation, checker) {
  var checkerCurrentYLocation = checker.location()[0];
  var checkerCurrentXLocation = checker.location()[1];

  var targetXLocation = Number(dropLocation.target.attributes.x.value);
  var targetYLocation = Number(dropLocation.target.attributes.y.value);

  if (checker.color === 'red') {
    //check if movement is up one, over one
    if ( ( checkerCurrentYLocation + 1 == targetYLocation ) &&
        ( checkerCurrentXLocation - 1 == targetXLocation || (checkerCurrentXLocation + 1 == targetXLocation) ) ) {
      return true;
    }
  } else {
    if ( ( checkerCurrentYLocation - 1 == targetYLocation ) &&
      ( checkerCurrentXLocation - 1 == targetXLocation || (checkerCurrentXLocation + 1 == targetXLocation ) ) ) {
      return true;
    }
  }
}

function jumpDiagonal (dropLocation, checker) {
  var targetXLocation = Number(dropLocation.target.attributes.x.value);
  var targetYLocation = Number(dropLocation.target.attributes.y.value);

  if (checker.color == 'red') {
    //check if movement is up two, over two
    if ( ( checker.location()[1] + 2 == targetYLocation ) &&
        ( (checker.location()[0] - 2 == targetXLocation &&
        adjacentChecker(checker).xMinusOne != undefined) || (checker.location()[0] + 2 == targetXLocation &&
          adjacentChecker(checker).xPlusOne != undefined) )
      ) {
      return true;
    }
  }
  if (checker.color == 'blue') {
    //check if movement is up two, over two
    if ( ( checker.location()[1] - 2 == targetYLocation ) &&
        ( (checker.location()[0] - 2 == targetXLocation &&
        adjacentChecker(checker).xMinusOne != undefined) || (checker.location()[0] + 2 == targetXLocation &&
          adjacentChecker(checker).xPlusOne != undefined) )
      ) {
      return true;
    }
  }
}

function adjacentChecker(checker) {
  var matches = {};
  if (checker.color == "red") {
    for (var i = 0; i < blueTeam.length; i++) {
      if (blueTeam[i].location()[0] === checker.location()[0] + 1 && blueTeam[i].location()[1] === checker.location()[1] + 1) {
        matches.xPlusOne = blueTeam[i];
      } else if (blueTeam[i].location()[0] === checker.location()[0] - 1 && blueTeam[i].location()[1] === checker.location()[1] + 1) {
        matches.xMinusOne = blueTeam[i];
      }
    }
  }
  else {
    for (var i = 0; i < redTeam.length; i++) {
      if (redTeam[i].location()[0] === checker.location()[0] + 1 && redTeam[i].location()[1] === checker.location()[1] - 1) {
        matches.xPlusOne = redTeam[i];
      } else if ( redTeam[i].location()[0] === checker.location()[0] - 1 && redTeam[i].location()[1] === checker.location()[1] - 1 ) {
        matches.xMinusOne = redTeam[i];
      }
    }
  }
  return matches;
}

function removeCheckerFromTeam(checker) {
  if (checker.color === 'red') {
    redTeam.splice(checker.id, 1);
  } else {
    blueTeam.splice(checker.id, 1);
  }

  checker.element.parentNode.removeChild(checker.element);
}
//Logic:
//-team turn
//-who starts?
//-where can you drop a checker?
//if you drop piece where you picked it up it disappears --done
