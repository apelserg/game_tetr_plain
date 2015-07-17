// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

//-- Глобальные переменные
//--

var APELSERG = {};

APELSERG.MAIN = {};
APELSERG.MODEL = {};
APELSERG.CANVA = {};
APELSERG.UI = {};
APELSERG.LANG = {};
APELSERG.CONFIG = {};
APELSERG.CONFIG.SET = {};
APELSERG.CONFIG.KEY = {};
APELSERG.CONFIG.PROC = {};
APELSERG.CONFIG.WELL = {};
APELSERG.CONFIG.INFO = {};
APELSERG.CONFIG.RESULT = {};

//===
// старт программы (начальная прорисовка)
//===
APELSERG.MAIN.OnLoad = function () {

    //-- определить место загрузки
    //--
    window.location.protocol == "file:" ? APELSERG.CONFIG.PROC.LoadFromWeb = false : APELSERG.CONFIG.PROC.LoadFromWeb = true;

    APELSERG.CONFIG.GetConfigOnLoad();
    APELSERG.CONFIG.GetResultOnLoad();

    if (APELSERG.CONFIG.SET.ShowInfo) {
        document.getElementById("APELSERG_DivCanvas").innerHTML = "<canvas id='APELSERG_CanvasTetr'></canvas> <canvas id='APELSERG_CanvasInfo'></canvas>";
    }
    else {
        document.getElementById("APELSERG_DivCanvas").innerHTML = "<canvas id='APELSERG_CanvasTetr'></canvas>";
    }

    //-- сперва канва
    //--
    APELSERG.CONFIG.WELL.CanvaID = document.getElementById('APELSERG_CanvasTetr');
    APELSERG.CONFIG.WELL.Ctx = APELSERG.CONFIG.WELL.CanvaID.getContext('2d');
    APELSERG.CONFIG.WELL.CanvaID.width = APELSERG.CONFIG.SET.WellColumn * APELSERG.CONFIG.SET.CellSize;
    APELSERG.CONFIG.WELL.CanvaID.height = APELSERG.CONFIG.SET.WellRow * APELSERG.CONFIG.SET.CellSize;

    if (APELSERG.CONFIG.SET.ShowInfo) {
        APELSERG.CONFIG.INFO.CanvaID = document.getElementById('APELSERG_CanvasInfo');
        APELSERG.CONFIG.INFO.Ctx = APELSERG.CONFIG.INFO.CanvaID.getContext('2d');
        APELSERG.CONFIG.INFO.CanvaID.width = APELSERG.CONFIG.SET.WellColumn * APELSERG.CONFIG.SET.CellSize;
        APELSERG.CONFIG.INFO.CanvaID.height = APELSERG.CONFIG.SET.WellRow * APELSERG.CONFIG.SET.CellSize;
    }

    //-- потом настройки
    //--
    APELSERG.CONFIG.SET.Level = APELSERG.CONFIG.SET.LevelStart;
    APELSERG.CONFIG.PROC.CurrentBlock = APELSERG.MODEL.GetBlock();
    APELSERG.CONFIG.PROC.NextBlock = APELSERG.MODEL.GetBlock();
    APELSERG.CONFIG.PROC.CellPool = [];

    APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPool);
}

//===
// Клонировать объект
//===
APELSERG.MAIN.CloneObj = function (object) {
    return JSON.parse(JSON.stringify(object));
}

//===
// Обработка нажатий клавиш
//===
window.addEventListener('keydown', function (event) {

    //-- предотвратить срабатывание при "всплытии" клика
    //--
    document.getElementById("APELSERG_InputSettings").blur();
    document.getElementById("APELSERG_InputPoints").blur();
    document.getElementById("APELSERG_InputHelp").blur();

    if (event.keyCode == APELSERG.CONFIG.KEY.Space) {
        APELSERG.MAIN.Start();
    }
    if (event.keyCode == APELSERG.CONFIG.KEY.Pause) {
        APELSERG.MAIN.Pause();
    }    
    if (event.keyCode == APELSERG.CONFIG.KEY.ShowNextBlock) {
        APELSERG.CONFIG.SET.ShowNextBlock = !APELSERG.CONFIG.SET.ShowNextBlock;
        APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPool);
    }
    if (event.keyCode == APELSERG.CONFIG.KEY.ShowNet) {
        APELSERG.CONFIG.SET.ShowNet = !APELSERG.CONFIG.SET.ShowNet;
        APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPool);
    }
    if (event.keyCode == APELSERG.CONFIG.KEY.ShowResult) {
        APELSERG.CONFIG.SET.ShowResult = !APELSERG.CONFIG.SET.ShowResult;
        APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPool);
    }
    if (!APELSERG.CONFIG.PROC.GameStop && !APELSERG.CONFIG.PROC.GamePause) {
        if (event.keyCode == APELSERG.CONFIG.KEY.Left) {
            APELSERG.MODEL.BlockShift('LEFT');
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.Right) {
            APELSERG.MODEL.BlockShift('RIGHT');
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RotateLeft) {
            APELSERG.MODEL.BlockShift('ROTATE_LEFT');
        }
        if (event.keyCode == APELSERG.CONFIG.KEY.RotateRight) {
            APELSERG.MODEL.BlockShift('ROTATE_RIGHT');
        }
    }
});

