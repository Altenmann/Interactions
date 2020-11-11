function createElement(elementParams = []) {
    let element = document.createElement(elementParams["tag"]);
    element.id = elementParams["id"];
    element.className = elementParams["classTag"];

    return element;
}

function appendChildren(children = [], container) {
    for(let i=0; i<children.length; i++) {
        let childParams = children[i];
        let child = createElement(childParams);
        container.appendChild(child);
    }
}

function createInput(id, classTag, type, min, max) {
    let input = createElement({
        "tag": "input",
        "id": id,
        "classTag": classTag
    });

    input.type = type;
    input.min = min;
    input.max = max;

    return input;
}

function createSpecialInput(id, min, max, info) {
    let p = createElement({"tag": "p"});
}

function createSpecial(mainId, hoverElements = []) {
    let mainContainer = createElement({
        "tag": "div",
        "id": mainId,
        "classTag": mainId
    });

    appendChildren(hoverElements, mainContainer);

    document.body.appendChild(mainContainer);
}