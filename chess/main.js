'use strict'

let table = document.querySelector('table');
let whiteMoves = {};
let blackMoves = {};
let whiteMovesArr = [];
let blackMovesArr = [];
let movesLog = [];
let eatenPieces = [];
let checkLine;
let potentialCheckWhite = [];
let potentialCheckBlack = [];
let availableMovesWhite = {};
let availableMovesBlack = {};

let whiteDiagonals = [];
let blackDiagonals = [];

document.onmousedown = function(event) {
	event.preventDefault();
}

function makeDiagonals() {
	let j, k;
	let x = 0;
	let z = 7;
	
	for (let i = 0; i < 15; i++) {
		let diagonal = [];

		if (z > 0) {
			k = 0;
			j = z;

			while (j < table.rows.length) {
				diagonal.push(table.rows[j].cells[k]);
				j++;
				k++;
			}

			if (z % 2) blackDiagonals.push(diagonal)
				else whiteDiagonals.push(diagonal);

			z--;
		} else {
			k = x;
			j = 0;

			while (table.rows[j] && table.rows[j].cells[k]) {
				diagonal.push(table.rows[j].cells[k]);
				j++;
				k++;
			}

			if (x % 2) blackDiagonals.push(diagonal)
				else whiteDiagonals.push(diagonal);

			x++;
		}
	}
}

function paint() {
	let i = 0;

	for (let row of table.rows) {
		let j = 0;

		for (let cell of row.children) {

			if (j % 2 === i) {
				cell.className = 'white-square';
			} else {
				cell.className = 'black-square';
			}
	
			j++;
		}

		i++;

		if (i === 2) i = 0;
	}
}

paint();
makeDiagonals();

let buttons = document.querySelector('.buttons');

let kf = 0.9;
let width = document.documentElement.clientWidth * kf - buttons.offsetWidth - 30;
let height = document.documentElement.clientHeight * kf - buttons.offsetWidth - 30;

if (document.documentElement.clientHeight * kf + buttons.offsetWidth > document.documentElement.clientWidth) {
		table.style.width = width + 'px';
		table.style.height = width + 'px';
	} else {
		if (width > height) {
			table.style.width = height + 'px'; 
			table.style.height = height + 'px';
		} else {
			table.style.width = width + 'px'; 
			table.style.height = width + 'px';
		}
	}

buttons.style.left = table.offsetWidth + table.offsetLeft + 10 + 'px';
buttons.style.top = table.offsetHeight/2 + table.offsetTop - buttons.offsetHeight/2 + 'px';

window.addEventListener('resize', () => {
	width = document.documentElement.clientWidth * kf - buttons.offsetWidth - 30;
	height = document.documentElement.clientHeight * kf - buttons.offsetWidth - 30;

	if (document.documentElement.clientHeight * kf + buttons.offsetWidth > document.documentElement.clientWidth) {
		table.style.width = width + 'px';
		table.style.height = width + 'px';
	} else {
		if (width > height) {
			table.style.width = height + 'px'; 
			table.style.height = height + 'px';
		}
	}

	buttons.style.left = table.offsetWidth + table.offsetLeft + 10 + 'px';
	buttons.style.top = table.offsetHeight/2 + table.offsetTop - buttons.offsetHeight/2 + 'px';
})

let count = 1;

buttons.onclick = function(event) {
	if (!movesLog.length) return;

	removeCircles();

	if (event.target.id === 'prev') {
		if (count > movesLog.length) return;

		let piece = movesLog[movesLog.length - count][0];
		let from = movesLog[movesLog.length - count][1];
		let to = movesLog[movesLog.length - count][2];
		let eatenPiece = movesLog[movesLog.length - count][3];
		let pawnToQueen = movesLog[movesLog.length - count][4];
		let castRook = movesLog[movesLog.length - count][5];
		let enPassant = movesLog[movesLog.length - count][7];
		let falseCastling = movesLog[movesLog.length - count][8];
		
		if (castRook) {
			let rowIndex = castRook.matches('.white')? 7 : 0;
			let king = table.rows[rowIndex].querySelector('.king');

			if (castRook.closest('td').cellIndex === 3) table.rows[rowIndex].cells[0].append(castRook);
			if (castRook.closest('td').cellIndex === 5) table.rows[rowIndex].cells[7].append(castRook);

			king.classList.remove('falseCastling');
			castRook.classList.remove('falseCastling');
		}

		if (falseCastling && !castRook) {
			piece.classList.remove('falseCastling');
		}

		if (pawnToQueen) {
			if (pawnToQueen.matches('.white')) {
				pawnToQueen.className = 'pawn white pieces';
				pawnToQueen.src = 'img/white-pawn.png';
				from.append(pawnToQueen);
				
			} else {
				pawnToQueen.className = 'pawn black pieces';
				pawnToQueen.src = 'img/black-pawn.png';
				from.append(pawnToQueen);
			}
		} else from.append(piece);

		if (eatenPiece) {
			if (enPassant) {
				if (eatenPiece.matches('.white')) {
					table.rows[to.closest('tr').sectionRowIndex - 1].cells[to.cellIndex].append(eatenPiece);
					to.classList.add('en-passant-white');
				}
				if (eatenPiece.matches('.black')) {
					table.rows[to.closest('tr').sectionRowIndex + 1].cells[to.cellIndex].append(eatenPiece);
					to.classList.add('en-passant-black');
				}
			} else {
				eatenPiece.closest('li').remove();
				to.append(eatenPiece);
			}

			eatenPieces.splice([eatenPieces.indexOf(eatenPiece, 0)], 1);
		}

		if (count <= movesLog.length) count++;
	}

	if (event.target.id === 'next') {
		if (count > 1) count--
			else return;

		let piece = movesLog[movesLog.length - count][0];
		let from = movesLog[movesLog.length - count][1];
		let to = movesLog[movesLog.length - count][2];
		let eatenPiece = movesLog[movesLog.length - count][3];
		let pawnToQueen = movesLog[movesLog.length - count][4];
		let castRook = movesLog[movesLog.length - count][5];
		let enPassantSquare = movesLog[movesLog.length - count][6];
		let falseCastling = movesLog[movesLog.length - count][8];

		if (castRook) {
			let rowIndex = castRook.matches('.white')? 7 : 0;
			let king = table.rows[rowIndex].querySelector('.king');

			if (castRook.closest('td').cellIndex === 0) table.rows[rowIndex].cells[3].append(castRook);
			if (castRook.closest('td').cellIndex === 7) table.rows[rowIndex].cells[5].append(castRook);

			king.classList.add('falseCastling');
			castRook.classList.add('falseCastling');
		}

		if (falseCastling && !castRook) {
			piece.classList.add('falseCastling');
		}

		if (eatenPiece) eat(eatenPiece);

		if (pawnToQueen) {
			if (pawnToQueen.matches('.white')) {
				pawnToQueen.className = 'queen white pieces';
				pawnToQueen.src = 'img/white-queen.png';
				to.append(pawnToQueen);
			} else {
				pawnToQueen.className = 'queen black pieces';
				pawnToQueen.src = 'img/black-queen.png';
				to.append(pawnToQueen);
			}
		} else to.append(piece);

		if (enPassantSquare) {
			if (piece.matches('.white')) enPassantSquare.classList.add('en-passant-white');
			
			if (piece.matches('.black')) enPassantSquare.classList.add('en-passant-black');
		}
	}

	changeOfTurn();
}

