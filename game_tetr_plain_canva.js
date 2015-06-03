"use strict";

//===
// Перерисовать колодец
//===
APELSERG.CANVA.WellRewrite = function (cellPool) {
    
    var ctxTetr = APELSERG.CONFIG.WELL.Ctx;
    var blockCurr = APELSERG.CONFIG.PROC.CurrentBlock;

    var wellColor = '#CCCCBB';

    //-- Очистить колодец
    //--
    ctxTetr.fillStyle = wellColor;
    ctxTetr.fillRect(0, 0, APELSERG.CONFIG.SET.WellColumn * APELSERG.CONFIG.SET.CellSize, APELSERG.CONFIG.SET.WellRow * APELSERG.CONFIG.SET.CellSize);

    //-- Отрисовать сетку
    //--
    if (APELSERG.CONFIG.SET.ShowNet) {
        ctxTetr.strokeStyle = "#E0E0E0";
        for (var nRow = 0 ; nRow < APELSERG.CONFIG.SET.WellRow; nRow++) {
            for (var nColumn = 0 ; nColumn < APELSERG.CONFIG.SET.WellColumn; nColumn++) {
                ctxTetr.lineWidth = 1;
                ctxTetr.strokeRect(nColumn * APELSERG.CONFIG.SET.CellSize, nRow * APELSERG.CONFIG.SET.CellSize, APELSERG.CONFIG.SET.CellSize, APELSERG.CONFIG.SET.CellSize);
            }
        }
    }

    //-- Отрисовать падающий блок
    //--
    for (var n = 0 in blockCurr.cells[blockCurr.idx]) {
        APELSERG.CANVA.CellRewrite(ctxTetr, blockCurr.cells[blockCurr.idx][n]);
    }

    //-- Отрисовать упавшие блоки
    //--
    for (var n = 0 in cellPool) {
        APELSERG.CANVA.CellRewrite(ctxTetr, cellPool[n]);
    }
    
    //-- Пауза
    //--
    if (APELSERG.CONFIG.PROC.GamePause && !APELSERG.CONFIG.PROC.GameStop) {
        APELSERG.CANVA.TextRewrite(ctxTetr, APELSERG.LANG.GetText("PAUSE"));
    }

    //-- Стоп
    //--
    if (APELSERG.CONFIG.PROC.GameStop) {
        APELSERG.CANVA.TextRewrite(ctxTetr, APELSERG.LANG.GetText("STOP"));
    }

    if (APELSERG.CONFIG.SET.ShowInfo) {

        var ctxInfo = APELSERG.CONFIG.INFO.Ctx;
        var blockNext = APELSERG.MAIN.CloneObj(APELSERG.CONFIG.PROC.NextBlock);

        //-- Очистить инфо
        //--
        ctxInfo.fillStyle = wellColor;
        ctxInfo.fillRect(0, 0, APELSERG.CONFIG.SET.WellColumn * APELSERG.CONFIG.SET.CellSize, APELSERG.CONFIG.SET.WellRow * APELSERG.CONFIG.SET.CellSize);

        //-- Отрисовать следующий блок
        //--
        if (APELSERG.CONFIG.SET.ShowNextBlock) {
            for (var n = 0 in blockNext.cells[blockNext.idx]) {
                APELSERG.CANVA.CellRewrite(ctxInfo, blockNext.cells[blockNext.idx][n]);
            }
        }

        //-- Инфо
        //--
        APELSERG.CANVA.InfoRewrite(ctxInfo);
    }
}

//===
// Перерисовать ячейку
//===
APELSERG.CANVA.CellRewrite = function (ctx, cell) {
    
    var xR = (cell.Col - 1) * APELSERG.CONFIG.SET.CellSize;
    var xL = APELSERG.CONFIG.SET.CellSize;
    var yR = (cell.Row - 1) * APELSERG.CONFIG.SET.CellSize;
    var yL = APELSERG.CONFIG.SET.CellSize;
    
    ctx.fillStyle = cell.Color;
    ctx.fillRect(xR, yR, xL, yL);
}

//===
// Перерисовать текст
//===
APELSERG.CANVA.TextRewrite = function (ctx, strText) {

    var fontHight = 1.0;

    ctx.font = (APELSERG.CONFIG.SET.CellSize * fontHight).toString() + "px Arial"; //ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(strText, APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2 , APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellRow / 2);
}

//===
// Перерисовать инфо
//===
APELSERG.CANVA.InfoRewrite = function (ctx) {

    var fontHight = 1.0;

    ctx.font = (APELSERG.CONFIG.SET.CellSize * fontHight).toString() + "px Arial"; //ctx.font = "30px Arial";

    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    ctx.fillText(APELSERG.LANG.GetText("P:OINT") + APELSERG.CONFIG.PROC.Points.toString(), APELSERG.CONFIG.SET.CellSize / 2, (APELSERG.CONFIG.SET.CellSize * 3) * fontHight);
    ctx.fillText(APELSERG.LANG.GetText("L:EVEL") + (APELSERG.CONFIG.SET.Level + 1).toString(), APELSERG.CONFIG.SET.CellSize / 2, (APELSERG.CONFIG.SET.CellSize * 4) * fontHight);
    ctx.fillText(APELSERG.LANG.GetText("S:KILL") + APELSERG.CONFIG.SET.Skill.toString(), APELSERG.CONFIG.SET.CellSize / 2, (APELSERG.CONFIG.SET.CellSize * 5) * fontHight);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.fillText(APELSERG.CONFIG.SET.UserName, APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * 1) * fontHight);
    ctx.fillText("-----", APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * 2) * fontHight);
    ctx.fillText("-----", APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * 6) * fontHight);

    if (APELSERG.CONFIG.SET.ShowResult) {

        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        if (APELSERG.CONFIG.RESULT.Best[0] === undefined)
        {
            ctx.fillText(APELSERG.LANG.GetText("NO_DATA"), APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * 7) * fontHight);
        }
        else
        {
            for (var n = 0; APELSERG.CONFIG.RESULT.Best.length > n; n++) {
                if (n == 3) {
                    break;
                }
                ctx.fillText((n + 1).toString(), APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * ((n * 4) + 7)) * fontHight);
                ctx.fillText(APELSERG.CONFIG.RESULT.Best[n].Name, APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * ((n * 4) + 8)) * fontHight);
                ctx.fillText(APELSERG.CONFIG.RESULT.Best[n].Points.toString(), APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * ((n * 4) + 9)) * fontHight);
                ctx.fillText("-----", APELSERG.CONFIG.SET.CellSize * APELSERG.CONFIG.SET.WellColumn / 2, (APELSERG.CONFIG.SET.CellSize * ((n * 4) + 10)) * fontHight);
            }
        }
    }
}
