package languages{

	/**
	 * Class containing English string constants
	 * @author Alexander Kachkaev
	 * @version 2010/02/21
	 * @since 1.2
	 */
	public final class Language_EN extends Language_SHELL
	{
		/**
		 * Completes the array with language string constants
		 * @return	Array of string constants
		 */
		public static function getStrings():Array {
			
			// Language parameters
			addStrings('id','en');
			addStrings('name','English');
			addStrings('release','2010/02/02');
			addStrings('about','');
			
			// Language translators
			clearAutors();
			// addAutor('Введте сюда своё имя','Введте сюда свой ID ВКонтакте');
			
			// Interface elements
			addInterfaceElem('menu_autor','Developed by Alexander Kachkaev');
			addInterfaceElem('l_app_title','GRAPH\nPLOTTER');
			addInterfaceElem('l_app_version','version ');
			addInterfaceElem('h_info','Information');
			addInterfaceElem('h_boundaries','Plot area properties');
			addInterfaceElem('h_color','Choose color');
			
			addInterfaceElem('l_info','“Graph plotter” allows you to plot up to 10 function graphs at once! If find this app useful, invite your friends!');
			addInterfaceElem('l_translator','Translated by ');
			addInterfaceElem('l_ymax','ymax');
			addInterfaceElem('l_ymin','ymin');
			addInterfaceElem('l_xmax','xmax');
			addInterfaceElem('l_xmin', 'xmin');
			addInterfaceElem('l_n_of_points', 'Number of dots');
			addInterfaceElem('l_y_equals', 'y =');
			addInterfaceElem('l_saving', 'Saving your information…');
			addInterfaceElem('l_error_load', 'An error occured when loading your graphs. It is recommended to reload current page. Please, notice that no changes that you will make before reloading will can be saved. Sorry for any inconvenience.');
			addInterfaceElem('l_error_save', 'An error occured when saving your graphs. It is recommended to reload current page. Please, notice that no changes that you will make before reloading will can be saved. Sorry for any inconvenience.');
			addInterfaceElem('l_autonomous_mode', 'Autonomous mode');
			
			addInterfaceElem('b_plot', 'Plot!');
			addInterfaceElem('b_stop', 'Stop');
			addInterfaceElem('b_del','Delete');
			addInterfaceElem('b_help','Help');
			addInterfaceElem('b_group','Application group');
			addInterfaceElem('b_report_an_error','Report an error');
			addInterfaceElem('b_add_graph','Add one more function');
			addInterfaceElem('b_add_app','Add application to my page');
			addInterfaceElem('b_add_friends','Invite friends!');
			addInterfaceElem('b_apply','Apply');
			addInterfaceElem('b_random_color','Random color');
			addInterfaceElem('b_defaults','Restore defaults');
			addInterfaceElem('b_ok','OK');
			addInterfaceElem('b_cancel','Cancel');
			addInterfaceElem('b_yes','Yes');
			addInterfaceElem('b_no','No');
			addInterfaceElem('b_add','Add');
			
			addInterfaceElem('c_show_grid','Show grid');
			addInterfaceElem('c_show_axes','Show axes');
			
			
			// Errors in formula
			
			//// Common errors
			addFormulaError(0,'Unknown error occured.');
			addFormulaError(1,'Expression is empty.');
			addFormulaError(2,'Expression is too long.');
			addFormulaError(3,'Symbol <b>%2</b> can not be used.');
			
			//// Equals sign
			addFormulaError(10,'The expression must contain the equals sign.');
			addFormulaError(11,'The expression can not contain more than one equals sign.');
			addFormulaError(12,'Equals sign cannot be placed in the very beginning of the expression.');
			addFormulaError(13,'Equals sign cannot be placed in the very end of the expression.');
			addFormulaError(14,'Equals sign cannot be inside of brackets (there are %2 unpaired left brackets before it).');
			
			//// Brackets
			addFormulaError(20,'Extra right bracket found. The number of right brackets must not be more than the number of left brackets before it.');
			addFormulaError(21,'The number of left brackets is more than the number of right brackets (by %2).');
			addFormulaError(22,'Left bracket cannot follow the right bracket (arithmetical sign needed between them).');
			addFormulaError(23,'Empty brackets are allowed only when calling a function without any parameters.');
			
			//// Wrong elements / element placement
			addFormulaError(30,'Couldn\'t parse <b>%2</b>.');
			addFormulaError(31,'Unknown argument or constant <b>%2</b>.');
			addFormulaError(32,'<b>%2</b> — wrong numeric format.');
			addFormulaError(33,'Comma can be used only between arguments for a function.');
			addFormulaError(34,'Function <b>%2</b> is unknown.');
			addFormulaError(35,'Argument <b>%2</b> cannot be used as a function.');
			addFormulaError(36,'Constant <b>%2</b> cannot be used as a function.');
			addFormulaError(37,'The name of the function <b>%2</b> must be followed by brackets.');
			addFormulaError(38,'Arithmetical sign expected.');
			addFormulaError(39,'<b>%2</b> — this number is too big.');
			
			//// Sign misplacement
			addFormulaError(40,'Sign <b>%2</b> cannot be placed here.');
			addFormulaError(41,'Sign <b>%2</b> cannot be placed to the very end of an expression.');
			addFormulaError(42,'Sign <b>%2</b> cannot be placed to the very beginning of an expression.');
			addFormulaError(43,'Sign <b>%2</b> cannot be placed before the right bracket.');
			addFormulaError(44,'Sign <b>%2</b> cannot be placed after the left bracket.');
			addFormulaError(45,'Sign <b>%2</b> cannot be placed before the comma.');
			addFormulaError(46,'Sign <b>%2</b> cannot be placed after the comma.');
			addFormulaError(47,'Sign <b>%2</b> cannot follow any other arithmetical signs.');
			
			//// Arguments of a function
			addFormulaError(50,'Wrong number of parameters for <b>%2</b> function.');
			addFormulaError(51,'Function <b>%2</b> has too many argumets. The number of argumets must vary from %3 to %4.');
			addFormulaError(52,'Function <b>%2</b> has too many arguments. The number of argumets must be equal to %3.');
			addFormulaError(53,'Function <b>%2</b> does not accept any arguments.');
			addFormulaError(54,'Function <b>%2</b> has too few arguments. The number of arguments must be more than %3.');
			addFormulaError(55,'Function <b>%2</b> has too few arguments. The number of argumets must vary from %3 to %4.');
			addFormulaError(56,'Function <b>%2</b> has too few arguments. The number of argumets must be equal to %3.');
			addFormulaError(57,'An argument for the <b>%2</b> function expected between the bracket and the comma.');
			addFormulaError(58,'An argument for function <b>%2</b> expected after the comma.');
			
			//// Different errors for functions
			addError('wrong_bound','Field <b>%0</b> must contain a number from <br/>-%1 to %1.');
			addError('wrong_number_of_dots','The field with number of dots must contain an integer number in range between %0 and %1.');
			addError('small_range','<b>%1</b> must be greater than <b>%0</b> and their minumum difference must be equal to %2.');
			addError('y_in_f','You cannot use <b>y</b> as an argument for the function. Only <b>x</b> may be used.');
			addError('x_rus',' Hint: to designate ex, use latin letter <b>x</b>.');
			addError('vertical_slash',' Hint: to plot an absolute value function use <b>abs</b>, e. g. abs(x).');
			addError('comma',' Hint: to split the integer and the fractional part of a number use a dot, e.g. 3.14.');
			addError('log_ln',' Hint: In this version natural logarithm is designate as <b>ln</b>.');
			addError('equal_presents','Second equals sign <b>=</b> cannot appear twice.');
			addError('func_name_hint',' Hint: To plot %0, use function <b>%1</b>.');
			
			addInterfaceElem('cap_f_empty','Input a function in the field below to see its graph.');
			addInterfaceElem('cap_f_param_error','Error in plot area properties');
			addInterfaceElem('cap_f_error','Error in function');
			
			// Return the array of string constants
			return r;
		}
	}
}