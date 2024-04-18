
console.log('HELLO')

const DEFN = {
    ROWS: 10,
    COLS: 10,
    ROW_WIDTH: 30,
    COL_WIDTH: 30,
};

const main = document.getElementById('main');

const CELLS = new Array(DEFN.COLS);
for (let i = 0; i < DEFN.COLS; i++) {
    CELLS[i] = new Array(DEFN.ROWS);
}

for (let i = 0; i < DEFN.ROWS; i++) {
    for (let j = 0; j < DEFN.COLS; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.left = `${j * DEFN.COL_WIDTH}px`;
        cell.style.top = `${i * DEFN.ROW_WIDTH}px`;
        cell.dataset.x = j;
        cell.dataset.y = i;
        cell.innerText = `${j},${i}`;
        CELLS[j][i] = cell;
        main.appendChild(cell);
    }
}

const p1elem = document.createElement('div');
p1elem.id = 'player1';
main.appendChild(p1elem);

const p2elem = document.createElement('div');
p2elem.id = 'player2';
main.appendChild(p2elem);

const state = { };

function move(elem, x, y) {
    elem.dataset.x = x;
    elem.dataset.y = y;
    elem.style.left = `${ x * DEFN.COL_WIDTH }px`
    elem.style.top = `${ y * DEFN.ROW_WIDTH }px`
}

function update(incoming) {

    Object.assign(state, incoming);

    move(p1elem, state.player1.x, state.player1.y);
    move(p2elem, state.player2.x, state.player2.y);
}

(async function() {

    const webSocket = new WebSocket('coms');
    await new Promise((resolve, reject) => {
        webSocket.onopen = resolve;
        webSocket.onerror = reject;
    });

    webSocket.onmessage = function(message) {
        const state = JSON.parse(message.data);
        update(state);
    }

    window.addEventListener('keydown', (e) => {
        const delta = { x: 0, y: 0 };
        switch (e.key) {
        case 'ArrowLeft':
            delta.x = -1;
            break;
        case 'ArrowRight':
            delta.x = 1;
            break;
        case 'ArrowDown':
            delta.y = 1;
            break;
        case 'ArrowUp':
            delta.y = -1;
            break;
        }

        state.player1.x += delta.x;
        state.player1.y += delta.y;
        move(p1elem, state.player1.x, state.player1.y)
        webSocket.send(JSON.stringify(state.player1));
    })

})();