let piece;
let counter = true;
let color = '.white';

calculateTheMoves()

function onMouseOut(event) {
	if (event.target.closest('td') && event.target.closest('td').querySelector('.available')) {
		event.target.closest('td').classList.remove('mouseover');
	}

	if (event.target.tagName === 'TD' && event.target.querySelector('.mouseover')) {
		event.target.classList.remove('mouseover');
	}
}

table.onmouseout = onMouseOut;

table.onmouseover = function(event) {
	if (event.target.closest('td') && event.target.closest('td').querySelector('.available')) {
		event.target.closest('td').classList.add('mouseover');
	}

	if (event.target.tagName === 'TD' && event.target.querySelector('.available')) {
		event.target.classList.add('mouseover');
	}
}

table.onclick = function(event) {
	onMouseOut(event);

	if (piece) {
		move(piece, event.target);

		piece = null;
	}

	removeCircles();

	if (event.target.closest('td') && event.target.closest('td').querySelector(color)) {
		piece = event.target.closest('td').querySelector(color);

		makeCircles(piece);
	}
}

function playSound(event) {
	let audio = new Audio();
	audio.src = 'sounds/' + event + '.mp3';
	audio.autoplay = true;
}

function removeCircles() {
	if (table.querySelector('.available')) {
		for (let div of table.querySelectorAll('.available')) div.remove();
	}

	if (table.querySelector('.highlighted')) table.querySelector('.highlighted').classList.remove('highlighted');

	if (table.querySelector('.mouseover')) table.querySelector('.mouseover').classList.remove('mouseover');
}

function calculateValue(item) {
	let piece = item.querySelector('.pieces')? item.querySelector('.pieces'): item;

	if (piece.matches('.pawn')) return 1
		else if (piece.matches('.bishop')) return 3
			else if (piece.matches('.knight')) return 3.01
				else if (piece.matches('.rook')) return 5
					else if (piece.matches('.queen')) return 9
}

function eat(piece) {
	eatenPieces.push(piece);

	let pieceValue = calculateValue(piece);
	let eaten, list, moves;
	let li = document.createElement('li');
	li.append(piece);

	if (piece.matches('.white')) {
		eaten = document.body.querySelector('.eaten-white-pieces');
		list = eaten.querySelectorAll('li');
		moves = whiteMoves;
	} else {
		eaten = document.body.querySelector('.eaten-black-pieces');
		list = eaten.querySelectorAll('li');
		moves = blackMoves;
	}

	for (let item of list) if (!item.children[0]) item.remove();

	list = eaten.querySelectorAll('li');

	if (list.length) {
		for (let item of list) {
			if (pieceValue < calculateValue(item)) {
				item.before(li)
				break;
			} else if (item === list[list.length - 1]) item.after(li);
		}
	} else eaten.append(li);

	delete moves[piece.id];
}

