package languages{

	/**
	 * Class containing Russian string constants
	 * @version 2010/12/22
	 * @since 1.2
	 */
	public final class Language_DE extends Language_SHELL
	{
		/**
		 * Completes the array with language string constants
		 * @return	Array of string constants
		 */
		public static function getStrings():Array {
			
			// Language parameters
			addStrings('id','ru');
			addStrings('name','Deutsch');
			addStrings('release','2010/12/22');
			addStrings('about','');
			
			// Language translators
			clearAutors();
			addAutor('Джейсон Соло','id14932749');
			
			// Interface elements
			addInterfaceElem('menu_autor','Autor - Alexander Kachkaev');
			addInterfaceElem('l_app_title','GRAPHISCHE DARSTELLUNG\nDER FUNKTIONEN');
			addInterfaceElem('l_app_version','Version ');
			addInterfaceElem('h_info','Information');
			addInterfaceElem('h_boundaries','Gesamtflache');
			addInterfaceElem('h_color','Farbauswahl');
			
			addInterfaceElem('l_info','Sie konnen sofort bis zu 10 graphischen Funktionen gleichzeitig darstellen. Falls Ihnen diese Anwendung gefallt, laden Sie Ihre Freunde ein!');
			addInterfaceElem('l_translator','Translator — ');
			addInterfaceElem('l_ymax','ymax');
			addInterfaceElem('l_ymin','ymin');
			addInterfaceElem('l_xmax','xmax');
			addInterfaceElem('l_xmin', 'xmin');
			addInterfaceElem('l_n_of_points', 'Anzahl der Punkte');
			addInterfaceElem('l_y_equals', 'y =');
			addInterfaceElem('l_saving', 'Saving Private Informationen auf...');
			addInterfaceElem('l_error_load', 'Fehler beim Verbinden zum Server Facebook bei der graphischen Darstellung der gespeicherten Funktion. Es ist zu empfehlen, die Seite zu aktualisieren, um Ihre graphische Darstellung zu sehen. Beachten Sie, dass alle Anderungen, die Sie jetzt machen, gehen nach dem Schliessen des Browser-Fenster verloren, wenn die Seite nicht neu geladen wird.');
			addInterfaceElem('l_error_save', 'Fehler beim Verbinden zum Server facebook beim Speichern der graphischen Funktionen. Anderungen, die Sie jetzt vornehmen, werden nach dem Schliessen des Browser-Fensters verloren gehen. Es wird empfohlen, die Seite zu aktualisieren und weiter zu arbeiten.');
			addInterfaceElem('l_autonomous_mode', 'Offline-Modus');
			
			addInterfaceElem('b_plot', 'darstellen');
			addInterfaceElem('b_stop', 'Stop');
			addInterfaceElem('b_del','Loschen');
			addInterfaceElem('b_help','Hilfe');
			addInterfaceElem('b_group','Gruppe Anwendungen');
			addInterfaceElem('b_report_an_error','Fehler melden');
			addInterfaceElem('b_add_graph','neue Funktion zufügen');
			addInterfaceElem('b_add_app','Anwendung auf meine Seite hinzufugen');
			addInterfaceElem('b_add_friends','Freunde einladen!');
			addInterfaceElem('b_apply','anwenden');
			addInterfaceElem('b_random_color','Zufallige Farbe');
			addInterfaceElem('b_defaults','Default');
			addInterfaceElem('b_ok','OK');
			addInterfaceElem('b_cancel','Abbrechen');
			addInterfaceElem('b_yes','Ja');
			addInterfaceElem('b_no','Nein');
			addInterfaceElem('b_add','Hinzufugen');
			
			addInterfaceElem('c_show_grid','Grid');
			addInterfaceElem('c_show_axes','Axte');
			
			
			// Errors in formula
			
			//// Common errors
			addFormulaError(0,'Unbekannter Fehler.');
			addFormulaError(1,'Die Formel fehlt.');
			addFormulaError(2,'Die Formel ist zu groß.');
			addFormulaError(3,'Ein verbotenes Symbol <b>%2</b>.');
			
			//// Equals sign
			addFormulaError(10,'Die Formel muss ein Gleichheitszeichen beinhalten.');
			addFormulaError(11,'Formel sollte nicht mehr als ein Gleichheitszeichen beinhalten.');
			addFormulaError(12,'Gleichheitszeichen sollte nicht am Anfang der Formel stehen.');
			addFormulaError(13,'Gleichheitszeichen sollte nicht ganz am Ende der Formel stehen.');
			addFormulaError(14,'Gleichheitszeichen sollte nicht innerhalb der Klammern stehen (die Anzahl der offnenden Klammern auf der linken Seite der Formel ist um %2 kleiner als die Anzahl der Klammern rechts ).');
			
			//// Brackets
			addFormulaError(20,'Überfluessige schliessende Klammer. die Anzahl der schließenden Klammern kann nicht mehr als die Anzahl der offenen Klammern am Anfang sein.');
			addFormulaError(21,'Anzahl der offenen Klammern links muss um %2 groeßer als die Anzahl der schlißenden Klammern rechts sein.');
			addFormulaError(22,'Die offene Klammer sollte nicht gleich hinter der schließenden Klammer stehen, es muss dazwischen ein Arithmetisches Zeichen stehen.');
			addFormulaError(23,'Leere Klammern sind nur nach den Namen der Funktion ohne Parameter zulassig.');
			
			//// Wrong elements / element placement
			addFormulaError(30,'<b>%2</b> ist nicht verständlich .');
			addFormulaError(31,'Unbekanntes Argument / konstant <b>%2</b>.');
			addFormulaError(32,'<b>%2</b> — falsche Format fur die Nummer.');
			addFormulaError(33,'Ein Komma kann nur wahrend der Aufzählung der Argumenten einer Funktion benuzt werden.');
			addFormulaError(34,'Unbekannte Funktion <b>%2</b>.');
			addFormulaError(35,'Argument <b>%2</b> kann nicht als eine graphische Funktion verwendet werden.');
			addFormulaError(36,'Konstante <b>%2</b> kann nicht als eine graphische Funktion verwendet werden.');
			addFormulaError(37,'Nach den Namen der Funktion <b>%2</b> erforderlich Klammern.');
			addFormulaError(38,'Nicht genug arithmetischen Zeichen.');
			addFormulaError(39,'<b>%2</b> - Zu grosse Zahl.');
			
			//// Sign misplacement
			addFormulaError(40,'Ungultige Position des Zeichens <b>%2</b>.');
			addFormulaError(41,'Die Zeichen <b>%2</b> kann nicht am Ende der Formel stehen.');
			addFormulaError(42,'Die Zeichen <b>%2</b> kann nicht am Anfang der Formel stehen.');
			addFormulaError(43,'Die Zeichen <b>%2</b> kann nicht vor der geschoßenen Klammer stehen.');
			addFormulaError(44,'Die Zeichen <b>%2</b> kann nicht gleich hinter der offnenden Klammer stehen.');
			addFormulaError(45,'Die Zeichen <b>%2</b> kann nicht vor dem Komma stehen.');
			addFormulaError(46,'Die Zeichen <b>%2</b> kann nicht nach dem Komma stehen.');
			addFormulaError(47,'Die Zeichen <b>%2</b> kann nicht nach dem anderen Rechenarten stehen.');
			
			//// Arguments of a function
			addFormulaError(50,'Falsche Anzahl von Argumenten fur Funktion <b>%2</b>.');
			addFormulaError(51,'Zu viele Argumente wurden für die Funktion eingegeben <b>%2</b>. Die Anzahl der Argumente muss %3 bis %4 sein.');
			addFormulaError(52,'Zu viele Argumente wurden für die Funktion eingegeben <b>%2</b>. Die Anzahl der Argumente muss gleich %3 sein.');
			addFormulaError(53,'Funktion <b>%2</b> kann keine Argumente beinhalten.');
			addFormulaError(54,'Nicht genug Argumente für die Funktion eingegeben worden <b>%2</b>. Die Anzahl der Argumente muss grosser als %3 sein.');
			addFormulaError(55,'Nicht genug Argumente für die Funktion eingegeben worden <b>%2</b>. Die Anzahl der Argumente muss %3 bis %4 sein.');
			addFormulaError(56,'Nicht genug Argumente für die Funktion eingegeben worden <b>%2</b>. Die Anzahl der Argumente muss gleich %3 sein.');
			addFormulaError(57,'Zwischen der Klammer und dem Komma ist ein Argument zu erwarten <b>%2</b>.');
			addFormulaError(58,'Nach dem Komma ist Argument zu erwartet <b>%2</b> .');
			
			//// Different errors for functions
			addError('wrong_bound','Feld <b>%0</b> muss eine Zahl enthalten, diese Zahl muss im Bereich von -%1 bis %1 sein.');
			addError('wrong_number_of_dots','Feld mit einer Reihe von Punkten muss eine ganze Zahl enthalten, diese Zahl muss zwischen %0 bis %1 sein.');
			addError('small_range','<b>%1</b> muss großer sein  <b>%0</b>, minimaler Unterschied muss gleich %2 sein.');
			addError('y_in_f','<b>Y</b> kann nicht als Parameter der graphischen Funktion sein. es dueren nur die <b>x</b> verwenden werden.');
			addError('x_rus',' Tipp: Um Argument X zu bezeichnen, sollten Sie das lateinische <b>x</b> benutzen.');
			addError('vertical_slash',' Hinweis: um das Modul zu darstellen, sollte man die Funktion <b>ABS</b>, zum Beispiel (x) verwenden.');
			addError('comma',' Tipp: Bei nicht ganzen Zahlen soll statt Komma ein Punkte verwendet werden, zum Beispiel 3.14.');
			addError('log_ln',' Hinweis: In dieser Version ist ein naturliches Logarithmus bezeichnet als <b>ln</b>.');
			addError('equal_presents', 'Das zweite Zeichen <b>=</b> kann nicht in der Formel der graphischen Funktion vorkommen.');
			addError('func_name_hint',' Hinweis: Fur die Darstellung einer %0, verwenden Sie die Funktion <b>%1</b>.');
			
			addInterfaceElem('cap_f_empty','Geben Sie eine Funktion in das untere Feld um die graphische Funktion zu darstellen.');
			addInterfaceElem('cap_f_param_error','Fehler in den Eigenschaften der Gesamtfläche');
			addInterfaceElem('cap_f_error','Fehler in der Funktion');
			
			// Return the array of string constants
			return r;
		}
	}
}