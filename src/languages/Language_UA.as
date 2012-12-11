package languages{

	/**
	 * Class containing Ukrainian string constants
	 * @author Dmytriy Rubanov
	 * @version 2010/02/22
	 * @since 1.2
	 */
	public final class Language_UA extends Language_SHELL
	{
		/**
		 * Completes the array with language string constants
		 * @return	Array of string constants
		 */
		public static function getStrings():Array {
			
			// Language parameters
			addStrings('id','ua');
			addStrings('name','Українська');
			addStrings('release','2010/02/17');
			addStrings('about','');
			
			// Language translators
			clearAutors();
			addAutor('Дмитро Рубанов','id17483226');
			
			// Interface elements
			addInterfaceElem('menu_autor','Автор — Александр Качкаев');
			addInterfaceElem('l_app_title','БУДІВНИК\nГРАФІКІВ');
			addInterfaceElem('l_app_version','версія ');
			addInterfaceElem('h_info','Інформація');
			addInterfaceElem('h_boundaries','Область побудови');
			addInterfaceElem('h_color','Вибір кольору');
			
			addInterfaceElem('l_info','«Будівник графіків» дозволяє миттєво будувати до 10 графіків функцій одночасно. Якщо тобі сподобався цей додаток, запрошуй друзів!');
			addInterfaceElem('l_translator','Перекладач — ');
			addInterfaceElem('l_ymax','ymax');
			addInterfaceElem('l_ymin','ymin');
			addInterfaceElem('l_xmax','xmax');
			addInterfaceElem('l_xmin', 'xmin');
			addInterfaceElem('l_n_of_points', 'Кількість точок');
			addInterfaceElem('l_y_equals', 'y =');
			addInterfaceElem('l_saving', 'Зберігання інформації...');
			addInterfaceElem('l_error_load', 'Помилка з\'єднання з сервером ВКонтакті під час отримання збережених графіків. Рекомендується спробувати оновити сторінку, щоб побачити свої графіки. Зверніть увагу, що всі зміни, які Ви зараз зробите, загубляться після закриття вікна браузера, якщо не перезавантажити сторінку.');
			addInterfaceElem('l_error_save', 'Помилка з\'єднання з сервером ВКонтакті під час збереження графіків. Зміни, які Ви зараз зробите, загубляться після закриття вікна браузера. Рекомендується оновити сторінку и продовжити працювати.');
			addInterfaceElem('l_autonomous_mode', 'Автономний режим');
			
			addInterfaceElem('b_plot', 'Побудувати');
			addInterfaceElem('b_stop', 'Зупинити');
			addInterfaceElem('b_del','Видалити');
			addInterfaceElem('b_help','Довідка');
			addInterfaceElem('b_group', 'Група додатка');
			addInterfaceElem('b_extra', 'Дослідження від британських вчених!');
			addInterfaceElem('b_report_an_error','Повідомити про помилку');
			addInterfaceElem('b_add_graph','Додати ще один графік');
			addInterfaceElem('b_add_app','Додати додаток собі на сторінку');
			addInterfaceElem('b_add_friends','Запросити друзів!');
			addInterfaceElem('b_apply','Застосувати');
			addInterfaceElem('b_random_color','Випадковий колір');
			addInterfaceElem('b_defaults','За умовчанням');
			addInterfaceElem('b_ok','ОК');
			addInterfaceElem('b_cancel','Відміна');
			addInterfaceElem('b_yes','Так');
			addInterfaceElem('b_no','Ні');
			addInterfaceElem('b_add','Додати');
			
			addInterfaceElem('c_show_grid','Сітка');
			addInterfaceElem('c_show_axes','Координатні вісі');
			
			
			// Errors in formula
			
			//// Common errors
			addFormulaError(0,'Невідома помилка.');
			addFormulaError(1,'Формула відсутня.');
			addFormulaError(2,'Формула занадто велика.');
			addFormulaError(3,'Зустрівся заборонений символ <b>%2</b>.');
			
			//// Equals sign
			addFormulaError(10,'Формула має містити знак рівності.');
			addFormulaError(11,'Формула не може містити більше одного знака рівності.');
			addFormulaError(12,'Знак рівності не може знаходитися у самому початку формули.');
			addFormulaError(13,'Знак рівності не може знаходитися у самому кінці формули.');
			addFormulaError(14,'Знак рівності не може знаходитися у дужках (кількість відкриваючих дужок у лівій частині формули менше, ніж кількість закриваючих на %2). ');
			
			//// Brackets
			addFormulaError(20,'Зайва закриваюча дужка. Закриваючих дужок не може бути більше, ніж відкритих дужок до цього.');
			addFormulaError(21,'Відкриваючих дужок більше, ніж закриваючих (на %2).');
			addFormulaError(22,'Відкираюча дужка не може знаходитись відразу за закриваючою, необхідний знак арифметичної дії.');
			addFormulaError(23, 'Пусті дужки допустимі тільку після ім\'я функції, що не має параметрів.');
			
			//// Wrong elements / element placement
			addFormulaError(30,'<b>%2</b> не підлягає розбору.');
			addFormulaError(31,'Невідомий аргумент/константа <b>%2</b>.');
			addFormulaError(32,'<b>%2</b> — невірний формат для числа.');
			addFormulaError(33,'Кома може бути застосована тільки під час перерахування агрументів функції.');
			addFormulaError(34,'Невідома функція. <b>%2</b>.');
			addFormulaError(35,'Аргумент <b>%2</b> не може використовуватися як функція.');
			addFormulaError(36,'Константа <b>%2</b> не може використовуватися як функція.');
			addFormulaError(37,'Після ім\'я функції <b>%2</b> обов\'язкові дужки.');
			addFormulaError(38,'Не вистачає знака арифметичної дії.');
			addFormulaError(39,'<b>%2</b> — занадто велике число.');
			
			//// Sign misplacement
			addFormulaError(40,'Недопустиме положення знака <b>%2</b>.');
			addFormulaError(41,'Знак <b>%2</b> не може стояти у самому кінці виразу.');
			addFormulaError(42,'Знак <b>%2</b> не може стояти у самому початку виразу.');
			addFormulaError(43,'Знак <b>%2</b> не може стояти перед закриваючої дужкою.');
			addFormulaError(44,'Знак <b>%2</b> не може стояти відразу після відкриваючої дужки.');
			addFormulaError(45,'Знак <b>%2</b> не може стояти перед комою.');
			addFormulaError(46,'Знак <b>%2</b> не може стояти після коми.');
			addFormulaError(47,'Знак <b>%2</b> не може стояти після іншого знака арифметичної дії.');
			
			//// Arguments of a function
			addFormulaError(50,'Невірна кількість аргументів для функції <b>%2</b>.');
			addFormulaError(51,'Занадто багато аргументів передано у функцію <b>%2</b>. Кількість аргументів має бути від %3 до %4.');
			addFormulaError(52,'Занадто багато аргументів передано у функцію <b>%2</b>. Кількість аргументів має бути рівною %3.');
			addFormulaError(53,'Функція <b>%2</b> не може містити аргументи.');
			addFormulaError(54,'Недостатньо аргументів передано у функцію <b>%2</b>. Кількість аргументів має бути більше %3.');
			addFormulaError(55,'Недостатньо аргументів передано у функцію <b>%2</b>. Кількість аргументів має бути від %3 до %4.');
			addFormulaError(56,'Недостатньо аргументів передано у функцію <b>%2</b>. Кількість аргументів має бути рівною %3.');
			addFormulaError(57,'Між дужкою и комою очікувався аргумент функції <b>%2</b>.');
			addFormulaError(58,'Після коми очікувався аргумент функції <b>%2</b>.');
			
			//// Different errors for functions
			addError('wrong_bound','Поле <b>%0</b> має містити число у діапазані від —%1 до %1.');
			addError('wrong_number_of_dots','Поле з кількістю точок побудови має містити ціле число у діапазоні від %0 до %1.');
			addError('small_range','<b>%1</b> має бути більше <b>%0</b>, різниця має бути не меншою, ніж%2.');
			addError('y_in_f','<b>Y</b> не може бути в якості параметра функції. Допустимо використання тільки <b>x</b>.');
			addError('x_rus',' Підказка: щоб обозначити ікс, варто використовувати латинську <b>x</b>.');
			addError('vertical_slash',' Підказка: для побудови модуля варто використовувати функцію <b>abs</b>, наприклад, abs(x).');
			addError('comma',' Підказка: для відокремлення цілої і дробової частин у числах варто використовувати крапку, наприклад, 3.14.');
			addError('log_ln',' Подсказка: В цій версії натуральний логарифм<br/>обозначається як <b>ln</b>.');
			addError('equal_presents','Другий знак <b>=</b> не може бути присутнім в виразі, ща задає функцію.');
			addError('func_name_hint',' Підказка: Щоб побудувати %0, варто використовувати функцію <b>%1</b>.');
			
			addInterfaceElem('cap_f_empty','Введіть фуункцію в поле вводу знизу для побудови<br/>її графіка.');
			addInterfaceElem('cap_f_param_error','Помилка в властивостях<br>області побудови');
			addInterfaceElem('cap_f_error','Помилка в функції');
			
			// Return the array of string constants
			return r;
		}
	}
}