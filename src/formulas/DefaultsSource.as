package formulas{
	import utils.*;
	/*
    * класс - источник стандартных функций и констант для Expression
    * получение функций  - DefaultsSource.funcs()
	* получение констант - DefaultsSource.consts()
	*/
	internal class DefaultsSource
	{
		//============================
		//источник стандартных констант
		
		private static  var c:Array=null;
		//возвращает список стандартынх констант
		public static function consts():Array
		{
			if (c==null) {
				c=new Array();
				c['PI']=Math.PI;
				c['EXP']=Math.E;
			}
			return c;
		}
		
		//============================
		//источник стандартных функций
		
		private static  var f:Array=null;
		//добавляет функцию в список стандартных функций
		private static function addF(key:String, func:* ,minArgs:int=0,maxArgs:int=-2):*
		{
			f[key]=new Array();
			f[key]['f']=func;
			f[key]['minArgs']=minArgs;
			if (maxArgs==-2) {
				f[key]['maxArgs']=minArgs;
			} else {
				f[key]['maxArgs']=maxArgs;
			}
		}
		//возвращает список стандартынх функций
		public static function funcs():Array
		{
			if (f==null) {
				f=new Array();
				//тригонометрия
				addF('sin',function():*{return Math.sin(arguments[0][0]);},1);
				addF('cos',function():*{return Math.cos(arguments[0][0]);},1);
				addF('tg' ,       function():*{return Math.tan(arguments[0][0]);},1);
				/*eng*/addF('tan',function():*{return Math.tan(arguments[0][0]);},1);
				addF('ctg',       function():*{return 1/Math.tan(arguments[0][0]);},1);
				/*eng*/addF('cot',function():*{return 1/Math.tan(arguments[0][0]);},1);
				/*!!!description needed*/addF('sec',function():*{return 1/Math.cos(arguments[0][0]);},1);
				/*!!!description needed*/    addF('cosec',function():*{return 1/Math.sin(arguments[0][0]);},1);
				/*!!!description needed,eng*/addF('csc',  function():*{return 1/Math.sin(arguments[0][0]);},1);
				
				addF('arcsin',function():*{return Math.asin(arguments[0][0]);},1);
				addF('arccos',function():*{return Math.acos(arguments[0][0]);},1);
				addF('arctg',        function():*{return Math.atan(arguments[0][0]);},1);
				/*eng*/addF('arctan',function():*{return Math.atan(arguments[0][0]);},1);
				addF('arcctg',       function():*{return (arguments[0][0]<0?Math.PI:0)+Math.atan(1/arguments[0][0]);},1);
				/*eng*/addF('arccot', function():*{return (arguments[0][0]<0?Math.PI:0)+Math.atan(1/arguments[0][0]);},1);
				/*!!!description needed*/addF('arcsec',function():*{return Math.acos(1/arguments[0][0]);},1);
				/*!!!description needed*/addF('arccosec',function():*{return Math.asin(1/arguments[0][0]);},1);
				/*!!!description needed,en*/addF('arccsc',function():*{return Math.asin(1/arguments[0][0]);},1);
				
				//Гиперболические функции
				/*!!!description needed for all*/
				addF('sh',function():*{return (Math.exp(arguments[0][0])-Math.exp(-arguments[0][0]))/2},1);
				/*eng*/addF('sinh',function():*{return (Math.exp(arguments[0][0])-Math.exp(-arguments[0][0]))/2},1);
				addF('ch',function():*{return (Math.exp(arguments[0][0])+Math.exp(-arguments[0][0]))/2},1);
				/*eng*/addF('cosh',function():*{return (Math.exp(arguments[0][0])+Math.exp(-arguments[0][0]))/2},1);
				addF('th',function():*{return (Math.exp(2*arguments[0][0])-1)/(Math.exp(2*arguments[0][0])+1)},1);
				/*eng*/addF('tanh',function():*{return (Math.exp(2*arguments[0][0])-1)/(Math.exp(2*arguments[0][0])+1)},1);
				addF('cth',function():*{return (Math.exp(2*arguments[0][0])+1)/(	Math.exp(2*arguments[0][0])-1)},1);
				/*eng*/addF('coth',function():*{return (Math.exp(2*arguments[0][0])+1)/(	Math.exp(2*arguments[0][0])-1)},1);
				addF('sech',function():*{return 2/(Math.exp(arguments[0][0])+Math.exp(-arguments[0][0]))},1);
				addF('cosech',function():*{return 2/(Math.exp(arguments[0][0])-Math.exp(-arguments[0][0]))},1);
				/*eng*/addF('csch',function():*{return 2/(Math.exp(arguments[0][0])-Math.exp(-arguments[0][0]))},1);
				
				//обратные гиперболические функции
				/*!!!description needed for all*/
				addF('arsh',          function():*{return Math.log(arguments[0][0]+Math.sqrt(arguments[0][0]*arguments[0][0]+1))},1);
				/*eng*/addF('arcsinh',function():*{return Math.log(arguments[0][0]+Math.sqrt(arguments[0][0]*arguments[0][0]+1))},1);
				addF('arch',          function():*{return arguments[0][0]>=1?(Math.log(arguments[0][0]+Math.sqrt(arguments[0][0]*arguments[0][0]-1))):NaN},1);
				/*eng*/addF('arccosh',function():*{return arguments[0][0]>=1?(Math.log(arguments[0][0]+Math.sqrt(arguments[0][0]*arguments[0][0]-1))):NaN},1);
				addF('arth',          function():*{return (arguments[0][0]<1 && arguments[0][0]>-1)?(Math.log((1+arguments[0][0])/(1-arguments[0][0]))/2):NaN},1);
				/*eng*/addF('arctanh',function():*{return (arguments[0][0]<1 && arguments[0][0]>-1)?(Math.log((1+arguments[0][0])/(1-arguments[0][0]))/2):NaN},1);
				addF('arcth',         function():*{return (arguments[0][0]>1 || arguments[0][0]<-1)?(Math.log((arguments[0][0]+1)/(arguments[0][0])-1)/2):NaN},1);
				/*eng*/addF('arccoth', function():*{return (arguments[0][0]>1 || arguments[0][0]<-1)?(Math.log((arguments[0][0]+1)/(arguments[0][0])-1)/2):NaN},1);
				addF('arsch',function():*{return (arguments[0][0]>0 && arguments[0][0]<=1)?Math.log((1+Math.sqrt(1-arguments[0][0]*arguments[0][0]))/arguments[0][0]):NaN},1);
				/*eng*/addF('arcsech',function():*{return (arguments[0][0]>0 && arguments[0][0]<=1)?Math.log((1+Math.sqrt(1-arguments[0][0]*arguments[0][0]))/arguments[0][0]):NaN},1);
				addF('arcsch',function():*{return Math.log(1/arguments[0][0]+Math.sqrt(arguments[0][0]*arguments[0][0]+1)/Math.abs(arguments[0][0]))},1);
				/*eng*/addF('arccsch',function():*{return Math.log(1/arguments[0][0]+Math.sqrt(arguments[0][0]*arguments[0][0]+1)/Math.abs(arguments[0][0]))},1);
				
				//округление
				addF('round',function():*{return Math.round(arguments[0][0]);},1);
				addF('floor',function():*{return Math.floor(arguments[0][0]);},1);
				addF('ceil',function():*{return Math.ceil(arguments[0][0]);},1);
				addF('frac',function():*{return arguments[0][0]-Math.floor(arguments[0][0]);},1);
				
				//разное
				addF('abs',function():*{return Math.abs(arguments[0][0]);},1);
				addF('cbrt',function():*{return arguments[0][0]>=0?Math.pow(arguments[0][0],1/3):-Math.pow(-arguments[0][0],1/3);},1);
				addF('if',function():*{return arguments[0][0]>=0?arguments[0][1]:arguments[0][2];},3);
				addF('ln',function():*{return Math.log(arguments[0][0]);},1);
				addF('lg',function():*{return Math.log(arguments[0][0])/Math.LN10;},1);
				addF('log',function():*{return Math.log(arguments[0][1])/Math.log(arguments[0][0]);},2);
				addF('max',function():*{
								var result:*=arguments[0][0];
								for (var i:int=1;i<arguments[0].length;i++){
									result=Math.max(result,arguments[0][i]);
								}
								return result;
								}
								,2,-1);
				addF('min',function():*{
								var result:*=arguments[0][0];
								for (var i:int=1;i<arguments[0].length;i++){
									result=Math.min(result,arguments[0][i]);
								}
								return result;
								}
								,2,-1);
				addF('pow',function():*{return Math.pow(arguments[0][0],arguments[0][1]);},2);
				addF('random',function():*{return Math.random();},0);
				addF('random2',function():*{return Math.random();},0);
				addF('root',function():*{
								if(Math.floor(arguments[0][0])!=arguments[0][0] || arguments[0][0]<1)
									return NaN;
								return arguments[0][1]>=0?
									Math.pow(arguments[0][1],1/arguments[0][0])
									:(Math.floor(arguments[0][0]/2)==arguments[0][0]/2?
										NaN
										:-Math.pow(-arguments[0][1],1/arguments[0][0])
									 );
								}
								,2);
				addF('sgn', function():*{ if (isNaN(arguments[0][0])) return NaN; return arguments[0][0] == 0?0:(arguments[0][0] > 0?1: -1); }, 1);
				addF('sqr',function():*{return Math.pow(arguments[0][0],2);},1);
				addF('sqrt',function():*{return Math.sqrt(arguments[0][0]);},1);
				
			}
			return f;
		}
		
		//============================
		//источник запрещенных имен
		
		private static  var r:Array=null;
		//возвращает список запрещенных имен
		public static function restricts():Array
		{
			if (r==null) {
				r=new Array();
				r.push('E');
			}
			return r;
		}
	}
}