

var rows = document.getElementsByClassName("row");

function addChecker(tile, color) {
  var checker = document.createElement('div');
  checker.className = "checker checker--" + color;
  checker.draggable = "true";
  tile.appendChild(checker);

  return checker;
}

function CheckerPiece(id, color, location) {
  var self = this;
  self.id = id,
  self.color = color,
  self.addChecker = function(tile, color) {
    var checker = document.createElement('div');
    checker.className = "checker checker--" + color;
    checker.draggable = "true";
    tile.appendChild(checker);

    self.element = checker;
    self.location = [Number(checker.parentNode.attributes.x.value), Number(checker.parentNode.attributes.y.value)];
  }
  // this.element = document.createElement('div');
  //
  // .addEventListener("click", this, false);

}

var redTeam = [];
var blueTeam = [];

//Ridiculously long board setup
for (var x = 0; x < rows.length; x++) {
  var tiles = rows[x].getElementsByClassName('tile');
  for (var y = 0; y < tiles.length; y++) {
    var redCounter = 0;
    var blueCounter = 0;
    if (x < 3) {
      if (x % 2 === 0 && y % 2 === 0) {
        // var checker = addChecker(tiles[y], "red");
        var redChecker = new CheckerPiece(redCounter, "red", [x, y]);
        redChecker.addChecker(tiles[y], "red");
        redTeam.push(redChecker);
        redCounter++;
      }
      else if (x % 2 != 0 && y % 2 !== 0) {
        addChecker(tiles[y], "red");
        var redChecker = new CheckerPiece(redCounter, "red", [x, y]);
        redTeam.push(redChecker);
        redCounter++;
      }
    }
    else if (x > 4) {
      if (x % 2 != 0 && y % 2 != 0) {
        addChecker(tiles[y], "blue");
        var blueChecker = new CheckerPiece(blueCounter, "blue", [x, y]);
        blueTeam.push(blueChecker);
        blueCounter++;
      }
      else if (x % 2 == 0 && y % 2 == 0 ) {
        addChecker(tiles[y], "blue");
        var blueChecker = new CheckerPiece(blueCounter, "blue", [x, y]);
        blueTeam.push(blueChecker);
        blueCounter++;
      }
    }
  }
}

document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged elem
    dragged = event.target;
}, false);


document.addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

CheckerPiece.prototype.handleEvent = function(e) {
  switch (e.type) {
    case "click": this.click(e);
      console.log('clicked');
  }
}

CheckerPiece.prototype.click = function(e) {
    // do something with this.element...
    this.element.style.color = "#F00";
}

//Checker movement
//If tile is playable highlight color to green
document.addEventListener("dragenter", function( event ) {
    // highlight potential drop target when the draggable element enters it
    if ( checkDropLocation(event) != false && event.target.classList[0] == 'tile' ) {
        event.target.style.background = "green";
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
    // move dragged elem to the selected drop target
    if ( checkDropLocation(event) != false && dragged.parentNode != event.target && dragged != event.target && moveDiagonal(event, dragged) == true ) {
        event.target.style.background = "";
        dragged.parentNode.removeChild( dragged );
        event.target.appendChild( dragged );
    }

}, false);

function checkDropLocation (dropLocation) {
  if ( ( dropLocation.target.classList[0] == "tile" && dropLocation.target.childElementCount > 0 )|| ( dropLocation.target.classList[0] == 'checker' ) || ( dropLocation.target.classList[0] != "tile" ) || moveDiagonal(dropLocation, dragged) != true ) {
    return false
  }
}

function moveDiagonal (dropLocation, checker) {
  var checkerCurrentYLocation = Number(checker.parentNode.attributes.y.value);
  var checkerCurrentXLocation = Number(checker.parentNode.attributes.x.value);

  var targetXLocation = Number(dropLocation.target.attributes.x.value);
  var targetYLocation = Number(dropLocation.target.attributes.y.value);

  var checkerTeam = (checker.classList[1] == 'checker--red' ? 'red' : 'blue');
  if (checkerTeam == 'red') {
    //check if movement is up one, over one
    if ( ( checkerCurrentYLocation + 1 == targetYLocation ) &&
        ( checkerCurrentXLocation - 1 == targetXLocation || (checkerCurrentXLocation + 1 == targetXLocation) ) ) {
      return true;
    }

    // else if ( ( checkerCurrentYLocation + 2 == targetYLocation ) &&
    //     ( checkerCurrentXLocation - 2 == targetXLocation || (checkerCurrentXLocation + 2 == targetXLocation) ) &&
    //     ( targetXLocation - 1 )) {
    //       if (  )
    //     }
  } else {
    if ( ( checkerCurrentYLocation - 1 == targetYLocation ) &&
      ( checkerCurrentXLocation - 1 == targetXLocation || (checkerCurrentXLocation + 1 == targetXLocation ) ) ) {
      return true;
    }
  }
}


//Logic:
//-team turn
//-who starts?
//-where can you drop a checker?
//if you drop piece where you picked it up it disappears --done
