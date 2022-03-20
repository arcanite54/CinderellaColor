
function DrawRect(canvas, image, data) {

    var idolName = data[0];
    var actorName = data[2];
    var colorCode = data[4];

    var context = canvas.getContext("2d");
    context.fillStyle = "#" + colorCode;
    context.fillRect(0, 0, 320, 150);

    image.src = "icon/" + idolName + ".png";
    image.height = 150;
    image.width = 150;

    context.font = "39px 'Yu Gothic UI'";
    context.lineWidth = "4";
    context.lineJoin = "miter";
    context.miterLimit = "4";
    context.fillStyle = "#000000";
    context.textBaseline = "middle";
    context.strokeText(idolName, 20, 46);
    context.strokeText(actorName, 20, 106);

    context.fillStyle = "#FFFFFF";
    context.fillText(idolName, 20, 46);
    context.fillText(actorName, 20, 106);
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

    var tableWidth = Math.floor(window.innerWidth / 450);

    var table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.borderSpacing = 0;
    table.style.margin = 0;
    table.style.padding = 0;
    //table.style.backgroundColor = "#e0e0e0";

    var resultList = [];

    for (var i = 0; i < array.length; ++i) {
        var data = array[i];
        if (isDispIdol(data, disptype, isPushButton)) {
            resultList.push(data);
        }
    }
    var newRow = table.insertRow(-1);
    for (var i = 0; i < resultList.length; ++i) {
        var newCell = newRow.insertCell(-1);
        var canvas = document.createElement("canvas");
        var outputImg = document.createElement("img");

        //画像下にできる謎の余白を消す.
        canvas.style.verticalAlign = "top";
        outputImg.style.verticalAlign = "top";

        DrawRect(canvas, outputImg, resultList[i]);

        //横並びにして余白を消す.
        newCell.style.whiteSpace = "nowrap";
        newCell.style.padding = 0;
        newCell.style.margin = 0;
        newCell.style.border = 0;

        newCell.appendChild(outputImg);
        newCell.appendChild(canvas);

        newRow.appendChild(newCell);

        if ((i + 1) % tableWidth == 0 || (i + 1) == resultList.length) {
            //折り返し.
            var newRow = table.insertRow(-1);
        }
    }
    div1.appendChild(table);
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

//床に置きっぱなしはどうかと思うのであとで整理する.
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

//検索.
$('#search-text').on('input', searchWord);

/*
var btn = document.getElementById("download-btn");
btn.addEventListener("click", () => {
    html2canvas(document.querySelector("#canvas-box"), {
        // キャプチャ幅を変更する
        width: 450 * 8,
        // html2canvas のウィンドウ幅を変更する
        windowWidth: 450 * 8,
    }).then(canvas => {
        let downloadEle = document.createElement("a");
        downloadEle.href = canvas.toDataURL("image/png");
        downloadEle.download = "canvas.png";
        downloadEle.click();
    });
})
*/