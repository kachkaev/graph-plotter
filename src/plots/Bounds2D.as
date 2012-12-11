package plots 
{
	/**
	 * Class for storing 2D bounds
	 * @author Alexander Kachkaev
	 */
	public class Bounds2D
	{
		private var _xMin:Number = 0;
		private var _xMax:Number = 0;
		private var _yMin:Number = 0;
		private var _yMax:Number = 0;
		
		//-------------------------------------------------------------------------------------------------- Constructor
		/**
		 * Bounds2DConstructor
		 * @param	xMin
		 * @param	xMax
		 * @param	yMin
		 * @param	yMax
		 */
		public function Bounds2D(xMin:Number = 0, xMax:Number = 0, yMin:Number = 0 , yMax:Number = 0) 
		{
			_xMin = xMin;
			_xMax = xMax;
			_yMin = yMin;
			_yMax = yMax;
		}
		
		
		//--------------------------------------------------------------------------------------------------- Properties
		
		public function get xMin():Number
		{
			return _xMin;
		}
		
		public function get xMax():Number
		{
			return _xMax;
		}
		
		public function get yMin():Number
		{
			return _yMin;
		}
		
		public function get yMax():Number
		{
			return _yMax;
		}
		
		
		//---------------------------------------------------------------------------------------------------- Functions
		/**
		 * Calculates difference between xMax and xMin
		 * @return the difference
		 */
		public function getDiffX():Number
		{
			return _xMax - _xMin;
		}
		
		/**
		 * Calculates difference between yMax and yMin
		 * @return the difference
		 */
		public function getDiffY():Number
		{
			return _yMax - _yMin;
		}
		
		/**
		 * Checks if 2 bounds are equal to each other
		 * @param	BoundsToCompare
		 * @return  true if bounds have the same values
		 */
		public function equals(boundsToCompare:Bounds2D):Boolean
		{
			if (
					   _xMin == boundsToCompare.xMin
					&& _xMax == boundsToCompare.xMax
					&& _yMin == boundsToCompare.yMin
					&& _yMax == boundsToCompare.yMax
				)
				return true;
			
			return false;
		}
	}

}