function move(piece, target) {
	if (!target.closest('td')) return;

	if (target.closest('td').querySelector('.available')) {
		let square = target.closest('td');
		let targetPiece = square.querySelector('.pieces');
		let localMoves = [];

		localMoves.push(piece, piece.closest('td'), square);

		if (targetPiece) {
			localMoves.push(targetPiece);

			eat(targetPiece);
		}

		if (piece.matches('.rook')) {
			piece.classList.add('falseCastling');
			localMoves[8] = true;
		}

		if (piece.matches('.king')) {
			piece.classList.add('falseCastling');
			localMoves[8] = true;

			let kingPos = piece.closest('td');

			if (kingPos.cellIndex === square.cellIndex + 2 || kingPos.cellIndex === square.cellIndex - 2) {
				let castRook;

				if (square.cellIndex > kingPos.cellIndex) {
					castRook = table.rows[kingPos.closest('tr').sectionRowIndex].cells[7].querySelector('.rook');
					table.rows[kingPos.closest('tr').sectionRowIndex].cells[5].append(castRook);
				} else {
					castRook = table.rows[kingPos.closest('tr').sectionRowIndex].cells[0].querySelector('.rook');
					table.rows[kingPos.closest('tr').sectionRowIndex].cells[3].append(castRook);
				}

				castRook.classList.add('falseCastling');
				localMoves[5] = castRook;
			}
		}

		if (piece.matches('.pawn')) {
			if (piece.matches('.white') && square.closest('tr').sectionRowIndex === 0) {
				piece.className = 'queen white pieces';
				piece.src = 'img/white-queen.png';
				localMoves[4] = piece;
			}
			if (piece.matches('.black') && square.closest('tr').sectionRowIndex === 7) {
				piece.className = 'queen black pieces';
				piece.src = 'img/black-queen.png';
				localMoves[4] = piece;
			}

			if (piece.matches('.white') && piece.closest('tr').sectionRowIndex === 6 &&
				square.closest('tr').sectionRowIndex === 4) {
				table.rows[5].cells[square.cellIndex].classList.add('en-passant-white');
				localMoves[6] = table.rows[5].cells[square.cellIndex];
			}
			if (piece.matches('.black') && piece.closest('tr').sectionRowIndex === 1 &&
				square.closest('tr').sectionRowIndex === 3) {
				table.rows[2].cells[square.cellIndex].classList.add('en-passant-black');
				localMoves[6] = table.rows[2].cells[square.cellIndex];
			}

			if (square.classList.contains('en-passant-white')) {
				let pawn = table.rows[square.closest('tr').sectionRowIndex - 1].cells[square.cellIndex].querySelector('.pawn');
				pawn.remove();
				eatenPieces.push(pawn);
				localMoves.push(pawn);
				localMoves[7] = true;

				delete whiteMoves[pawn.id];
			} 
			if (square.classList.contains('en-passant-black')) {
				let pawn = table.rows[square.closest('tr').sectionRowIndex + 1].cells[square.cellIndex].querySelector('.pawn');
				pawn.remove();
				eatenPieces.push(pawn);
				localMoves.push(pawn);
				localMoves[7] = true;

				delete blackMoves[pawn.id];
			}
		}

		for (; count > 1; count--) movesLog.pop();

		square.append(piece);

		movesLog.push(localMoves);

		playSound('move');
		changeOfTurn();
	}
}

function changeOfTurn() {
	if (counter) color = '.black'
		else color = '.white';

	counter = !counter;

	checkLine = null;
		
	if (color === '.white') {
		let enPassantSquare = table.querySelector('.en-passant-white');
		if (enPassantSquare) enPassantSquare.classList.remove('en-passant-white');
	} else {
		let enPassantSquare = table.querySelector('.en-passant-black');
		if (enPassantSquare) enPassantSquare.classList.remove('en-passant-black');
	}

	calculateTheMoves();
	calculateThePotentialCheck();
	checkmate();
}

function check(checker) {
	let line = [];

	if (checker.matches('.pawn') || checker.matches('.knight')) {
		line.push(checker.closest('td'));

		return line;
	}

	let cellIndex = checker.closest('td').cellIndex;
	let rowIndex = checker.closest('tr').sectionRowIndex;
	let enemy, friend;

	if (checker.matches('.white')) {
		enemy = '.black';
		friend = '.white';
	} else {
		enemy = '.white';
		friend = '.black';
	}

	let enemysKingPos = table.querySelector(`.king${enemy}`).closest('td');
	let kingCellIndex = enemysKingPos.cellIndex;
	let kingRowIndex = enemysKingPos.closest('tr').sectionRowIndex;

	if (rowIndex === kingRowIndex) {
		if (cellIndex > kingCellIndex) { 
			for (let i = cellIndex; i != kingCellIndex; i--) line.push(table.rows[rowIndex].cells[i])
		} else {
			for (let i = cellIndex; i != kingCellIndex; i++) line.push(table.rows[rowIndex].cells[i])
		}
	} else if (cellIndex === enemysKingPos.cellIndex) {
		if (rowIndex > kingRowIndex) {
			for (let i = rowIndex; i != kingRowIndex; i--) line.push(table.rows[i].cells[cellIndex])
		} else {
			for (let i = rowIndex; i != kingRowIndex; i++) line.push(table.rows[i].cells[cellIndex])
		}
	} else {
		if (rowIndex > kingRowIndex && cellIndex > kingCellIndex) {
			for (let i = rowIndex, j = cellIndex; i != kingRowIndex; i--, j--) line.push(table.rows[i].cells[j])
		} else if (rowIndex > kingRowIndex && cellIndex < kingCellIndex) {
			for (let i = rowIndex, j = cellIndex; i != kingRowIndex; i--, j++) line.push(table.rows[i].cells[j])
		} else if (rowIndex < kingRowIndex && cellIndex > kingCellIndex) {
			for (let i = rowIndex, j = cellIndex; i != kingRowIndex; i++, j--) line.push(table.rows[i].cells[j])
		} else if (rowIndex < kingRowIndex && cellIndex < kingCellIndex) {
			for (let i = rowIndex, j = cellIndex; i != kingRowIndex; i++, j++) line.push(table.rows[i].cells[j])
		}
	}

	return line;
}

