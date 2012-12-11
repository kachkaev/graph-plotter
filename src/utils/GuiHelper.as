package utils
{
	import adobe.utils.CustomActions;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.filters.ColorMatrixFilter;
	import flash.geom.ColorTransform;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import flash.display.Stage;
	/**
	 * Helps to work with some interface elements
	 * @author not Alexander Kachkaev, he doesn't usually write such a bad code as here
	 */
	public class GuiHelper
	{
		public static const ALIGN_TOP_LEFT:int = 00;
		public static const ALIGN_TOP_CENTER:int = 01;
		public static const ALIGN_TOP_RIGHT:int = 02;
		public static const ALIGN_MIDDLE_LEFT:int = 10;
		public static const ALIGN_MIDDLE_CENTER:int = 11;
		public static const ALIGN_MIDDLE_RIGHT:int = 12;
		public static const ALIGN_BOTTOM_LEFT:int = 20;
		public static const ALIGN_BOTTOM_CENTER:int = 21;
		public static const ALIGN_BOTTOM_RIGHT:int = 22;
		
		public static const INPUT_MODE_NORMAL:int = 0;
		public static const INPUT_MODE_ERROR:int = 1;
		public static const INPUT_MODE_CHANGED:int = 2;
		
		
		public static const DISTANCE_INPUT_PADDING:int = 1;
		
		public static const COLOR_INPUT_BORDER:int = 0xC0CAD5;
		public static const COLOR_INPUT_BORDER_ERROR:int = 0xe89b88;
		public static const COLOR_INPUT_BORDER_CHANGED:int = 0xC0CAD5;
		public static const COLOR_INPUT_BACKGROUND:int = 0xffffff;
		public static const COLOR_INPUT_BACKGROUND_ERROR:int = 0xffefe8;
		public static const COLOR_INPUT_BACKGROUND_CHANGED:int = 0xffffaa;
		public static const COL_LINE1:uint = 0xC0C0C0;
		
		public static const TF_NORMAL:TextFormat = new TextFormat("Tahoma", 11, 0, null, null, null, null, null, null, null, null, null, 2);
		public static const TF_INPUT:TextFormat = new TextFormat("Tahoma", 11, 0);
		public static const TF_LABEL_INPUT:TextFormat = new TextFormat("Tahoma", 11, 0x666666, true);
		public static const TF_HEADER:TextFormat = new TextFormat("Tahoma", 12, 0x36638E, true);
			
		/**
		 * Creates standart bordered input with one line
		 * @param	target
		 * @param	text - default text
		 * @param	x
		 * @param	y
		 * @param	width
		 * @param	align
		 * @return
		 */
		public static function createInput(target:*, text:*, x:int, y:int, width:int, align:int, textAlign:* = TextFormatAlign.LEFT):*
		{
			var result:Object = new Object();
			
			// Text field
			result.edit = new TextField();
			result.edit.multiline = false;
			result.edit.name = "edit";
			result.edit.type = TextFieldType.INPUT;
			result.edit.defaultTextFormat = TF_INPUT;
			var tf:TextFormat = result.edit.defaultTextFormat;
			tf.align = textAlign;
			result.edit.defaultTextFormat = tf;
			result.edit.width = width - 2 * DISTANCE_INPUT_PADDING;
			result.edit.height = 17;
			result.edit.text = text;
			// Border and background
			result.background = new Shape();
			result.background.graphics.beginFill(0);
			result.background.graphics.drawRect(0, 0, width, result.edit.height+2 * DISTANCE_INPUT_PADDING);
			result.background.name = "background";
			result.border = new Shape();
			result.border.name = "border";
			result.border.graphics.lineStyle(0, 0);
			result.border.graphics.drawRect(0, 0, width, result.edit.height+2 * DISTANCE_INPUT_PADDING);
			
			placeElem(result.background, x, y, align);
			placeElem(result.border, x, y, align);
			result.edit.x += result.background.x + DISTANCE_INPUT_PADDING;
			result.edit.y += result.background.y + DISTANCE_INPUT_PADDING;
			
			highlightInput(result);
			
			target.addChild(result.background);
			target.addChild(result.border);
			target.addChild(result.edit);
			return result;
		}
		
		/**
		 * Creates label
		 * @param	target
		 * @param	text
		 * @param	x
		 * @param	y
		 * @param	align
		 * @param	textFormat
		 * @return
		 */
		public static function createTextField(target:*, text:String, x:int, y:int, align:int, textFormat:TextFormat = null, width:* = null, height:* = null):TextField
		{
			if (textFormat == null)
				textFormat = TF_NORMAL;
				
			var result:TextField = new TextField();
			result.defaultTextFormat = textFormat;
			
			result.htmlText = text;
			result.selectable = false;
			
			if (width != null) {
				result.wordWrap = true;
				result.width = width;
			
				if (height != null)
					result.width = width;
				else
					result.height = result.textHeight + 4;
			}
			else
				result.autoSize = TextFieldAutoSize.LEFT;
			
				
			placeElem(result, x, y, align);
			target.addChild(result);
			return result;
		}
		
		public static function createLabel(target:*, text:String, x:int, y:int, align:int, textFormat:TextFormat = null, width:* = null, height:* = null):TextField
		{
			return createTextField(target, text, x, y, align, textFormat);			
		}
		
		public static function createHeader(target:*, text:String, x:int, y:int, width:int, align:* = ALIGN_BOTTOM_LEFT):*
		{
			var result:Object = new Object();
			result.label = new TextField();
			result.label.defaultTextFormat = TF_HEADER;
			result.label.text = text;
			result.label.autoSize = TextFieldAutoSize.LEFT;
			result.label.selectable = false;
			
			result.line = new Shape();
			result.line.graphics.lineStyle(0, COL_LINE1);
			result.line.graphics.moveTo(0,0);
			result.line.graphics.lineTo(width, 0);
			placeElem(result.line, x, y, align);
			placeElem(result.label, x, y, align);
			result.label.x = result.line.x;
			result.line.y = result.label.y + result.label.height;
			
			target.addChild(result.label);
			target.addChild(result.line);
			return result;
		}
		
		/**
		 * Places created element according its position and ancor
		 * @param	element
		 * @param	x
		 * @param	y
		 * @param	align
		 */
		public static function placeElem(element:*, x:int, y:int, align:int):void
		{
			//vertical position
			switch (Math.floor(align / 10)) {
				case 2: //bottom
					element.y = y - element.height;
					break;
				case 1: //middle
					element.y = y - element.height/2;
					break;
				default:
					element.y = y;
			}
			//horisonral position
			switch (align % 10) {
				case 2: //right
					element.x = x - element.width;
					break;
				case 1: //middle
					element.x = x - element.width/2;
					break;
				default:
					element.x = x;
			}
		}
		
		/**
		 * Changes style of a target input (basically, highlights the background and border)
		 * @param	target
		 * @param	input_mode
		 */
		public static function highlightInput(target:*, input_mode:int = 0):void
		{
			var color_background:int = COLOR_INPUT_BACKGROUND;
			var color_border:int = COLOR_INPUT_BORDER;
			
			switch (input_mode)
			{
				case (INPUT_MODE_ERROR):
					color_background = COLOR_INPUT_BACKGROUND_ERROR;
					color_border = COLOR_INPUT_BORDER_ERROR;
					break;
				case (INPUT_MODE_CHANGED):
					color_background = COLOR_INPUT_BACKGROUND_CHANGED;
					color_border = COLOR_INPUT_BORDER_CHANGED;
					break;
			}
			
			var background:*;
			var border:*;
			if (target is Sprite)
			{
				background = target.getChildByName("background");
				border = target.getChildByName("border");
			}
			else
			{
				background = target.background;
				border = target.border;
			}
			var myColor:ColorTransform = background.transform.colorTransform; 
			myColor.color = color_background;
			background.transform.colorTransform = myColor;
			
			myColor = border.transform.colorTransform; 
			myColor.color = color_border;
			border.transform.colorTransform = myColor;
		}

		public static function focusInput(stage:*, target:*, selectAll:Boolean = false):void
		{
			stage.focus = target.edit;
			target.edit.setSelection(0,target.edit.text.length);
		}

		
	}
	
}