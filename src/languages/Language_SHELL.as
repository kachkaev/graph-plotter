package languages{
	import flash.events.ContextMenuEvent;
	/*
	*  класс - оболочка для языков построителя графиков
	*  содержит функции для упрощения добавления языковых констант
	*/
	internal class Language_SHELL {

		//=====================================
		//поля
		//-------------------------------------
		//----------- статические -------------
		/// cсылка на массив нулевого уровня
		protected static  var r:Array;
		/// cсылка на массив первого уровня
		protected static  var r1:Array;
		/// cсылка на массив второго уровня
		protected static  var r2:Array;
		/// cсылка на массив третьего уровня
		protected static  var r3:Array;
		/// cсылка на массив четвертого уровня
		protected static  var r4:Array;

		

		//=====================================
		// заглушка на конструктор
		//-------------------------------------
		public function Language_SHELL()
		{
			throw new Error("Запрещено создавать объекты класса язык. Использовать его можно только как статический класс");
		}

		
		
		//=====================================
		//методы
		//-------------------------------------
		//----------- статические -------------
		/// очистка списка авторов перевода
		protected static function clearAutors():void
		{
			check_r();
			check_elem('autors', r);
			r['autors'] = new Array();
			
		}
		/// добавление автора перевода
		protected static function addAutor(name:String,href:String=null,position:String=null):void
		{
			check_r();

			check_elem('autors',r);
			r1=r['autors'];
			r2=r1[r1.push(new Array(0))-1];
			r2['name']=name;
			if(href!=null)
				r2['href']=href;
			if(position!=null)
				r2['position']=position;
		}
		
		/// добавление элемента интерфейса к базе констант языка
		/// <param name="name">идентификатор элемента</param>
		/// <param name="value">строковая константа</param>
		protected static function addInterfaceElem(name:String,value:String):void
		{
			check_r();

			check_elem('interface',r);
			r1=r['interface'];
			r1[name]=value;
		}
		
		///проверка, существует ли массив с ключем what в массиве where; если нет - то создается
		protected static function check_elem(what:String,where:Array):void
		{
			if (where[what]==null) {
				where[what]=new Array();
			}
		}
		
		///создается массив языковых констант, если не был создан до этого
		protected static function check_r():void
		{
			if (r==null) {
				r=new Array();
			}
		}
		
		/// добавление формулы
		protected static function addFormula(...args):void
		{
			check_r();
			check_elem('formula',r);
			r1=r['formula'];
			{
				r1[args[0]]=new Array();
				r2=r1[args[0]];
				{
					r2['name']=args[1];
					r2['def']=args[2];
					if (args.length>3) {
						r2['args']=args.slice(3,args.length);
					}
				}
			}
		}

		/// добавление константы (в формуле)
		protected static function addConstant(...args):void
		{
			check_r();
			check_elem('constant',r);
			r1=r['constant'];
			{
				r1[args[0]]=new Array();
				r2=r1[args[0]];
				{
					r2['def']=args[1];
					r2['equals']=args[2];
				}
			}
		}

		/// добавляет описание ошибки формулы
		/// <param name="code">код ошибки</param>
		/// <param name="message">сообщение ошибки</param>
		protected static function addFormulaError(code:*, message:String):void
		{
			check_r();
			check_elem('func_error',r);
			r1=r['func_error'];
			r1[code]=message;
		}
				
		/// добавляет описание ошибки
		/// <param name="code">код ошибки</param>
		/// <param name="message">сообщение ошибки</param>
		protected static function addError(code:*, message:String):void
		{
			check_r();
			check_elem('error',r);
			r1=r['error'];
			r1[code]=message;
		}

		/// добавление пар (идентификатор - значение) к базе констант языка
		protected static function addStrings(...args):void
		{
			check_r();

			//в массив добавляются пары 
			for (var i:int=0; i<Math.floor(args.length/2.0); i+=2) {
				r[args[i]]=args[i+1];
			}
		}

	}
}