function calculateTheMoves() {
	let pieces = table.querySelectorAll('.pieces');
	let row, enemy, friend, enemysKingPos;
	whiteMovesArr = [];
	blackMovesArr = [];

	for (let piece of pieces) {
		let cellIndex = piece.closest('td').cellIndex;
		let rowIndex = piece.closest('tr').sectionRowIndex;
		let id = piece.id;
		let localMoves = [];

		if (piece.matches('.white')) {
			row = rowIndex - 1;
			enemy = '.black';
			friend = '.white';
		} else {
			row = rowIndex + 1;
			enemy = '.white';
			friend = '.black';
		}

		enemysKingPos = table.querySelector(`.king${enemy}`).closest('td');

		if (piece.matches('.pawn')) {
			if (table.rows[row].cells[cellIndex - 1] && table.rows[row].cells[cellIndex + 1]) {
				localMoves.push(table.rows[row].cells[cellIndex - 1]);
				localMoves.push(table.rows[row].cells[cellIndex + 1]);
			} else if (table.rows[row].cells[cellIndex - 1]) localMoves.push(table.rows[row].cells[cellIndex - 1])
			else if (table.rows[row].cells[cellIndex + 1]) localMoves.push(table.rows[row].cells[cellIndex + 1]);
		} else if (piece.matches('.rook')) {
			let i = 1;
			
			while (table.rows[rowIndex - i]) {
				let file = table.rows[rowIndex - i].cells[cellIndex];

				if ((file.querySelector(enemy) && file != enemysKingPos) || file.querySelector(friend)) {
					localMoves.push(file);

					break;
				}

				localMoves.push(file);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex + i]) {
				let file = table.rows[rowIndex + i].cells[cellIndex];

				if ((file.querySelector(enemy) && file != enemysKingPos) || file.querySelector(friend)) {
					localMoves.push(file);

					break;
				}

				localMoves.push(file);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex].cells[cellIndex - i]) {
				let rank = table.rows[rowIndex].cells[cellIndex - i];

				if ((rank.querySelector(enemy) && rank != enemysKingPos) || rank.querySelector(friend)) {
					localMoves.push(rank);

					break;
				}

				localMoves.push(rank);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex].cells[cellIndex + i]) {
				let rank = table.rows[rowIndex].cells[cellIndex + i];

				if ((rank.querySelector(enemy) && rank != enemysKingPos) || rank.querySelector(friend)) {
					localMoves.push(rank);

					break;
				}

				localMoves.push(rank);

				i++;
			}
		} else if (piece.matches('.knight')) {
			if (table.rows[rowIndex - 2]) {
				if (table.rows[rowIndex - 2].cells[cellIndex - 1]) {
					localMoves.push(table.rows[rowIndex - 2].cells[cellIndex - 1]);
				}

				if (table.rows[rowIndex - 2].cells[cellIndex + 1]) {
					localMoves.push(table.rows[rowIndex - 2].cells[cellIndex + 1]);
				}
			}

			if (table.rows[rowIndex - 1]) {
				if (table.rows[rowIndex - 1].cells[cellIndex - 2]) {
					localMoves.push(table.rows[rowIndex - 1].cells[cellIndex - 2]);
				}

				if (table.rows[rowIndex - 1].cells[cellIndex + 2]) {
					localMoves.push(table.rows[rowIndex - 1].cells[cellIndex + 2]);
				}
			}

			if (table.rows[rowIndex + 2]) {
				if (table.rows[rowIndex + 2].cells[cellIndex - 1]) {
					localMoves.push(table.rows[rowIndex + 2].cells[cellIndex - 1]);
				}

				if (table.rows[rowIndex + 2].cells[cellIndex + 1]) {
					localMoves.push(table.rows[rowIndex + 2].cells[cellIndex + 1]);
				}
			}

			if (table.rows[rowIndex + 1]) {
				if (table.rows[rowIndex + 1].cells[cellIndex - 2]) {
					localMoves.push(table.rows[rowIndex + 1].cells[cellIndex - 2]);
				}

				if (table.rows[rowIndex + 1].cells[cellIndex + 2]) {
					localMoves.push(table.rows[rowIndex + 1].cells[cellIndex + 2]);
				}
			}
		} else if (piece.matches('.bishop')) {
			let i = 1;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex + i]) {
				if ((table.rows[rowIndex + i].cells[cellIndex + i].querySelector(enemy) &&
					table.rows[rowIndex + i].cells[cellIndex + i] != enemysKingPos) ||
					table.rows[rowIndex + i].cells[cellIndex + i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex + i].cells[cellIndex + i]);

					break;
				}

				localMoves.push(table.rows[rowIndex + i].cells[cellIndex + i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex - i]) {
				if ((table.rows[rowIndex + i].cells[cellIndex - i].querySelector(enemy) &&
					table.rows[rowIndex + i].cells[cellIndex - i] != enemysKingPos) ||
					table.rows[rowIndex + i].cells[cellIndex - i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex + i].cells[cellIndex - i]);

					break;
				}

				localMoves.push(table.rows[rowIndex + i].cells[cellIndex - i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex + i]) {
				if ((table.rows[rowIndex - i].cells[cellIndex + i].querySelector(enemy) &&
					table.rows[rowIndex - i].cells[cellIndex + i] != enemysKingPos) ||
					table.rows[rowIndex - i].cells[cellIndex + i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex - i].cells[cellIndex + i]);

					break;
				}

				localMoves.push(table.rows[rowIndex - i].cells[cellIndex + i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex - i]) {
				if ((table.rows[rowIndex - i].cells[cellIndex - i].querySelector(enemy) &&
					table.rows[rowIndex - i].cells[cellIndex - i] != enemysKingPos) ||
					table.rows[rowIndex - i].cells[cellIndex - i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex - i].cells[cellIndex - i]);

					break;
				}

				localMoves.push(table.rows[rowIndex - i].cells[cellIndex - i]);

				i++;
			}
		} else if (piece.matches('.queen')) {
			let i = 1;

			while (table.rows[rowIndex - i]) {
				if ((table.rows[rowIndex - i].cells[cellIndex].querySelector(enemy) &&
					table.rows[rowIndex - i].cells[cellIndex] != enemysKingPos) ||
					table.rows[rowIndex - i].cells[cellIndex].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex - i].cells[cellIndex]);

					break;
				}

				localMoves.push(table.rows[rowIndex - i].cells[cellIndex]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex + i]) {
				if ((table.rows[rowIndex + i].cells[cellIndex].querySelector(enemy) &&
					table.rows[rowIndex + i].cells[cellIndex] != enemysKingPos) ||
					table.rows[rowIndex + i].cells[cellIndex].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex + i].cells[cellIndex]);

					break;
				}

				localMoves.push(table.rows[rowIndex + i].cells[cellIndex]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex].cells[cellIndex - i]) {
				if ((table.rows[rowIndex].cells[cellIndex - i].querySelector(enemy) &&
					table.rows[rowIndex].cells[cellIndex - i] != enemysKingPos) ||
					table.rows[rowIndex].cells[cellIndex - i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex].cells[cellIndex - i]);

					break;
				}

				localMoves.push(table.rows[rowIndex].cells[cellIndex - i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex].cells[cellIndex + i]) {
				if ((table.rows[rowIndex].cells[cellIndex + i].querySelector(enemy) &&
					table.rows[rowIndex].cells[cellIndex + i] != enemysKingPos) ||
					table.rows[rowIndex].cells[cellIndex + i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex].cells[cellIndex + i]);

					break;
				}

				localMoves.push(table.rows[rowIndex].cells[cellIndex + i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex + i]) {
				if ((table.rows[rowIndex + i].cells[cellIndex + i].querySelector(enemy) &&
					table.rows[rowIndex + i].cells[cellIndex + i] != enemysKingPos) ||
					table.rows[rowIndex + i].cells[cellIndex + i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex + i].cells[cellIndex + i]);

					break;
				}

				localMoves.push(table.rows[rowIndex + i].cells[cellIndex + i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex - i]) {
				if ((table.rows[rowIndex + i].cells[cellIndex - i].querySelector(enemy) &&
					table.rows[rowIndex + i].cells[cellIndex - i] != enemysKingPos) ||
					table.rows[rowIndex + i].cells[cellIndex - i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex + i].cells[cellIndex - i]);

					break;
				}

				localMoves.push(table.rows[rowIndex + i].cells[cellIndex - i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex + i]) {
				if ((table.rows[rowIndex - i].cells[cellIndex + i].querySelector(enemy) &&
					table.rows[rowIndex - i].cells[cellIndex + i] != enemysKingPos) ||
					table.rows[rowIndex - i].cells[cellIndex + i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex - i].cells[cellIndex + i]);

					break;
				}

				localMoves.push(table.rows[rowIndex - i].cells[cellIndex + i]);

				i++;
			}

			i = 1;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex - i]) {
				if ((table.rows[rowIndex - i].cells[cellIndex - i].querySelector(enemy) &&
					table.rows[rowIndex - i].cells[cellIndex - i] != enemysKingPos) ||
					table.rows[rowIndex - i].cells[cellIndex - i].querySelector(friend)) {
					localMoves.push(table.rows[rowIndex - i].cells[cellIndex - i]);

					break;
				}

				localMoves.push(table.rows[rowIndex - i].cells[cellIndex - i]);

				i++;
			}
		} else if (piece.matches('.king')) {
			if (table.rows[rowIndex].cells[cellIndex + 1]) {
				localMoves.push(table.rows[rowIndex].cells[cellIndex + 1]);
			}

			if (table.rows[rowIndex].cells[cellIndex - 1]) {
				localMoves.push(table.rows[rowIndex].cells[cellIndex - 1]);
			}

			if (table.rows[rowIndex + 1]) {
				localMoves.push(table.rows[rowIndex + 1].cells[cellIndex]);
				
				if (table.rows[rowIndex + 1].cells[cellIndex + 1]) {
					localMoves.push(table.rows[rowIndex + 1].cells[cellIndex + 1]);
				}

				if (table.rows[rowIndex + 1].cells[cellIndex - 1]) {
					localMoves.push(table.rows[rowIndex + 1].cells[cellIndex - 1]);
				}
			}

			if (table.rows[rowIndex - 1]) {
				localMoves.push(table.rows[rowIndex - 1].cells[cellIndex]);

				if (table.rows[rowIndex - 1].cells[cellIndex + 1]) {
					localMoves.push(table.rows[rowIndex - 1].cells[cellIndex + 1]);
				}

				if (table.rows[rowIndex - 1].cells[cellIndex - 1]) {
					localMoves.push(table.rows[rowIndex - 1].cells[cellIndex - 1]);
				}
			}
		}

		if (localMoves.includes(enemysKingPos)) {
			checkLine = check(piece);
		}

		if (piece.matches('.white')) whiteMoves[id] = localMoves
			else blackMoves[id] = localMoves;
	}

	for (let pieceId in whiteMoves) {
		whiteMoves[pieceId].forEach((item) => whiteMovesArr.push(item))
	};
	
	for (let pieceId in blackMoves) {
		blackMoves[pieceId].forEach((item) => blackMovesArr.push(item))
	};
}

