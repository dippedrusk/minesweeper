 /*
  * Minesweeper: an exercise in front-end development by recreating Microsoft Minesweeper
  * Copyright (C) 2017 Vasundhara Gautam
  *
  * This program is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

var gameInProgress = false;
var board = [];
var rows = 0, cols = 0, numMines = 0;
var minesSliderVal = 0;
var numRevealedSquares = 0;
//var validClick = true;
//var mousedownid;
//var timeout;

/*function getMinesAttr() {
  $("#mines").attr("max", ($("#rows").val() * $("#cols").val()) - 1);
  $("#mines").attr("value", Math.floor(0.2 * $("#mines").attr("max")));
}*/

function loadNewGame() {
  if (gameInProgress) {
    if (!(window.confirm("Are you sure you want to start a new game?")))
    {
      $("#rows").val(rows);
      $("#cols").val(cols);
      $("#mines").val(minesSliderVal);
      return;
    }
    else {
      gameInProgress = false;
    }
  }
  $("#endGame").html("");
  rows = $("#rows").val();
  cols = $("#cols").val();
  minesSliderVal = $("#mines").val();
  if (minesSliderVal >= rows*cols) {
    numMines = rows*cols - 1;
  }
  else {
    numMines = minesSliderVal;
  }
  numRevealedSquares = 0;
  board = [];

  for (var i = 0; i < rows*cols; i++) {
    board.push("");
  }
  populateMines();
  populateNumbers();
  loadBoardHTML();
  $(".square").on("mousedown", handleMouseDown);
}

function loadBoardHTML() {
  var html = "";
  for (var i = 0; i < rows; i++) {
    html += "<tr> ";
    for (var j = 0; j < cols; j++) {
      html += "<td class=\"square unrevealed" + board[i*cols + j] + "\" ";
      var id = getID(i*cols + j);
      html += "id=\"" + id + "\" </td>";
      //$("#"+id).contextmenu(function() {return false;});
    }
    html += "</tr>";
  }
  $("#minesweeper").html(html);
}

function handleMouseDown(event) {
  if (!gameInProgress) { // first move
    gameInProgress = true;
    // first move reveals a mine
    if ((event.button != 2) && ($("#"+this.id).hasClass("mine"))) {
      repositionMine(this.id);
      populateNumbers();
      loadBoardHTML();
      $(".square").on("mousedown", handleMouseDown);
    }
  }

  if ($("#"+this.id).hasClass("unrevealed")) {
    if (event.button == 2) {
      if ($("#"+this.id).hasClass("flagged")) {
        $("#"+this.id).removeClass("flagged");
      }
      else {
        $("#"+this.id).addClass("flagged");
      }
    }
    else {
      revealSquare(this.id);
    }
  }
}

function repositionMine(id) {
  var position = id.slice(3);
  var i = 0;
  while (board[i] == " mine") {
    i++;
  }
  board[i] = " mine";
  board[position] = "";
}

function clickSquare(id) {
  $("#"+id).removeClass("unrevealed");
  $("#"+id).removeClass("revealed");
  $("#"+id).addClass("clicked");
}

function unclickSquare(id) {
  $("#"+id).removeClass("clicked");
  $("#"+id).addClass("unrevealed");
  $("#"+id).off("mouseup");
}

function revealSquare(id) {
  if ($("#"+id).hasClass("flagged")) {
    return;
  }
  $("#"+id).removeClass("unrevealed");
  $("#"+id).removeClass("clicked");
  $("#"+id).addClass("revealed");
  numRevealedSquares += 1;
  if (isEmpty(id)) {
    revealAdjacentSquares(id); // reveal no mines
  }
  if ($("#"+id).hasClass("mine")) {
    $("#"+id).addClass("first");
    endGame("sad"); return;
  }
  if (numRevealedSquares == rows*cols - numMines) {
    endGame("happy"); return;
  }
}

function isEmpty(id) {
  var position = id.slice(3);
  if (board[position] == "") {
    return true;
  }
  return false;
}

function getID(position) {
  return ("sq-" + position);
}

