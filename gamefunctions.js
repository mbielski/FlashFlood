var Colors = ["red", "pink", "purple", "blue", "yellow", "green"],
	SelectorsEnabled = true,
	BoardSize = 14,
    ScoreArray = [671088640, 335544320, 167772160, 83886080, 41943040, 20971520, 10485760, 5242880, 2621440, 1310720, 655360, 327680, 163840, 81920, 40960, 20480, 10240, 5120, 2560, 1280, 640, 320, 160, 80, 40, 20];

function ResetBoard(){
	var Board, ThisCell, BoardTR, BoardTD;
	ClearAlert();
	Board = document.getElementById("GameBoard");
	for (BoardTR = 0; BoardTR < BoardSize; BoardTR++){
		for (BoardTD = 0; BoardTD < BoardSize; BoardTD++){
			ThisCell = Board.rows[BoardTR].cells[BoardTD];
			ThisCell.className = Colors[Math.floor(Math.random() * 6)];
		}
	}
	$("#Counter").text("0");
	SelectorsEnabled = true;
}

function CheckBelow(RowID, ColumnID, ColorToUse, ColorToCheck){
	var CellBelow;
	if (RowID + 1 < BoardSize){
		CellBelow = document.getElementById("GameBoard").rows[RowID + 1].cells[ColumnID];
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
	var CellBelow
	if (RowID - 1 >= 0){
		CellBelow = document.getElementById("GameBoard").rows[RowID - 1].cells[ColumnID];
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
	var CellRight;
	if (ColumnID - 1 >= 0){
		CellRight = document.getElementById("GameBoard").rows[RowID].cells[ColumnID - 1];
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
	var CellRight;
	if (ColumnID + 1 < BoardSize){
		CellRight = document.getElementById("GameBoard").rows[RowID].cells[ColumnID + 1];
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
	var Board, IsFlooded, BoardTR, BoardTD;

	Board = document.getElementById("GameBoard");
	IsFlooded = true;
	for (BoardTR = 0; BoardTR < BoardSize; BoardTR++){
		for (BoardTD = 0; BoardTD < BoardSize; BoardTD++){
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

function SetStats(winner){
	var GamesPlayed, GamesWon, GamesLost, TotalScore, LastScore, HighScore;
	GamesPlayed = document.getElementById("GamesPlayed");
	GamesWon = document.getElementById("GamesWon");
	GamesLost = document.getElementById("GamesLost");
	TotalScore = document.getElementById('TotalScore');

	SelectorsEnabled = false;
	GamesPlayed.innerHTML = parseInt(GamesPlayed.innerHTML) + 1;

	if(winner){
		TotalScore.innerHTML = parseInt(TotalScore.innerHTML) + ScoreArray[ClickTotal];
		LastScore = document.getElementById("LastScore");
		LastScore.innerHTML = ScoreArray[ClickTotal];
		GamesWon.innerHTML = parseInt(GamesWon.innerHTML) + 1;
		HighScore = document.getElementById("HighScore");
		if (ScoreArray[ClickTotal] > parseInt(HighScore.innerHTML)){
			HighScore.innerHTML = ScoreArray[ClickTotal];
		}
		Winner();
	} else {
		GamesLost.innerHTML = parseInt(GamesLost.innerHTML) + 1;
		Loser();
	}

	WonPercent = (parseInt(GamesWon.innerHTML) / parseInt(GamesPlayed.innerHTML)) * 100;
	document.getElementById("WonPercent").innerHTML = WonPercent.toFixed(1);
	LostPercent = (parseInt(GamesLost.innerHTML) / parseInt(GamesPlayed.innerHTML)) * 100;
	document.getElementById("LostPercent").innerHTML = LostPercent.toFixed(1);
}

function ColorSelection(theCell){
	var HomeCell, ClickTotal;
	HomeCell = document.getElementById("GameBoard").rows[0].cells[0];
	if (HomeCell.className != theCell.className && SelectorsEnabled){
		CheckBelow(0, 0, theCell.className, HomeCell.className);
		CheckRight(0, 0, theCell.className, HomeCell.className);
		HomeCell.className = theCell.className;
		ClickTotal = parseInt($("#Counter").text());
		ClickTotal++;
		$("#Counter").text(ClickTotal);

		if (BoardFlooded(theCell.className)){
			SetStats(true);	//winner
		} else {
			if (ClickTotal == 25){
				SetStats(); //game over
			}
		}
	}
}

$(document).ready(function(){
	ResetBoard();
	$("#resetBoard").click(function(){ResetBoard();});
	$("#playFromLoss").click(function(){ResetBoard();});
	$("#noPlayFromLoss").click(function(){ClearAlert();});
	$("#playFromWin").click(function(){ResetBoard();});
	$("#noPlayFromWin").click(function(){ClearAlert();});
	$("table.choices tr td").not("table.choices tr td.spacer").click(function(){ColorSelection(this);});
});