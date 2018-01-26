var Colors = ["red", "pink", "purple", "blue", "yellow", "green"];
var SelectorsEnabled = true;
var ScoreArray = [671088640, 335544320, 167772160, 83886080, 41943040, 20971520, 10485760, 5242880, 2621440, 1310720, 655360, 327680, 163840, 81920, 40960, 20480, 10240, 5120, 2560, 1280, 640, 320, 160, 80, 40, 20];

function ResetBoard(){
	ClearAlert();
	var Board = document.getElementById("GameBoard");
	for (var BoardTR = 0; BoardTR < Board.rows.length; BoardTR++){
		for (var BoardTD = 0; BoardTD < Board.rows[BoardTR].cells.length; BoardTD++){
			var ThisCell = Board.rows[BoardTR].cells[BoardTD];
			ThisCell.className = Colors[Math.floor(Math.random() * 6)];
		}
	}
	$("#Counter").text("0");
	SelectorsEnabled = true;
}

function CheckBelow(RowID, ColumnID, ColorToUse, ColorToCheck){
	if (RowID + 1 < 14){
		var CellBelow = document.getElementById("GameBoard").rows[RowID + 1].cells[ColumnID];
		if (CellBelow.className == ColorToCheck && CellBelow.className != ColorToUse){
			CellBelow.className = ColorToUse;
			CheckBelow(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
			CheckRight(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
			CheckAbove(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
			CheckLeft(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
		}
	}
}

function CheckAbove(RowID, ColumnID, ColorToUse, ColorToCheck){
	if (RowID - 1 >= 0){
		var CellBelow = document.getElementById("GameBoard").rows[RowID - 1].cells[ColumnID];
		if (CellBelow.className == ColorToCheck && CellBelow.className != ColorToUse){
			CellBelow.className = ColorToUse;
			CheckBelow(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
			CheckRight(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
			CheckAbove(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
			CheckLeft(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
		}
	}
}

function CheckLeft(RowID, ColumnID, ColorToUse, ColorToCheck){
	if (ColumnID - 1 >= 0){
		var CellRight = document.getElementById("GameBoard").rows[RowID].cells[ColumnID - 1];
		if (CellRight.className == ColorToCheck && CellRight.className != ColorToUse){
			CellRight.className = ColorToUse;
			CheckBelow(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
			CheckRight(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
			CheckAbove(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
			CheckLeft(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
		}
	}
}

function CheckRight(RowID, ColumnID, ColorToUse, ColorToCheck){
	if (ColumnID + 1 < 14){
		var CellRight = document.getElementById("GameBoard").rows[RowID].cells[ColumnID + 1];
		if (CellRight.className == ColorToCheck && CellRight.className != ColorToUse){
			CellRight.className = ColorToUse;
			CheckBelow(RowID, ColumnID + 1, ColorToUse, ColorToCheck);
			CheckRight(RowID, ColumnID + 1, ColorToUse, ColorToCheck);
			CheckAbove(RowID, ColumnID + 1, ColorToUse, ColorToCheck);
			CheckLeft(RowID, ColumnID + 1, ColorToUse, ColorToCheck);
		}
	}
}

function BoardFlooded(ColorToCheck){
	var Board = document.getElementById("GameBoard");
	var IsFlooded = true;

	for (var BoardTR = 0; BoardTR < Board.rows.length; BoardTR++){
		for (var BoardTD = 0; BoardTD < Board.rows[BoardTR].cells.length; BoardTD++){
			if (Board.rows[BoardTR].cells[BoardTD].className != ColorToCheck){
				IsFlooded = false;
			}
		}
	}
	return IsFlooded;
}

function ClearAlert(){
	$("#loser").addClass("hide")
	$("#winner").addClass("hide");
}

function Loser(){
	$("#loser").removeClass("hide");
}

function Winner(){
	$("#winner").removeClass("hide");
}

$(document).ready(function(){
	ResetBoard();
	$("#resetBoard").click(function(){ResetBoard();});
	$("#playFromLoss").click(function(){ResetBoard();});
	$("#noPlayFromLoss").click(function(){ClearAlert();});
	$("#playFromWin").click(function(){ResetBoard();});
	$("#noPlayFromWin").click(function(){ClearAlert();});
	$("table.Layout tr td.colors table.choices tr td").not("table.Layout tr td.colors table.choices tr td.spacer").click(function(){
		var HomeCell = document.getElementById("GameBoard").rows[0].cells[0];
		if (HomeCell.className != this.className && SelectorsEnabled){
			CheckBelow(0, 0, this.className, HomeCell.className);
			CheckRight(0, 0, this.className, HomeCell.className);
			HomeCell.className = this.className;
			var ClickTotal = parseInt($("#Counter").text());
			ClickTotal++;
			$("#Counter").text(ClickTotal);
			var GamesPlayed = document.getElementById("GamesPlayed");
			var GamesWon = document.getElementById("GamesWon");
			var GamesLost = document.getElementById("GamesLost");
			if (BoardFlooded(this.className)){
				//winner
				SelectorsEnabled = false;
				TotalScore.innerHTML = parseInt(TotalScore.innerHTML) + ScoreArray[ClickTotal];
				var LastScore = document.getElementById("LastScore");
				LastScore.innerHTML = ScoreArray[ClickTotal];
				GamesWon.innerHTML = parseInt(GamesWon.innerHTML) + 1;
				GamesPlayed.innerHTML = parseInt(GamesPlayed.innerHTML) + 1;
				var WonPercent = (parseInt(GamesWon.innerHTML) / parseInt(GamesPlayed.innerHTML)) * 100;
				document.getElementById("WonPercent").innerHTML = WonPercent.toFixed(1);
				var LostPercent = (parseInt(GamesLost.innerHTML) / parseInt(GamesPlayed.innerHTML)) * 100;
				document.getElementById("LostPercent").innerHTML = LostPercent.toFixed(1);
				var HighScore = document.getElementById("HighScore");
				if (ScoreArray[ClickTotal] > parseInt(HighScore.innerHTML)){
					HighScore.innerHTML = ScoreArray[ClickTotal];
				}
				Winner();
			} else {
				if (ClickTotal == 25){
					//game over
					SelectorsEnabled = false;
					GamesLost.innerHTML = parseInt(GamesLost.innerHTML) + 1;
					GamesPlayed.innerHTML = parseInt(GamesPlayed.innerHTML) + 1;
					var WonPercent = (parseInt(GamesWon.innerHTML) / parseInt(GamesPlayed.innerHTML)) * 100;
					document.getElementById("WonPercent").innerHTML = WonPercent.toFixed(1);
					var LostPercent = (parseInt(GamesLost.innerHTML) / parseInt(GamesPlayed.innerHTML)) * 100;
					document.getElementById("LostPercent").innerHTML = LostPercent.toFixed(1);
					Loser();
				}
			}

		}
	});
});