

var rows = document.getElementsByClassName("row");

function addChecker(tile, color, id) {
  var checker = document.createElement('div');
  checker.className = "checker checker--" + color;
  checker.draggable = "true";
  checker.id = id;
  tile.appendChild(checker);
}

function CheckerPiece(id, color, location) {
  this.id = id;
  this.color = color;
  this.location = location;
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
        var id = tiles[y].attributes.x.value.toString() + tiles[y].attributes.y.value.toString();
        addChecker(tiles[y], "red", id);
        var redChecker = new CheckerPiece(redCounter, "red", [x, y]);
        redTeam.push(redChecker);
        redCounter++;
      }
      else if (x % 2 != 0 && y % 2 !== 0) {
        var id = tiles[y].attributes.x.value.toString() + tiles[y].attributes.y.value.toString();
        addChecker(tiles[y], "red", id);
        var redChecker = new CheckerPiece(redCounter, "red", [x, y]);
        redTeam.push(redChecker);
        redCounter++;
      }
    }
    else if (x > 4) {
      if (x % 2 != 0 && y % 2 != 0) {
        var id = tiles[y].attributes.x.value.toString() + tiles[y].attributes.y.value.toString();
        addChecker(tiles[y], "blue", id);
        var blueChecker = new CheckerPiece(blueCounter, "blue", [x, y]);
        blueTeam.push(blueChecker);
        blueCounter++;
      }
      else if (x % 2 == 0 && y % 2 == 0 ) {
        var id = tiles[y].attributes.x.value.toString() + tiles[y].attributes.y.value.toString();
        addChecker(tiles[y], "blue", id);
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


//If tile is playable highlight color to green
document.addEventListener("dragenter", function( event ) {
    // highlight potential drop target when the draggable element enters it
    if ( checkDropLocation(event) != false && event.target.classList[0] == 'tile' ) {
        event.target.style.background = "green";
    } else if ( event.target.classList[0] == 'tile' && checkDropLocation(event) == false ) {
      event.target.style.background = 'pink';
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
    if ( checkDropLocation(event) != false && dragged.parentNode != event.target && dragged != event.target  ) {
        event.target.style.background = "";
        dragged.parentNode.removeChild( dragged );
        event.target.appendChild( dragged );
    }

}, false);

function checkDropLocation (dropLocation) {
  if ( ( dropLocation.target.classList[0] == "tile" && dropLocation.target.childElementCount > 0 )|| ( dropLocation.target.classList[0] == 'checker' ) ) {
    return false
  }
}

//Logic:
//-team turn
//-who starts?
//-where can you drop a checker?
//if you drop piece where you picked it up it disappears --done
