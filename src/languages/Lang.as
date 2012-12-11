package languages{
	import languages.*;
	import utils.Utils;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	/*
	*  класс, реализующий функционал многоязычности в приложении
	*  позволяет перелючаться между установленными языками, получать строковые константы языка, а также генерировать событие при смене языка
	*/
	public class Lang {

		//=====================================
		//поля
		//-------------------------------------
		//----------- статические -------------
		/// идентификатор события, на которое будут реагировать объекты приложения
		public static const CHANGE:String='lang_changed';
		/// id текущего языка
		private static var current:uint=255;
		/// ссылка на объект-корень цепочки событий (содержит все объекты, зависящие от языка, которые будут реагировать на Lang.CANGED)
		private static var dispatcher:EventDispatcher;
		//счетчик, используется в функции поиска строки
		private static var i:int;
		/// флажок - защита от повторной инициализации
		private static var initialized:Boolean=false;
		/// многоуровневый массив строковых констант
		private static var langs:Array;
		/// список установленных языков
		private static var languageList:Array;
		/// id языка, который был раньше
		private static var oldLanguage:int=current;
		//ссылка на подмасив. будет использоваться при поиске строки; объявлена тут для экономии памяти
		private static  var _ref:Array;
		//используется в функции смены языка в for in
		private static var value:*;
		
	
		
		//=====================================
		//свойства
		//-------------------------------------
		//----------- статические -------------
		///число установленных языков (только чтение)
		public static  function get Count():uint
		{
			checkInit();
			return languageList.length;
		}
		
		/// текущий язык
		///// чтение
		public static  function get Current():int
		{
			checkInit();
			return current;
		}
		///// запись
		public static  function set Current(new_current:int):void
		{
			setLanguage(new_current);
		}
	
		//название текущего языка
		///// чтение
		public static  function get CurrentName():String
		{
			checkInit();
			return languageList[current];
		}
		///// запись
		public static  function set CurrentName(new_current:String):void
		{
			setLanguage(new_current);
		}
	
		//ссылка на объект-корень цепочки событий (содержит все объекты, зависящие от языка, которые будут реагировать на Lang.CANGED)
		///// чтение
		public static  function get Dispatcher():EventDispatcher
		{
			return dispatcher;
		}
		///// запись
		public static  function set Dispatcher(new_dispatcher:EventDispatcher):void
		{
			dispatcher = new_dispatcher;
		}
		
		
		
		//=====================================
		// заглушка на конструктор
		//-------------------------------------
		public function Lang()
		{
			throw new Error("Запрещено создавать объекты класса Lang. Использовать его можно только как статический класс");
		}
		

		
		//=====================================
		//методы
		//-------------------------------------
		//----------- статические -------------
		///проверяет, установлен ли языковой пакет
		private static  function checkInit():void
		{
			if (! initialized) {
				throw new Error("Языки еще не установлены");
			}
		}
		
		/// возвращает запрашиваемую строку (или пустую строку в случе неудачи поиска)
		public static  function getStr(... args):String
		{
			checkInit();
			_ref=langs[current];
			try {
				//углубление внутрь массива
				for (i=0; i < args.length - 1; i++) {
					_ref=_ref[args[i]];
				}
				//когда глубина достигнута, проверка типа: если не строка - выход
				if (! _ref[args[args.length - 1]] is String) {
					throw new Error  ;
				}
	
				//возвращение строки
				return _ref[args[args.length - 1]];
			} catch (e:*) {
			}
			return "";
		}
	
		/// возвращает список установленных языков
		public static  function getLanguageList():Array
		{
			checkInit();
			return Utils.deepCopy(languageList);
		}

		/// загружает в себя языки и подготавливает класс к работе
		public static  function initialize(defaultLanguage:*=0):void
		{
			//проверка на повторную инициализацию
			if (initialized) {
				throw new Error("Языки уже установлены");
			}
			
			//если до этого не было неудачных попыток инициализации,
			if (langs==null){
				langs=new Array();
				//составление общего массива языковых констант								<-место подключения языков
				//русский
				langs.push(Utils.deepCopy(languages.Language_RU.getStrings()));
				//английский
				langs.push(Utils.deepCopy(languages.Language_EN.getStrings()));
				//украинский
				langs.push(Utils.deepCopy(languages.Language_UA.getStrings()));
				//немецкий
				langs.push(Utils.deepCopy(languages.Language_DE.getStrings()));
				//вывод
				//trace(Utils.printArray(langs));
				
				//составление списка языков
				languageList=new Array ;
				for (var i:uint=0; i < langs.length; i++) {
					languageList.push(langs[i]['name']);
				}
			}
			
			//ставится флажок инициализации
			initialized=true;
			
			//выбирается текщий язык
			try{
				setLanguage(defaultLanguage);
			}catch(e:*){
				initialized=false;
				throw new Error('Неверный параметр для инициализации языкового пакета - '+defaultLanguage+'. Инициализация не была произведена.');
			}
			//всё. языки установлены
		}
	
		/// меняет язык
		public static  function setLanguage(newLanguage:*):void
		{
			checkInit();
			oldLanguage=current;
			try {
				//в случае, когда в качестве параметра - строка
				if (newLanguage is String) {
					for (value in languageList) {
						if (languageList[value] == newLanguage) {
							current=value;
							throw uint;
						}
					}
					throw new Error  ;
					//в случае, когда в качестве параметра - целое подходящее число
				} else if (newLanguage is uint && newLanguage < langs.length && newLanguage >= 0) {
					current=newLanguage;
				} else {
					throw new Error  ;
				}
	
			} catch (e:Error) {
				throw new Error('Неверный параметр для смены языка - "' + newLanguage + '"');
			} catch (e:*) {
			}
			//если язык действительно изменен, то активируется функция-событие смены языка
			if (current != oldLanguage) {
				if (dispatcher!=null)
					dispatcher.dispatchEvent(new Event(CHANGE,true,true));
			}
		}
	}
}