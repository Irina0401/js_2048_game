/* eslint-disable no-shadow */
'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const size = 4;

const field = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const statusEl = document.querySelector('.message-container');
const button = document.querySelector('.start');

const game = new Game();

function renderBoard() {
  const state = game.getState();

  field.innerHTML = '';

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement('div');

      cell.classList.add('field-cell');

      const value = state[row][col];

      if (value) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
      field.appendChild(cell);
    }
  }

  scoreEl.textContent = game.getScore();

  const status = game.getStatus();

  statusEl.textContent =
    status === 'win' ? 'You win!' : status === 'lose' ? 'Game over' : '';
  statusEl.classList.toggle('hidden', status === 'playing');
}

function handleMove(direction) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moved = {
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
  }[direction];

  if (moved) {
    moved();
    renderBoard();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}

document.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    handleMove(event.key);
  }
});

button.addEventListener('click', () => {
  game.restart();
  renderBoard();
  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
});

game.start();
renderBoard();
