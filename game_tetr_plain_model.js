// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

//===
// Базовый объект - ячейка
//===
APELSERG.MODEL.Cell = function (cellRow, cellCol, cellColor) {
    this.Row = cellRow;
    this.Col = cellCol;
    this.Color = cellColor;
}

//===
// Объект - блок
//===
APELSERG.MODEL.Block = function (blockType) {
    this.type = blockType;
    this.idx = 0;
    this.cells = [[], [], [], []];
}

//===
// Новый блок
//===
APELSERG.MODEL.GetNewBlock = function() {

    var newBlock = APELSERG.CONFIG.PROC.NextBlock;
    APELSERG.CONFIG.PROC.NextBlock = APELSERG.MODEL.GetBlock();

    if (!APELSERG.MODEL.CheckBlockCross(newBlock)) {
        APELSERG.CONFIG.PROC.GameStop = true;  //-- игра завершена
        window.clearTimeout(APELSERG.CONFIG.PROC.TimeoutID); //-- отмена срабатывания
        APELSERG.CONFIG.SetResult(); //-- запись результата
    }
    return newBlock;
}

//===
// Получить случайное число из диапазона
//===
APELSERG.MODEL.GetRandomNumber = function(max) {
    
    return Math.round(Math.random() * max * 100) % max;
}

//===
// Получить случайный цвет из списка
//===
APELSERG.MODEL.GetCellColor = function() {
    var cellColors = ['#CC3300', '#FF9900', '#FFFF00', '#009933', '#3399FF', '#0033CC', '#9900CC'];
    return cellColors[APELSERG.MODEL.GetRandomNumber(cellColors.length)];
}

//===
// Получить случайный тип блока из списка
//===
APELSERG.MODEL.GetBlockType = function() {

    var blockTypes = [];

    if(APELSERG.CONFIG.SET.Skill == 1) {
        blockTypes = [101,
                  201, 202, 203,
                  301, 302, 303, 304, 305, 306, 307, 308, 309];
    }
    else if(APELSERG.CONFIG.SET.Skill == 2) {
        blockTypes = [101,
                  201, 202, 203,
                  301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319];
    }
    else if (APELSERG.CONFIG.SET.Skill == 3) {
        blockTypes = [101,
                  201, 202, 203,
                  301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319,
                  401, 402, 403, 404, 405, 406, 407, 408, 409];
    }
    else {
        blockTypes = [101];
    }

    /*
    //-- !!! WOW !!! Этот switch не работает (проваливается в default), хотя APELSERG.CONFIG.SET.Skill устанавливается корректно
    //--

    switch(APELSERG.CONFIG.SET.Skill) {
        case 1:
            blockTypes = [101,
                      201, 202, 203,
                      301, 302, 303, 304, 305, 306, 307];
            break;
        case 2:
            blockTypes = [101,
                      201, 202, 203,
                      301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317];
            break;
        case 3:
            blockTypes = [101,
                      201, 202, 203,
                      301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319];
            break;
        default:
            //console.log("APELSERG.CONFIG.SET.Skill (getBlockType): " + APELSERG.CONFIG.SET.Skill);
            blockTypes = [101];
            break;
    }
    */

    return blockTypes[APELSERG.MODEL.GetRandomNumber(blockTypes.length)];
}

//===
// Сместить текущий блок по горизонтали
//===
APELSERG.MODEL.ShiftBlockColumn = function(block, num) {
    for (var x in block.cells) {
        for (var n in block.cells[x]) {
            block.cells[x][n].Col = block.cells[x][n].Col + num;
        }
    }
}

//===
// Сместить текущий блок по вертикали
//===
APELSERG.MODEL.ShiftBlockRow = function(block, num) {
    for (var x in block.cells) {
        for (var n in block.cells[x]) {
            block.cells[x][n].Row = block.cells[x][n].Row + num;
        }
    }
}