//===
// Старт
//===
APELSERG.MAIN.Start = function () {

    //-- закрыть окна (если открыты - должны закрыться)
    //--
    if (APELSERG.CONFIG.PROC.UiSettings) {
        APELSERG.UI.ShowSettings();
    }
    if (APELSERG.CONFIG.PROC.UiPoints) {
        APELSERG.UI.ShowPoints();
    }
    if (APELSERG.CONFIG.PROC.UiHelp) {
        APELSERG.UI.ShowHelp();
    }

    //-- обработать "пробел"
    //--
    if (!APELSERG.CONFIG.PROC.UiSettings && !APELSERG.CONFIG.PROC.UiPoints && !APELSERG.CONFIG.PROC.UiHelp) {

        if (APELSERG.CONFIG.PROC.GameStop) {

            //-- новая игра - инициализация
            //--
            APELSERG.CONFIG.PROC.GameStop = false;
            APELSERG.CONFIG.PROC.GamePause = false;

            APELSERG.CONFIG.PROC.CellPoolPrev = [];
            APELSERG.CONFIG.PROC.CellPool = []; //-- !!! перед getNewBlock()
            APELSERG.CONFIG.PROC.CurrentBlock = APELSERG.MODEL.GetNewBlock();

            APELSERG.CONFIG.PROC.Points = 0;
            APELSERG.CONFIG.SET.Level = APELSERG.CONFIG.SET.LevelStart;

            APELSERG.MAIN.Animation(false); //-- запуск рабочего цикла
        }
        else {
            if (APELSERG.CONFIG.PROC.GamePause) {
                APELSERG.CONFIG.PROC.GamePause = false; //-- отмена паузы
                APELSERG.MAIN.Animation(false); //-- запуск рабочего цикла
            }
            else {
                APELSERG.MODEL.BlockShift('SPACE');
            }
        }
    }
}

//===
// Пауза
//===
APELSERG.MAIN.Pause = function () {
    if (!APELSERG.CONFIG.PROC.GameStop) {
        if (APELSERG.CONFIG.PROC.GamePause) {
            APELSERG.CONFIG.PROC.GamePause = false;
            APELSERG.MAIN.Animation(false); //-- запуск рабочего цикла
        }
        else {
            APELSERG.CONFIG.PROC.GamePause = true;
            window.clearTimeout(APELSERG.CONFIG.PROC.TimeoutID); //-- отмена срабатывания
            APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPool);
        }
    }
}

//===
// Рабочий цикл таймера
//===
APELSERG.MAIN.Animation = function (makeStep) {

    if (makeStep) {
        APELSERG.MODEL.BlockShift('DOWN'); //-- !!! окончание игры срабатывает здесь - устанавливается флаг при получении нового блока
    }

    APELSERG.CANVA.WellRewrite(APELSERG.CONFIG.PROC.CellPool);

    if (!APELSERG.CONFIG.PROC.GameStop && !APELSERG.CONFIG.PROC.GamePause) {
        APELSERG.MAIN.RequestAnimationFrame(function () {
            APELSERG.MAIN.Animation(true);
        });
    }
}

//===
// Таймер с функцией callback
//===
APELSERG.MAIN.RequestAnimationFrame = function (callback) {
    if (APELSERG.CONFIG.PROC.FastDownFlag) { //-- сброс как последовательный DOWN
        APELSERG.CONFIG.PROC.TimeoutID = window.setTimeout(callback, 10);
    }
    else {
        APELSERG.CONFIG.PROC.TimeoutID = window.setTimeout(callback, APELSERG.CONFIG.SET.LevelTick[APELSERG.CONFIG.SET.Level]);
    }
}
