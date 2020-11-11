// sets up canvas and context

let c;

function setupCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.addEventListener('click', (event) => {
        currentWorld.onClick(event);
    });
    canvas.id = "gameCanvas";
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    c = canvas.getContext('2d');
}