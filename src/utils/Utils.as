package utils{
	import flash.utils.ByteArray;
	/*
	* класс, содержащий некоторые важные функции для обеспечения работы программы
	*/
	public final class Utils {
		
		//=====================================
		// заглушка на конструктор
		//-------------------------------------
		public function Utils()
		{
			throw new Error('Запрещено создавать объекты класса Utils');
		}
		
		
		//=====================================
		//методы
		//-------------------------------------
		//----------- статические -------------
		/// создает копию объекта
		/// <param name="source">копируемый объект</param>
		/// <returns>копия объекта</returns>
		public static function deepCopy(source:Object):*
		{
			var copier:ByteArray = new ByteArray();
			copier.writeObject(source);
			copier.position = 0;
			return copier.readObject();
		}
		
		/// форматирует строку, добавляя значения values вместо %1 %2 %3 ... во входной строке
		/// <param name="stringToFormat">строка, подлежащая форматированию</param>
		/// <param name="values">массив переменных, значения которых должны быть вставлены в строку</param>
		/// <returns>отформатированная строка</returns>
		private static var i:int;
		private static var j:int;
		private static var count:int;
		private static var result:*;
		public static function formatStr(stringToFormat:String, ...args):String
		{
			result=stringToFormat;
			if (result==null)
				return '';
			count=0;
			if (args is Array){
				for (i=0;i<args.length;i++) {
					if (args[i] is Array){
						for (j=0;j<args[i].length;j++)
							result = result.replace(new RegExp("%"+(count++),"g"),String(args[i][j]));
					}else
						result = result.replace(new RegExp("%"+(count++),"g"),String(args[i]));
				}
			}
			return result;
		}
		
		/// печатает содержимое словаря констант
		/// <param name="_ref">ссылка на массив, который нужно распечатать</param>
		/// <param name="depth">глубина</param>
		/// <returns>отформатированный массив</returns>
		public static function printArray(__ref:*):String
		{
			if (__ref==null)
				return 'null';
			if (!(__ref is Array))
				return 'неверный тип аргумента для printArray';
			var result:*=trim(_printArray(__ref,0))+'\n';
			if (result.length==1)
				result='<ПУСТОЙ МАССИВ>\n';
			return result;
			
		}
		private static function _printArray(_ref:Array,depth:uint=0):String
		{
			var result:String='';
			var tab:String='';
			//отступ от начала строки в зависимости от глубины
			for (var i:int=0; i<depth; i++) {
				tab+='	';
			}
			//сортировка индексов
			var sorter:Array=new Array();
			for (var ind:* in _ref)
				sorter.push(ind);
			sorter.sort();
			
			//вывод каждого элемента массива
			for (ind in sorter) {
				result+=tab+'[';
				if (sorter[ind] is Number)
					result+=sorter[ind];
				else
					result+='\''+sorter[ind]+'\'';
				result+=']';
				
				if (!(_ref[sorter[ind]] is Array)) {
					result+=' = '+_ref[sorter[ind]]+'\n';
				} else {
					result+='\n'+_printArray(_ref[sorter[ind]],depth+1);
				}
			}
			if (result.length){
				result+='\n';
				result = result.replace(new RegExp('\\n\\n\\n','g'),'\n\n');
			}
			sorter=null;
			return result;
		}
		
		/// проверка, не слишком ли это большое число
		public static function checkIfNotBigNumber(n:Number):Boolean{
			if (n>1E18 || n<-1E18)
				return false;
			return true;
		}
		
		/// переводит строку в число
		/// отличительная особенность - строка может содержать пробелы между цифрами
		private static var oldValue:String;
		public static function strToNumber(str:String):Number
		{
			oldValue=str;
			for (i=0;i<str.length;i++)
				if (isSpace(str.charAt(i))){
					str=str.substring(0,i)+str.substring(i+1);
					i--;
				}
			var result:Number=Number(str);
			if (isNaN(result))
				throw new ArgumentError('Невозможно перевести \''+oldValue+'\'в число.');
			if (Math.abs(result)<1E-15)
				result=0;
			return result;
		}
		
		/// переводит число в строку
		/// отличительная особенность - выходной формат не содержит E
		public static function numberToStr(n:Number):String
		{
			var result:String=String(n);
			if (result.indexOf('e')!=-1){
				if (Math.abs(n)>1){
					result='NaN'
				}else{
					result=n<0?'-0.':'0.';
					n=Math.abs(n);
					while (n>0){
						n=n*10
						result+=Math.floor(n);
						n-=Math.floor(n);
					};
				}
			}
			return result;
		}
		
		/// обрезает пробелы в строке слева
        /// <param name="str">исходная строка</param>
        /// <returns>исходная строка без пробелов в начале</returns>
        private static const firstNotSpace:uint=33;
		public static function trimLeft(str:String):String
        {
			for(var i:Number = 0; str.charCodeAt(i) < firstNotSpace; i++);    
			return str.substring(i,str.length-1);
        }

        /// обрезает пробелы в строке справа
        /// <param name="str">исходная строка</param>
        /// <returns>исходная строка без пробелов в конце</returns>
        public static function trimRight(str:String):String
        {
			for(var j:Number = str.length-1; str.charCodeAt(j) < firstNotSpace; j--);
			return str.substring(0, j+1);
        }
		
		/// обрезает пробелы в строке
        /// <param name="str">исходная строка</param>
        /// <returns>исходная строка без пробелов в начале и конце</returns>
        public static function trim(str:String):String
        {
			for(i = 0; str.charCodeAt(i) < firstNotSpace && i<str.length; i++);    
			for(j = str.length-1; str.charCodeAt(j) < firstNotSpace && j>=i; j--);
			return str.substring(i, j+1);
        }
		
		/// подсчитывает число пробелов в начале строки
        /// <param name="str">исходная строка</param>
        public static function countSpacesLeft(str:String):int
        {
			for(var i:Number = 0; str.charCodeAt(i) < firstNotSpace; i++);
			return i;
        }

        /// подсчитывает число пробелов в конце строки
        /// <param name="str">исходная строка</param>
        public static function countSpacesRight(str:String):int
        {
			for(var j:Number = str.length-1; str.charCodeAt(j) < firstNotSpace; j--);
			return str.length-1-j;
		}
		
		// проверяет, является ли символ пробелом
		public static function isSpace(str:String):Boolean
		{
			return str.charCodeAt(0)<firstNotSpace?true:false;
		}
        
	}
}