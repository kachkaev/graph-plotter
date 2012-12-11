package formulas{
	/*
	* узел выражения, используется в классе Expression
	*/
	internal class ExpressionUnit{
        
		//=====================================
		//поля
		//-------------------------------------
		//------- принадлежащие объекту -------
		/// отформатированный текст узла
        public var formattedText:String;
		/// массив ссылок на другие узлы
        public var links:Array;
		/// неотформатированный (исходный) текст узла
        public var text:String = '';
		/// тип узла
        public var type:int;
		/// значение (либо число, либо имя аргумента/константы/функции)
        public var value:*;
		//----------- статические -------------
        /// тип узла - не распознанный
		public static const TYPE_UNPARSED:int = 0;
        /// тип узла - ошибка
        public static const TYPE_ERROR:int = -1;
        /// тип узла - число
        public static const TYPE_NUMBER:int = 1;
        /// тип узла - аргумент
        public static const TYPE_ARG:int = 2;
        /// тип узла - константа
        public static const TYPE_CONST:int = 3;
        /// тип узла - арифметическое действие
        public static const TYPE_ARITHMETIC:int = 4;
        /// тип узла - математическая функция
        public static const TYPE_SUBFUNCTION:int = 5;
        
		
		
		//=====================================
		//конструктор
		//-------------------------------------
		public function ExpressionUnit(text:String="")
		{
			links=null;
			value=null;
			type=TYPE_UNPARSED;
			formattedText='';
			this.text=text;
		}
		
		
		
		//=====================================
		//методы
		//-------------------------------------
		//------- принадлежащие объекту -------
		/// возвращает звено формулы в виде строки
        public function toString():String
        {
            var result:String = 'ExpressionUnit[';
			switch (type){
				case TYPE_UNPARSED:
					result+='UNPARSED';
					break;
				case TYPE_ERROR:
					result+='ERROR';
					break;
				case TYPE_NUMBER:
					result+='NUMBER';
					break;
				case TYPE_ARG:
					result+='ARG';
					break;
				case TYPE_CONST:
					result+='CONST';
					break;
				case TYPE_ARITHMETIC:
					result+='ARITHMETIC';
					break;
				case TYPE_SUBFUNCTION:
					result+='SUBFUNCTION';
					break;
				default:
					result+='UNKNOWN';
					break;
			}
				result += ': ';
			if (type!=TYPE_UNPARSED){
				if (value is String)
					result += '\''+value+'\', ';
				else
					result += value+', ';
			}
				result+='text = ';
				if (text is String)
					result += '\''+text+'\'';
				else
					result += text;
			if (type!=TYPE_UNPARSED){
				result+=', formattedText = ';
				if (formattedText is String)
					result += '\''+formattedText+'\'';
				else
					result += formattedText;
				
				result += ', links = '+links;
			}
			return result+']';
        }
    }
}
