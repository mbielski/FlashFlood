var Colors = ["red", "pink", "purple", "blue", "yellow", "green"],
	SelectorsEnabled = true,
	BoardSize = 14,
    ScoreArray = [671088640, 335544320, 167772160, 83886080, 41943040, 20971520, 10485760, 5242880, 2621440, 1310720, 655360, 327680, 163840, 81920, 40960, 20480, 10240, 5120, 2560, 1280, 640, 320, 160, 80, 40, 20];

function CreateBoard(){
	var Board, TableRow, TableCell, BoardTR, BoardTD;
	Board = $("#GameBoard");

	for (BoardTR = 0; BoardTR < BoardSize; BoardTR++){
		TableRow = $('<tr/>');
		for (BoardTD = 0; BoardTD < BoardSize; BoardTD++){
			TableCell = $('<td/>');
			TableRow.append(TableCell);
		}
		Board.append(TableRow);
	}
}

function ResetBoard(){
	var Board, ThisCell, BoardTR, BoardTD;
	ClearAlert();
	Board = $("#GameBoard");
	Board.find('tr').each(function(){
		$(this).find('td').each(function(){
			$(this).removeClass();
			$(this).addClass(Colors[Math.floor(Math.random() * 6)]);
		});
	});
	$("#Counter").text("0");
	SelectorsEnabled = true;
}

function CheckBelow(RowID, ColumnID, ColorToUse, ColorToCheck){
	var CellBelow, TheRow;
	if (RowID + 1 < BoardSize){
		TheRow = $("#GameBoard").find('tr')[RowID + 1];
		CellBelow = TheRow.cells[ColumnID];
		if (CellBelow.className === ColorToCheck && CellBelow.className !== ColorToUse){
			CellBelow.className = ColorToUse;
			CheckBelow(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
			CheckRight(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
			CheckAbove(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
			CheckLeft(RowID + 1, ColumnID, ColorToUse, ColorToCheck);
		}
	}
}

function CheckAbove(RowID, ColumnID, ColorToUse, ColorToCheck){
	var CellAbove, TheRow;
	if (RowID - 1 >= 0){
		TheRow = $("#GameBoard").find('tr')[RowID - 1];
		CellAbove = TheRow.cells[ColumnID];
		if (CellAbove.className === ColorToCheck && CellAbove.className !== ColorToUse){
			CellAbove.className = ColorToUse;
			CheckBelow(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
			CheckRight(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
			CheckAbove(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
			CheckLeft(RowID - 1, ColumnID, ColorToUse, ColorToCheck);
		}
	}
}

function CheckLeft(RowID, ColumnID, ColorToUse, ColorToCheck){
	var CellLeft, TheRow;
	if (ColumnID - 1 >= 0){
		TheRow = $("#GameBoard").find('tr')[RowID];
		CellLeft = TheRow.cells[ColumnID - 1];
		if (CellLeft.className === ColorToCheck && CellLeft.className !== ColorToUse){
			CellLeft.className = ColorToUse;
			CheckBelow(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
			CheckRight(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
			CheckAbove(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
			CheckLeft(RowID, ColumnID - 1, ColorToUse, ColorToCheck);
		}
	}
}

function CheckRight(RowID, ColumnID, ColorToUse, ColorToCheck){
	var CellRight, TheRow;
	if (ColumnID + 1 < BoardSize){
		TheRow = $("#GameBoard").find('tr')[RowID];
		CellRight = TheRow.cells[ColumnID + 1];
		if (CellRight.className === ColorToCheck && CellRight.className !== ColorToUse){
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

	Board = $("#GameBoard");
	IsFlooded = true;
	for (BoardTR = 0; BoardTR < BoardSize; BoardTR++){
		for (BoardTD = 0; BoardTD < BoardSize; BoardTD++){
			Board.find('tr').each(function(){
				$(this).find('td').each(function(){
					if(!$(this).hasClass(ColorToCheck)){
						IsFlooded = false;
					}
				});
			});
		}
	}
	return IsFlooded;
}

function ClearAlert(){
	$("#loser").addClass("hide");
	$("#winner").addClass("hide");
}

function Loser(){
	$("#loser").removeClass("hide");
}

function Winner(){
	$("#winner").removeClass("hide");
}

function SetStats(winner){
	var GamesPlayed, GamesWon, GamesLost, TotalScore, LastScore, HighScore, ClickTotal, WonPercent, LostPercent;
	GamesPlayed = $("#GamesPlayed");
	GamesWon = $("#GamesWon");
	GamesLost = $("#GamesLost");
	TotalScore = $('#TotalScore');
	ClickTotal = parseInt($("#Counter").text());
	LastScore = $('#LastScore');
	HighScore = $('#HighScore');

	SelectorsEnabled = false;
	GamesPlayed.text(parseInt(GamesPlayed.text()) + 1);

	if(winner){
		TotalScore.text(parseInt(TotalScore.text()) + ScoreArray[ClickTotal]);
		LastScore.text(ScoreArray[ClickTotal]);
		GamesWon.text(parseInt(GamesWon.text()) + 1);
		if (ScoreArray[ClickTotal] > parseInt(HighScore.text())){
			HighScore.text(ScoreArray[ClickTotal]);
		}
		Winner();
	} else {
		GamesLost.text(parseInt(GamesLost.text()) + 1);
		Loser();
	}

	WonPercent = (parseInt(GamesWon.text()) / parseInt(GamesPlayed.text())) * 100;
	$("#WonPercent").text(WonPercent.toFixed(1));
	LostPercent = (parseInt(GamesLost.text()) / parseInt(GamesPlayed.text())) * 100;
	$("#LostPercent").text(LostPercent.toFixed(1));
}

function ColorSelection(theCell){
	var HomeCell, ClickTotal, Counter, Board;
	Board = $("#GameBoard").find('tr').find('td');
	HomeCell = $(Board[0])[0];
	if (HomeCell.className !== theCell.className && SelectorsEnabled){
		CheckBelow(0, 0, theCell.className, HomeCell.className);
		CheckRight(0, 0, theCell.className, HomeCell.className);
		HomeCell.className = theCell.className;
		Counter = $("#Counter");
		ClickTotal = parseInt(Counter.text());
		ClickTotal++;
		Counter.text(ClickTotal);

		if (BoardFlooded(theCell.className)){
			SetStats(true);	//winner
		} else {
			if (ClickTotal === 25){
				SetStats(); //game over
			}
		}
	}
}

$(document).ready(function(){
	CreateBoard();
	ResetBoard();
	$("#resetBoard").click(function(){ResetBoard();});
	$("#playFromLoss").click(function(){ResetBoard();});
	$("#noPlayFromLoss").click(function(){ClearAlert();});
	$("#playFromWin").click(function(){ResetBoard();});
	$("#noPlayFromWin").click(function(){ClearAlert();});
	$("table.choices tr td").not("table.choices tr td.spacer").click(function(){ColorSelection(this);});
});