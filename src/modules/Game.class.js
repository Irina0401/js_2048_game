'use strict';
class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'playing';
    this.board = initialState ? this.cloneBoard(initialState) : this.createEmptyBoard();
    if (!initialState) {
      this.addRandomTile()
      this.addRandomTile()
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map(row => row.slice());
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  moveLeft() {
    this.move(this.board);
  }

  moveRight() {
    const reversed = this.board.map(row => row.reverse());
    this.move(reversed);
    this.board = reversed.map(row => row.reverse());
  }

  moveUp() {
    const transposed = this.transpose(this.board);
    this.move(transposed);
    this.board = this.transpose(transposed);
  }

  moveDown() {
    const transposed = this.transpose(this.board).map(row => row.reverse());
    this.move(transposed);
    this.board = this.transpose(transposed.map(row => row.reverse()));
  }

  move(rows) {
    let moved = false;
    for (let row of rows) {
      const original = row.slice();
      const merged = this.merge(row);
      if (!this.arraysEqual(original, merged)) {
        moved = true;
      }
      row.splice(0, row.length, ...merged);
    }
    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  merge(row) {
    const nonZero = row.filter(n => n !== 0);
    const merged = [];
    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        merged.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++;
      } else {
        merged.push(nonZero[i]);
      }
    }
    while (merged.length < this.size) merged.push(0);
    return merged;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  addRandomTile() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return;

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.board.some(row => row.includes(2048))) {
      this.status = 'win';
      return;
    }

    if (this.board.some(row => row.includes(0))) return;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const value = this.board[r][c];
        if (
          (r < this.size - 1 && this.board[r + 1][c] === value) ||
          (c < this.size - 1 && this.board[r][c + 1] === value)
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;

