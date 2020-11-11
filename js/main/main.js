let width, height;

let pause = true;
let pauseAfterUpdate = false;

function main() {
    width = 700;
    height = 700;

    setupCanvas(width, height);
    
    setupKeyEvents();

    currentWorld = new World();

    document.body.setAttribute("color", "#0f0f0a");

    window.requestAnimationFrame(loop);

    draw();
}

function setupKeyEvents() {
    document.addEventListener('keypress', (event) => {
        const keyName = event.key;
        
        switch(keyName) {
            case 'p':
                if(pause) {
                    pause = false;
                    window.requestAnimationFrame(loop);
                } else pause = true;
        }
    }, false);
}

function loop() {
    if(!pause) {
        update();
        draw();
        window.requestAnimationFrame(loop);
    }
}

function update() {
    currentWorld.update();
    if(pauseAfterUpdate) pause = true;
}

function draw() {
    currentWorld.draw();
}

main();