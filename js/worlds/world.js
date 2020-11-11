let currentWorld;

let mouseX, mouseY;

class World {
    constructor() {
        // Html.js test
        createHTML();

        /***/
        this.previewPoint = new Point(25, 25);
        showPreview();
        /***/

        this.points = [];

        this.generatePoints(100);
    }

    generatePoints(numPoints) {
        for(let i=0; i<numPoints; i++) {
            let p = new Point(random(0, width), random(0, height));
            p.randomInit();
            this.points.push(p);
        }
    }

    showPreview() {
        let p = this.previewPoint;
        
        if(!document.getElementById("randomCheck").checked) {
            p.rgb[0] = document.getElementById('rNum').value;
            p.rgb[1] = document.getElementById('gNum').value;
            p.rgb[2] = document.getElementById('bNum').value;
            p.setColor();

            p.radius = document.getElementById('radiusNum').value;
            p.bounds = p.radius;
        }

        this.previewPoint = p;

        cPreview.fillStyle = "white";
        cPreview.strokeStyle = "black";

        cPreview.fillRect(0, 0, 50, 50);
        cPreview.strokeRect(0, 0, 50, 50);

        this.previewPoint.draw(cPreview);
    }

    onClick(event) {
        let canvasRect = document.getElementById("gameCanvas").getBoundingClientRect();

        let x = Math.floor(event.clientX - canvasRect.left);
        let y = Math.floor(event.clientY - canvasRect.top);

        let p = new Point(x, y);

        if(!document.getElementById("randomCheck").checked) {
            let idValue = function(id) {
                return Number(document.getElementById(id).value);
            }
            p.rgb[0] = idValue('rNum');
            p.rgb[1] = idValue('gNum');
            p.rgb[2] = idValue('bNum');
            p.setColor();

            let radius = idValue('radiusNum');
            p.radius = radius;
            p.bounds = radius;

            p.roi = idValue('roiNum');
            p.leadership = idValue('leadershipNum');

            p.vel[0] = idValue('xVelNum');
            p.vel[1] = idValue('yVelNum');

            p.flowRate["rgb"] = idValue('flowRateRgbNum');
            
            p.flowRate["vel"] = idValue('flowRateXVelNum');

        } else {
            p.randomInit();
        }

        this.points.push(p);

        this.draw();
    }

    update() {
        for(this.p of this.points) {
            this.p.update();
        }    
    }

    draw() {
        this.clearScreen();

        for(this.p of this.points) {
            this.p.draw(c);
        }
        
        this.showPreview();
    }

    clearScreen() {
        c.fillStyle = 'rgb(10, 10, 5, .2)';
        c.fillRect(0, 0, width, height);
        c.lineWidth = 2;
        c.strokeStyle = 'black';
        c.strokeRect(0, 0, width, height);
    }
}

function createHTML() {
    let hoverElements = [];
    for(let i=0; i<3; i++) {
        hoverElements.push(createElement({
            "tag": "div",
            "classTag": "hover"
        }));
    }
    createSpecial("pointGenerator", hoverElements);
}