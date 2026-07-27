class Game2048 {
    constructor(gridSize = 64) {
        this.gridSize = gridSize;
        this.grid = [];
        this.score = 0;
        this.gameOver = false;
        this.init();
    }

    init() {
        this.grid = Array(this.gridSize * this.gridSize).fill(0);
        this.score = 0;
        this.gameOver = false;
        this.addNewTile();
        this.addNewTile();
        this.render();
    }

    addNewTile() {
        const emptyTiles = this.grid
            .map((val, idx) => (val === 0 ? idx : null))
            .filter(val => val !== null);

        if (emptyTiles.length === 0) return;

        const randomIdx = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        this.grid[randomIdx] = Math.random() < 0.9 ? 2 : 4;
    }

    getPosition(idx) {
        return {
            row: Math.floor(idx / this.gridSize),
            col: idx % this.gridSize
        };
    }

    getIndex(row, col) {
        if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
            return -1;
        }
        return row * this.gridSize + col;
    }

    move(direction) {
        const gridBefore = [...this.grid];

        if (direction === 'left' || direction === 'a') this.moveLeft();
        else if (direction === 'right' || direction === 'd') this.moveRight();
        else if (direction === 'up' || direction === 'w') this.moveUp();
        else if (direction === 'down' || direction === 's') this.moveDown();

        const gridAfter = this.grid;
        const moved = JSON.stringify(gridBefore) !== JSON.stringify(gridAfter);

        if (moved) {
            this.addNewTile();
            this.render();
            this.checkGameOver();
        }

        return moved;
    }

    moveLeft() {
        for (let row = 0; row < this.gridSize; row++) {
            const line = [];
            for (let col = 0; col < this.gridSize; col++) {
                const idx = this.getIndex(row, col);
                if (this.grid[idx] !== 0) {
                    line.push(this.grid[idx]);
                }
            }
            const merged = this.merge(line);
            for (let col = 0; col < this.gridSize; col++) {
                const idx = this.getIndex(row, col);
                this.grid[idx] = merged[col] || 0;
            }
        }
    }

    moveRight() {
        for (let row = 0; row < this.gridSize; row++) {
            const line = [];
            for (let col = this.gridSize - 1; col >= 0; col--) {
                const idx = this.getIndex(row, col);
                if (this.grid[idx] !== 0) {
                    line.push(this.grid[idx]);
                }
            }
            const merged = this.merge(line);
            for (let col = this.gridSize - 1; col >= 0; col--) {
                const idx = this.getIndex(row, col);
                this.grid[idx] = merged[this.gridSize - 1 - col] || 0;
            }
        }
    }

    moveUp() {
        for (let col = 0; col < this.gridSize; col++) {
            const line = [];
            for (let row = 0; row < this.gridSize; row++) {
                const idx = this.getIndex(row, col);
                if (this.grid[idx] !== 0) {
                    line.push(this.grid[idx]);
                }
            }
            const merged = this.merge(line);
            for (let row = 0; row < this.gridSize; row++) {
                const idx = this.getIndex(row, col);
                this.grid[idx] = merged[row] || 0;
            }
        }
    }

    moveDown() {
        for (let col = 0; col < this.gridSize; col++) {
            const line = [];
            for (let row = this.gridSize - 1; row >= 0; row--) {
                const idx = this.getIndex(row, col);
                if (this.grid[idx] !== 0) {
                    line.push(this.grid[idx]);
                }
            }
            const merged = this.merge(line);
            for (let row = this.gridSize - 1; row >= 0; row--) {
                const idx = this.getIndex(row, col);
                this.grid[idx] = merged[this.gridSize - 1 - row] || 0;
            }
        }
    }

    merge(line) {
        let merged = [...line];
        for (let i = 0; i < merged.length - 1; i++) {
            if (merged[i] === merged[i + 1]) {
                merged[i] *= 2;
                this.score += merged[i];
                merged.splice(i + 1, 1);
            }
        }
        return merged;
    }

    checkGameOver() {
        // Check if any moves are possible
        if (this.grid.some(val => val === 0)) return;

        // Check horizontal moves
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 1; col++) {
                const idx1 = this.getIndex(row, col);
                const idx2 = this.getIndex(row, col + 1);
                if (this.grid[idx1] === this.grid[idx2]) return;
            }
        }

        // Check vertical moves
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize - 1; row++) {
                const idx1 = this.getIndex(row, col);
                const idx2 = this.getIndex(row + 1, col);
                if (this.grid[idx1] === this.grid[idx2]) return;
            }
        }

        this.gameOver = true;
    }

    render() {
        const container = document.getElementById('gameContainer');
        container.innerHTML = '';

        this.grid.forEach((value, idx) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (value === 0) {
                tile.classList.add('empty');
            } else {
                tile.setAttribute('data-value', value);
                tile.textContent = value;
            }
            container.appendChild(tile);
        });

        document.getElementById('score').textContent = this.score;
    }
}

let game = new Game2048(64);

document.getElementById('newGameBtn').addEventListener('click', () => {
    game = new Game2048(64);
});

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's'].includes(key)) {
        e.preventDefault();
        const directionMap = {
            'arrowleft': 'left',
            'arrowright': 'right',
            'arrowup': 'up',
            'arrowdown': 'down',
            'a': 'a',
            'd': 'd',
            'w': 'w',
            's': 's'
        };
        game.move(directionMap[key]);
        if (game.gameOver) {
            setTimeout(() => alert(`Game Over! Final Score: ${game.score}`), 100);
        }
    }
});