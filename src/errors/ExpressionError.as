package errors{
	import utils.*;
	import languages.*;
	/*
	* класс ошибки для выражения
	*/
	public class ExpressionError extends MultiLanguageError {
		
		//=====================================
		//поля
		//-------------------------------------
		//------- принадлежащие объекту -------
		protected var type:*;
		protected var position:int;
		protected var content:*;//строка или массив
		protected var length:int;

		
		//=====================================
		//свойства
		//-------------------------------------
		//------- принадлежащие объекту -------
		/// причина ошибки (только чтение)
		public function get Content():String
		{
			return content;
		}

		/// длина участка в исходной строке, содержащего ошибку (только чтение)
		public function get Length():int
		{
			return length;
		}
		
		/// свойство Message наследовано от предка - MultiLanguageError (только чтение)
		
		/// позиция ошибки в исходной строке (только чтение)
		public function get Position():int
		{
			return position;
		}
		
		/// тип ошибки (фактически - её номер) (только чтение)
        public function get Type():int
		{
			return type;
		}



		//=====================================
		//конструктор
		//-------------------------------------
		/// <param name="type">тип ошибки</param>
		/// <param name="position">позиция ошибки</param>
		/// <param name="content">причина ошибки</param>
		/// <param name="length">длина ошибки</param>
		public function ExpressionError(type:*, position:int=-1, content:*="", length:int=0):void
		{
			this.type=type;
			this.position=position;
			this.content=content;
			this.length=length;
		}

		
		
		//=====================================
		//методы
		//-------------------------------------
		//------- принадлежащие объекту -------
		/// генерация сообщения - текстовой строки
		/// выходное значение зависит как от параметров ошибки, так и от текущего языка приложения
		protected override function generateMessage():void
		{
			message=Utils.formatStr(Lang.getStr('func_error',type),this.position,this.length,this.content);
		}
		
		/// метод toString наследован от предка - MultiLanguageError
		
		public override function toString():String{
			return '['+int(type)+'] '+Message;
		}
	}
}