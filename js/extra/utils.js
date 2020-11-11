function random(min, max, float) {
    if(float) return Math.floor((Math.random() * (max - min) + min) * Math.pow(10, float)) / Math.pow(10, float);
    else return Math.floor(Math.random() * (max - min) + min);
}

function squish(min, max, value) {
    let spanValue = max - min;
    let relativeValue = value - min;

    return relativeValue / spanValue;
}