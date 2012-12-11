package plots
{
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import flash.geom.ColorTransform;
	import utils.Utils;
	import utils .Dbg;
	import formulas.Expression;
	import errors.ExpressionError;
	
	/**
	 * ...
	 * @author not Alexander Kachkaev, he doesn't usually write such a bad code as here
	 */
	public class GraphsContainer extends Sprite
	{
		public static const BOUND_MAX_VALUE:Number = 1000;
		public static const BOUND_MIN_DISTANCE:Number = 0.5;
		public static const MAX_POINTS_COUNT:int = 10000;
		public static const MIN_POINTS_COUNT:int = 50;
		public static const COL_DEFAULT:Array = new Array(0x45688e, 0x696029, 0xa4bacf, 0xd7cf9e, 0x000000);
		public static const COL_AXES:int = 0x666666;
		public static const TF_AXIS_LABEL:TextFormat = new TextFormat("Tahoma", 8, 0x666666);
		public static const COL_GRID:int = 0xeeeeee;
		
		private var _height:int = 0;
		private var _width:int = 0;
		private var _dx:Number = 0;
		private var _dy:Number = 0;
		private var _x0:Number = 0;
		private var _y0:Number = 0;
		
		private var _hasGrid:Boolean = false;
		private var _hasAxes:Boolean = false;
		
		private var _grid:Sprite;
		private var _graphsGUI:Sprite;
		private var _axes:Sprite;
		
		private var _bounds:Bounds2D;
		
		private var _graphs:Array;		
		
		//--------------------------------------------------------------------------------------------------- Constructor
		
		public function GraphsContainer(target:*, width:int = 100, height:int = 100) 
		{
			_width = width;
			_height = height;
			
			_grid = new Sprite();
			_grid.graphics.lineStyle(0, 0xeeeeee);
			target.coordsContainer.addChild(_grid);
			
			_graphs = new Array();
			_graphsGUI = new Sprite();
			target.grafContainer.addChild(_graphsGUI);
			
			_axes = new Sprite();
			target.coordsContainer.addChild(_axes);
			
			_bounds = new Bounds2D();
			updateBounds();
			
		}
		
		
		//--------------------------------------------------------------------------------------------------- Properties
		
		/**
		 * Overriding height and width
		 */
		public override function get height():Number
		{
			return 420//_height;
		}
		
		public override function get width():Number
		{
			return 420//_width;
		}
		
		/**
		 * Wrapping some parameters
		 */
		public function get hasGrid():Boolean
		{
			return _hasGrid;
		}
		public function set hasGrid(newHasGrid:Boolean):void
		{
			_hasGrid = newHasGrid;
			updateAxesAndGrid();
		}
		
		public function get hasAxes():Boolean
		{
			return _hasGrid;
		}
		public function set hasAxes(newHasAxes:Boolean):void
		{
			_hasAxes = newHasAxes;
			updateAxesAndGrid();
		}
		
		
		//------------------------------------------------------------------------------------------------------ Methods
		
		/**
		 * 
		 * @param	newBounds — new bounds of the field
		 * @return true if bounds were changed, false if they equal
		 */
		public function updateBounds(newBounds:Bounds2D = null):Boolean
		{
			if (newBounds != null && _bounds.equals(newBounds))
				return false;
			
			if (newBounds != null)
				_bounds = newBounds;
			
			if (_bounds.getDiffX() <= 0 || _bounds.getDiffY() <= 0)
			{
				_grid.visible = false;
				_axes.visible = false;
				_graphsGUI.visible = false;
				_bounds = new Bounds2D();
				return true;
			}
			
			//variables used for convertion to pixels
			_dx = _width / (_bounds.xMax - _bounds.xMin);
			_dy = _height / (_bounds.yMin - _bounds.yMax);
			_x0 = -_bounds.xMin * _dx;
			_y0 = _height - _bounds.yMin * _dy;
			
			
			updateAxesAndGrid();
			
			for each(var v:* in _graphs)
				v.plot.graphics.clear();
			
			_grid.visible = true;
			_axes.visible = true;
			_graphsGUI.visible = true;
			
			return true;
		}
		
		/**
		 * updatex Axes with captions
		 */
		public function updateAxesAndGrid():void
		{
			_axes.graphics.clear();
			_grid.graphics.clear();
			while(_axes.numChildren)
				_axes.removeChildAt(0);
			
			_axes.visible = true;			
			_axes.graphics.lineStyle(1, COL_AXES);
			
			var y_axis_coord:Number=xToPixel(0);
			if (y_axis_coord<0)
				y_axis_coord=0;
			else if (y_axis_coord>_width)
				y_axis_coord = _width;
			
			var x_axis_coord:Number=yToPixel(0);
			if (x_axis_coord<0)
				x_axis_coord=0;
			else if (x_axis_coord>_height)
				x_axis_coord=_height;
			
			if (_hasAxes){
				_axes.graphics.moveTo(y_axis_coord,0);
				_axes.graphics.lineTo(y_axis_coord, _height);
				_axes.graphics.moveTo(0,x_axis_coord);
				_axes.graphics.lineTo(_height,x_axis_coord);
			}
			var tf:TextField;
			
			////подписи к оси x
			var x_poradok:Number = Math.floor(Math.log(_bounds.xMax-_bounds.xMin)/Math.LN10)-1;
			var x_coordStep:Number = Math.pow(10,x_poradok);
			if (xToPixel(x_coordStep)-xToPixel(0)<8)
				x_coordStep*=5;
			else if (xToPixel(x_coordStep)-xToPixel(0)<15)
				x_coordStep*=2;
				
			var x_coord:Number = Math.ceil(_bounds.xMin/x_coordStep)*x_coordStep;

			var y_up:Number = 3;
			if (yToPixel(yFromPixel(x_axis_coord-y_up))<0)
				y_up=0;
				
			var y_down:Number = 3;
			if (yToPixel(yFromPixel(x_axis_coord+y_down))>_height)
				y_down=0;
				
			var y_text:int=2;
			if (yToPixel(yFromPixel(x_axis_coord+12))>_height)
				y_text=-15;
			
			//в этом промежутке подписей по y не будет
			var bookedAreaTop:Number=x_axis_coord-(y_text==-15?13:y_up);
			var bookedAreaBottom:Number=x_axis_coord+(y_text==-15?y_down:10);
			
			while (x_coord<=_bounds.xMax+0.01){
				if(_hasAxes){
					tf = new TextField();
					tf.defaultTextFormat = TF_AXIS_LABEL;
					tf.text = ""+Math.round(x_coord * 100) / 100;
					tf.selectable = false;
					tf.autoSize = TextFieldAutoSize.LEFT;
					tf.x = xToPixel(x_coord) -tf.textWidth / 2 - 3;
					tf.y = x_axis_coord + y_text;
					_axes.addChild(tf);
					_axes.graphics.lineStyle(1,0x666666);
					_axes.graphics.moveTo(xToPixel(x_coord),x_axis_coord+y_down);
					_axes.graphics.lineTo(xToPixel(x_coord),x_axis_coord-y_up);
				}
				if (_hasGrid){
					_grid.graphics.lineStyle(1,COL_GRID);
					_grid.graphics.moveTo(xToPixel(x_coord),0);
					_grid.graphics.lineTo(xToPixel(x_coord), _height);
				}
				x_coord+=x_coordStep;
			}
			
			////подписи к оси y
			var y_poradok:Number=Math.floor(Math.log(_bounds.yMax-_bounds.yMin)/Math.LN10)-1;
			var y_coordStep:Number=Math.pow(10,y_poradok);
			if (yToPixel(y_coordStep)-yToPixel(0)>-8)
				y_coordStep*=5;
			else if (yToPixel(y_coordStep)-yToPixel(0)>-15)
				y_coordStep*=2;
				
			var y_coord:Number=Math.ceil(_bounds.yMin/y_coordStep)*y_coordStep;

			var x_up:Number=3;
			if (xToPixel(xFromPixel(y_axis_coord-x_up))<0)
				x_up=0;
				
			var x_down:Number=3;
			if (xToPixel(xFromPixel(y_axis_coord+x_down))>_width)
				x_down=0;
				
			var x_text:Number=3;
			if (xToPixel(xFromPixel(y_axis_coord+12))>_width){
				x_text=0;
				TF_AXIS_LABEL.align = TextFormatAlign.RIGHT
			}
			
			while (y_coord<=_bounds.yMax+0.01){
				if(_hasAxes){
					tf = new TextField();
					tf.defaultTextFormat = TF_AXIS_LABEL;
					tf.text = ""+Math.round(y_coord * 100) / 100;
					tf.selectable = false;
					tf.autoSize = TextFieldAutoSize.LEFT;
					tf.y=yToPixel(y_coord)-tf.textHeight/2-2;
					tf.x=y_axis_coord+(x_text==0?-tf.width-3:x_text);
					_axes.addChild(tf);
					_axes.graphics.lineStyle(1,0x666666);
					_axes.graphics.moveTo(y_axis_coord+x_down,yToPixel(y_coord));
					_axes.graphics.lineTo(y_axis_coord-x_up,yToPixel(y_coord));
				}
				if (_hasGrid){
					_grid.graphics.lineStyle(1,COL_GRID);
					_grid.graphics.moveTo(0,yToPixel(y_coord));
					_grid.graphics.lineTo(_width,yToPixel(y_coord));
				}
				y_coord+=y_coordStep;
			}
			
			
		}

		//------------------------------------------------------------------------------------------ Working with graphs
		/**
		 * Reserves place for new graph
		 * @return ID of a new graph
		 */
		public function graphCreate():int
		{
			var result:int;
			//reserving ID
			do {
				result = Math.round(Math.random()*100000);
			} while (_graphs[result] != null);
			
			//setting properties to default
			_graphs[result] = new Object();
			_graphs[result].visible = true;
			_graphs[result].numberOfDots = 0;
			_graphs[result].str = "";
			_graphs[result].formula = new Expression("",new Array("x"));
			_graphs[result].plot = new Shape();
			_graphs[result].plot.x = 11.5;
			_graphs[result].plot.y = 11.5;
			
			_graphsGUI.addChild(_graphs[result].plot);
			
			//
			
			
			//choosing colors within default ones (the one that was rarely used)
			var colsCounts:Array = new Array();
			for (var i:int = 0; i <= COL_DEFAULT.length; i++)
				colsCounts[i] = 0;
			
			for each (var v:* in _graphs)
				colsCounts[COL_DEFAULT.indexOf(v.color)+1]++
			
			var timesused:int = int.MAX_VALUE;
			for (i = 1; i <= COL_DEFAULT.length; i++)
				if (colsCounts[i]<timesused)
				{
					_graphs[result].color = COL_DEFAULT[i - 1];
					timesused = colsCounts[i];
				}
			
			graphChangeColor(result, _graphs[result].color);
			Dbg.log("Graph created " + result);
			return result;			
		}
		
		/**
		 * changes color of a selected graph
		 * @param	graphId
		 * @param	newColor
		 */
		public function graphChangeNumberOfDots(graphId:int, newNumberOfDots:int):void
		{
			Dbg.log("Graph "+graphId+" Number of dots changed to " + newNumberOfDots);
			_graphs[graphId].numberOfDots = newNumberOfDots;
		}
		
		/**
		 * changes color of a selected graph
		 * @param	graphId
		 * @param	newColor
		 */
		public function graphChangeColor(graphId:int, newColor:int):void
		{
			Dbg.log("Graph "+graphId+" Color changed to " + newColor);
			_graphs[graphId].color = newColor;
			
			var myColor:ColorTransform = _graphs[graphId].plot.transform.colorTransform; 
			myColor.color = newColor;
			_graphs[graphId].plot.transform.colorTransform = myColor;
		}
		
		/**
		 * changes visisbility of a selected graph
		 * @param	graphId
		 * @param	visible
		 */
		public function graphChangeVisible(graphId:int, newVisible:Boolean):void
		{
			Dbg.log("Graph "+graphId+" Visible Changed to " + newVisible);
			_graphs[graphId].plot.visible = newVisible;
		}
		
		/**
		 * changes formula of a selected graph and replots it
		 * @param	graphId
		 * @param	newFormula
		 */
		public function graphChangeFormula(graphId:int, newFormula:String):void
		{
			Dbg.log("Graph "+graphId+" Formula Changed to " + newFormula);
			_graphs[graphId].str = newFormula;
			
			//ввод текст в формулу
			_graphs[graphId].formula.Text = newFormula;
			
			//ошибка в формулие
			var ee:* = _graphs[graphId].formula.FatalError;
			if (_graphs[graphId].formula.FatalError != null)
				throw _graphs[graphId].formula.FatalError;
			
			
		}
		
		/**
		 * attempts to refresh a selected graph
		 * @param	graphId
		 */
		public function graphRefresh(graphId:int):void
		{
			//parsing formula
			var currentGraph:* = _graphs[graphId];
			
			var plot:Shape = currentGraph.plot;
			plot.graphics.clear();
			plot.graphics.lineStyle(0, 0);
			
			if (currentGraph.formula.FatalError != null)
				return;
			
			
			//рисование графика
			////цикл рисования
			var in_arr:* = new Array;
			in_arr['x'] = _bounds.xMin;
			var step:* = (_bounds.xMax - _bounds.xMin) / currentGraph.numberOfDots;
			var y_coords:*=new Array();
			y_coords[0]=yToPixel(currentGraph.formula.getValue(in_arr));
			plot.graphics.moveTo(xToPixel(_bounds.xMin), yToPixel(currentGraph.formula.getValue(in_arr)));
			for (var j:Number=_bounds.xMin+step;j<_bounds.xMax+step;j+=step){
				in_arr['x']=j;
				y_coords[1]=yToPixel(currentGraph.formula.getValue(in_arr));
				if (isFinite(y_coords[1]) && y_coords[1]<-1000)
					y_coords[1]=-1000;
				if (isFinite(y_coords[1]) && y_coords[1]>15000)
					y_coords[1]=1500;
				if ((y_coords[1]<_bounds.yMax|| y_coords[1]>_bounds.yMin) && (isFinite(y_coords[0]) && isFinite(y_coords[1])) && Math.abs(y_coords[1]- y_coords[0])<_height){
					Dbg.log("plot");
					plot.graphics.lineTo(xToPixel(j), y_coords[1]);
				}else if (isFinite(y_coords[1]))
					plot.graphics.moveTo(xToPixel(j), y_coords[1]);
				y_coords.shift();
			}
			
			Dbg.log("Graph "+graphId+" Attempt to replot. (Formula "+ _graphs[graphId].str +", "+_graphs[graphId].numberOfDots+"dots");
		}
		
		public function graphDelete(graphId:int):void
		{
			Dbg.log(Utils.printArray(_graphs));
			_graphsGUI.removeChild(_graphs[graphId].plot);
			delete _graphs[graphId];
			Dbg.log("Graph "+graphId+" deleted");
		}
		
		public function graphGetColor(graphId:int):int
		{
			return _graphs[graphId].color;
		}
		//------------------------------------------------------------------------------------------------------ Helpers
		
		private function xToPixel(x:Number):Number
		{
			return _dx*x+_x0;
		}
		private function yToPixel(y:Number):Number
		{
			return _dy*y+_y0;
		}
		private function xFromPixel(y:Number):Number
		{
			return (x-_x0)/_dx;
		}
		
		private function yFromPixel(y:Number):Number
		{
			return (y-_y0)/_dy;
		}
	}

}