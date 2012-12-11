package formula{
    
	/*
	* узел формулы, используется в классе Formula
	*/
	
	//public
	//internal
	public class FormulaUnit{
        
		//=====================================
		//переменные, инкапсулированные в класс
		//-------------------------------------

		/// массив ссылок на подфункци
        public var links:Array=null;
        
		/// значение (либо число, либо "x" или "y", либо ссылка на функцию/константу)
        public var value=null;
        
		/// тип узла формулы
        public var type:int=-1;
        /// тип узла формулы - неизвестно
        public static const TYPE_UNKNOWN:int = -1;
        /// тип узла формулы - конечный узел
        public static const TYPE_SINGLE:int = 0;
        /// тип узла формулы - арифметическое действие
        public static const TYPE_ARITHMETIC:int = 1;
        /// тип узла формулы - математическая функция
        public static const TYPE_SUBFUNCTION:int = 2;
		
		/// отформатированный текст узла
        public var formattedText:String = '';

		/// неотформатированный (исходный) текст узла
        public var text:String = '';
        
		
		//=====================================
		//методы
		//-------------------------------------
		
		/// возвращает звено формулы в виде строки
        public function toString():String
        {
            var result:String = 'FormulaUnit[';
			switch (type){
				case 0:
					result+='SINGLE';
					break;
				case 1:
					result+='ARITHMETIC';
					break;
				case 2:
					result+='SUBFUNCTION';
					break;
				default:
					result+='UNKNOWN';
					break;
			}
			if (type!=TYPE_UNKNOWN){
				result += ': ';
				if (value is String)
					result += '\''+value+'\'';
				else
					result += value;
				
				result+=', text = ';
				if (text is String)
					result += '\''+text+'\'';
				else
					result += text;
				
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
