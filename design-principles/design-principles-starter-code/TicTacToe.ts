
// This program violates the principles of High-Quality Abstraction, Primitive Obsession, and Information Hiding.
// 
// 1. Explain why/how this program violates the above principles.
// The Game class violates the High-Quality Abstraction principle 
// because it exposes the internal details of how the game is played to other parts of the game
// it should keep the implementation details of checking winning moves separate from the logic that chooses a move.
// The Game class violates the Primitive Obsession principle 
// because it uses primitive types of strings and numbers to represent the game state and player moves
// The Game class violates the Information Hiding principle 
// because it exposes the internal details of how the game is played
// these things should be private and not accessible to other parts of the game

// 2. Explain how you would refactor the code to improve its design.
// - High-Quality Abstraction: 
// Create clear methods that represent game actions and rules, 
// such as play(), winner(), and move(). 
// - Primitive Obsession: 
// Replace primitive strings with an enum or dedicated types for players and board cells. 
// - Information Hiding: 
// Make the board field private and prevent callers from directly modifying the board. 
// Provide methods to access the board state and make moves so the class can enforce valid positions and player values.

export class Game {

	board: string[];

	constructor(board: string[], position: number = -1, player: string = '') {
		this.board = [...board];
		
		if (position >= 0 && player !== "") {
			this.board[position] = player;
		}
	}

	move(player: string): number {
		for (let i = 0; i < 9; i++) {
			if (this.board[i] == "-") {
				let game = this.play(i, player);
				if (game.winner() == player) {
					return i;
				}
			}
		}

		for (let i = 0; i < 9; i++) {
			if (this.board[i] == "-") {
				return i;
			}
		}
		return -1;
	}

	play(position: number, player: string): Game {
		return new Game(this.board, position, player);
	}

	winner(): string {
		if (this.board[0] != "-" &&
			this.board[0] == this.board[1] &&
			this.board[1] == this.board[2]) {

			return this.board[0]
		}
		if (this.board[3] != "-" &&
			this.board[3] == this.board[4] &&
			this.board[4] == this.board[5]) {

			return this.board[3]
		}
		if (this.board[6] != "-" &&
			this.board[6] == this.board[7] &&
			this.board[7] == this.board[8]) {
			return this.board[6]
		}

		return "-";
	}
}

export class GameTest {

	testDefaultMove() {
		let game = new Game(this.stringToCharArray("XOXOX-OXO"));
		this.assertEquals(5, game.move('X'));

		game = new Game(this.stringToCharArray("XOXOXOOX-"));
		this.assertEquals(8, game.move('O'));

		game = new Game(this.stringToCharArray("---------"));
		this.assertEquals(0, game.move('X'));

		game = new Game(this.stringToCharArray("XXXXXXXXX"));
		this.assertEquals(-1, game.move('X'));
	}

	testFindWinningMove() {
		let game = new Game(this.stringToCharArray("XO-XX-OOX"));
		this.assertEquals(5, game.move('X'));
	}
	
	testWinConditions() {
		let game = new Game(this.stringToCharArray("---XXX---"));
		this.assertEquals('X', game.winner());
	}

	private assertEquals(expected: string | number, actual: string | number){
		if (expected !== actual) {
			console.error(`${expected} != ${actual}`);
		}
	}

	private stringToCharArray(str: string): string[] {
		let result: string[] = [];
		for (const char of str) {
			result.push(char);
		}
		return result;
	}
}

// Test Driver

let gameTest = new GameTest();
gameTest.testDefaultMove();
gameTest.testFindWinningMove();
gameTest.testWinConditions();
