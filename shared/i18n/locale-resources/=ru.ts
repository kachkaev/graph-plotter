/* eslint-disable @typescript-eslint/naming-convention */
export const ruLocalResource = {
  translation: {
    // Interface elements
    "ui.menu_autor": "Автор — Александр Качкаев",
    "ui.l_app_title_1": "Построитель",
    "ui.l_app_title_2": "графиков",
    "ui.l_app_version": "версия ",
    "ui.h_info": "Об этом приложении",
    "ui.h_boundaries": "Область построения",
    "ui.h_graphs": "Мои графики",
    "ui.h_color": "Выбор цвета",

    "ui.l_info_1":
      "Построитель графиков позволяет мгновенно строить десятки графиков функций одновременно.",
    "ui.l_info_2": "Если тебе понравилось это приложение, приглашай друзей!",
    "ui.l_translator": "Переводчик —",
    "ui.l_ymax": "ymax",
    "ui.l_ymin": "ymin",
    "ui.l_xmax": "xmax",
    "ui.l_xmin": "xmin",
    "ui.l_n_of_points": "Количество точек",
    "ui.l_y_equals": "y = ",
    "ui.l_saving": "Сохранение инофрмации…",
    "ui.l_error_load":
      "Ошибка соединения с сервером ВКонтакте во время получения сохранённых графиков. Рекомендуется попробовать обновить страницу, чтобы увидеть свои графики. Обратите внимание, что все изменения, которые Вы сейчас сделаете, потеряются после закрытия окна браузера, если не перезагрузить страницу.",
    "ui.l_error_save":
      "Ошибка соединения с сервером ВКонтакте во время сохранения графиков. Изменения, которые Вы сейчас сделаете, потеряются после закрытия окна браузера. Рекомендуется обновить страницу и продолжить работать.",
    "ui.l_autonomous_mode": "Автономный режим",

    "ui.b_plot": "Построить",
    "ui.b_stop": "Остановить",
    "ui.b_del": "Удалить",
    "ui.b_help": "Справка",
    "ui.b_group": "Группа приложения",
    "ui.b_report_an_error": "Сообщить об ошибке",
    "ui.b_extra": "Поучаствуй в клёвом исследовании!",
    "ui.b_add_graph": "Добавить ещё один график",
    "ui.b_add_app": "Добавить приложение к себе на страницу",
    "ui.b_add_friends": "Пригласить друзей!",
    "ui.b_apply": "Применить",
    "ui.b_random_color": "Случайный цвет",
    "ui.b_defaults": "По умолчанию",
    "ui.b_ok": "ОК",
    "ui.b_cancel": "Отмена",
    "ui.b_yes": "Да",
    "ui.b_no": "Нет",
    "ui.b_add": "Добавить",

    "ui.c_show_grid": "Сетка",
    "ui.c_show_axes": "Координатные оси",

    "ui.cap_f_empty":
      "Введите функцию в поле ввода снизу для построения её графика.",
    "ui.cap_f_param_error": "Ошибка в свойствах области построения",
    "ui.cap_f_error": "Ошибка в функции",

    // Errors in formula

    // // Common errors
    "error.formula.0": "Неизвестная ошибка.",
    "error.formula.1": "Формула отсутствует.",
    "error.formula.2": "Формула слишком большая.",
    "error.formula.3": "Встретился запрещенный символ <0>{2}</0>.",

    // // Equals sign
    "error.formula.10": "Формула должна содержать знак равенства.",
    "error.formula.11":
      "Формула не должна содержать более одного знака равенства.",
    "error.formula.12":
      "Знак равенства не должен находиться в самом начале формулы.",
    "error.formula.13":
      "Знак равенства не должен находиться в самом конце формулы.",
    "error.formula.14":
      "Знак равенства не должен находиться внутри скобок (число открывающихся скобок в левой части формулы меньше, чем число закрывающихся на {2}). ",

    // // Brackets
    "error.formula.20":
      "Лишняя закрывающаяся скобка. Закрывающихся скобок не может быть больше, чем открытых скобок до этого.",
    "error.formula.21":
      "Открывающихся скобок больше, чем закрывающихся (на {2}).",
    "error.formula.22":
      "Открывающаяся скобка не должна быть сразу за закрывающейся, необходим знак арифметического действия.",
    "error.formula.23":
      "Пустые скобки допустимы только после имени функции, не имеющей параметров.",

    // // Wrong elements / element placement
    "error.formula.30": "<0>{2}</0> не подлежит разбору.",
    "error.formula.31": "Неизвестный аргумент/константа <0>{2}</0>.",
    "error.formula.32": "<0>{2}</0> — неверный формат для числа.",
    "error.formula.33":
      "Запятая может быть применима только во время перечисления аргументов функции.",
    "error.formula.34": "Неизвестная функция <0>{2}</0>.",
    "error.formula.35":
      "Аргумент <0>{2}</0> не может использоваться как функция.",
    "error.formula.36":
      "Константа <0>{2}</0> не может использоваться как функция.",
    "error.formula.37": "После имени функции <0>{2}</0> обязательны скобки.",
    "error.formula.38": "Не хватает знака арифметического действия.",
    "error.formula.39": "<0>{2}</0> — слишком большое число.",

    // // Sign misplacement
    "error.formula.40": "Недопустимое положение знака <0>{2}</0>.",
    "error.formula.41":
      "Знак <0>{2}</0> не может стоять в самом конце выражения.",
    "error.formula.42":
      "Знак <0>{2}</0> не может стоять в самом начале выражения.",
    "error.formula.43":
      "Знак <0>{2}</0> не может стоять перед закрывающейся скобкой.",
    "error.formula.44":
      "Знак <0>{2}</0> не может стоять сразу после открывающейся скобки.",
    "error.formula.45": "Знак <0>{2}</0> не может стоять перед запятой.",
    "error.formula.46": "Знак <0>{2}</0> не может стоять полсе запятой.",
    "error.formula.47":
      "Знак <0>{2}</0> не может стоять после другого знака арифметического действия.",

    // // Arguments of a function
    "error.formula.50": "Неверное число аргументов для функции <0>{2}</0>.",
    "error.formula.51":
      "Слишком много аргументов передано в функцию <0>{2}</0>. Число аргументов должно быть от {3} до {4}.",
    "error.formula.52":
      "Слишком много аргументов передано в функцию <0>{2}</0>. Число аргументов должно быть равно {3}.",
    "error.formula.53": "Функция <0>{2}</0> не может содержать аргументов.",
    "error.formula.54":
      "Недостаточно аргументов передано в функцию <0>{2}</0>. Число аргументов должно быть больше {3}.",
    "error.formula.55":
      "Недостаточно аргументов передано в функцию <0>{2}</0>. Число аргументов должно быть от {3} до {4}.",
    "error.formula.56":
      "Недостаточно аргументов передано в функцию <0>{2}</0>. Число аргументов должно быть равно {3}.",
    "error.formula.57":
      "Между скобкой и запятой ожидался аргумент функци <0>{2}</0>.",
    "error.formula.58": "После запятой ожидался аргумент функции <0>{2}</0>.",

    // // Different errors for functions
    "error.wrong_bound":
      "Поле <0>{0}</0> должно содержать число, это число обязано быть в диапазоне <1>от -{1} до {1}.</1>",
    "error.wrong_number_of_points":
      "Поле с количеством точек построения должно содержать целое число, это число обязано быть в диапазоне от <1>{0} до {1}.</1>",
    "error.small_range":
      "<0>{1}</0> должен быть больше <0>{0}</0>, минимальная разница должна быть равна {2}.",
    "error.y_in_f":
      "<0>Y</0> не может присутствовать в качестве параметра функции. Допустимо использование только <0>x</0>.",
    "error.x_rus":
      " Подсказка: чтобы обозначить аргумент икс, следует использовать латинскую <0>x</0>.",
    "error.vertical_slash":
      " Подсказка: для построения модуля следует использовать функцию <0>abs</0>, например, abs(x).",
    "error.comma":
      " Подсказка: для разделения целой и дробной части у чисел, следует использовать точку, например, 3.14.",
    "error.log_ln":
      " Подсказка: В этой версии натуральный логарифм обозначается как <0>ln</0>.",
    "error.equal_presents":
      "Второй знак <0>=</0> не может присутствовать в задающим функцию выражении.",
    "error.func_name_hint":
      " Подсказка: Чтобы построить {0}, следует использовать функцию <0>{1}</0>.",
  },
};