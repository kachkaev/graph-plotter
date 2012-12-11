package formula{
    import utils.*;
	import errors.FormulaError;
    /*
	* класс формула
	* класс, подходящий для представления формулы графика функции или уравнения графика функции, в общем случае - f(x,y)
	*/
	public class Formula{
        
		//=====================================
		//переменные, инкапсулированные в класс
		//-------------------------------------

		/// текст формулы
        protected var text:String;
		
		/// отформатированный текст формулы(без лишних пробелов и с нормализированным индексом букв)
        protected var formattedText:String;
		
		/// ошибка
        protected var error:FormulaError;

        /// массив частей формулы
        protected var units:Array;
		/// идентификатор нового узла формулы в массиве units
        protected var newUnitID:int;

		//тип формулы
		protected var type:int;
		/// тип формулы - функция f(x)
        public static const TYPE_F_X:int = 1;
        /// тип формулы - уравнение f(x,y)=z
        public static const TYPE_F_XY:int = 2;
        /// тип формулы - ошибка
        public static const TYPE_NONE:int = 0;
		
        //известные разборщику формул допустимые символы (с учетом регистра и кроме пробелов)
		protected static const acceptedChars='0123456789.,+-=*/^()abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ';
		
		/// известные разборщику формул функции
        protected static const subFunctions:Array = new Array();

        /// известные разборщику формул константы
        protected static const constants:Array = new Array();

        /// признак присутствия x и отсутствия y в узле формулы
        protected const HAS_X:int = 1;
		/// признак присутствия y и отсутствия x в узле формулы
        protected const HAS_Y:int = 2;
		/// признак отсутствия x и y в узле формулы
        protected const HAS_NONE:int = 0;
		/// признак присутствия и x, и y в узле формулы
        protected const HAS_XY:int = 3;
		/// признак неупрощаемого узла, несмотря на то, что x и y не встретились (напмриер, когда внутри - функция random)
       	protected const HAS_NONE_BUT_NOT_SIMPE:int=4;
        
		/// максимальное количество узлов формулы
        /// фактически - максимальные допустимые сложность и размер формулы
        protected static const MAX_SIZE:int = 30;


		//=====================================
		//свойства
		//-------------------------------------
	
		/// текст форулы, изменение свойства ведет за собой пересчет формулы
		/////чтение
		public function get Text():String
		{
			return text;
		}
        /////запись
		public function set Text(newText:String):void
		{
			text=newText;
			parse();
		}
		
        /// тип функции - f(x) или f(x,y) или NONE (только чтение)
        public function get Type():int
		{
			return type;
		}
		
		/// ошибка в текстовом виде (только чтение)
        public function get ErrorMessage():String
		{
			return error.toString();
        }

        /// тип ошибки (только чтение)
        public function get ErrorType():int
        {
			return error.Type;
        }

        /// позиция ошибки (только чтение)
        public function get ErrorPosition():int
        {
			return error.Position;
		}

        /// длина ошибки (только чтение)
        public function get ErrorLength():int
        {
			return error.Length;
		}

		/// известные разборщику формул функции (только чтение)
        public static function get SubFunctions():Array
        {
			return Utils.deepCopy(subFunctions);
		}

        /// известные разборщику формул константы (только чтение)
        public static function get Constants():Array
        {
			return Utils.deepCopy(constants);
        }

		
        //=====================================
		//методы
		//-------------------------------------
		
		/// конструктор
		public function Formula(initialText:String=""):void{
			Text=initialText;
		}
		
		/// возвращает true, если в формуле есть любая ошибка
        public function hasError():Boolean
        {
            if (error==null)
				return false;
			return true;
        }

        /// возвращает  значение функции f(x)
        /// работает только если функция типа y=f(x)
        /// <param name="x">значение x</param>
        public function getValueY(x:Number):Number
        {
            if (type!=TYPE_F_X)
				throw new Error ('Значение Y можно получить только у формул типа f(x)');
			return getUnitValue(0,x,0);
        }

        /// возвращает  значение функции z (x,y)
        /// работает только если функция типа y=f(x,y)
        /// <param name="x">значение x</param>
        /// <param name="y">значение y</param>
        public function getValueZ(x:Number, y:Number):String
        {
            if (type!=TYPE_F_XY)
				throw new Error ('Значение Z можно получить только у формул типа f(x,y)');
			return getUnitValue(0,x,y);
        }

        /// возвращает  значение узла address  при заданных значениях x и y
        /// <param name="address">ID узла</param>
        /// <param name="x">значение x</param>
        /// <param name="y">значение y</param>
        public function getUnitValue(address:int, x:Number, y:Number)
        {
        	throw new Error('функция getUnitValue еще не создана');
        }
		
		/// возвращает формулу в отформатированном текстовом виде
        public function toString():String
        {
            return formattedText;
		}

        /// парсит введенный Text
        /// работает следующим образом:
        /// 1) проверяет количество знаков =, выдает ошибку если их не 1.
        /// 2) парсит правую и левую части от "=", выдает ошибку, если парсинг хотя бы 1 части провалился. Запоминает, встретился ли в правой и левых частях y или нет.
        /// 4) генерирует formattedText.
        /// 3) делает z=f(x,y) = левая часть минус правая часть от знака равно.
        /// 5) смотрит, если правая или левая часть простая и состоит только из y (а может y+const), а другая y не содержит, то это функция типа f(x).  z = y - всё остальное. При вычислении z при y=0 получаем. -f(x).
        protected function parse():void
        {
            clear();
			
			try{
				//проверка формулы на пустоту
				if (Utils.countSpacesLeft(text)==text.length)
					throw new FormulaError(1);
					
				for (var i:int=0;i<text.length;i++)
					if (!Utils.isSpace(text.charAt(i)) && acceptedChars.indexOf(text.charAt(i))==-1)
						throw new FormulaError(3,i,text.charAt(i),1);
				//разбиение формулы на части знаком "равно"
				var splitted:Array = text.split('=');
				//проверка количества знаков "=", ошибка, если "равно" не один.
				if(splitted.length < 2)
					throw new FormulaError(10,text.length);
				if(splitted.length > 2)
					throw new FormulaError(11,(splitted[0]+splitted[1]).length+1,'',1);
				
				//переменные, знающие что из x и y в левой, а что в правой части уравнения
				var whatInLeft:int;
				var whatInRight:int;
				
				//рассмотрение ЛЕВОЙ части формулы
				try{
					whatInLeft=recursiveParse(splitted[0],0);
				// если слева от равно ничего нет
				}catch(e:FormulaEmptyError){
					throw new FormulaError(12,0);
				}catch(e:FormulaError){
					if (e.Type==21)
						throw new FormulaError(14,splitted[0].length,e.Content);
					throw e;
				}
				//рассмотрение ПРАВОЙ части формулы
				try{
					whatInRight=recursiveParse(splitted[1],splitted[0].length+1);
				// если справа от равно ничего нет
				}catch(e:FormulaEmptyError){
					throw new FormulaError(13,splitted[0].length+1);
				}				
				
				//если в правой и левой части аргументов не встретилось
				if (whatInLeft<=HAS_NONE_BUT_NOT_SIMPE && whatInRight<=HAS_NONE_BUT_NOT_SIMPE)
					throw new FormulaError(4,-1);
				
				//если в левой или правой части только y, а в другой он не встречается , то это y=f(x)
				
				//если в левой или правой части только x, а в другой он не встречается , то это x=f(y)
				
				//иначе - z=(f(x,y))
				
			}catch(e:FormulaTooBigError){
				// если узел слишком большой для разбора
				error = new FormulaError(2,-1);
			}catch(e:FormulaError){
				//если поймана ошибка в формуле, она записывается
				error = e;
			}catch(e:Error){
				//если поймана неизвестная ошибка, она сохраняется как ошибка с кодом ноль
				error = new FormulaError(0);
			}
        }

        /// рекурсивно парсит часть формулы
        /// Возвращает HAS_X/HAS_Y/HAS_XY/HAS_NONE/HAS_NONE_BUT_NOT_SIMPE в зависимости от того, какие из переменных встретились.
        ///  Или исключение:
        ///  FormulaEmptyError - если узел пуст 
        ///  FormulaError - если ошибка в разборе
        ///  FormulaTooBigError - если узел слишком большой для разбора (слишком большая глубина у рекурсии)
        /// <param name="textToParce">текст с необрезанными пробелами - часть формулы</param>
        /// <param name="initialPosition">позиция этого текста в глобальной формуле (для того, чтобы в случае чего правильно указать на позицию ошибки)</param>
        /// <param name="bracketsNecessary">важно ли наличие круглых скобок вокруг всего выражения (используется только для создания форматированной строки)</param>
        protected function recursiveParse(textToParse:String, initialPosition:int,bracketsNecessary:Boolean=true):int
        {

			//проверка на слишком большие формулы
			if (newUnitID>MAX_SIZE)
				throw new FormulaTooBigError();
				
			//обрезка пробелов по краям
			initialPosition+=Utils.countSpacesLeft(textToParse);
			textToParse=Utils.trim(textToParse);
			
			//проверка на пустой блок
			if (Utils.countSpacesLeft(textToParse)==textToParse.length)
				throw new FormulaEmptyError();
			
			//обработка синтаксиса круглых скобок
			var rbr_level=0;
			var rbr_level_min=Infinity;
			var closing_rbr_was_before=0;
			var i:int;
			////прогон всей строки и анализ положения скобок
			for (i=0;i<textToParse.length;i++)
			{
				// (
				if (textToParse.charAt(i)=='('){
					//ошибка в случае, когда встретилась открывающаяся скобка сразу после закрывающейся
					if (closing_rbr_was_before)
						throw new FormulaError(22,i,'',1);
					rbr_level++;
					closing_rbr_was_before=false;

				// )
				}else if (textToParse.charAt(i)==')'){
					rbr_level--;
					closing_rbr_was_before=true;
				
				// пробел
				}else if (Utils.isSpace(textToParse.charAt(i))){
				
				//другой символ
				}else{
					if (rbr_level<rbr_level_min)
						rbr_level_min=rbr_level;
					closing_rbr_was_before=false;
				};
				
				//случай, когда ))) слишком много
				if (rbr_level<0)
					throw new FormulaError(20,i,'',1);
			}
			
			//случай, когда не все ((( закрыты
			if (rbr_level>0)
			throw new FormulaError(21,i,rbr_level);
			
			//когда случай (выражение) или ((выражение)) и тд скобки по краям удаляются
			if (rbr_level_min>0){
				for (i=0;i<rbr_level_min;i++){
					textToParse=textToParse.substring(1,textToParse.length-1);
					initialPosition+=Utils.countSpacesLeft(textToParse)+1;
					textToParse=Utils.trim(textToParse);
				}
			}
			
			//тут пока не доделано:)
			throw new FormulaError(100,initialPosition,textToParse,textToParse.length);
			return HAS_NONE;
        }

        /// упрощает узел
        /// подсчитывает значение узла при x=0 и y=0, полученное значение записывается в value
		/// вызывается только для узлов, не содержащих и x и y и разрешающих упрощение (не HAS_NONE_BUT_NOT_SIMPE)
		protected function simplify(address:int)
        {
        	throw new Error('функция simplify еще не создана');
        }

        /// очищает объект класса
        protected function clear()
        {
        	units=null;
			formattedText="";
			error=null;
			newUnitID=0;
			type=TYPE_NONE;
        }
    }
}

/// класс ошибки - разбираемый узел формулы пуст
internal class FormulaEmptyError extends Error { }
/// класс ошибки - формула слишком большая
internal class FormulaTooBigError extends Error { }
