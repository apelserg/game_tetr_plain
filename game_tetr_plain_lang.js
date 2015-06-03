"use strict";

//===
// Получить текст на выбранном языке
//===
APELSERG.LANG.GetText = function (keyText) {

    if (APELSERG.CONFIG.SET.Lang == "EN") {
        if (keyText == "YES") return "Yes";
        if (keyText == "NO") return "No";
        if (keyText == "CANCEL") return "Cancel";
        if (keyText == "STOP") return "STOP";
        if (keyText == "PAUSE") return "PAUSE";
        if (keyText == "SAVE") return "Save";
        if (keyText == "RESET") return "Reset";
        if (keyText == "RELOAD_PAGE") return "Reload page";
        if (keyText == "NO_DATA") return "No data";
        if (keyText == "P:OINT") return "P: ";
        if (keyText == "L:EVEL") return "L: ";
        if (keyText == "S:KILL") return "S: ";
        if (keyText == "NO_DATA") return "No data";
        if (keyText == "LABEL_NAME") return "Name";
        if (keyText == "LABEL_LANG") return "Lang";
        if (keyText == "LABEL_WIDTH") return "Width";
        if (keyText == "LABEL_HEIGHT") return "Height";
        if (keyText == "LABEL_LEVEL") return "Level";
        if (keyText == "LABEL_SKILL") return "Skill";
        if (keyText == "LABEL_CELL_SIZE") return "Cell";
        if (keyText == "LABEL_INFO") return "Info";
        return "== ? EN ? ==";
    }

    if (APELSERG.CONFIG.SET.Lang == "RU") {
        if (keyText == "YES") return "Да";
        if (keyText == "NO") return "Нет";
        if (keyText == "CANCEL") return "Отмена";
        if (keyText == "STOP") return "СТОП";
        if (keyText == "PAUSE") return "ПАУЗА";
        if (keyText == "SAVE") return "Сохранить";
        if (keyText == "RESET") return "Сбросить";
        if (keyText == "RELOAD_PAGE") return "Перегрузите страницу";
        if (keyText == "NO_DATA") return "Нет данных";
        if (keyText == "P:OINT") return "О: ";
        if (keyText == "L:EVEL") return "У: ";
        if (keyText == "S:KILL") return "С: ";
        if (keyText == "NO_DATA") return "Нет данных";
        if (keyText == "LABEL_NAME") return "Имя";
        if (keyText == "LABEL_LANG") return "Язык";
        if (keyText == "LABEL_WIDTH") return "Ширина";
        if (keyText == "LABEL_HEIGHT") return "Глубина";
        if (keyText == "LABEL_LEVEL") return "Уровень";
        if (keyText == "LABEL_SKILL") return "Сложность";
        if (keyText == "LABEL_CELL_SIZE") return "Блок";
        if (keyText == "LABEL_INFO") return "Инфо";
        return "== ? RU ? ==";
    }

    return "== ? No lang ? ==";
}


//===
// Получить помощь на выбранном языке
//===
APELSERG.LANG.GetHelp = function () {

    if (APELSERG.CONFIG.SET.Lang == "EN") {

        return "" +
            "<h3>Game</h3>" +
            "<pre>" +
            "Start - [space] <br/>" +
            "Stop - filling the well, page reload <br/>" +
            "Pause - [P] <br/>" +
            "Cancel pause - [P], [space] <br/>" +
            "Show/hide next block  - [B] <br/>" +
            "Show/hide net - [N] <br/>" +
            "Show/hide best results - [V] <br/>" +
            "Throw block - [space] <br/>" +
            "Move/rotate block - [arrows] <br/>" +
            "Full screen mode on/off - [F11] for most browsers <br/>" +
            "</pre>" +
            "" +
            "<h3>Top buttons</h3>" +
            "<pre>" +
            "Settings, Best results, Help <br/>" +
            "Available when [Stop] <br/>" +
            "Press [space] - windows closed, game begins <br/>" +
            "When you save the settings - also saved [B],[N],[V] <br/>" +
            "</pre>" +
            "" +
            "<h3>Offline mode</h3>" +
            "<pre>" +
            "Load from web server - Offline mode must be already installed <br/>" +
            "Load from local disk - does not work save the settings and results <br/>" +
            "</pre>" +
            "" +
            "<h3>Problems</h3>" +
            "<pre>" +
            "1. Update your browser to the latest version <br/>" +
            "2. Try a different browser <br/>" +
            "</pre>";

    }

    if (APELSERG.CONFIG.SET.Lang == "RU") {
        return "" +
            "<h3>Игра</h3>" +
            "<pre>" +
            "Старт - [пробел] <br/>" +
            "Стоп - заполнение колодца, перезагрузка страницы <br/>" +
            "Пауза - [P] <br/>" +
            "Отменить паузу - [P], [пробел] <br/>" +
            "Показать/скрыть следующий блок  - [B] <br/>" +
            "Показать/скрыть сетку - [N] <br/>" +
            "Показать/скрыть лучшие результаты - [V] <br/>" +
            "Сброс блока - [пробел] <br/>" +
            "Перемещение/вращение блока - [стрелки] <br/>" +
            "Полноэкранный режим вкл/выкл - [F11] для большинства браузеров <br/>" +
            "</pre>" +
            "" +
            "<h3>Кнопки сверху</h3>" +
            "<pre>" +
            "Настройка, 10 лучших результатов, Подсказка <br/>" +
            "Доступны в режиме [Стоп] <br/>" +
            "При нажатии [пробел] - окна закрываются, начинается игра <br/>" +
            "При сохранении настроек - сохраняются установки [B],[N],[V] <br/>" +
            "</pre>" +
            "" +
            "<h3>Автономная работа</h3>" +
            "<pre>" +
            "С веб-сервера - автономный режим должен быть уже установлен <br/>" +
            "С локального диска - не работает сохранение настроек и результатов <br/>" +
            "</pre>" +
            "" +
            "<h3>Проблемы</h3>" +
            "<pre>" +
            "1. Обновить браузер до последней версии <br/>" +
            "2. Попробовать другой браузер <br/>" +
            "</pre>";
    }

    return "== ? No help ? ==";
}