function calculateThePotentialCheck() {
	let pieces = table.querySelectorAll('.pieces');
	let row, enemy, friend, enemysKingPos;
	potentialCheckWhite = [];
	potentialCheckBlack = [];

	for (let piece of pieces) {
		if (piece.matches('.pawn') || piece.matches('.knight') || piece.matches('.king')) continue;

		let cellIndex = piece.closest('td').cellIndex;
		let rowIndex = piece.closest('tr').sectionRowIndex;
		let localPC = [];

		if (piece.matches('.white')) {
			enemy = '.black';
			friend = '.white';
		} else {
			enemy = '.white';
			friend = '.black';
		}

		enemysKingPos = table.querySelector(`.king${enemy}`).closest('td');

		if (piece.matches('.rook')) {
			let i = 1;
			let indic = false;

			while (table.rows[rowIndex - i]) {
				let file = table.rows[rowIndex - i].cells[cellIndex];

				if (file.querySelector(friend)) break;

				if (file.querySelector(enemy) && file != enemysKingPos && indic === true) break;

				if (file.querySelector(enemy) && file != enemysKingPos) indic = true;

				if (file === enemysKingPos && indic === true) {
					while (i > 0) {
						-- i;

						localPC.push(table.rows[rowIndex - i].cells[cellIndex]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex + i]) {
				let file = table.rows[rowIndex + i].cells[cellIndex];

				if (file.querySelector(friend)) break;

				if (file.querySelector(enemy) && file != enemysKingPos && indic === true) break;

				if (file.querySelector(enemy) && file != enemysKingPos) indic = true;

				if (file === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex + i].cells[cellIndex]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex].cells[cellIndex - i]) {
				let rank = table.rows[rowIndex].cells[cellIndex - i];

				if (rank.querySelector(friend)) break;

				if (rank.querySelector(enemy) && rank != enemysKingPos && indic === true) break;

				if (rank.querySelector(enemy) && rank != enemysKingPos) indic = true;

				if (rank === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex].cells[cellIndex - i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex].cells[cellIndex + i]) {
				let rank = table.rows[rowIndex].cells[cellIndex + i];

				if (rank.querySelector(friend)) break;

				if (rank.querySelector(enemy) && rank != enemysKingPos && indic === true) break;

				if (rank.querySelector(enemy) && rank != enemysKingPos) indic = true;

				if (rank === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex].cells[cellIndex + i]);
					}

					break;
				}

				i++;
			}
		} else if (piece.matches('.bishop')) {
			let i = 1;
			let indic = false;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex + i]) {
				let diagonal = table.rows[rowIndex + i].cells[cellIndex + i];

				if (diagonal.querySelector(friend)) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;

				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex + i].cells[cellIndex + i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex - i]) {
				let diagonal = table.rows[rowIndex + i].cells[cellIndex - i];

				if (diagonal.querySelector(friend)) break;
	
				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;
			
				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;
						
						localPC.push(table.rows[rowIndex + i].cells[cellIndex - i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex + i]) {
				let diagonal = table.rows[rowIndex - i].cells[cellIndex + i];

				if (diagonal.querySelector(friend)) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;

				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;
						
						localPC.push(table.rows[rowIndex - i].cells[cellIndex + i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex - i]) {
				let diagonal = table.rows[rowIndex - i].cells[cellIndex - i];

				if (diagonal.querySelector(friend)) break;
	
				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;
			
				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;
						
						localPC.push(table.rows[rowIndex - i].cells[cellIndex - i]);
					}

					break;
				}

				i++;
			}
		} else if (piece.matches('.queen')) {
			let i = 1;
			let indic = false;

			while (table.rows[rowIndex - i]) {
				let file = table.rows[rowIndex - i].cells[cellIndex];

				if (file.querySelector(friend)) break;
		
				if (file.querySelector(enemy) && file != enemysKingPos && indic === true) break;

				if (file.querySelector(enemy) && file != enemysKingPos) indic = true;
		
				if (file === enemysKingPos && indic === true) {
					while (i > 0) {
						-- i;

						localPC.push(table.rows[rowIndex - i].cells[cellIndex]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex + i]) {
				let file = table.rows[rowIndex + i].cells[cellIndex];

				if (file.querySelector(friend)) break;

				if (file.querySelector(enemy) && file != enemysKingPos && indic === true) break;

				if (file.querySelector(enemy) && file != enemysKingPos) indic = true;

				if (file === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex + i].cells[cellIndex]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex].cells[cellIndex - i]) {
				let rank = table.rows[rowIndex].cells[cellIndex - i];

				if (rank.querySelector(friend)) break;
	
				if (rank.querySelector(enemy) && rank != enemysKingPos && indic === true) break;

				if (rank.querySelector(enemy) && rank != enemysKingPos) indic = true;
			
				if (rank === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex].cells[cellIndex - i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex].cells[cellIndex + i]) {
				let rank = table.rows[rowIndex].cells[cellIndex + i];

				if (rank.querySelector(friend)) break;
	
				if (rank.querySelector(enemy) && rank != enemysKingPos && indic === true) break;

				if (rank.querySelector(enemy) && rank != enemysKingPos) indic = true;
			
				if (rank === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex].cells[cellIndex + i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex + i]) {
				let diagonal = table.rows[rowIndex + i].cells[cellIndex + i];

				if (diagonal.querySelector(friend)) break;
	
				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;
			
				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;

						localPC.push(table.rows[rowIndex + i].cells[cellIndex + i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex + i] && table.rows[rowIndex + i].cells[cellIndex - i]) {
				let diagonal = table.rows[rowIndex + i].cells[cellIndex - i];

				if (diagonal.querySelector(friend)) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;

				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;
						
						localPC.push(table.rows[rowIndex + i].cells[cellIndex - i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex + i]) {
				let diagonal = table.rows[rowIndex - i].cells[cellIndex + i];

				if (diagonal.querySelector(friend)) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;

				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;
						
						localPC.push(table.rows[rowIndex - i].cells[cellIndex + i]);
					}

					break;
				}

				i++;
			}

			i = 1;
			indic = false;

			while (table.rows[rowIndex - i] && table.rows[rowIndex - i].cells[cellIndex - i]) {
				let diagonal = table.rows[rowIndex - i].cells[cellIndex - i];

				if (diagonal.querySelector(friend)) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos && indic === true) break;

				if (diagonal.querySelector(enemy) && diagonal != enemysKingPos) indic = true;

				if (diagonal === enemysKingPos && indic === true) {
					while (i > 0) {
						--i;
						
						localPC.push(table.rows[rowIndex - i].cells[cellIndex - i]);
					}

					break;
				}

				i++;
			}
		}

		if (localPC.length) {
			if (piece.matches('.white')) localPC.forEach(item => potentialCheckWhite.push(item))
				else localPC.forEach(item => potentialCheckBlack.push(item));
		}
	}
}

