// ============================
// Разработчик: apelserg ; https://github.com/apelserg/
// Лицензия: WTFPL
// ============================

"use strict";

APELSERG.CONFIG.SET.Version = "0.1.0"
APELSERG.CONFIG.SET.LocalStorageName = "APELSERG-TetrPlain";

APELSERG.CONFIG.SET.CellSize = 20; //-- размер базового объекта (кубика) (в пикселях)

APELSERG.CONFIG.SET.WellColumn = 5; //-- 5, 10, 15 -- ширина колодца (в базовых объектах)
APELSERG.CONFIG.SET.WellRow = 20; //-- 15, 20, 25 -- глубина колодца (в базовых объектах)

APELSERG.CONFIG.SET.LevelTick = [2000, 1800, 1600, 1400, 1200, 1000, 800, 600, 400, 200];
APELSERG.CONFIG.SET.LevelPointStep = 300; //-- 50; 
APELSERG.CONFIG.SET.LevelStart = 4; //-- 0 - 9
APELSERG.CONFIG.SET.Level = 0; //-- 0 - 9
APELSERG.CONFIG.SET.Skill = 3; //-- 1, 2, 3

APELSERG.CONFIG.SET.UserName = "Noname";
APELSERG.CONFIG.SET.Lang = "EN"; //-- RU

//-- Настройка визуальных эффектов
//--
//-- показать заполненный ряд перед удалением
//-- при установленном APELSERG.CONFIG.SET.FastDownUse = true - не эффективно из-за короткого тайаута
//-- лучшее значение для восприятия игры - false
//--
APELSERG.CONFIG.SET.ShowFullRow = false; 

//-- после достижения пола - скользить или прилипнуть (на низком уровне даёт задержку до появления следующего блока)
//-- при установленном APELSERG.CONFIG.SET.FastDownUse = true - не эффективно из-за короткого тайаута
//-- лучшее значение для восприятия игры - false
//--
APELSERG.CONFIG.SET.SlideToFloor = false;

//-- использовать последовательный DOWN, пока не будет достигнут "пол"
//-- блок будет визуально "скользить" вниз
//--
APELSERG.CONFIG.SET.FastDownUse = false;

APELSERG.CONFIG.SET.ShowNextBlock = true; //-- показывать следующий блок (срабатывает по <B>)
APELSERG.CONFIG.SET.ShowNet = false; //-- показывать сетку  (срабатывает по <N>)
APELSERG.CONFIG.SET.ShowResult = false; //-- показывать очки  (срабатывает по <V>)
APELSERG.CONFIG.SET.ShowInfo = false; //-- показывать панель INFO  (срабатывает по <I>)


APELSERG.CONFIG.KEY.Space = 32;
APELSERG.CONFIG.KEY.Pause = 80;

APELSERG.CONFIG.KEY.ShowNextBlock = 66;
APELSERG.CONFIG.KEY.ShowNet = 78;
APELSERG.CONFIG.KEY.ShowResult = 86;

APELSERG.CONFIG.KEY.Left = 37;
APELSERG.CONFIG.KEY.Right = 39;
APELSERG.CONFIG.KEY.RotateLeft = 38;
APELSERG.CONFIG.KEY.RotateRight = 40;

APELSERG.CONFIG.PROC.NextBlock;
APELSERG.CONFIG.PROC.CurrentBlock;
APELSERG.CONFIG.PROC.CellPool = [];
APELSERG.CONFIG.PROC.CellPoolPrev = []; //-- используется только для показа заполненного ряда перед удалением (для флага APELSERG.CONFIG.SET.ShowFullRow)
APELSERG.CONFIG.PROC.Points = 0;

APELSERG.CONFIG.PROC.GameStop = true;
APELSERG.CONFIG.PROC.GamePause = true;
APELSERG.CONFIG.PROC.UiSettings = false; //-- для синхронизации интерфейса и режима игры
APELSERG.CONFIG.PROC.UiPoints = false; //-- для синхронизации интерфейса и режима игры
APELSERG.CONFIG.PROC.UiHelp = false; //-- для синхронизации интерфейса и режима игры

