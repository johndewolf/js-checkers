'use strict';

var rows = document.getElementsByClassName("row");

function addChecker(tile, color) {
  var checker = document.createElement('div');
  checker.className = "checker checker--" + color;
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
    if (x < 3) {
      var counter = 0;
      if (x % 2 === 0 && y % 2 === 0) {
        addChecker(tiles[y], "red");
        var redChecker = new CheckerPiece(counter, "red", [x, y]);
        redTeam.push(redChecker);
        counter++;
      }
      else if (x % 2 != 0 && y % 2 !== 0) {
        addChecker(tiles[y], "red");
        var redChecker = new CheckerPiece(counter, "red", [x, y]);
        redTeam.push(redChecker);
        counter++;
      }
    }
    else if (x > 4) {
      var counter = 0;
      if (x % 2 != 0 && y % 2 != 0) {
        addChecker(tiles[y], "blue");
        var blueChecker = new CheckerPiece(counter, "blue", [x, y]);
        blueTeam.push(blueChecker);
        counter++;
      }
      else if (x % 2 == 0 && y % 2 == 0 ) {
        addChecker(tiles[y], "blue");
        var blueChecker = new CheckerPiece(counter, "blue", [x, y]);
        blueTeam.push(blueChecker);
        counter++;
      }
    }
  }
}
