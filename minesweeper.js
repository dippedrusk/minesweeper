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
var numMines = 0;
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
      gameInProgress = false;
      return; // reset values to originals
    }
  }
  var rows = $("#rows").val();
  var cols = $("#cols").val();
  switch ($("#difficulty").val()) {
    case "easy":
      numMines = Math.floor(0.4 * rows * cols); break;
    case "difficult":
      numMines = Math.floor(0.1 * rows * cols); break;
    default:
      numMines = Math.floor(0.25 * rows * cols); break;
  }
  board = [];
  for (var i = 0; i < rows*cols; i++) {
    board.push("");
  }
  populateMines(rows, cols, numMines);
  populateNumbers(rows, cols);
  loadBoardHTML(rows, cols);
  $(".square").on("mousedown", handleMouseDown);
}

function loadBoardHTML(rows, cols) {
  var html = "";
  for (var i = 0; i < rows; i++) {
    html += "<tr>"
    for (var j = 0; j < cols; j++) {
      var id = i*cols + j;
      html += "<td class=\"square unrevealed" + board[id] + "\" ";
      html += "id=\"sq-";
      html += id.toString();
      html += "\" </td>"
    }
    html += "</tr>";
  }
  $("#minesweeper").html(html);
}

function handleMouseDown() {
  if (!gameInProgress) {
    gameInProgress = true;
  }
  if ($("#"+this.id).hasClass("unrevealed")) {
    revealSquare(this.id);
  }
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
  $("#"+id).removeClass("unrevealed");
  $("#"+id).removeClass("clicked");
  $("#"+id).addClass("revealed");
  if ($("#"+id).hasClass("mine")) {
    $("#"+id).addClass("first");
    endGame();
  }
}

function endGame() {
  $(".square").off("mousedown");
  revealAllMines();
  gameInProgress = false;
}

function revealAllMines() {
  for (var i = 0; i < board.length; i++) {
    if (board[i] == " mine") {
      $("#sq-"+i).removeClass("unrevealed");
      $("#sq-"+i).removeClass("clicked");
      $("#sq-"+i).addClass("revealed");
    }
  }
}

function populateMines(rows, cols, mines) {
  for (var i = 0; i < mines; i++) {
    var position;
    do {
      position = Math.floor(Math.random() * rows*cols);
    } while (board[position] == " mine");
    board[position] = " mine";
  }
}

function populateNumbers(rows, cols) {
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < cols; y++) {
      var position = x*cols + y;
      if (!(board[position] == " mine")) {
        var surroundingMines = countSurroundingMines(x, y, rows, cols);
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

function countSurroundingMines(x, y, rows, cols) {
  var px = x-1;
	var nx = x+1;
	var py = y-1;
	var ny = y+1;
	var surrounding = 0;

  if ((px>-1) && (py>-1) && (board[px*cols + py]) == " mine") {
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
  if ((nx<rows) && (board[nx*cols + py] == " mine")) {
    surrounding += 1;
  }
  if ((nx<rows) && (board[nx*cols + y] == " mine")) {
    surrounding += 1;
  }
  if ((nx<rows) && (board[nx*cols + ny] == " mine")) {
    surrounding += 1;
  }

  return surrounding;
}