function makeCircles(piece) {
	let cellIndex = piece.closest('td').cellIndex;
	let rowIndex = piece.closest('tr').sectionRowIndex;
	let id = piece.id;
	let moves, enemysMoves, potentialCheck, row, enemy, friend, enPassantSquare;

	if (color === '.white') {
		moves = whiteMoves;
		enemysMoves = blackMovesArr;
		potentialCheck = potentialCheckBlack;
		row = rowIndex - 1;
		enemy = '.black';
		friend = '.white';
		enPassantSquare = 'en-passant-black';
	} else {
		moves = blackMoves;
		enemysMoves = whiteMovesArr;
		potentialCheck = potentialCheckWhite;
		row = rowIndex + 1;
		enemy = '.white';
		friend = '.black';
		enPassantSquare = 'en-passant-white';
	}

	piece.closest('td').classList.add('highlighted')

	for (let td of moves[id]) {
		if (!checkLine && piece.matches('.pawn') && !td.querySelector(enemy) &&
		!td.classList.contains(enPassantSquare)) continue;

		if (checkLine && !piece.matches('.king')) {
			if (!checkLine.includes(td)) continue;
		}

		if (potentialCheck.includes(piece.closest('td')) && !potentialCheck.includes(td)) continue;

		if (piece.matches('.king')) {
			if (enemysMoves.includes(td)) continue;
		}

		if (td.querySelector(friend)) continue;

		let div = document.createElement('div');
		div.className = 'available';

		td.append(div);
	}
	
	if (piece.classList.contains('pawn')) {
		let td = table.rows[row].cells[cellIndex];

		if (!td.querySelector('.pieces')) {

			if ((checkLine && checkLine.includes(td)) || !checkLine) {

				if (!potentialCheck.includes(piece.closest('td')) || potentialCheck.includes(td)) {
					let div = document.createElement('div');
					div.className = 'available';

					td.append(div);	
				}
			}

			let td2 = table.rows[row - 1].cells[cellIndex];

			if (piece.classList.contains('white') && rowIndex === 6 && !td2.querySelector('.pieces')) {

				if ((checkLine && checkLine.includes(td2)) || !checkLine) {

					if (!potentialCheck.includes(piece.closest('td')) || potentialCheck.includes(td2)) {
						let div = document.createElement('div');
						div.className = 'available';

						td2.append(div);	
					}
				}
			}

			td2 = table.rows[row + 1].cells[cellIndex];

			if (piece.classList.contains('black') && rowIndex === 1 && !td2.querySelector('.pieces')) {

				if ((checkLine && checkLine.includes(td2)) || !checkLine) {

					if (!potentialCheck.includes(piece.closest('td')) || potentialCheck.includes(td2)) {
						let div = document.createElement('div');
						div.className = 'available';

						td2.append(div);	
					}
				}
			}
		}
	} else if (piece.matches('.king')) {
		if (!piece.matches('.falseCastling') && !checkLine) {
			let shortRook = table.rows[rowIndex].cells[7].querySelector(`.rook${friend}`);

			if (shortRook && !shortRook.matches('.falseCastling')) {
				let short = table.rows[rowIndex].cells[cellIndex + 2];
				let free = false;

				for (let i = cellIndex + 1; i < 7; i++) {
					if (table.rows[rowIndex].cells[i].querySelector('.pieces')) {
						free = false;
						break;
					} 

					free = true;
				}

				if (free && !enemysMoves.includes(short) &&
				!enemysMoves.includes(table.rows[rowIndex].cells[cellIndex + 1])) {
					let div = document.createElement('div');
					div.className = 'available';

					short.append(div);
				}
			}
			
			let longRook = table.rows[rowIndex].cells[0].querySelector(`.rook${friend}`);

			if (longRook && !longRook.matches('.falseCastling')) {
				let long = table.rows[rowIndex].cells[cellIndex - 2];
				let free = false;

				for (let i = cellIndex - 1; i > 1; i--) {
					if (table.rows[rowIndex].cells[i].querySelector('.pieces')) {
						free = false;
						break;
					}

					free = true;
				}

				if (free && !enemysMoves.includes(long) &&
				!enemysMoves.includes(table.rows[rowIndex].cells[cellIndex - 1])) {
					let div = document.createElement('div');
					div.className = 'available';

					long.append(div);
				}
			}
			
		}
	}
}

