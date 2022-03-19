
function DrawRect(canvas, image, data) {

    var idolName = data[0];
    var actorName = data[2];
    var colorCode = data[4];

    //canvas.width = 320;
    //canvas.height = 150;

    var context = canvas.getContext("2d");
    context.fillStyle = "#" + colorCode;
    context.fillRect(0, 0, 320, 150);

    image.src = "icon/" + idolName + ".png";
    image.height = 150;
    image.width = 150;

    context.font = "39px impact";
    context.lineWidth = "4";
    context.lineJoin = "miter";
    context.miterLimit = "4";
    context.fillStyle = "#000000";
    context.textBaseline = "middle";
    context.strokeText(idolName, 20, 45);
    context.strokeText(actorName, 20, 105);

    context.fillStyle = "#FFFFFF";
    context.fillText(idolName, 20, 45);
    context.fillText(actorName, 20, 105);
}
function getCSV(disptype, isPushButton) {
    var req = new XMLHttpRequest();
    req.open("get", "data.csv", true);
    req.send(null);
    req.onload = function () {
        var array = convertCSVtoArray(req.responseText);
        main(array, disptype, isPushButton);
    }
}
function convertCSVtoArray(str) {
    var result = [];
    var tmp = str.split("\n");
    for (var i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',');
    }
    return result;
}

function main(array, disptype, isPushButton) {

    var div1 = document.getElementById("div-box");
    while (div1.firstChild) {
        div1.removeChild(div1.firstChild);
    }

    var tableWidth = Math.floor(window.innerWidth / 470);

    var newDiv = document.createElement("div");

    var resultList = [];

    for (var i = 0; i < array.length; ++i) {
        var data = array[i];
        if (isDispIdol(data, disptype, isPushButton)) {
            resultList.push(data);
        }
    }
    for (var i = 0; i < resultList.length; ++i) {
        var canvas = document.createElement("canvas");
        var outputImg = document.createElement("img");

        DrawRect(canvas, outputImg, resultList[i]);

        newDiv.appendChild(outputImg);
        newDiv.appendChild(canvas);

        if ((i + 1) % tableWidth == 0 || (i + 1) == resultList.length) {
            div1.appendChild(newDiv);
            newDiv = document.createElement("div");
        }

    }


}

function isDispIdol(data, disptype, isPushButton) {
    var idolName = data[0];
    var idolNameKana = data[1];
    var actorName = data[2];
    var actorNameKana = data[3];
    var type = data[5];
    if (isPushButton) {
        return type == disptype || disptype == "All";
    }

    if (~idolName.indexOf(disptype)) {
        return true;
    }
    if (~idolNameKana.indexOf(disptype)) {
        return true;
    }
    if (~actorName.indexOf(disptype)) {
        return true;
    }
    if (~actorNameKana.indexOf(disptype)) {
        return true;
    }
    return false;
}

div2 = document.getElementById("div-type-button");
var buttonAll = document.createElement("button");
var buttonCu = document.createElement("button");
var buttonCo = document.createElement("button");
var buttonPa = document.createElement("button");

buttonAll.innerText = "全アイドル";
buttonCu.innerText = "キュート";
buttonCo.innerText = "クール";
buttonPa.innerText = "パッション";
buttonAll.onclick = function () {
    getCSV("All", true);
};
buttonCu.onclick = function () {
    getCSV("Cu", true);
};
buttonCo.onclick = function () {
    getCSV("Co", true);
};
buttonPa.onclick = function () {
    getCSV("Pa", true);
};
div2.appendChild(buttonAll);
div2.appendChild(buttonCu);
div2.appendChild(buttonCo);
div2.appendChild(buttonPa);

searchWord = function () {
    var searchText = $(this).val();
    if (searchText != '') {
        getCSV(searchText, false);
    }
};


$('#search-text').on('input', searchWord);

var btn = document.getElementById("download-btn");
btn.addEventListener("click", () => {
    html2canvas(document.querySelector("#canvas-box")).then(canvas => {
        let downloadEle = document.createElement("a");
        downloadEle.href = canvas.toDataURL("image/png");
        downloadEle.download = "canvas.png";
        downloadEle.click();
    });
})