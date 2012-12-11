package errors{
	import utils.*;
	import languages.*;

	/*
	* класс ошибки для класса Formula (формула)
	*/
	public class FormulaError extends MultiLanguageError {
		protected var type;
		protected var position:int;
		protected var content:String;
		protected var length:int;

		/// конструктор ошибки
		/// <param name="type">тип ошибки</param>
		/// <param name="position">позиция ошибки</param>
		/// <param name="content">содержимое ошибки</param>
		/// <param name="length">длина ошибки</param>
		public function FormulaError(type, position:int=-1, content:String="", length:int=0):void {
			this.type=type;
			this.position=position;
			this.content=content;
			this.length=length;
		}

		public function get Type():int {
			return type;
		}

		/// позиция ошибки в исходной строке
		public function get Position():int {
			return position;
		}

		/// причина ошибки
		public function get Content():String {
			return content;
		}

		/// длина участка в исходной строке, содержащего ошибку
		public function get Length():int {
			return length;
		}
		/// генерация сообщения - текстовой строк
		/// значение зависит как от параметров ошибки, так и от текущего языка приложения
		protected override function generateMessage():void {
			message='['+int(type)+'] '+Utils.formatStr(Lang.getStr('func_error',type),this.position,this.content,this.length);
		}
	}
}