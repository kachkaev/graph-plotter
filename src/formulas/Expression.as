package formulas{
    import utils.*;
	import errors.ExpressionError;
    /*
    * класс выражение
    * предназначен для распознавания выражений (совокупности аргументов, констант, арифметических действий, функций и скобок) для получения значения выражения при задаваемых значениях аргументов
	*/
	public class Expression{
        
		//=====================================
		//поля
		//-------------------------------------
		//------- принадлежащие объекту -------
		/// переменные в выражении
        protected var args:Array;
        /// переменные, действительно найденные в выражении
        protected var argsFound:Array;
		/// значения переменных (используется при вызове getValue для всех getUnitValue)
        protected var argValues:Array;
		/// запрет разбора при изменении входных параметров (для того, чтобы при изменении сразу нескольких параметров Parse не вызывалась многократно)
        protected var blockParse:Boolean;
        /// пользовательские константы
        protected var constantsCustom:Array;
		/// известные константы (стандартные + пользовательские)
        protected var constants:Array;
		/// ошибка
        protected var error:ExpressionError;
		/// выражение в отформатированном виде (без лишних скобок, пробелов и с нормализированным индексом букв)
        protected var formattedText:String;
		/// идентификатор нового узла выражения в массиве units
        protected var newUnitID:int;
        /// пользовательские функци
		protected var subFunctionsCustom:Array;
		/// известные функции (стандартные + пользовательские)
        protected var subFunctions:Array;
		/// текст выражения
        protected var text:String;
		/// массив узлов выражения
        protected var units:Array;

		//----------- статические -------------
		///----известные разборщику выражений допустимые символы (с учетом регистра и кроме пробелов)
		protected static const acceptedArithmetic:*='-+*/^';//не должно быть регулярным выражением (разрешено только перечисление)
		protected static const acceptedChars:*='a-zA-Z';
		protected static const acceptedNumbers:*='\\d';
		protected static const acceptedAll:*='\\Q'+acceptedArithmetic+'\\E'+acceptedChars+acceptedNumbers+'\\.\\,\\(\\)';
		//protected static const acceptedNumbersExt='^-?['+acceptedNumbers+']+(\.['+acceptedNumbers+']*)?(E(-?['+acceptedNumbers+']+))?';
		/// стандартные константы
        public static const constantsDefault:Array  = DefaultsSource.consts();
		///---регулярные выражения
		protected static const nameSymbolRegExp:* = new RegExp('^(['+acceptedChars+']+['+acceptedNumbers+']*)+','i');
		protected static const nameFuncRegExp:* = new RegExp('^(['+acceptedChars+']+['+acceptedNumbers+']*)+\\s*\\(.*\\)','i')
		protected static const nameRegExp:* = new RegExp('^(['+acceptedChars+']+['+acceptedNumbers+']*)+');
		protected static const oneDigit:* = new RegExp(acceptedNumbers);
		protected static const numberFirstRegExp:* = new RegExp('^-?[\\s'+acceptedNumbers+']*(\\.[\\s'+acceptedNumbers+']*)?');
		protected static const numberRegExp:* = numberFirstRegExp;//new RegExp('^-?[\\s'+acceptedNumbers+']*(\\.[\\s'+acceptedNumbers+']*)?$');
		/// максимальное количество узлов выражения (фактически - максимальные допустимые сложность и размер формулы)
        protected static const MAX_COMPLEXITY:int = 200;
	    //protected static const numberFirstRegExp = new RegExp('^-?['+acceptedNumbers+']+(\\.['+acceptedNumbers+']*)?(E(-?['+acceptedNumbers+']+)?)?');
		//protected static const numberRegExp = new RegExp('^-?['+acceptedNumbers+']+(\\.['+acceptedNumbers+']*)?(E(-?['+acceptedNumbers+']+)?)?$');
		/// cписок запрещенных имен для функций/переменных/констант
		protected static const restrictedNames:Array = DefaultsSource.restricts();
		/// стандартные функции
		protected static const subFunctionsDefault:Array = DefaultsSource.funcs();
		
		
		
		//=====================================
		//свойства
		//-------------------------------------
		//------- принадлежащие объекту -------
		/// переменные
		/////чтение
		public function get Arguments():Array
		{
			return args;
		}
		/////запись
		public function set Arguments(newArgs:Array):*
		{
			var _newArgs:Array=new Array();
			var i:int;
			var ind2:*;
			if (newArgs!=null)
				for (var ind:* in newArgs){
					//попытка добавить переменную.
					//1)проверка имени
					if (!checkName(newArgs[ind]))
						throw new ArgumentError('Недопустимое имя переменной - \''+newArgs[ind]+'\'.');
					//2)проверка имени на запрещенность
					for(ind2 in restrictedNames)
						if (newArgs[ind].length==restrictedNames[ind2].length && newArgs[ind].match(new RegExp(restrictedNames[ind2],'i')) is Array)
							throw new ArgumentError('Недопустимое имя переменной - \''+newArgs[ind]+'\'. Использовать такое имя запрещено.');
					//3)поиск этого имени в переменных
					for (i=0;i<_newArgs.length;i++)
						if (newArgs[ind]==_newArgs[i].length && newArgs[ind].match(new RegExp(_newArgs[i],'i')) is Array)
							throw new ArgumentError('Невозможно добавить переменную \''+newArgs[ind]+'\' дважды.');
					//4)поиск этого имени в функциях
					for (ind2 in subFunctions)
						if (newArgs[ind].length==ind2.length && newArgs[ind].match(new RegExp(ind2,'i')) is Array)
							throw new ArgumentError('Невозможно добавить переменную \''+newArgs[ind]+'\' - в выражении уже существует функция с таким имененем.');
					//5)поиск этого имени в константах
					for (ind2 in constants)
						if (newArgs[ind].length==ind2.length && newArgs[ind].match(new RegExp(ind2,'i')) is Array)
							throw new ArgumentError('Невозможно добавить переменную \''+newArgs[ind]+'\' - в выражении уже существует константа с таким имененем.');
					_newArgs.push(newArgs[ind]);
				}
			args=_newArgs;
			parse();
		}
		
		/// переменные, найденные при разборе (только чтение)
		public function get ArgumentsFound():Array
		{
			return argsFound;
		}
		
		/// константы (только чтение)
		public function get Constants():Array
		{
			return constants;
		}
		
		/// пользовательские константы
		/////чтение
		public function get ConstantsCustom():Array
		{
			return constantsCustom;
		}
		////запись
		public function set ConstantsCustom(newConsts:Array):*
		{
			var _newConsts:Array=new Array();
			var _consts:Array=Utils.deepCopy(constantsDefault);
			var i:int;
			var ind2:*;
			var ma:Array;
			if (newConsts!=null)
				for (var ind:* in newConsts){
					//попытка добавить константу.
					//1)проверка имени и значения
					if (!checkName(ind))
						throw new ArgumentError('Недопустимое имя константы - \''+ind+'\'.');
					if (isNaN(newConsts[ind]))
						throw new ArgumentError('Недопустимое значение константы - \''+newConsts[ind]+'\'.');
					//2)проверка имени на запрещенность
					for(ind2 in restrictedNames)
						if (ind.length==restrictedNames[ind2].length && ind.match(new RegExp(restrictedNames[ind2],'i')) is Array)
							throw new ArgumentError('Недопустимое имя константы - \''+ind+'\'. Использовать такое имя запрещено.');
					//3)поиск этого имени в переменных
					for (i=0;i<args.length;i++)
						if (ind.length==args[i].length && ind.match(new RegExp(args[i],'i')) is Array)
							throw new ArgumentError('Невозможно добавить константу \''+ind+'\' - в выражении уже существует переменная с таким имененем.');
					//4)поиск этого имени в функциях
					for (ind2 in subFunctions)
						if (ind.length==ind2.length && ind.match(new RegExp(ind2,'i')) is Array)
								throw new ArgumentError('Невозможно добавить константу \''+ind+'\' - в выражении уже существует функция с таким имененем.');
					//5)поиск этого имени в константах
					////стандартных
					for (ind2 in constantsDefault)
						if (ind.length==ind2.length && ind.match(new RegExp(ind2,'i')) is Array)
								throw new ArgumentError('Невозможно добавить константу \''+ind+'\' - в выражении уже существует стандартная константа с таким имененем.');
					////пользовательских
					for (ind2 in _newConsts)
						if (ind.length==ind2.length && ind.match(new RegExp(ind2,'i')) is Array)
								throw new ArgumentError('Невозможно добавить константу \''+ind+'\' дважды.');
					_newConsts[ind]=newConsts[ind];
					_consts[ind]=newConsts[ind];
				}
			constantsCustom=_newConsts;
			constants=_consts;
			parse();
		}
		
		/// ошибка в выражении (только чтение)
        public function get FatalError():ExpressionError
		{
			return error;
		}
		
		/// текст формулы в отформатированном виде или null, если ошибка (только чтение)
		public function get FormattedText():String
		{
			return formattedText;
		}
		
		/// функции (только чтение)
		public function get SubFunctions():Array
		{
			return copyOfFuncs(subFunctions);
		}
		
		/// пользовательские функции
		/////чтение
		public function get SubFunctionsCustom():Array
		{
			return copyOfFuncs(subFunctionsCustom);
		}
		////запись
		public function set SubFunctionsCustom(newFuncs:Array):*
		{
			var _newFuncs:Array=new Array();
			var _funcs:Array=copyOfFuncs(subFunctionsDefault);
			var i:int;
			var ind2:*;
			var ma:Array;
			if (newFuncs!=null)
				for (var ind:* in newFuncs){
					//попытка добавить подфункцию.
					//1)проверка имени и значения
					if (!checkName(ind))
						throw new ArgumentError('Недопустимое имя функции - \''+ind+'\'.');
					if (!(newFuncs[ind] is Array) || !(newFuncs[ind]['f'] is Function) || !(newFuncs[ind]['minArgs'] is int) || !(newFuncs[ind]['maxArgs'] is int) || (newFuncs[ind]['minArgs']<0) || (newFuncs[ind]['maxArgs']<newFuncs[ind]['minArgs'] && newFuncs[ind]['maxArgs']!=-1))
						throw new ArgumentError('Пользовательская функция \''+ind+'\' должна быть массивом со строковым ключом, структурой [\'f\']=function, [\'minArgs\']=неотрицательное число, [\'maxArgs\']=число, не меньшее minArgs или равное -1 (для неограниченного числа аргументов).');
					//2)проверка имени на запрещенность
					for(ind2 in restrictedNames)
						if (ind.length==restrictedNames[ind2].length && ind.match(new RegExp(restrictedNames[ind2],'i')) is Array)
							throw new ArgumentError('Недопустимое имя функции - \''+ind+'\'. Использовать такое имя запрещено.');
					//3)поиск этого имени в переменных
					for (i=0;i<args.length;i++)
						if (ind.length==args[i].length && ind.match(new RegExp(args[i],'i')) is Array)
							throw new ArgumentError('Невозможно добавить функцию \''+ind+'\' - в выражении уже существует переменная с таким имененем.');
					//4)поиск этого имени в функциях
					////стандартных
					for (ind2 in subFunctionsDefault)
						if (ind.length==ind2.length && ind.match(new RegExp(ind2,'i')) is Array)
							throw new ArgumentError('Невозможно добавить функцию \''+ind+'\' - в выражении уже существует стандартная функция с таким имененем.');
					////пользовательских
					for (ind2 in _newFuncs)
						if (ind.length==ind2.length && ind.match(new RegExp(ind2,'i')) is Array)
							throw new ArgumentError('Невозможно добавить функцию \''+ind+'\' дважды.');
					//5)поиск этого имени в константах
					for (ind2 in constants)
						if (ind.length==ind2.length && ind.match(new RegExp(ind2,'i')) is Array)
							throw new ArgumentError('Невозможно добавить фукнцию \''+ind+'\' - в выражении уже существует константа с таким имененем.');
					_newFuncs[ind]=newFuncs[ind];
					_funcs[ind]=newFuncs[ind];
				}
			subFunctionsCustom=_newFuncs;
			subFunctions=_funcs;
			parse();
		}

		/// текст форулы, изменение свойства ведет за собой пересчет формулы
		/////чтение
		public function get Text():String
		{
			return text;
		}
        /////запись
		public function set Text(newText:String):void
		{
			if (newText == null)
				text='';
			else
				text=newText;
			parse();
		}
		
		//----------- статические -------------
		/// стандартные константы (только чтение)
		public static function get ConstantsDefault():Array
		{
			return Utils.deepCopy(constantsDefault);
		}

		/// известные разборщику формул запрещенные имена переменных/констант/функций (только чтение)
		public static function get RestrictedNames():Array
		{
			return Utils.deepCopy(restrictedNames);
		}
		
		/// стандартные функции (только чтение)
		public static function get SubFunctionsDefault():Array
		{
			return copyOfFuncs(subFunctionsDefault);
		}

		
		
		//=====================================
		//конструктор
		//-------------------------------------
	    public function Expression(initialText:String='', args:Array=null, funcs:Array=null, consts:Array=null):void
        {
			blockParse=true;
			Arguments=null;
			SubFunctionsCustom=null;
			ConstantsCustom=null;
			Text=initialText;
			Arguments=args;
			SubFunctionsCustom=funcs;
			ConstantsCustom=consts;
			blockParse=false;
			parse();
        }
		
		
        
		//=====================================
		//методы
		//-------------------------------------
		//------- принадлежащие объекту -------
		/// проверка переменной/константы/функции на правильность имени
		protected function checkName(name:String):Boolean
		{
			if (name.length>50 || name.match(nameRegExp)[0]==name)
				return true;
			return false;
		}
		
        /// очищает переменные до распознавания текста
        protected function clear():*
        {
			argsFound=null;
			error=null;
			//units=null;
			units = new Array();
			newUnitID=0;
			formattedText=null;
        }

		//копирует массив функций и возвращает его
		protected static function copyOfFuncs(ref:Array):Array
		{			
			//функции копирвать стандартными способом нельзя - либо теряются ссылки на функции, либо есть вероятность скукожить исходный массив
			var result:* = new Array();
			for (var ind:* in ref){
				result[ind]=new Array();
				result[ind]['f']=ref[ind]['f'];
				result[ind]['minArgs']=ref[ind]['minArgs'];
				result[ind]['maxArgs']=ref[ind]['maxArgs'];
			}
			return result;

		}
		
        /// возвращает  значение узла
        /// <param name="address">ID узла</param>
        /// <param name="argValues">значения аргументов</param>
        public function getUnitValue(address:int):Number
        {
        	var result:Number=0;
			switch (units[address].type){
				//узел-число
				case ExpressionUnit.TYPE_NUMBER:
					result=units[address].value;
					break;
				//узел - аргумент
				case ExpressionUnit.TYPE_ARG:
					result=argValues[units[address].value];
					break;
				//узел - константа
				case ExpressionUnit.TYPE_CONST:
					result=constants[units[address].value];
					break;
				//узел - арифметическое действие
				case ExpressionUnit.TYPE_ARITHMETIC:
					switch(units[address].value){
						case '+':
							result=getUnitValue(units[address].links[0])+getUnitValue(units[address].links[1]);
						break;
						case '-':
							result=getUnitValue(units[address].links[0])-getUnitValue(units[address].links[1]);
						break;
						case '*':
							result=getUnitValue(units[address].links[0])*getUnitValue(units[address].links[1]);
						break;
						case '/':
							result=getUnitValue(units[address].links[0])/getUnitValue(units[address].links[1]);
						break;
						case '^':
							result=Math.pow(getUnitValue(units[address].links[0]),getUnitValue(units[address].links[1]));
						break;
					}
					break;
				//узел - подфункция
				case ExpressionUnit.TYPE_SUBFUNCTION:
					var args:Array=new Array();
					for (var i:int=0;i<units[address].links.length;i++)
							args.push(getUnitValue(units[address].links[i]));
					result=subFunctions[units[address].value]['f'].call(null,args);
					break;
			}
			//для отладки
			//if (units[address].type==ExpressionUnit.TYPE_SUBFUNCTION ||units[address].type==ExpressionUnit.TYPE_ARITHMETIC)
			//	trace(units[address].formattedText+' = '+result);
			if (isFinite(result) && Utils.checkIfNotBigNumber(result))
				return result;
			return NaN;
        }

		/// возвращает  значение выражения
        /// <param name="argValues">значения аргументов</param>
        public function getValue(argValues:Array):Number
        {
			if (error!=null) return NaN;
			var re:RegExp;
			for (var ind:* in argValues){
				try{
					for (var ind2:* in args)
						if (args[ind2]==ind)
							throw 0;
					throw new ArgumentError('Неизвестный аргумент '+ind+' на входе в getValue. Можно задавать значения только известных аргумнетов (имена чувствительны к регистру).');
				}catch(ind:int){};
			}
			
			try{
				this.argValues=argValues;
				return getUnitValue(0);
			}catch(e:*){}
			return NaN;
        }

		
		/// возвращает true, если в выражении есть любая ошибка
        public function hasError():Boolean
        {
            if (error==null)
				return false;
			return true;
        }

		/// парсит введенный Text
        protected function parse():void
        {
			//возврат, если разбор запрещен в настройках
			if (blockParse) return;
			
			//очистка выходных данных (форматированнанный текст, ошибка и тд)
			clear();
			
			try{
				//проверка выражения на пустоту
				if (Utils.countSpacesLeft(text)==text.length)
					throw new ExpressionError(1);
					
				//проверка на запрещенные символы
				var re:*=new RegExp('['+acceptedAll+']');
				for (var i:int=0;i<text.length;i++){
					if (!Utils.isSpace(text.charAt(i)) && text.charAt(i).search(re)==-1)
						throw new ExpressionError(3,i,text.charAt(i),1);
				}
						
				//проверка синтаксиса круглых скобок
				var rbr_level:*=0;
				var closing_rbr_was_before:*=0;
				////прогон всей строки и анализ положения скобок
				for (i=0;i<text.length;i++)
				{
					// (
					if (text.charAt(i)=='('){
						//ошибка в случае, когда встретилась открывающаяся скобка сразу после закрывающейся
						if (closing_rbr_was_before)
							throw new ExpressionError(22,i,'',1);
						rbr_level++;
						closing_rbr_was_before=false;
	
					// )
					}else if (text.charAt(i)==')'){
						rbr_level--;
						closing_rbr_was_before=true;
					
					// пробел
					}else if (Utils.isSpace(text.charAt(i))){
					
					//другой символ
					}else{
						if (closing_rbr_was_before)
							
						closing_rbr_was_before=false;
					};
					
					//случай, когда ))) слишком много
					if (rbr_level<0)
						throw new ExpressionError(20,i,'',1);
				}
				////случай, когда не все открывающиеся скобки закрыты закрыты
				if (rbr_level>0)
					throw new ExpressionError(21,i,rbr_level);
					
				//проверка сочетаний знаков арифметических действий
				var chBefore:*=-1;
				var lastArithmeticCharPos:*=-1;//-1 когда предыдущий симовол - не знак а.д., и позиция знака а.д. если да
				var ch:*;
				////прогон всей строки и анализ положения знаков
				for (i=0;i<text.length;i++)
				{
					ch=text.charAt(i);
					//текущий символ - знак арифметического дейстивя
					if (acceptedArithmetic.indexOf(ch)!=-1){
						//ошибка в случае, когда этот символ не "-" и он в начале выражения
						if (chBefore==-1 && ch!='-')
							throw new ExpressionError(42,i,ch,1);
						//ошибка в случае, когда этот символ не "-" и он после скобки
						if (chBefore=='(' && ch!='-')
							throw new ExpressionError(44,i,ch,1);
						//ошибка в случае, когда этот символ не "-" и он после запятой
						if (chBefore==',' && ch!='-')
							throw new ExpressionError(46,i,ch,1);
						//ошибка в случае, когда этот символ стоит за другим знаком а.д.
						if (lastArithmeticCharPos!=-1)
							throw new ExpressionError(47,i,ch,1);
						lastArithmeticCharPos=i;
					//другой символ (но не пробел)
					}else if (!Utils.isSpace(text.charAt(i))){
						//ошибка, когда текущий символ скобка, а предыдущий - знак а.д.
						if (ch==')' && lastArithmeticCharPos!=-1)
							throw new ExpressionError(43,lastArithmeticCharPos,chBefore,1);
						//ошибка, когда текущий символ скобка, а предыдущий - знак а.д.
						if (ch==',' && lastArithmeticCharPos!=-1)
							throw new ExpressionError(45,lastArithmeticCharPos,chBefore,1);
						lastArithmeticCharPos=-1;
					}else{
						lastArithmeticCharPos=-1;
					}
					chBefore=ch;
				}
				////проверка последнего символа выражения. Если это знак а.д., то ошибка
				if (lastArithmeticCharPos!=-1)
					throw new ExpressionError(41,lastArithmeticCharPos,chBefore,1);

				//запись текста в первый элемент массива узлов
				units[0]=new ExpressionUnit(text);
				//рекурсивный разбор этого элемента
				var tempArgsFound:*=recursiveParse(0,0,false);
				//запоминается отформатированный текст
				formattedText=units[0].formattedText;
				
				var ind:*;
				argsFound=new Array();
				//формируется список найденных переменных 
				for(ind in tempArgsFound){
					argsFound[tempArgsFound[ind]]=true;
				}
				
			}catch(e:ExpressionTooBigError){
				// если узел слишком большой для разбора
				error = new ExpressionError(2);
			}catch(e:ExpressionError){
				//если поймана ошибка в формуле, она записывается
				error = e;
			}/*catch(e:Error){
				//если поймана неизвестная ошибка, она сохраняется как ошибка с кодом ноль
				error = new ExpressionError(0);
			}*/
			
			//на время отладки
			/*if (error!=null)
				trace('===>>>\''+text+'\' parsed with error:'+error+'\nпозиция ошибки: '+error.Position+', длина: '+error.Length+'');
			else{
				trace ('===>>>\''+text+'\' parsed.\nUnits array:');
				for (i=0;i<units.length;i++)
					trace(i+': '+units[i]);
			}*/
        }

        /// рекурсивно разбирает часть выражения
        /// возвращает массив с именами переменных, которые встретились или вызывает исключение:
        /// * FormulaEmptyError - если узел пуст 
        /// * ExpressionError - если ошибка в разборе
        /// * FormulaTooBigError - если узел слишком большой для разбора (слишком большая глубина у рекурсии)
        /// <param name="unitID">ID узла в массиве узлов</param>
        /// <param name="initialPosition">глобальная позиция этого выражения (для того, чтобы в случае чего правильно указать на позицию ошибки)</param>
        /// <param name="bracketsNecessary">важно ли наличие скобок вокруг всего выражения (используется только для создания форматированной строки)</param>
        /// <param name="reverseSubtr">флаг, показывающий, поменены ли в этом узле плюс на минус и наоборот</param>
		/// <param name="reverseDiv">флаг, показывающий, поменены ли в этом узле умножить на разделить и наоборот</param>
		protected function recursiveParse(unitID:int, initialPosition:int,bracketsNecessary:Boolean=false,reverseSubtr:Boolean=false,reverseDiv:Boolean=false):Array
        {
			var result:*=new Array();
			
			//проверка на слишком большие формулы
			if (newUnitID>MAX_COMPLEXITY)
				throw new ExpressionTooBigError();
			
			//разбираемый текст - в буфер	
			var textToParse:String=units[unitID].text;
			
			//обрезка пробелов по краям (со сдвигом начальной позиции)
			initialPosition+=Utils.countSpacesLeft(textToParse);
			textToParse=Utils.trim(textToParse);
			
			//проверка на пустой блок
			if (textToParse.length==0)
				throw new ExpressionEmptyError();
			
			//вложенность в скобки по краям текста узла
			var rbr_level_min:*=Infinity;
			
			try{
				//обработка синтаксиса круглых скобок
				var rbr_level:*=0;
				////прогон всей строки и анализ положения скобок
				for (i=0;i<textToParse.length;i++)
				{
					// (
					if (textToParse.charAt(i)=='('){
						rbr_level++;
					// )
					}else if (textToParse.charAt(i)==')'){
						rbr_level--;
					//другой символ
					}else if (!Utils.isSpace(textToParse.charAt(i))){
						if (rbr_level<rbr_level_min){
							rbr_level_min=rbr_level;
						}
					}
				}
				////cлучай, когда выражение - тупо несколько открывающихся, а потом закрывающихся скобок
				if (rbr_level_min==Infinity)
					throw new ExpressionError(23,initialPosition,textToParse,textToParse.length);
				////когда случай (выражение) или ((выражение)) и тд скобки по краям удаляются
				if (rbr_level_min>0){
					for (i=0;i<rbr_level_min;i++){
						textToParse=textToParse.substring(1,textToParse.length-1);
						initialPosition+=Utils.countSpacesLeft(textToParse)+1;
						textToParse=Utils.trim(textToParse);
					}
				}
				
				//флаги замен знаков отменяются, если выражение опоясано скобками
				if(rbr_level_min && rbr_level_min<Infinity){
					reverseSubtr=false;
					reverseDiv=false;
				}
				
				var ind:String;
				var i:int;
				var re:RegExp;
				
				//узел -(выражение?выражение) ? - знак арифметического действия
				var blindStr:String;
				var pos:int;
				var ch:String;
				var j:int;
				////инверсия знаков у правой и левой частей разбиения (по умолчанию отсуствует)
				var leftReverseSubtr:*=false;
				var leftReverseDiv:*=false;
				var rightReverseSubtr:*=false;
				var rightReverseDiv:*=false;
				////сначала создается копия исходного текста, где ВСЁ, что в скобках будет заменено пробелом
				blindStr=textToParse;
				//////прогон всей blindStr и вырезание символов внутри скобок
				rbr_level=0;
				for (i=0;i<blindStr.length;i++)
				{
					// (
					if (blindStr.charAt(i)=='('){
						rbr_level++;
					// )
					}else if (blindStr.charAt(i)==')'){
						rbr_level--;
					//другой символ
					}else if (rbr_level!=0)
							blindStr=blindStr.substring(0,i)+' '+blindStr.substring(i+1);
				}

				////поиск знаков арифметического действия в blindStr (зники берутся acceptedArithmetic, там они расставлены в порядке уменьешния приоритета)
				for (i=0;i<acceptedArithmetic.length;i++)
				{
					//выявляется позиция знака а.д. и сам знак
					ch=acceptedArithmetic.charAt(i);
					pos=blindStr.lastIndexOf(ch);
					if (pos==-1)
						continue;
										
					//случай с '-'
					if (ch=='-'){
						//разворот знаков в дочерних узлах
						if (reverseSubtr)
							leftReverseSubtr=true;
						else
							rightReverseSubtr=true;
						//менются знаки + на - и - на + в узле после знака в случае, если арифметическое дейстивие - минус
						for (j=pos+1;j<blindStr.length;j++)
							if (blindStr.charAt(j)=='-')
								textToParse=textToParse.substring(0,j)+'+'+textToParse.substring(j+1);
							else if (blindStr.charAt(j)=='+')
								textToParse=textToParse.substring(0,j)+'-'+textToParse.substring(j+1);
					//случай с '/'
					}else if (ch=='/'){
						//разворот знаков в дочерних узлах
						if (reverseDiv)
							leftReverseDiv=true;
						else
							rightReverseDiv=true;
						//менются знаки / на * и * на / в узле после знака в случае, если арифметическое дейстивие - поделить
						for (j=pos+1;j<blindStr.length;j++)
							if (blindStr.charAt(j)=='*')
								textToParse=textToParse.substring(0,j)+'/'+textToParse.substring(j+1);
							else if (blindStr.charAt(j)=='/')
								textToParse=textToParse.substring(0,j)+'*'+textToParse.substring(j+1);
					//случай с '+'
					}else if (ch=='+'){
						//разворот знаков в дочерних узлах
						if (reverseSubtr){
							rightReverseSubtr=true;
						}
					//случай с '*'
					}else if (ch=='*'){
						//разворот знаков в дочерних узлах
						if (reverseDiv)
							rightReverseDiv=true;
					//случай c другими знаками
					}//пусто
					
					//задаются параметры этого узла
					units[unitID].type=ExpressionUnit.TYPE_ARITHMETIC;
					units[unitID].value=ch;
					units[unitID].links=new Array();
					
					//создание ветвления
					////узел до знака
					units[++newUnitID]=new ExpressionUnit(textToParse.substring(0,pos));
					units[unitID].links.push(newUnitID);
					try{
						result=result.concat(recursiveParse(newUnitID,initialPosition,true,leftReverseSubtr,leftReverseDiv));
					}catch(e:ExpressionEmptyError){
						if (ch=='-'){
							units[newUnitID].type=ExpressionUnit.TYPE_NUMBER;
							units[newUnitID].value=0;
						}else 
							throw new ExpressionError(40,initialPosition+pos,ch,1);
					}
					////узел после знака
					units[++newUnitID]=new ExpressionUnit(textToParse.substring(pos+1));
					units[unitID].links.push(newUnitID);
					try{
						result=result.concat(recursiveParse(newUnitID,initialPosition+pos+1,true,rightReverseSubtr,rightReverseDiv));
					}catch(e:ExpressionEmptyError){
						throw new ExpressionError(40,initialPosition+pos,ch,1);
					}
					throw new Result();
				}
				
				//обработка ошибки нахождения запятой вне перечисления аргументов функции
				var ma:Array;
				if (blindStr.indexOf(',')!=-1)
					throw new ExpressionError(33,initialPosition+blindStr.indexOf(','),',',1);
				
				//рассмотрение варианта числовыражение (например 10x)
				var matchResult:*=textToParse.match(numberFirstRegExp);
				if (matchResult is Array && matchResult[0].search(oneDigit)!=-1 && matchResult[0].length!=textToParse.length){
					units[unitID].type=ExpressionUnit.TYPE_ARITHMETIC;
					units[unitID].value=' ';
					units[unitID].links=new Array();
					units[++newUnitID]=new ExpressionUnit(matchResult[0]);
					units[unitID].links.push(newUnitID);
					result=result.concat(recursiveParse(newUnitID,initialPosition,false));
					units[++newUnitID]=new ExpressionUnit(textToParse.substring(matchResult[0].length));
					units[unitID].links.push(newUnitID);
					result=result.concat(recursiveParse(newUnitID,initialPosition+matchResult[0].length,false));
					throw new Result();
				}
											
				//рассмотрение варианта конечного узла
				////узел - число
				ma=textToParse.match(numberRegExp);
				if (ma is Array && ma[0].search(oneDigit)!=-1){
					try{
						units[unitID].value=Utils.strToNumber(textToParse);
					}catch(e:*){
						throw new ExpressionError(32,initialPosition,ma[0],ma[0].length)
					}
					if (!Utils.checkIfNotBigNumber(units[unitID].value))
							throw new ExpressionError(39,initialPosition,ma[0],ma[0].length)
					units[unitID].type=ExpressionUnit.TYPE_NUMBER;
					throw new Result();
				}
				////узел - переменная или константа
				ma=textToParse.match(nameSymbolRegExp);
				if (ma is Array && Utils.trimLeft(textToParse.substring(ma[0].length)).charAt(0)=='(') //это чтобы функция под эту гребенку не попала
					ma=null;
				if (ma is Array){
					re=new RegExp(ma[0],'i'); 
					//поиск по переменным
					for(i=0;i<args.length;i++){
						if (args[i].length==ma[0].length && args[i].match(re) is Array){
							//переменная найдена
							//проверка, нет ли ничего лишнего за именем переменной
							if (ma[0].length<textToParse.length)
								throw new ExpressionError(38,initialPosition+ma[0].length);
							units[unitID].type=ExpressionUnit.TYPE_ARG;
							units[unitID].value=args[i];
							result.push(args[i]);
							throw new Result();
						}
					}
					//поиск по константам
					for (ind in constants)
						if (ind.length==ma[0].length && ind.match(re) is Array){
							//константа найдена
							//проверка, нет ли ничего лишнего за именем переменной
							if (ma[0].length<textToParse.length)
								throw new ExpressionError(38,initialPosition+ma[0].length);
							units[unitID].type=ExpressionUnit.TYPE_CONST;
							units[unitID].value=ind;
							throw new Result();
						}
					//поиск не дал результатов
					////поиск по функциям
					for (ind in subFunctions)
						if (ind.length==ma[0].length && ind.match(re) is Array){
							//функция найдена
							throw new ExpressionError(37,initialPosition+ma[0].length,ma[0]);
						}
					////если это не функция, то ошибка имени
					throw new ExpressionError(31,initialPosition,ma[0],ma[0].length);
				}
				
				//рассмотрение варианта функция(аргумент1,аргумент2,аргумент3...)
				ma=textToParse.match(nameFuncRegExp);
				var functionName:String;
				var buf:String;
				j=initialPosition+textToParse.indexOf('(');//позиция открывающейся скобки
				if (ma is Array){
					re=new RegExp(Utils.trimRight(textToParse.substring(0,textToParse.indexOf('('))),'i'); 
					//разбор содержимого скобок
					////сначала создается копия исходного текста, где ВСЁ, что в скобках будет заменено пробелом
					blindStr=textToParse;
					//////прогон всей blindStr и вырезание символов кроме главных скобок и запятых
					rbr_level=0;
							for (i=0;i<blindStr.length;i++)
							{
								// (
								if (blindStr.charAt(i)=='(')
									rbr_level++;
								// )
								if (blindStr.charAt(i)==')')
									rbr_level--;
								if (!((rbr_level==1 && (blindStr.charAt(i)==',' || blindStr.charAt(i)=='(')) || (rbr_level==0 && blindStr.charAt(i)==')')))
										blindStr=blindStr.substring(0,i)+' '+blindStr.substring(i+1);
								
								
							}
					//поиск по функциям
					for (ind in subFunctions)
						if (ind.length==ma[1].length && ind.match(re) is Array){
							//функция найдена
							units[unitID].type=ExpressionUnit.TYPE_SUBFUNCTION;
							units[unitID].value=ind;
							units[unitID].links=new Array();
							////получение содержимого скобок функции
							buf=textToParse.substring(blindStr.indexOf('(')+1,blindStr.indexOf(')'));
							var k:*=Utils.countSpacesRight(buf);
							var blindArgs:*=blindStr.substring(blindStr.indexOf('(')+1,blindStr.indexOf(')'));
							////циклическое разбиение содержимого на аргументы
							if (Utils.trim(buf)!=''){
								blindArgs+=',';
								buf+=',';
							};
							while (blindArgs.indexOf(',')!=-1){
								//создание нового узла
								i=j+1;//начальная позиция аргумента функции
								j+=1+buf.substring(0,blindArgs.indexOf(',')).length;//конечная позиция аргумента функции
								units[++newUnitID]=new ExpressionUnit(buf.substring(0,j-i));
								units[unitID].links.push(newUnitID);
								//разбор аргумента
								try{
									result=result.concat(recursiveParse(newUnitID,i,false,false,leftReverseDiv));
								}catch(e:ExpressionEmptyError){
									if (units[unitID].links.length==1)
										throw new ExpressionError(57,i,ind,j-i);
									else
										throw new ExpressionError(58,i,ind,j-i);
								}
								buf=buf.substring(blindArgs.indexOf(',')+1);
								blindArgs=blindArgs.substring(blindArgs.indexOf(',')+1);
							}
							var minCount:int=subFunctions[units[unitID].value].minArgs;
							var maxCount:int=subFunctions[units[unitID].value].maxArgs;
							////проверка количества аргументов (используем уже ранее объяывленную переменную pos)
							pos=units[unitID].links.length;
							//////колиечство аргументов превышино
							if (pos>maxCount && maxCount!=-1){
								j=initialPosition;
								j+=textToParse.indexOf('(')+((maxCount==0)?1:0);
								//подсчет положения ошибки                                           	sin(x,x)  cos() 10
								for (i=0;i<maxCount;i++)
									j+=1+units[units[unitID].links[i]].text.length;
								//создание ошибки
								if (maxCount!=minCount)
									throw new ExpressionError(51,j,new Array(units[unitID].value,minCount,maxCount),blindStr.indexOf(')')-j+initialPosition);
								else if (maxCount!=0)
									throw new ExpressionError(52,j,new Array(units[unitID].value,minCount),blindStr.indexOf(')')-j+initialPosition);
								else
									throw new ExpressionError(53,j,units[unitID].value,blindStr.indexOf(')')-j+initialPosition);
							//////количество аргументов меньше положенного
							}else if (pos<minCount){
								if (minCount==maxCount)
									throw new ExpressionError(56,initialPosition+blindStr.indexOf(')')-k,new Array(units[unitID].value,minCount),k);
								else if (maxCount==-1)
									throw new ExpressionError(54,initialPosition+blindStr.indexOf(')')-k,new Array(units[unitID].value,minCount),k);
								else
									throw new ExpressionError(55,initialPosition+blindStr.indexOf(')')-k,new Array(units[unitID].value,minCount,maxCount),k);
							}
							
							//проверка, нет ли ничего лишнего за вызовом функции
							if (blindStr.indexOf(')')<textToParse.length-1)
								throw new ExpressionError(38,initialPosition+blindStr.indexOf(')')+1);
							//для random2
							if (units[unitID].value=='random2') result.push(args[0]); 
							throw new Result();
						}
					//поиск не дал результатов
					////поиск по переменным
					for(i=0;i<args.length;i++)
						if (args[i].length==ma[1].length && args[i].match(re) is Array)
							//переменная найдена
							throw new ExpressionError(35,initialPosition+textToParse.indexOf('('),ma[1],textToParse.length-textToParse.indexOf('('));
					////поиск по константам
					for (ind in constants)
						if (ind.length==ma[1].length && ind.match(re) is Array)
							//константа найдена
							throw new ExpressionError(36,initialPosition+textToParse.indexOf('('),ma[1],textToParse.length-textToParse.indexOf('('));

					//поиск в аргументах и константах не дал результатов => функция с неизвестным имененм
					throw new ExpressionError(34,initialPosition,ma[1],ma[1].length);
				}
				
			//поймано событие успешного нахождения структуры узла
			}catch (r:Result){
				//форматирование форматированного текста формулы
				var ft:String='';
				////для чисел
				if (units[unitID].type==ExpressionUnit.TYPE_NUMBER){
					ft=units[unitID].value;
				////для переменных и констант
				}else if (units[unitID].type==ExpressionUnit.TYPE_ARG || units[unitID].type==ExpressionUnit.TYPE_CONST){
					ft=units[unitID].value;
				////для арифметических действий
				}else if (units[unitID].type==ExpressionUnit.TYPE_ARITHMETIC){
					//левая часть от знака
					ft=units[units[unitID].links[0]].formattedText;
					//сам знак
					var c:*=units[unitID].value;
					if (c=='+' && reverseSubtr)c='-';
					else if (c=='-' && reverseSubtr)c='+';
					else if (c=='*' && reverseDiv)c='/';
					else if (c=='/' && reverseDiv)c='*';
					if (c==' '){c='';units[unitID].value='*'}
					ft+=c;
					//правая часть от знака
					ft+=units[units[unitID].links[1]].formattedText;
				////для функций
				}else if (units[unitID].type==ExpressionUnit.TYPE_SUBFUNCTION){
					//имя функции
					ft=units[unitID].value+'(';
					//аргументы через запятую
					for (i=0;i<units[unitID].links.length;i++){
						ft+=units[units[unitID].links[i]].formattedText+',';
					}
					//закрывающаяся скобка
					ft=ft.substring(0,ft.length-1)+')';
				}
				
				//опоясывание скобками, если необходимо
				if (bracketsNecessary && rbr_level_min>0 && units[unitID].type!=ExpressionUnit.TYPE_SUBFUNCTION)
					ft='('+ft+')';
				units[unitID].formattedText=ft;
				
				//упрощение узла, если возможно
				if (result.length==0 && units[unitID].type!=ExpressionUnit.TYPE_NUMBER)
					simplify(unitID);
					
				//возврат списка использованных переменных
				return result;
			}

			//если результата не было и не выкинута какая-то определенная ошибка, значит узел разобрать не получилось, выкидывается ошибка 30
			throw new ExpressionError(30,initialPosition,textToParse,textToParse.length);
			
        }

        /// упрощает узел
        /// подсчитывает значение непростого узла, не содержащего аргументов; полученное значение записывается в value
		protected function simplify(address:int):*
        {
			units[address].value=getUnitValue(address);
			units[address].type=ExpressionUnit.TYPE_NUMBER;
			if (units[address].links is Array)
				for (var ind:* in units[address].links)
					units[units[address].links[ind]]=null;
			units[address].links=null;
        }

		/// возвращает формулу в отформатированном текстовом виде
        public function toString():String
        {
            return formattedText;
		}
    }
}

///## класс псевдоошибки, используемой в recursiveParse для выбрасывания результата, а затем его обработки 
internal class Result extends Error{};
///## класс ошибки - выражение пустое
internal class ExpressionEmptyError extends Error { };
///## класс ошибки - выражение слишком большое
internal class ExpressionTooBigError extends Error { };