APELSERG.CONFIG.PROC.TimeoutID = 0; //-- для управления таймером
APELSERG.CONFIG.PROC.FastDownFlag = false; //-- для управления таймером если APELSERG.CONFIG.SET.FastDownUse = true
APELSERG.CONFIG.PROC.LoadFromWeb = false; //-- HTML загружен с сети или локального диска (надо для сохранения результатов и конфигурации)


APELSERG.CONFIG.WELL.CanvaID;
APELSERG.CONFIG.WELL.Ctx;

APELSERG.CONFIG.INFO.CanvaID;
APELSERG.CONFIG.INFO.Ctx;


APELSERG.CONFIG.RESULT.Best = [];

//===
// Получить имя хранения конфигурации
//===
APELSERG.CONFIG.GetLocalStorageConfigName = function () {
    return APELSERG.CONFIG.SET.LocalStorageName + "-Config-" + APELSERG.CONFIG.SET.Version;
}

//===
// Получить имя хранения результатов
//===
APELSERG.CONFIG.GetLocalStorageResultName = function () {
    return APELSERG.CONFIG.SET.LocalStorageName + "-Results";
}

//===
// Получить результаты
//===
APELSERG.CONFIG.GetResultOnLoad = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

        //-- восстановить результаты из хранилища
        //--
        if (localStorage[resultName] !== undefined) {

            APELSERG.CONFIG.RESULT.Best = JSON.parse(localStorage[resultName]);
        }
    }
}

//===
// Получить конфигурацию
//===
APELSERG.CONFIG.GetConfigOnLoad = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var configName = APELSERG.CONFIG.GetLocalStorageConfigName();

        //-- восстановить конфигурацию из хранилища
        //--
        if (localStorage[configName] !== undefined) {

            APELSERG.CONFIG.SET = JSON.parse(localStorage[configName]);
        }
    }
}

//===
// Сохранить результат
//===
APELSERG.CONFIG.SetResult = function () {

    if (APELSERG.CONFIG.PROC.LoadFromWeb) {

        var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

        var dateCurrent = new Date();
        var dateCurrentStr = dateCurrent.toJSON().substring(0, 10);

        var resultCurrent = {};
        resultCurrent.Name = APELSERG.CONFIG.SET.UserName;
        resultCurrent.Points = APELSERG.CONFIG.PROC.Points;
        resultCurrent.Date = dateCurrentStr;

        APELSERG.CONFIG.RESULT.Best.push(resultCurrent);

        //-- выбрать лучшие результаты (10)
        //--
        var topBest = [];
        var cntBest = 0;
        while (true) {
            var maxValue = 0;
            var maxIdx = -1;
            for (var n in APELSERG.CONFIG.RESULT.Best) {
                if (APELSERG.CONFIG.RESULT.Best[n] !== undefined) {
                    if (APELSERG.CONFIG.RESULT.Best[n].Points >= maxValue) {
                        maxValue = APELSERG.CONFIG.RESULT.Best[n].Points;
                        maxIdx = n;
                    }
                }
            }
            if (maxIdx >= 0) {
                topBest.push(APELSERG.CONFIG.RESULT.Best[maxIdx]);
                APELSERG.CONFIG.RESULT.Best.splice(maxIdx, 1);
                cntBest++;
            }
            if (cntBest >= 10 || maxIdx < 0) {
                break;
            }
        }
        APELSERG.CONFIG.RESULT.Best = topBest;
        localStorage[resultName] = JSON.stringify(APELSERG.CONFIG.RESULT.Best);
    }
}

//===
// Сброс результата
//===
APELSERG.CONFIG.ResetResult = function () {

    var resultName = APELSERG.CONFIG.GetLocalStorageResultName();

    localStorage.removeItem(resultName);

    APELSERG.CONFIG.RESULT.Best = [];

    if (APELSERG.CONFIG.PROC.UiPoints) {
        APELSERG.UI.ShowPoints();
    }
}

//===
// Сброс конфигурации
//===
APELSERG.CONFIG.ResetConfig = function () {

    var configName = APELSERG.CONFIG.GetLocalStorageConfigName();

    localStorage.removeItem(configName);

    if (APELSERG.CONFIG.PROC.UiSettings) {
        APELSERG.UI.ShowSettings();
    }

    document.getElementById('APELSERG_DivCanvas').innerHTML = APELSERG.LANG.GetText('RELOAD_PAGE');
}