//===
// Сместить текущий блок
//===
APELSERG.MODEL.BlockShift = function(shiftType) {

    var nextBlock = APELSERG.MAIN.CloneObj(APELSERG.CONFIG.PROC.CurrentBlock);

    if (shiftType == 'LEFT') {

        APELSERG.MODEL.ShiftBlockColumn(nextBlock, -1);

        if (APELSERG.MODEL.CheckBlockCross(nextBlock)) {
            APELSERG.CONFIG.PROC.CurrentBlock = nextBlock;
        }
    }

    if (shiftType == 'RIGHT') {

        APELSERG.MODEL.ShiftBlockColumn(nextBlock, 1);

        if (APELSERG.MODEL.CheckBlockCross(nextBlock)) {
            APELSERG.CONFIG.PROC.CurrentBlock = nextBlock;
        }
    }

    //-- срабатывает по таймеру
    //--
    if (shiftType == 'DOWN') {

        APELSERG.MODEL.ShiftBlockRow(nextBlock, 1);

        if (APELSERG.MODEL.CheckBlockCross(nextBlock)) {
            APELSERG.CONFIG.PROC.CurrentBlock = APELSERG.MAIN.CloneObj(nextBlock);

            //-- будет "скользить" по нижнему блоку до следующего тика
            //--
            if (!APELSERG.CONFIG.SET.SlideToFloor) {

                APELSERG.MODEL.ShiftBlockRow(nextBlock, 1);

                if (!APELSERG.MODEL.CheckBlockCross(nextBlock)) {
                    APELSERG.MODEL.DropBlockToPool();
                    APELSERG.CONFIG.PROC.FastDownFlag = false;
                }
            }
        }
        else {
            APELSERG.MODEL.DropBlockToPool();
            APELSERG.CONFIG.PROC.FastDownFlag = false;
        }
    }

    if (shiftType == 'SPACE') {

        if (APELSERG.CONFIG.SET.FastDownUse) {
            //-- последовательный DOWN по таймеру, пока не будет достигнут "пол" (будет видно)
            //--
            APELSERG.CONFIG.PROC.FastDownFlag = true;
            window.clearTimeout(APELSERG.CONFIG.PROC.TimeoutID);
            APELSERG.MAIN.Animation(true); //-- запуск рабочего цикла
        }
        else {
            //-- последовательный DOWN виртуальный, пока не будет достигнут "пол" (не будет видно)
            //--
            while (true) {

                APELSERG.MODEL.ShiftBlockRow(nextBlock, 1);

                if (APELSERG.MODEL.CheckBlockCross(nextBlock)) {
                    APELSERG.CONFIG.PROC.CurrentBlock = APELSERG.MAIN.CloneObj(nextBlock);
                }
                else {
                    if (!APELSERG.CONFIG.SET.SlideToFloor) {
                        APELSERG.MODEL.DropBlockToPool();
                    }
                    break;
                }
            }
        }
    }

    if (shiftType == 'ROTATE_LEFT') {
        if (nextBlock.idx == 3) {
            nextBlock.idx = 0;
        }
        else {
            nextBlock.idx++;
        }
        if (APELSERG.MODEL.CheckBlockCross(nextBlock)) {
            APELSERG.CONFIG.PROC.CurrentBlock = nextBlock;
        }
    }

    if (shiftType == 'ROTATE_RIGHT') {
        if (nextBlock.idx == 0) {
            nextBlock.idx = 3;
        }
        else {
            nextBlock.idx--;
        }
        if (APELSERG.MODEL.CheckBlockCross(nextBlock)) {
            APELSERG.CONFIG.PROC.CurrentBlock = nextBlock;
        }
    }

    //-- заполненный ряд исчезнет только по следующему нажатию или таймеру (dropBlockToPool())
    //--
    if (APELSERG.CONFIG.SET.ShowFullRow) {
        APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPoolPrev);
        APELSERG.CONFIG.PROC.CellPoolPrev = APELSERG.MAIN.CloneObj(APELSERG.CONFIG.PROC.CellPool); //-- сохранить предыдущее состояние колодца (с заполненным рядом)
    }
    else {
        APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPool);
    }
}