function revealAdjacentSquares(id) {
  var position = id.slice(3);
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols-1; y++) {
      if ((x*cols + y) == position) {
        break;
      }
    }
    if ((x*cols + y) == position) {
      break;
    }
  }
  var px = x-1;
	var nx = x+1;
	var py = y-1;
	var ny = y+1;

  if ((px>-1) && (py>-1) && (board[px*cols + py] != " mine") && (($("#"+getID(px*cols + py)).hasClass("unrevealed")))) {
    revealSquare(getID(px*cols + py));
  }
  if ((px>-1) && (board[px*cols + y] != " mine") && (($("#"+getID(px*cols + y)).hasClass("unrevealed")))) {
    revealSquare(getID(px*cols + y));
  }
  if ((px>-1) && (ny<cols) && (board[px*cols + ny] != " mine") && (($("#"+getID(px*cols + ny)).hasClass("unrevealed")))) {
    revealSquare(getID(px*cols + ny));
  }
  if ((py>-1) && (board[x*cols + py] != " mine") && (($("#"+getID(x*cols + py)).hasClass("unrevealed")))) {
    revealSquare(getID(x*cols + py));
  }
  if ((ny<cols) && (board[x*cols + ny] != " mine") && (($("#"+getID(x*cols + ny)).hasClass("unrevealed")))) {
    revealSquare(getID(x*cols + ny));
  }
  if ((nx<rows) && (py>-1) && (board[nx*cols + py] != " mine") && (($("#"+getID(nx*cols + py)).hasClass("unrevealed")))) {
    revealSquare(getID(nx*cols + py));
  }
  if ((nx<rows) && (board[nx*cols + y] != " mine") && (($("#"+getID(nx*cols + y)).hasClass("unrevealed")))) {
    revealSquare(getID(nx*cols + y));
  }
  if ((nx<rows) && (ny<cols) && (board[nx*cols + ny] != " mine") && (($("#"+getID(nx*cols + ny)).hasClass("unrevealed")))) {
    revealSquare(getID(nx*cols + ny));
  }
}

function endGame(smileyStatus) {
  $(".square").off("mousedown");
  if (smileyStatus == "happy") {
    $("#endGame").html("You won! :D");
  }
  else {
    $("#endGame").html("You lose! :(");
    revealAllMines();
  }
  gameInProgress = false;
}

function revealAllMines() {
  for (var i = 0; i < board.length; i++) {
    if (board[i] == " mine") {
      var id = getID(i);
      $("#"+id).removeClass("unrevealed");
      $("#"+id).removeClass("clicked");
      $("#"+id).addClass("revealed");
      if ($("#"+id).hasClass("flagged")) {
        $("#"+id).removeClass("flagged");
        $("#"+id).addClass("crossed");
      }
    }
  }
}

function populateMines() {
  for (var i = 0; i < numMines; i++) {
    var position;
    do {
      position = Math.floor(Math.random() * rows*cols);
    } while (board[position] == " mine");
    board[position] = " mine";
  }
}

function populateNumbers() {
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols; y++) {
      var position = x*cols + y;
      if (board[position] != " mine") {
        var surroundingMines = countSurroundingMines(x, y);
        switch (surroundingMines) {
          case 1:
            board[position] = " one"; break;
          case 2:
            board[position] = " two"; break;
          case 3:
            board[position] = " three"; break;
          case 4:
            board[position] = " four"; break;
          case 5:
            board[position] = " five"; break;
          case 6:
            board[position] = " six"; break;
          case 7:
            board[position] = " seven"; break;
          case 8:
            board[position] = " eight"; break;
          default:
            board[position] = ""; break;
        }
      }
    }
  }
}

function countSurroundingMines(x, y) {
  var px = x-1;
	var nx = x+1;
	var py = y-1;
	var ny = y+1;
	var surrounding = 0;

  if ((px>-1) && (py>-1) && (board[px*cols + py] == " mine")) {
    surrounding += 1;
  }
  if ((px>-1) && (board[px*cols + y] == " mine")) {
    surrounding += 1;
  }
  if ((px>-1) && (ny<cols) && (board[px*cols + ny] == " mine")) {
    surrounding += 1;
  }
  if ((py>-1) && (board[x*cols + py] == " mine")) {
    surrounding += 1;
  }
  if ((ny<cols) && (board[x*cols + ny] == " mine")) {
    surrounding += 1;
  }
  if ((nx<rows) && (py>-1) && (board[nx*cols + py] == " mine")) {
    surrounding += 1;
  }
  if ((nx<rows) && (board[nx*cols + y] == " mine")) {
    surrounding += 1;
  }
  if ((nx<rows) && (ny<cols) && (board[nx*cols + ny] == " mine")) {
    surrounding += 1;
  }

  return surrounding;
}
