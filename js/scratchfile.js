document.addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged.element elem to the selected drop target
    if ( checkDropLocation(event) != false && dragged.element.parentNode != event.target && dragged.element != event.target ) {
      if ( moveDiagonal(event, dragged) == true ) {
        dragged.element.parentNode.removeChild(dragged.element);
        event.target.appendChild(dragged.element);
      }
      else if ( jumpDiagonal(event, dragged.color, dragged.location()) == true ) {
        console.log(jumpCheck(event, dragged.color, dragged.location()));
        if (Number(event.target.attributes.x.value) > dragged.location()[0]) {
          var jumped = adjacentChecker(dragged.color, dragged.location()).xPlusOne
          removeCheckerFromTeam(jumped);
        }
        else if (Number(event.target.attributes.x.value) < dragged.location()[0]) {
          var jumped = adjacentChecker(dragged.color, dragged.location()).xMinusOne;
          removeCheckerFromTeam(jumped);
        }
        dragged.element.parentNode.removeChild(dragged.element);
        event.target.appendChild(dragged.element);
      }
      else if (document.getElementsByClassName('tile--green').length > 2) {

      }
    }
    var greenTiles = document.getElementsByClassName('tile--green');
    if ( greenTiles.length > 0 ) {
      for (var i = 0; i <= greenTiles.length; i++) {
        greenTiles[0].classList.remove('tile--green');
      }
    }
    dragged.tempLocation.length = 0;
}, false);