//===
// Проверить что блок не пересекается с границами колодца и пулом накопившехся ячеек
//===
APELSERG.MODEL.CheckBlockCross = function(block) {

    var canShift = true;

    //-- проверить границы колодца
    //--
    for (var n in block.cells[block.idx]) {
        if (block.cells[block.idx][n].Col < 1 || block.cells[block.idx][n].Col > APELSERG.CONFIG.SET.WellColumn ||
            block.cells[block.idx][n].Row < 1 || block.cells[block.idx][n].Row > APELSERG.CONFIG.SET.WellRow) {
            canShift = false;
            break;
        }
    }

    //-- проверить границы пула
    //--
    if (canShift) {
        for (var n in block.cells[block.idx]) {
            for (var q in APELSERG.CONFIG.PROC.CellPool) {
                var cell = APELSERG.CONFIG.PROC.CellPool[q];
                if (block.cells[block.idx][n].Col == cell.Col && block.cells[block.idx][n].Row == cell.Row) {
                    canShift = false;
                    break;
                }
            }
            if (!canShift) {
                break;
            }
        }
    }

    return canShift;
}

//===
// Перенести блок в пул колодца
//===
APELSERG.MODEL.DropBlockToPool = function() {

    var block = APELSERG.CONFIG.PROC.CurrentBlock;

    var numRowDrops = 0;
    var pointsCell = (block.cells[block.idx].length * APELSERG.CONFIG.SET.Skill) + (APELSERG.CONFIG.SET.Level + 1);

    //-- Перенести блок в пул колодца
    //--
    for (var n in block.cells[block.idx]) {
        var cell = block.cells[block.idx][n];
        APELSERG.CONFIG.PROC.CellPool.push(new APELSERG.MODEL.Cell(cell.Row, cell.Col, cell.Color));
    }

    //-- заполненный ряд исчезнет только по следующему таймеру 
    //--
    if (APELSERG.CONFIG.SET.ShowFullRow) {
        APELSERG.CONFIG.PROC.CellPoolPrev = APELSERG.MAIN.CloneObj(APELSERG.CONFIG.PROC.CellPool);
    }

    //-- Удалить заполненные ряды
    //--
    while (true) {

        var currentRow = 0;

        //-- проверить ряды снизу
        //--
        for (currentRow = APELSERG.CONFIG.SET.WellRow; currentRow > 0; currentRow--) {

            var numCol = 0;

            for (var n in APELSERG.CONFIG.PROC.CellPool) {
                if (APELSERG.CONFIG.PROC.CellPool[n].Row == currentRow) {
                    numCol++;
                }
            }

            if (numCol == APELSERG.CONFIG.SET.WellColumn) {
                break; //-- найден заполненный ряд
            }
        }

        //-- если попался заполненный ряд - удалить
        //--
        if (currentRow > 0) {

            numRowDrops++;

            //-- убрать ряд
            //--
            var newCellPool = [];
            for (var n in APELSERG.CONFIG.PROC.CellPool) {
                if (APELSERG.CONFIG.PROC.CellPool[n].Row != currentRow) {
                    newCellPool.push(APELSERG.CONFIG.PROC.CellPool[n]);
                }
            }
            APELSERG.CONFIG.PROC.CellPool = newCellPool;

            //-- сдвинуть верхние ряды вниз
            //--
            for (var n in APELSERG.CONFIG.PROC.CellPool) {
                if (APELSERG.CONFIG.PROC.CellPool[n].Row < currentRow) {
                    APELSERG.CONFIG.PROC.CellPool[n].Row++;
                }
            }
        }
        else {
            break;
        }
    }

    //-- подсчёт очков
    //--
    APELSERG.CONFIG.PROC.Points = APELSERG.CONFIG.PROC.Points + (pointsCell + (numRowDrops * (APELSERG.CONFIG.SET.Skill + (APELSERG.CONFIG.SET.Level + 1))));

    //-- контроль уровня
    //--
    if ((APELSERG.CONFIG.PROC.Points >= (APELSERG.CONFIG.SET.LevelPointStep * (APELSERG.CONFIG.SET.Level + 1))) && (APELSERG.CONFIG.PROC.Points < (APELSERG.CONFIG.SET.LevelPointStep * (APELSERG.CONFIG.SET.Level + 2))) && APELSERG.CONFIG.SET.Level < 9) {
        APELSERG.CONFIG.SET.Level++;
    }

    //-- новый блок
    //--
    APELSERG.CONFIG.PROC.CurrentBlock = APELSERG.MODEL.GetNewBlock();
}
