let maxVel = 3;
let fov = 40;

let showBounds = false;

let isCollision = true;
let isInteraction = true;

class Point {
    constructor(x, y) {
        // Position
        this.x = x;
        this.y = y;

        // Radius of point
        this.radius = 0;
        // How close another point can get via collision (usually the radius)
        this.bounds = 0;

        // Field of View, How close another point must be to affect this point (usually will have a default)
        this.fov = fov;

        // Rate of Influence, how likely it will change given influence from others values range (0, 1)
        // Defaults to .5;
        this.roi = .5;

        // The amount of times it will affect others
        this.leadership = 1;

        // RGB Color, An array used to store the colors
        this.rgb = [0,0,0];
        // The method used to turn the array into a color
        this.setColor();

        // Velocity, Speeds at which the position changes [x, y]
        this.vel = [0, 0];

        // Determine direction of 'flow'
        this.flowDir = {
            "rgb": [1, 1, 1],
            "vel": [1, 1]
        }

        // Determine the rate of 'flow'
        this.flowRate = {
            "rgb": 0,
            "vel": 0
        }
    }

    // Allows the variables to be randomizied 
    randomInit() {
        this.radius = random(1, 6);
        this.bounds = this.radius;

        this.roi = random(0, 1, 4);
        this.leadership = random(1, 5);

        this.rgb = [random(0, 255), random(0, 255), random(0, 255)];
        this.flowRate["rgb"] = random(0, 10, 3);
        this.setColor();

        for(let i=0; i<this.vel.length; i++) 
            this.vel[i] = random(-this.radius, this.radius, 4);
        this.flowRate["vel"] = random(0, maxVel/100, 4);
    }

    // Method used to turn the rgb array into a color string
    setColor() {
        let color = 'rgb(';
        let i = 0;
        for(this.c of this.rgb) {
            let c = Math.floor(this.c);
            color += c;
            if(i < this.rgb.length - 1) color += ',';
            else color += ')';
            i++;
        }
        // The color of this point
        this.color = color;
    }

    // Will prevent points from getting inside the bounds of other points
    collide() {
        for(currentWorld.p of currentWorld.points) {
            let p = currentWorld.p;
            // Continues if the point recieved is outside of a "bounding box"
            if (p.x + p.radius < this.x - this.bounds ||
                p.x - p.radius > this.x + this.bounds ||
                p.y + p.radius < this.y - this.bounds ||
                p.y - p.radius > this.y + this.bounds ||
                p == this) continue;
            else {
                let xDis = p.x - this.x;
                let yDis = p.y - this.y;
                let dis = Math.sqrt( Math.pow(xDis, 2) + Math.pow(yDis, 2) );
                
                if(dis <= this.bounds + p.bounds) {
                    // Code for interaction

                    let intensity = 1;
                    if(dis > 0) intensity = (p.bounds + this.bounds) / dis;

                    // The angle at which the collision occurs
                    let angle = Math.atan2(yDis, xDis);

                    // Changes this velocity to the opposite direction of the point
                    this.vel[0] += -Math.cos(angle) * intensity / 2;
                    this.vel[1] += -Math.sin(angle) * intensity / 2;

                    // Changes the other point's velocity
                    p.vel[0] += Math.cos(angle) * intensity / 2;
                    p.vel[1] += Math.sin(angle) * intensity / 2;
                } else continue;
            }
        }
        this.setColor();
    }

    /* 
     * Method using the fov variable to determine how it reacts in
     * response to other points
     */
    interact() {
        let interactions = 0;

        let colorChange = [0,0,0];
        
        let velChange = [0, 0];

        for(currentWorld.p of currentWorld.points) {
            let p = currentWorld.p;
            if (p.x + p.radius < this.x - this.fov ||
                p.x - p.radius > this.x + this.fov ||
                p.y + p.radius < this.y - this.fov ||
                p.y - p.radius > this.y + this.fov ||
                p == this) continue;
            else {

                let xDis = p.x - this.x;
                let yDis = p.y - this.y;
                let dis = Math.sqrt( Math.pow(xDis, 2) + Math.pow(yDis, 2) );
                
                if(dis <= this.fov + p.bounds) {
                    // Code for interaction

                    for(let i=0; i<this.rgb.length; i++)
                        colorChange[i] += p.rgb[i] * p.leadership;

                    for(let i=0; i<this.vel.length; i++) 
                        velChange[i] += p.vel[i] * p.leadership;

                    interactions += p.leadership; 
                } else continue;
            }
        }

        if(interactions <= 0) return;

        // Color Changes
        let colorGroup = 0;
        for(let i=0; i<3; i++) {
            colorGroup = colorChange[i] / interactions;
            if(colorGroup < 0) colorGroup = 0;
            else if(colorGroup > 255) colorGroup = 255;

            this.rgb[i] = Math.floor( this.rgb[i] * this.roi + colorGroup * (1 - this.roi) );
        }
        this.setColor();

        // Velocity Changes
        for(let i=0; i<3; i++)
            this.vel[i] = (this.vel[i] * this.roi + velChange[i] * (1 - this.roi) / interactions);
    }

    update() {
        if(isCollision) this.collide();
        if(isInteraction) this.interact();
        
        this.independence();

        this.clampVelocity();

        this.x += this.vel[0];
        this.y += this.vel[1];

        this.loopWorld();
    }

    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();

        if(this.x + this.radius > width) {
            c.beginPath();
            c.arc(this.x - width, this.y, this.radius, 0, Math.PI*2);
            c.fillStyle = this.color;
            c.fill();
        }

        if(showBounds) {
            c.beginPath();
            c.arc(this.x, this.y, this.bounds, 0, Math.PI*2);
            c.strokeStyle = "red";
            c.stroke();
        }
    }

    independence() {
        this.rgbIndependence();
        this.velIndependence();
    }

    // Allows its color to have a flow independent of other's
    rgbIndependence() {
        for(let i=0; i<this.rgb.length; i++) {
            if(this.flowDir["rgb"][i] > 0) {
                this.rgb[i] += this.flowRate["rgb"];
                if(this.rgb[i] >= 255) {
                    this.rgb[i] = 255;
                    this.flowDir["rgb"][i] *= -1;
                }
            } else {
                this.rgb[i] -= this.flowRate["rgb"];
                if(this.rgb[i] <= 0) {
                    this.rgb[i] = 0;
                    this.flowDir["rgb"][i] *= -1;
                }
            }
        }
    }

    velIndependence() {
        for(let i=0; i<this.vel.length; i++) {
            if(this.flowDir["vel"][i] > 0)
                this.vel[i] += this.flowRate["vel"];
            else
                this.vel[i] -= this.flowRate["vel"];

            if(this.vel[i] > maxVel) {
                this.vel[i] = maxVel;
                this.flowDir["vel"][i] *= -1;
            } else if(this.vel[i] < -maxVel) {
                this.vel[i] = -maxVel;
                this.flowDir["vel"][i] *= -1;
            }
        }
    }

    clampVelocity() {
        if(this.vel[0] > maxVel) this.vel[0] = maxVel;
        else if(this.vel[0] < -maxVel) this.vel[0] = -maxVel;

        if(this.vel[1] > maxVel) this.vel[1] = maxVel;
        else if(this.vel[1] < -maxVel) this.vel[1] = -maxVel;
    }

    loopWorld() {
        if(this.x + this.radius < 0) this.x = width;
        else if(this.x - this.radius > width) this.x = 0;

        if(this.y + this.radius < 0) this.y = height;
        else if(this.y - this.radius > height) this.y = 0;
    }
}