function checkmate() {
	availableMovesWhite = {};
	availableMovesBlack = {};

	let pieces = table.querySelectorAll(`.pieces${color}`);
	let availableMoves = color === '.white'? availableMovesWhite: availableMovesBlack;

	for (let piece of pieces) {
		let cellIndex = piece.closest('td').cellIndex;
		let rowIndex = piece.closest('tr').sectionRowIndex;
		let id = piece.id;
		let moves, enemysMoves, potentialCheck, row, enemy, friend, enPassantSquare;
		let localMoves = [];

		if (piece.matches('.white')) {
			availableMoves = availableMovesWhite;
			moves = whiteMoves;
			enemysMoves = blackMovesArr;
			potentialCheck = potentialCheckBlack;
			row = rowIndex - 1;
			enemy = '.black';
			friend = '.white';
			enPassantSquare = 'en-passant-black';
		} else {
			availableMoves = availableMovesBlack;
			moves = blackMoves;
			enemysMoves = whiteMovesArr;
			potentialCheck = potentialCheckWhite;
			row = rowIndex + 1;
			enemy = '.white';
			friend = '.black';
			enPassantSquare = 'en-passant-white';
		}

		for (let td of moves[id]) {
			if (!checkLine && piece.matches('.pawn') && !td.querySelector(enemy) &&
			!td.classList.contains(enPassantSquare)) continue;

			if (checkLine && !piece.matches('.king')) {
				if (!checkLine.includes(td)) continue;
			}

			if (potentialCheck.includes(piece.closest('td')) && !potentialCheck.includes(td)) continue;

			if (piece.matches('.king')) {
				if (enemysMoves.includes(td)) continue;
			}

			if (td.querySelector(friend)) continue;

			localMoves.push(td);
		}
		
		if (piece.classList.contains('pawn')) {
			let td = table.rows[row].cells[cellIndex];

			if (!td.querySelector('.pieces')) {

				if ((checkLine && checkLine.includes(td)) || !checkLine) {

					if (!potentialCheck.includes(piece.closest('td')) || potentialCheck.includes(td)) {
						localMoves.push(td);
					}
				}

				let td2 = table.rows[row - 1].cells[cellIndex];

				if (piece.classList.contains('white') && rowIndex === 6 && !td2.querySelector('.pieces')) {

					if ((checkLine && checkLine.includes(td)) || !checkLine) {

						if (!potentialCheck.includes(piece.closest('td')) || potentialCheck.includes(td)) {
							localMoves.push(td2);
						}
					}
				}

				td2 = table.rows[row + 1].cells[cellIndex];

				if (piece.classList.contains('black') && rowIndex === 1 && !td2.querySelector('.pieces')) {

					if ((checkLine && checkLine.includes(td)) || !checkLine) {

						if (!potentialCheck.includes(piece.closest('td')) || potentialCheck.includes(td)) {
							localMoves.push(td2);
						}
					}
				}
			}
		} else if (piece.matches('.king')) {
			if (!piece.matches('.falseCastling') && !checkLine) {
				let shortRook = table.rows[rowIndex].cells[7].querySelector(`.rook${friend}`);

				if (shortRook && !shortRook.matches('.falseCastling')) {
					let short = table.rows[rowIndex].cells[cellIndex + 2];
					let free = false;

					for (let i = cellIndex + 1; i < 7; i++) {
						if (table.rows[rowIndex].cells[i].querySelector('.pieces')) {
							free = false;
							break;
						}

						free = true;
					}

					if (free && !enemysMoves.includes(short) &&
					!enemysMoves.includes(table.rows[rowIndex].cells[cellIndex + 1])) {
						localMoves.push(short);
					}
				}
				
				let longRook = table.rows[rowIndex].cells[0].querySelector(`.rook${friend}`);

				if (longRook && !longRook.matches('.falseCastling')) {
					let long = table.rows[rowIndex].cells[cellIndex - 2];
					let free = false;

					for (let i = cellIndex - 1; i > 1; i--) {
						if (table.rows[rowIndex].cells[i].querySelector('.pieces')) {
							free = false;
							break;
						}

						free = true;
					}

					if (free && !enemysMoves.includes(long) &&
					!enemysMoves.includes(table.rows[rowIndex].cells[cellIndex - 1])) {
						localMoves.push(long);
					}
				}
				
			}
		}

		if (localMoves.length) availableMoves[piece.id] = localMoves;
	}

	if (checkLine && !Object.keys(availableMoves).length) {
		playSound('checkmate');
		alert('checkmate!');
	} else if (checkLine) playSound('check');
}
