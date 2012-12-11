﻿package languages{

	/**
	 * Class containing Russian string constants
	 * @author Alexander Kachkaev
	 * @version 2010/02/02
	 * @since 1.2
	 */
	public final class Language_RU extends Language_SHELL
	{
		/**
		 * Completes the array with language string constants
		 * @return	Array of string constants
		 */
		public static function getStrings():Array {
			
			// Language parameters
			addStrings('name','Русский');
			addStrings('release','2010/02/02');
			addStrings('about','');
			
			// Language translators
			// addAutor('Введте сюда своё имя','Введте сюда свой ID ВКонтакте');
			
			// Interface elements
			addInterfaceElem('menu_autor','Автор — Александр Качкаев');
			addInterfaceElem('l_app_title','ПОСТРОИТЕЛЬ\nГРАФИКОВ');
			addInterfaceElem('l_app_version','версия ');
			addInterfaceElem('h_info','Информация');
			addInterfaceElem('h_boundaries','Область построения');
			addInterfaceElem('h_color','Выбор цвета');
			
			addInterfaceElem('l_info','«Построитель графиков» незаметно обновился до версии 1.2 — теперь можно строить до 10 графиков одновременно! На очереди — сохранение графиков ВКонтакте и окно выбора цвета. ');
			addInterfaceElem('l_translator','Переводчик —');
			addInterfaceElem('l_ymax','ymax');
			addInterfaceElem('l_ymin','ymin');
			addInterfaceElem('l_xmax','xmax');
			addInterfaceElem('l_xmin', 'xmin');
			addInterfaceElem('l_n_of_points', 'Количество точек');
			addInterfaceElem('l_y_equals', 'y =');
			addInterfaceElem('l_saving', 'Сохранение инофрмации…');
			addInterfaceElem('l_error_load', 'Ошибка соединения с сервером ВКонтакте во время получения сохранённых графиков. Рекомендуется попробовать обновить страницу, чтобы увидеть свои графики. Обратите внимание, что все изменения, которые Вы сейчас сделаете, потеряются после закрытия окна браузера, если не перезагрузить страницу.');
			addInterfaceElem('l_error_save', 'Ошибка соединения с сервером ВКонтакте во время сохранения графиков. Изменения, которые Вы сейчас сделаете, потеряются после закрытия окна браузера. Рекомендуется обновить страницу и продолжить работать.');
			addInterfaceElem('l_autonomous_mode', 'Автономный режим');
			
			addInterfaceElem('b_plot', 'Построить');
			addInterfaceElem('b_plot', 'Остановить');
			addInterfaceElem('b_del','Удалить');
			addInterfaceElem('b_help','Справка');
			addInterfaceElem('b_group','Группа приложения');
			addInterfaceElem('b_report_an_error','Сообщить об ошибке');
			addInterfaceElem('b_add_graph','Добавить ещё один график');
			addInterfaceElem('b_add_app','Добавить приложение к себе на страницу');
			addInterfaceElem('b_add_friends','Пригласить друзей!');
			addInterfaceElem('b_apply','Применить');
			addInterfaceElem('b_random_color','Случайный цвет');
			addInterfaceElem('b_defaults','По умолчанию');
			addInterfaceElem('b_ok','ОК');
			addInterfaceElem('b_cancel','Отмена');
			addInterfaceElem('b_yes','Да');
			addInterfaceElem('b_no','Нет');
			addInterfaceElem('b_add','Добавить');
			
			addInterfaceElem('c_show_grid','Сетка');
			addInterfaceElem('c_show_axes','Координатные оси');
			
			
			// Errors in formula
			
			//// Common errors
			addFormulaError(0,'Неизвестная ошибка.');
			addFormulaError(1,'Формула отсутствует.');
			addFormulaError(2,'Формула слишком большая.');
			addFormulaError(3,'Встретился запрещенный символ <b>%2</b>.');
			
			//// Equals sign
			addFormulaError(10,'Формула должна содержать знак равенства.');
			addFormulaError(11,'Формула не должна содержать более одного знака равенства.');
			addFormulaError(12,'Знак равенства не должен находиться в самом начале формулы.');
			addFormulaError(13,'Знак равенства не должен находиться в самом конце формулы.');
			addFormulaError(14,'Знак равенства не должен находиться внутри скобок (число открывающихся скобок в левой части формулы меньше, чем число закрывающихся на %2). ');
			
			//// Brackets
			addFormulaError(20,'Лишняя закрывающаяся скобка. Закрывающихся скобок не может быть больше, чем открытых скобок до этого.');
			addFormulaError(21,'Открывающихся скобок больше, чем закрывающихся (на %2).');
			addFormulaError(22,'Открывающаяся скобка не должна быть сразу за закрывающейся, необходим знак арифметического действия.');
			addFormulaError(23,'Пустые скобки допустимы только после имени функции, не имеющей параметров.');
			
			//// Wrong elements / element placement
			addFormulaError(30,'<b>%2</b> не подлежит разбору.');
			addFormulaError(31,'Неизвестный аргумент/константа <b>%2</b>.');
			addFormulaError(32,'<b>%2</b> — неверный формат для числа.');
			addFormulaError(33,'Запятая может быть применима только во время перечисления аргументов функции.');
			addFormulaError(34,'Неизвестная функция <b>%2</b>.');
			addFormulaError(35,'Аргумент <b>%2</b> не может использоваться как функция.');
			addFormulaError(36,'Константа <b>%2</b> не может использоваться как функция.');
			addFormulaError(37,'После имени функции <b>%2</b> обязательны скобки.');
			addFormulaError(38,'Не хватает знака арифметического действия.');
			addFormulaError(39,'<b>%2</b> — слишком большое число.');
			
			//// Sign misplacement
			addFormulaError(40,'Недопустимое положение знака <b>%2</b>.');
			addFormulaError(41,'Знак <b>%2</b> не может стоять в самом конце выражения.');
			addFormulaError(42,'Знак <b>%2</b> не может стоять в самом начале выражения.');
			addFormulaError(43,'Знак <b>%2</b> не может стоять перед закрывающейся скобкой.');
			addFormulaError(44,'Знак <b>%2</b> не может стоять сразу после открывающейся скобки.');
			addFormulaError(45,'Знак <b>%2</b> не может стоять перед запятой.');
			addFormulaError(46,'Знак <b>%2</b> не может стоять полсе запятой.');
			addFormulaError(47,'Знак <b>%2</b> не может стоять после другого знака арифметического действия.');
			
			//// Arguments of a function
			addFormulaError(50,'Неверное число аргументов для функции <b>%2</b>.');
			addFormulaError(51,'Слишком много аргументов передано в функцию <b>%2</b>. Число аргументов должно быть от %3 до %4.');
			addFormulaError(52,'Слишком много аргументов передано в функцию <b>%2</b>. Число аргументов должно быть равно %3.');
			addFormulaError(53,'Функция <b>%2</b> не может содержать аргументов.');
			addFormulaError(54,'Недостаточно аргументов передано в функцию <b>%2</b>. Число аргументов должно быть больше %3.');
			addFormulaError(55,'Недостаточно аргументов передано в функцию <b>%2</b>. Число аргументов должно быть от %3 до %4.');
			addFormulaError(56,'Недостаточно аргументов передано в функцию <b>%2</b>. Число аргументов должно быть равно %3.');
			addFormulaError(57,'Между скобкой и запятой ожидался аргумент функци <b>%2</b>.');
			addFormulaError(58,'После запятой ожидался аргумент функции <b>%2</b>.');
			
			//// Different errors for functions
			addError('wrong_bound','Поле <b>%0</b> должно содержать число, это число обязано быть в диапазоне<br/>от -%1 до %1.');
			addError('wrong_number_of_dots','Поле с количеством точек построения должно содержать целое число, это число обязано быть в диапазоне<br/>от %0 до %1.');
			addError('small_range','<b>%1</b> должен быть больше <b>%0</b>, минимальная разница должна быть равна %2.');
			addError('y_in_f','<b>Y</b> не может присутствовать в качестве параметра функции. Допустимо использование только <b>x</b>.');
			addError('x_rus',' Подсказка: чтобы обозначить аргумент икс, следует использовать латинскую <b>x</b>.');
			addError('vertical_slash',' Подсказка: для построения модуля следует использовать функцию <b>abs</b>, например, abs(x).');
			addError('comma',' Подсказка: для разделения целой и дробной части у чисел, следует использовать точку, например, 3.14.');
			addError('log_ln',' Подсказка: В этой версии натуральный логарифм<br/>обозначается как <b>ln</b>.');
			addError('equal_presents','Второй знак <b>=</b> не может присутствовать в задающим функцию выражении.');
			addError('func_name_hint',' Подсказка: Чтобы построить %0, следует использовать функцию <b>%1</b>.');
			
			addInterfaceElem('cap_f_empty','Введите функцию в поле ввода снизу для построения<br/>её графика.');
			addInterfaceElem('cap_f_param_error','Ошибка в свойствах<br>области построения');
			addInterfaceElem('cap_f_error','Ошибка в функции');
			
			
			/**
			 * === No need to translate this block ===
			 *
			
			addFormula('sin','синус','возвращает синус аргумента','любое действительное число');
			addFormula('cos','косинус','возвращает косинус аргумента','любое действительное число');
			addFormula('tg','тангенс','возвращает тангенс аргумента','любое действительное число, кроме π/2+2π*N');
			addFormula('ctg','котангенс','возвращает котангенс аргумента','любое действительное число, кроме 2π*N');
			//asin
			addFormula('arcsin','арксинус','возвращает арксинус аргумента (число в диапазоне (-π/2; π/2))','действительное число [-1;1]');
			//acos
			addFormula('arccos','арккосинус','возвращает арккосинус аргумента (число в диапазоне (0; π))','действительное число [-1;1]');
			//arctan
			addFormula('arctg','арктангенс','возвращает арктангенс аргумента (число в диапазоне (-π/2; π/2))','действительное число [-1;1]');
			//arcctan
			addFormula('arcсtg','арккотангенс','возвращает арккотангенс аргумента (число в диапазоне (0; π))','действительное число [-1;1]');
			
			addFormula('pow','возведение в степень','возвращает значение первого аргумента, возведенное в степень, равную значению второго аргумента','основание','степень');
			addFormula('sqrt','возведение в квадрат','возвращает значение аргумента, возведенное во вторую степень','основание - любое действительное число');
			addFormula('abs','модуль','возвращает абсолютное значение аргумента','любое действительное число');
			//rnd
			addFormula('round','округление до ближайшего целого','возвращает целое число: если дробная часть аргумента больше или равна 0.5, результат - большее число, иначе - меньшее','любое действительное число');
			//trunc
			addFormula('floor','округление вниз','возвращает ближайшее целое число, меньшее или равное значению аргумента','любое действительное число');
			addFormula('ceil','округление вверх','возвращает ближайшее целое число, большее или равное значению аргумента','любое действительное число');
			
			addConstant('PI','константа π','≈3.141 592 653');
			addConstant('EXP','константа e','≈2.718 281 828');
			*/
			
			// Return the array of string constants
			return r;
		}
	}
}