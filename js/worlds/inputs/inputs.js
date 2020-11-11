let cPreview;

function changeValue(id, value) {
    document.getElementById(id).value = value;
}

function showPreview() {
    const canvas = document.createElement('canvas');
    canvas.id = "previewCanvas";
    canvas.width = 50;
    canvas.height = 50;
    document.getElementById("apperanceHover").appendChild(canvas);

    cPreview = canvas.getContext('2d');
}