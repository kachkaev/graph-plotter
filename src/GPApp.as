package 
{
	import adobe.utils.CustomActions;
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Scene;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.display.StageScaleMode;
	import flash.display.LoaderInfo;
	import flash.events.Event;
	import flash.events.ContextMenuEvent;
	import flash.events.KeyboardEvent;
  	import flash.events.MouseEvent;
	import flash.text.FontStyle;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import flash.text.TextFieldAutoSize;
	import flash.ui.ContextMenu;
	import flash.ui.ContextMenuBuiltInItems;
	import flash.ui.ContextMenuItem;
	import flash.net.URLRequest;
	import flash.net.navigateToURL;
	import flash.system.Security;
	import flash.ui.Keyboard;
	import flash.ui.Mouse;
	import errors.ExpressionError;

	import languages.Lang;
	import utils.*;
	import vk.*;
	import plots.*;
	
	/**
	 * Graph Plotter Application main class
	 * @author not Alexander Kachkaev, he doesn't usually write such a bad code as here
	 */
	public class GPApp extends Sprite 
	{
		private static const MAX_GRAPH_COUNT:int = 10;
		//interface properties
		private static const PADDING_LEFT:uint = 5;
		private static const PADDING_RIGHT:uint = 5;
		private static const PADDING_TOP:uint = 5;
		private static const PADDING_BOTTOM:uint = 10;
		
		private static const PADDING_PLOTAREA_TOP:uint = 25;
		private static const PADDING_PLOTAREA_PADDING_LEFT:uint = 10;
		private static const PADDING_PLOTAREA_BOTTOM:uint = 10;
		private static const PADDING_BETWEEN_ELEMS_TOP:uint = 10;
		private static const PADDING_BETWEEN_TITLE_AND_VERSION:int = -7;
		private static const PADDING_AFTER_VERSION:uint = 15;
		private static const DISTANCE_WIDTH_PARAM_INPUT:uint = 42;
		private static const PADDING_PARAM_INPUT_VERTICAL:uint = 10;
		private static const PADDING_PARAM_INPUT_HORISONTAL:uint = 3;
		private static const DISTANCE_PLOTAREA_ROUNDFACTOR:uint = 5;
		private static const DISTANCE_COLOR_SIZE:uint = 12;
		private static var DISTANCE_PLOTAREA_WIDTH:uint = 0;
		private static var DISTANCE_PLOTAREA_HEIGHT:uint = 0;
			
		private static const COL_BACKGROUND:uint = 0xF7F7F7;
		private static const COL_LINE_HORISONTAL:uint = 0xC0C0C0;
		private static const DEFAULT_NUMBER_OF_POINTS:uint = 2000;
		
		private static const WEBADDR_ROOT:String = "/";
		//private static const WEBADDR_ROOT:String = "http://vkontakte.ru/";
		
		//text formats
		private static var fsTitle:TextFormat = new TextFormat("Arial Narrow",22,0,true);
		private static var fsTitleVersion:TextFormat = new TextFormat("Arial Narrow",15,0xcccccc,true);
		//private static const fsHeader1:TextFormat;
		private static const fsNormal:TextFormat = new TextFormat("Tahoma", 11);
		//private static const fsInputLabel:TextFormat;
					
		//application size
		private static var app_width:uint = 607;
		private static var app_height:uint = 600;
		
		private static var wrapper_enabled:Boolean = false
		private static var wrapper:* = null;
		private static var STAGE:* = null;
		private var vars:Object = null;
		private var user_id:uint = 0;
		private var viewer_id:uint = 0;
		private var is_app_user:uint = 0;
		
		//some objects
		private var layerMain:Sprite;
		private var bHelp:*;
		private var bGroup:*;
		private var bReport:*;
		private var bTranslations:*;
		private var plotArea:PlotArea;
		private var graphsContainer:GraphsContainer;
		private var eXMin:*;
		private var eYMin:*;
		private var eXMax:*;
		private var eYMax:*;
		private var bBoundsApply:*
		private var bBoundsDefaults:*
		private var cGrid:*
		private var cAxes:*
		private var bAddGraph:*;
		private var bAddApp:*;
		private var bAddFriends:*;
		private var pButtonsBottom:Sprite;
		private var functionsPanel:Sprite;
		private var functionPanelElements:Array;
		
		private static const VERSION:String = "1.2";
		private static const MY_ID:uint = 1308390; // For local testing please change this to your ID
		private static const MY_APP_ID:uint = 237314; // For local testing please change this to your APP_ID
		private static const MY_SECRET:String = "ArxxTkttE6"; // Please change this to your application secret key
		internal static const TEST_MODE:Boolean = true; // For local testing please change this to "true"
		
		

		/**
		 * Constructor
		 */
		public function GPApp():void 
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		/**
		 * Application Initialisation
		 */
		private function init(e:Event = null):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			//applying background
			this.graphics.beginFill(COL_BACKGROUND);
			this.graphics.drawRect( -1000, -1000, 3000, 3000);
			this.graphics.endFill();
			
			wrapper = Object(parent.parent);
			if ( wrapper.external == null )
			wrapper = stage; // Local
      
			if ( wrapper is Stage )
			{
				wrapper_enabled = false;
				
				STAGE = wrapper;
				vars = LoaderInfo(parent.loaderInfo).parameters;
			}
			else
			{
				wrapper_enabled = true;
				
				STAGE = wrapper.parent;
				vars = wrapper.application.parameters;
				
				//wrapper.addEventListener( 'onLocationChanged', onLocationChanged );
				//wrapper.addEventListener( 'onSettingsChanged', onSettingsChanged );
			}

			// Read FlashVars
			var app_id:uint = getFlashVarInt( "api_id" );
			user_id   = getFlashVarInt( "user_id" );
			viewer_id = getFlashVarInt( "viewer_id" );
			var api_url:String = vars['api_url'];
			var api_res:String = vars['api_result'];
			is_app_user = vars['is_app_user'];
			
			if ( viewer_id == 0 ) // Local testing
			{
				viewer_id = MY_ID;
				user_id = MY_ID;
				app_id = MY_APP_ID;
				api_url = "http://api.vkontakte.ru/api.php";
			}
			if ( user_id == 0 )
				user_id = viewer_id;
				
			//Text formats initialization
			////Application title
			fsTitle.letterSpacing = -1;
			fsTitle.leading = -5;
			////Application version
			fsTitleVersion.letterSpacing = -1;
			
			var lang:uint = 1;
			Security.allowDomain( "*" );
			
			if (wrapper_enabled)
			{
				VK.init( this, "http://api.vkontakte.ru/swf/vk_gui-0.5.swf" );
				switch (wrapper.lang.language)
				{
					case 0: 
					case 2: //Белорусский
					case 777: //В Союзе
					case 100: //Дореволюционный
					case 100: //Дореволюционный
						lang = 0;
						break;
					case 3: // Английский
						lang = 1;
						break;
					case 1: // Украинский
						lang = 2;
						break;
					case 6: // Немецкий
						lang = 3;
						break;
				};
			}
			else
				VK.init( this, "../bin/vk_gui-0.5.swf" );
				
			Lang.initialize(lang);
			
			createContextMenu();

			
		}
		
		/**
		 * Intarface Initialization
		 */
		public function onVKLoaded():void
		{
			//creating the main layer
			layerMain = new Sprite();
			
			//stuff on top
			////help button
			bHelp = VK.createLinkButton(Lang.getStr("interface", "b_help"),0,PADDING_TOP);
			bHelp.x = app_width - PADDING_RIGHT - bHelp.width - DISTANCE_PLOTAREA_ROUNDFACTOR;
			layerMain.addChild(bHelp);
			bHelp.addEventListener( MouseEvent.CLICK, function(e:MouseEvent):void
			{
			  navigateToURL( new URLRequest( WEBADDR_ROOT + "page717062"), "_blank" );
			});
			
			////group button
			bGroup = VK.createLinkButton(Lang.getStr("interface", "b_group"),0,PADDING_TOP);
			bGroup.x = bHelp.x - PADDING_BETWEEN_ELEMS_TOP - bGroup.width;
			layerMain.addChild(bGroup);
			bGroup.addEventListener( MouseEvent.CLICK, function(e:MouseEvent):void
			{
			  navigateToURL( new URLRequest( WEBADDR_ROOT + "club4844998"), "_blank" );
			});
			
			
			////report button
			bReport = VK.createLinkButton(Lang.getStr("interface", "b_report_an_error"),0,PADDING_TOP);
			bReport.x = bGroup.x - PADDING_BETWEEN_ELEMS_TOP - bReport.width;
			layerMain.addChild(bReport);
			bReport.addEventListener( MouseEvent.CLICK, function(e:MouseEvent):void
			{
			  navigateToURL( new URLRequest( WEBADDR_ROOT + "mail.php?act=write&to=1308390"), "_blank" );
			});
			
			
			//plotArea
			plotArea = new PlotArea();
			DISTANCE_PLOTAREA_WIDTH = plotArea.width;
			DISTANCE_PLOTAREA_HEIGHT = plotArea.height; 
			
			plotArea.y = PADDING_PLOTAREA_TOP;
			plotArea.x = app_width - DISTANCE_PLOTAREA_WIDTH - PADDING_RIGHT;
			layerMain.addChild(plotArea);
			plotArea.em.x += 10; //миллионный костыль, блин! :(
			
			graphsContainer = new GraphsContainer(plotArea, 360, 360)
			plotArea.coordsContainer.addChild(graphsContainer);
			 //left column
			////App title
			var lTitle:TextField = GuiHelper.createTextField(
													layerMain,
													Lang.getStr("interface", "l_app_title"),
													PADDING_LEFT,
													PADDING_PLOTAREA_TOP,
													GuiHelper.ALIGN_TOP_LEFT,
													fsTitle,
													plotArea.x - PADDING_PLOTAREA_PADDING_LEFT - PADDING_LEFT
												);
			
			////App version
			var lVersion:TextField = GuiHelper.createLabel(
													layerMain,
													Lang.getStr("interface", "l_app_version")+VERSION,
													PADDING_LEFT,
													PADDING_PLOTAREA_TOP + lTitle.height + PADDING_BETWEEN_TITLE_AND_VERSION,
													GuiHelper.ALIGN_TOP_LEFT,
													fsTitleVersion
												);
			
			////Info Header
			var lInfoHeader:* = GuiHelper.createHeader(layerMain, Lang.getStr("interface", "h_info"), PADDING_LEFT, lVersion.y+lVersion.height+PADDING_AFTER_VERSION , plotArea.x - PADDING_PLOTAREA_PADDING_LEFT - PADDING_LEFT, GuiHelper.ALIGN_TOP_LEFT);
			////Info text
			var lInfo:TextField = GuiHelper.createTextField(
													layerMain,
													Lang.getStr("interface", "l_info"),
													PADDING_LEFT,
													lInfoHeader.line.y + 3,
													GuiHelper.ALIGN_TOP_LEFT,
													GuiHelper.TF_NORMAL,
													plotArea.x - PADDING_PLOTAREA_PADDING_LEFT - PADDING_LEFT
												);
			
			//// params
			////// apply-defaults buttons
			bBoundsApply = VK.createRoundButton(Lang.getStr("interface", "b_apply"), 0, 0);
			//GuiHelper.placeElem(bBoundsApply, PADDING_LEFT, plotArea.y + DISTANCE_PLOTAREA_HEIGHT - DISTANCE_PLOTAREA_ROUNDFACTOR, GuiHelper.ALIGN_BOTTOM_LEFT);
			GuiHelper.placeElem(bBoundsApply, plotArea.x - PADDING_PLOTAREA_PADDING_LEFT, plotArea.y + DISTANCE_PLOTAREA_HEIGHT - DISTANCE_PLOTAREA_ROUNDFACTOR, GuiHelper.ALIGN_BOTTOM_RIGHT);
			layerMain.addChild(bBoundsApply);
			bBoundsApply.addEventListener(MouseEvent.CLICK, boundsApply);
			bBoundsDefaults = VK.createRoundButton(Lang.getStr("interface", "b_defaults"), 0, 0, 2);
			//GuiHelper.placeElem(bBoundsDefaults, bBoundsApply.x + bBoundsApply.width + PADDING_PARAM_INPUT_VERTICAL, plotArea.y + DISTANCE_PLOTAREA_HEIGHT  - DISTANCE_PLOTAREA_ROUNDFACTOR, GuiHelper.ALIGN_BOTTOM_LEFT);
			GuiHelper.placeElem(bBoundsDefaults, bBoundsApply.x - PADDING_PARAM_INPUT_VERTICAL, plotArea.y + DISTANCE_PLOTAREA_HEIGHT  - DISTANCE_PLOTAREA_ROUNDFACTOR, GuiHelper.ALIGN_BOTTOM_RIGHT);
			layerMain.addChild(bBoundsDefaults);
			bBoundsDefaults.addEventListener(MouseEvent.CLICK, boundsReturnDefaults);
			
			////// params inputs
			eYMax = GuiHelper.createInput(layerMain, "", plotArea.x - PADDING_PLOTAREA_PADDING_LEFT, bBoundsApply.y - PADDING_PARAM_INPUT_VERTICAL, DISTANCE_WIDTH_PARAM_INPUT, GuiHelper.ALIGN_BOTTOM_RIGHT,TextFormatAlign.RIGHT);
			eXMax = GuiHelper.createInput(layerMain, "", plotArea.x - PADDING_PLOTAREA_PADDING_LEFT, eYMax.background.y - PADDING_PARAM_INPUT_VERTICAL, DISTANCE_WIDTH_PARAM_INPUT, GuiHelper.ALIGN_BOTTOM_RIGHT,TextFormatAlign.RIGHT);
			eYMin = GuiHelper.createInput(layerMain, "", PADDING_LEFT/2 + (plotArea.x-PADDING_PLOTAREA_PADDING_LEFT)/2, bBoundsApply.y - PADDING_PARAM_INPUT_VERTICAL, DISTANCE_WIDTH_PARAM_INPUT, GuiHelper.ALIGN_BOTTOM_RIGHT,TextFormatAlign.RIGHT);
			eXMin = GuiHelper.createInput(layerMain, "", PADDING_LEFT/2 + (plotArea.x-PADDING_PLOTAREA_PADDING_LEFT)/2, eYMax.background.y - PADDING_PARAM_INPUT_VERTICAL, DISTANCE_WIDTH_PARAM_INPUT, GuiHelper.ALIGN_BOTTOM_RIGHT,TextFormatAlign.RIGHT);
			var lYMax:TextField = GuiHelper.createLabel(layerMain, Lang.getStr("interface","l_ymax"), eYMax.background.x - PADDING_PARAM_INPUT_HORISONTAL, eYMax.background.y + eYMax.background.height /2, GuiHelper.ALIGN_MIDDLE_RIGHT, GuiHelper.TF_LABEL_INPUT);
			var lXMax:TextField = GuiHelper.createLabel(layerMain, Lang.getStr("interface","l_xmax"), eXMax.background.x - PADDING_PARAM_INPUT_HORISONTAL, eXMax.background.y + eXMax.background.height /2, GuiHelper.ALIGN_MIDDLE_RIGHT, GuiHelper.TF_LABEL_INPUT);
			var lYMin:TextField = GuiHelper.createLabel(layerMain, Lang.getStr("interface","l_ymin"), eYMin.background.x - PADDING_PARAM_INPUT_HORISONTAL, eYMin.background.y + eYMin.background.height /2, GuiHelper.ALIGN_MIDDLE_RIGHT, GuiHelper.TF_LABEL_INPUT);
			var lXMin:TextField = GuiHelper.createLabel(layerMain, Lang.getStr("interface","l_xmin"), eXMin.background.x - PADDING_PARAM_INPUT_HORISONTAL, eXMin.background.y + eXMin.background.height /2, GuiHelper.ALIGN_MIDDLE_RIGHT, GuiHelper.TF_LABEL_INPUT);
			
			////// checkboxes
			cGrid = VK.createCheckBox(Lang.getStr("interface", "c_show_grid"), 0, 0);
			GuiHelper.placeElem(cGrid, PADDING_LEFT, eXMax.background.y - PADDING_PARAM_INPUT_VERTICAL, GuiHelper.ALIGN_BOTTOM_LEFT);
			layerMain.addChild(cGrid);
			cGrid.addEventListener(MouseEvent.CLICK, cGridAxesChanged);
			cAxes = VK.createCheckBox(Lang.getStr("interface", "c_show_axes"), 0, 0);
			GuiHelper.placeElem(cAxes, plotArea.x - PADDING_PLOTAREA_PADDING_LEFT, eXMax.background.y - PADDING_PARAM_INPUT_VERTICAL, GuiHelper.ALIGN_BOTTOM_RIGHT);
			layerMain.addChild(cAxes);
			cAxes.addEventListener(MouseEvent.CLICK, cGridAxesChanged);
			
			//loading default data
			boundsReturnDefaults();
			
			//// params header
			var lParamsHeader:* = GuiHelper.createHeader(layerMain, Lang.getStr("interface", "h_boundaries"), PADDING_LEFT, cGrid.y - PADDING_PARAM_INPUT_VERTICAL, plotArea.x - PADDING_PLOTAREA_PADDING_LEFT - PADDING_LEFT, GuiHelper.ALIGN_BOTTOM_LEFT);
			
			//graph properties
			functionsPanel = new Sprite();
			functionPanelElements = new Array();
			GuiHelper.placeElem(functionsPanel, 0, plotArea.y + DISTANCE_PLOTAREA_HEIGHT + PADDING_PARAM_INPUT_VERTICAL, GuiHelper.ALIGN_TOP_LEFT);
			layerMain.addChild(functionsPanel);
			
			// buttons in the bottom
			pButtonsBottom = new Sprite();
			
			//// add graph button
			bAddGraph = VK.createLinkButton(Lang.getStr("interface", "b_add_graph"),0,0);
			pButtonsBottom.addChild(bAddGraph);
			bAddGraph.addEventListener(MouseEvent.CLICK, bAddGraphClicked);
			
			//// add app button
			bAddApp = VK.createLinkButton(Lang.getStr("interface", "b_add_app"),0,0);
			pButtonsBottom.addChild(bAddApp);
			bAddApp.addEventListener(MouseEvent.CLICK, bAddAppClicked);
			
			//// add friends button
			bAddFriends = VK.createLinkButton(Lang.getStr("interface", "b_add_friends"),0,0);
			pButtonsBottom.addChild(bAddFriends);
			bAddFriends.addEventListener(MouseEvent.CLICK, bAddFriendsClicked);
			
			layerMain.addChild(pButtonsBottom);
			
			//creating first graph and its controls
			addGraphInstance();
			
			//showing the whole interface
			addChild(layerMain);
			
			//event listeners
			addEventListener(KeyboardEvent.KEY_DOWN, keyPressed);
		}
		
		/**
		 * creares a new graph and control elements
		 */
		private function addGraphInstance():void
		{
			var gid:int = graphsContainer.graphCreate();
			var col:int = graphsContainer.graphGetColor(gid);
			var current:Sprite = new Sprite();
			functionPanelElements.push(current);
			current.name = "f" + gid;
			
			////Plot button
			var bPlot:* = VK.createRoundButton(Lang.getStr("interface", "b_plot"),0,0);
			GuiHelper.placeElem(bPlot, app_width - PADDING_RIGHT - DISTANCE_PLOTAREA_ROUNDFACTOR, 0, GuiHelper.ALIGN_TOP_RIGHT);
			current.addChild(bPlot);
			bPlot.addEventListener(MouseEvent.CLICK, bPlotClicked);
			bPlot.name = "bPlot";
			
			////Delete button
			var bDel:* = VK.createRoundButton(Lang.getStr("interface", "b_del"),0,0, 2);
			GuiHelper.placeElem(bDel, bPlot.x - PADDING_PARAM_INPUT_VERTICAL, 0, GuiHelper.ALIGN_TOP_RIGHT);
			current.addChild(bDel);
			bDel.name = "bDel";
			bDel.addEventListener(MouseEvent.CLICK, bDelClicked);
			
			////Plot input
			var eFormula:* = GuiHelper.createInput(
												current,
												"",
												plotArea.x + DISTANCE_PLOTAREA_ROUNDFACTOR,
												0,
												DISTANCE_PLOTAREA_WIDTH - PADDING_PARAM_INPUT_VERTICAL*2 - DISTANCE_PLOTAREA_ROUNDFACTOR * 2 - bPlot.width - bDel.width,
												GuiHelper.ALIGN_TOP_LEFT
											);
			eFormula.name = "eFormula";
			
			//plot "y = " phrase
			var lFormulaPrefix:* = GuiHelper.createLabel(
												current,
												Lang.getStr("interface", "l_y_equals"),
												eFormula.background.x + GuiHelper.DISTANCE_INPUT_PADDING+1,
												eFormula.edit.height/2 + 3,
												GuiHelper.ALIGN_MIDDLE_LEFT
											);
			
			//moving edit to fit “y = ” text
			eFormula.edit.x = eFormula.edit.x+lFormulaPrefix.width + 1;
			eFormula.edit.width -= lFormulaPrefix.width + DISTANCE_COLOR_SIZE + 5;
			
			////Color button
			var bCol:* = VK.createLightButton("",0,0, DISTANCE_COLOR_SIZE, col, getHighlightColor(col), 0, 0, 0);
			bCol.height = DISTANCE_COLOR_SIZE;
			GuiHelper.placeElem(bCol, eFormula.background.x + eFormula.background.width - 3, Math.round(eFormula.background.y + eFormula.background.height/2), GuiHelper.ALIGN_MIDDLE_RIGHT);//TODO: исправить баг с расположением квадратика цвета в английской версии
			current.addChild(bCol);
			bCol.name = "bCol";
			bCol.addEventListener(MouseEvent.CLICK, bColClicked);
			
			var ePointsCountContainer:Sprite = new Sprite;
			ePointsCountContainer.name = "ePointsCountContainer";
			current.addChild(ePointsCountContainer);
			
			var ePointsCount:* = GuiHelper.createInput(
											ePointsCountContainer,
											DEFAULT_NUMBER_OF_POINTS,
											plotArea.x - PADDING_PLOTAREA_PADDING_LEFT,
											0,
											DISTANCE_WIDTH_PARAM_INPUT,
											GuiHelper.ALIGN_TOP_RIGHT,
											TextFormatAlign.RIGHT
										);
			var lPointsCount:* = GuiHelper.createLabel(
											current,
											Lang.getStr("interface", "l_n_of_points"),
											ePointsCount.background.x - PADDING_PARAM_INPUT_HORISONTAL,
											ePointsCount.edit.height/2 + 2,
											GuiHelper.ALIGN_MIDDLE_RIGHT,
											GuiHelper.TF_LABEL_INPUT
										);
			
			//correction of buttons y position
			GuiHelper.placeElem(
								bPlot,
								bPlot.x,
								Math.round(eFormula.background.y + eFormula.background.height/2),
								GuiHelper.ALIGN_MIDDLE_LEFT
							);
			//correction of button y position
			GuiHelper.placeElem(
								bDel,
								bDel.x,
								Math.round(eFormula.background.y + eFormula.background.height/2),
								GuiHelper.ALIGN_MIDDLE_LEFT
							);
			
			current.y = functionsPanel.height;
			functionsPanel.addChild(current);
			arrangeGraphInstances();
			
		}
		private function replotGraphInstance(gid:String):void
		{
			var id:int = parseInt(gid.substr(1));
			
			var eFormula:* = functionsPanel.getChildByName(gid);
			var eFormulaTF:* = eFormula.getChildByName("edit");
			var eNumberOfDots:* = (functionsPanel.getChildByName(gid) as Sprite).getChildByName("ePointsCountContainer");
			
			
			var formula:String = eFormula.getChildByName("edit").text;
			var numberOfDots:Number;
			
			var de:Error = null;
			var err:Error = null;	
				
			//applying number of dots
			try{
				numberOfDots=Utils.strToNumber(eNumberOfDots.getChildByName("edit").text);
				eNumberOfDots.getChildByName("edit").text = Utils.numberToStr(numberOfDots);
				if (Math.round(numberOfDots) != numberOfDots || numberOfDots < GraphsContainer.MIN_POINTS_COUNT || numberOfDots > GraphsContainer.MAX_POINTS_COUNT)
					throw new Error();
				GuiHelper.highlightInput(eNumberOfDots, GuiHelper.INPUT_MODE_NORMAL);
			}catch (e:*) {
				de = new Error();
				de.message = Utils.formatStr(Lang.getStr("error",'wrong_number_of_dots'), GraphsContainer.MIN_POINTS_COUNT, GraphsContainer.MAX_POINTS_COUNT);
				GuiHelper.highlightInput(eNumberOfDots,  GuiHelper.INPUT_MODE_ERROR);
				stage.focus = eNumberOfDots.getChildByName("edit");
			}
			
			//parsing formula
			try
			{
				graphsContainer.graphChangeFormula(id,formula);
			}
			catch(ee:ExpressionError)
			{
				err = new Error();
				//корректируются некоторые ошибки выражения (частные случаи)
				//пустое выражение
				if (ee.Type==1)
					err.message = "empty";
					//err.message='<font color="#36638E" size="12"><b>'+Lang.getStr('interface','cap_f_empty')+'</b></font>';
				else 
					//y
				if (ee.Type==31 && ee.Content.toLowerCase()=='y')
					err.message=Lang.getStr('error','y_in_f');
				//|x|
				else if (ee.Type==3 && ee.Content=='|')
					err.message=ee.Message+'<br/><br/><font color="#666666">'+Lang.getStr('error','vertical_slash')+'</font>';
				//ха вместо икс
				else if (ee.Type==3 && ee.Content.toLowerCase()=='х')
					err.message=ee.Message+'<br/><br/><font color="#666666">'+Lang.getStr('error','x_rus')+'</font>';
				//знак равно
				else if (ee.Type==3 && ee.Content=='=')
					err.message=Lang.getStr('error','equal_presents');
				//запятая вместо точки у числа
				else if (ee.Type==33)
					err.message=ee.Message+'<br/><br/><font color="#666666">'+Lang.getStr('error','comma')+'</font>';
				//1 аргумент вместо двух в log
				else if (ee.Type==56 && ee.Content.toLowerCase().indexOf('log')==0)
					err.message=ee.Message+'<br/><br/><font color="#666666">'+Lang.getStr('error','log_ln')+'</font>';
				//asin->sin и тд
				/*else if (ee.Type==34 && hnts[ee.Content.toLowerCase()]!=null){
						err.message=ee.Message+'<br/><br/><font color="#666666">'+Utils.formatStr(Lang.getStr('error','func_name_hint'),Lang.getStr('formula',hnts[ee.Content.toLowerCase()],'name'),hnts[ee.Content.toLowerCase()])+'</font>';
				}*/else 
					err.message=ee.Message;
				
				if (ee.Type!=1)
				{
					GuiHelper.highlightInput(eFormula, GuiHelper.INPUT_MODE_ERROR);
					Dbg.log(err.message);//TODO: showError in function
					//курсор ставится на место ошибки
					if (ee.Position==-1)
						eFormulaTF.setSelection(0,eFormulaTF.text.length);
					else
						eFormulaTF.setSelection(ee.Position,ee.Position+ee.Length);
					stage.focus=eFormulaTF;
				}
			}
			
			if (de != null)
			{
				GuiHelper.highlightInput(eNumberOfDots, GuiHelper.INPUT_MODE_ERROR);
				Dbg.log(de.message);//TODO: showError in function
				eNumberOfDots.getChildByName("edit").setSelection(0,eNumberOfDots.getChildByName("edit").text.length);
			}
			
			
			try {
				(functionsPanel.getChildByName(gid) as Sprite).removeChild((functionsPanel.getChildByName(gid) as Sprite).getChildByName("lError"));
			}catch (e:Error){}
			
			if (de != null || (err != null && err.message!="empty"))
			{
				var lError:TextField;
				
				var xx:* = eFormula.getChildByName("bPlot").x + eFormula.getChildByName("bPlot").width;
				var ww:* = xx - eNumberOfDots.getChildByName("background").x;//eFormula.getChildByName("background").width + eNumberOfDots.getChildByName("background").width +PADDING_PLOTAREA_PADDING_LEFT + DISTANCE_PLOTAREA_ROUNDFACTOR;
				if (err != null  && err.message!="empty")
				{
					lError = GuiHelper.createTextField(functionsPanel.getChildByName(gid), err.message, xx, 20, GuiHelper.ALIGN_TOP_RIGHT, null, ww);
				}
				else
				{
					lError = GuiHelper.createTextField(functionsPanel.getChildByName(gid), de.message, xx, 20, GuiHelper.ALIGN_TOP_RIGHT, null, ww);
				}
				lError.name = "lError";
				try
				{
					graphsContainer.graphChangeFormula(id, "");
				}
				catch (e:*) { };
				graphsContainer.graphRefresh(id);
				arrangeGraphInstances();
				return;
			}
			
			
			GuiHelper.highlightInput(eFormula, GuiHelper.INPUT_MODE_NORMAL);
			GuiHelper.highlightInput(eNumberOfDots, GuiHelper.INPUT_MODE_NORMAL);
				
			graphsContainer.graphChangeNumberOfDots(id, numberOfDots);
			graphsContainer.graphRefresh(id);
			
			functionsPanel.getChildByName(gid).alpha = 100;
			arrangeGraphInstances();	
		}
		
		private function removeGraphInstance(gid:String):void
		{
			graphsContainer.graphDelete(parseInt(gid.substr(1)));
			functionsPanel.removeChild(functionsPanel.getChildByName(gid));
			delete functionsPanel.getChildByName(gid);
			
			var newarr:Array = new Array();
			for (var i:int = 0; i < functionPanelElements.length; i++) 
				if (functionPanelElements[i].name != gid)
					newarr.push(functionPanelElements[i]);
			
			functionPanelElements = newarr;
			
			arrangeGraphInstances();
		}
		/**
		 * Creates Context menu
		 */
		private function createContextMenu():void
		{
			var cm:ContextMenu = new ContextMenu();
			cm.hideBuiltInItems();
			//Autor
			var cm_autor:ContextMenuItem = new ContextMenuItem(Lang.getStr("interface", "menu_autor"));
			cm_autor.addEventListener( ContextMenuEvent.MENU_ITEM_SELECT, function(e:ContextMenuEvent):void
			{
				navigateToURL( new URLRequest( "id1308390" ), "_blank" );
			});
			cm.customItems.push(cm_autor);
			
			//Translators (if present)
			var gotoTranslator:Function = function(e:ContextMenuEvent):void
			{
				var i:uint = 0;
				while (Lang.getStr("autors", i, "name") != "")
				{
					if (e.target.caption.indexOf(Lang.getStr("autors", i, "name")) !== false){
						navigateToURL(new URLRequest(Lang.getStr("autors", i, "href")), "_blank");
						break;
					}
					i++;
				}
			}
			var i:uint = 0;
			var cm_translator:ContextMenuItem;
			while (Lang.getStr("autors", i, "name") != "")
			{
				cm_translator = new ContextMenuItem(Lang.getStr("interface", "l_translator") + Lang.getStr("autors", i, "name"));
				if (Lang.getStr("autors", i, "href") != "")
				{
					cm_translator.addEventListener( ContextMenuEvent.MENU_ITEM_SELECT, gotoTranslator);
				}
				cm.customItems.push(cm_translator);
				++i;
			}
			
			contextMenu = cm;
		}
		
			
		/**
		 * Changing the size of an application window
		 * @param	new_width
		 * @param	new_height
		 */
		private function updateAppSize(new_width:uint, new_height:uint):void
		{
			if (app_width == new_width && app_height == new_height)
				return;
			
			app_height = new_height;
			app_width = new_width;
			
			if (wrapper_enabled)
			{
				wrapper.external.resizeWindow(app_width, app_height);
			}
			else
			{
				layerMain.graphics.lineStyle(1, 0x0);
				layerMain.graphics.drawRect(0, 0, app_width, app_height);
			}
			
		}
		
		/**
		 * Correctly places graph controls
		 */
		private function arrangeGraphInstances():void
		{
			var prev_y:Number = -PADDING_PARAM_INPUT_VERTICAL;
			for (var i:int = 0; i < functionPanelElements.length;i++) 
			{
				functionPanelElements[i].y = prev_y + PADDING_PARAM_INPUT_VERTICAL;
				prev_y += functionPanelElements[i].height + PADDING_PARAM_INPUT_VERTICAL;
			}
			
			//showing / hiding Del buttons
			var elem:*;
			if (functionPanelElements.length > 1)
			{
				//there are several elements
				for each (elem in functionPanelElements) 
				{
					if (!elem.getChildByName("bDel").visible)
					{
						elem.getChildByName("bDel").visible = true;
						elem.getChildByName("edit").width -= elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
						elem.getChildByName("background").width -= elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
						elem.getChildByName("border").width -= elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
						elem.getChildByName("bCol").x -= elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
					}
				}	
			}
			else
			{
				//there is one element
				for each (elem in functionPanelElements) 
				{
					if (elem.getChildByName("bDel").visible)
					{
						elem.getChildByName("edit").width += elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
						elem.getChildByName("background").width += elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
						elem.getChildByName("border").width += elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
						elem.getChildByName("bCol").x += elem.getChildByName("bDel").width + PADDING_PARAM_INPUT_VERTICAL;
						elem.getChildByName("bDel").visible = false;
					}
				}	
				
			}
			
			pButtonsBottom.y = functionsPanel.y + functionsPanel.height + PADDING_PARAM_INPUT_VERTICAL/2;
			updateButtonsBottom();
			Dbg.log("000 " + pButtonsBottom.height);
			updateAppSize(app_width,pButtonsBottom.y + pButtonsBottom.height+PADDING_BOTTOM);
		}
		
		/**
		 * Shows or hides needed buttons in the bottom
		 */
		private function updateButtonsBottom():void
		{
			var xpos:int = app_width - PADDING_RIGHT - DISTANCE_PLOTAREA_ROUNDFACTOR;
			
			if (functionPanelElements.length < MAX_GRAPH_COUNT)
			{
				bAddGraph.visible = true;
				GuiHelper.placeElem(bAddGraph, xpos, 0, GuiHelper.ALIGN_TOP_RIGHT);
				xpos -= bAddGraph.width + PADDING_BETWEEN_ELEMS_TOP;
			}
			else
				bAddGraph.visible = false;
			
				
			if (wrapper_enabled && !is_app_user)
			{
				bAddApp.visible = true;
				GuiHelper.placeElem(bAddApp, xpos, 0,  GuiHelper.ALIGN_TOP_RIGHT);
				xpos -= bAddApp.width + PADDING_BETWEEN_ELEMS_TOP;
			}
			else
				bAddApp.visible = false;
				
			if (wrapper_enabled)
			{
				bAddFriends.visible = true;
				GuiHelper.placeElem(bAddFriends, xpos, 0,  GuiHelper.ALIGN_TOP_RIGHT);
			}
			else
				bAddFriends.visible = false;
				
		}
			
		/**
		 * 
		 * @param	s — input string
		 * @return value of s as string or 0 if s is not defined
		 */
		private function getFlashVarInt( s:String ):int
		{
		  return (vars[s] != null)
			?	parseInt( vars[s] ) 
			:	0;
		}


		//------------------------------------------------------------------------------------ Events responce functions
		
		private function keyPressed(e:KeyboardEvent = null):void
		{
			var cc:* = e.charCode
			if (cc != 0 && cc != 13 && cc != 9){
				if (stage.focus == eXMax.edit)
					GuiHelper.highlightInput(eXMax, GuiHelper.INPUT_MODE_CHANGED);
				if (stage.focus == eYMax.edit)
					GuiHelper.highlightInput(eYMax, GuiHelper.INPUT_MODE_CHANGED);
				if (stage.focus == eXMin.edit)
					GuiHelper.highlightInput(eXMin, GuiHelper.INPUT_MODE_CHANGED);
				if (stage.focus == eYMin.edit)
					GuiHelper.highlightInput(eYMin, GuiHelper.INPUT_MODE_CHANGED);
				
				for (var i:int = 0; i < functionPanelElements.length; i++)
					if (stage.focus == functionPanelElements[i].getChildByName("edit"))
					{
						GuiHelper.highlightInput(functionPanelElements[i], GuiHelper.INPUT_MODE_CHANGED);
						//this is the worst code I've done since school
						functionPanelElements[i].alpha = 99;
						break;
					}
					else if (stage.focus == functionPanelElements[i].getChildByName("ePointsCountContainer").getChildByName("edit"))
					{
						GuiHelper.highlightInput(functionPanelElements[i].getChildByName("ePointsCountContainer"), GuiHelper.INPUT_MODE_CHANGED);
						//this is the worst code I've done since school
						functionPanelElements[i].alpha = 99;
						break;
					}
				if (stage.focus == eYMin.edit)
					GuiHelper.highlightInput(eYMin, GuiHelper.INPUT_MODE_CHANGED);
			}
			if (e.keyCode != Keyboard.ENTER)
				return;
			
			GuiHelper.highlightInput(e.target.parent, GuiHelper.INPUT_MODE_NORMAL);
			
			if (
					stage.focus == eXMax.edit
				 || stage.focus == eYMax.edit
				 || stage.focus == eXMin.edit
				 || stage.focus == eYMin.edit
				)
			{
				boundsApply();
			}
			else {
			if (stage.focus.parent.parent == functionsPanel || stage.focus.parent.parent.parent == functionsPanel)
				{
					var n:String = stage.focus.parent.name;
					if (n == "ePointsCountContainer") n = stage.focus.parent.parent.name
					replotGraphInstance(n);
				}
			}
		}
		
		private function bPlotClicked(e:MouseEvent = null):void
		{
			replotGraphInstance(e.target.parent.name);
		}
		
		private function bAddGraphClicked(e:MouseEvent = null):void
		{
			addGraphInstance();
		}
		
		private function bDelClicked(e:MouseEvent = null):void
		{
			removeGraphInstance(e.target.parent.name);
		}
		
		private function bColClicked(e:MouseEvent = null):void
		{
			var color:int = Math.random() * 0xFFFFFF;
			var eFormulaBackground:* = e.target.parent.getChildByName("background");
			
			var par:* = e.target.parent;
			
			graphsContainer.graphChangeColor(parseInt( e.target.parent.name.substr(1)), color);
			
			par.removeChild(par.getChildByName("bCol"));
			
			var bCol:* = VK.createLightButton("",0,0, DISTANCE_COLOR_SIZE, color, getHighlightColor(color), 0, 0);
			bCol.height = DISTANCE_COLOR_SIZE;
			GuiHelper.placeElem(bCol, eFormulaBackground.x + eFormulaBackground.width - 3, Math.round(eFormulaBackground.y + eFormulaBackground.height/2), GuiHelper.ALIGN_MIDDLE_RIGHT);
			bCol.name = "bCol";
			par.addChild(bCol);
			bCol.addEventListener(MouseEvent.CLICK, bColClicked);
		}
		
		private function cGridAxesChanged(e:Event = null):void
		{
			graphsContainer.hasGrid = cGrid.checked;
			graphsContainer.hasAxes = cAxes.checked;
		}
		 
		private function boundsReturnDefaults(e:Event = null):void
		{
			eXMin.edit.text = "-10";
			eYMin.edit.text = "-10";
			eXMax.edit.text = "10";
			eYMax.edit.text = "10";
			cGrid.checked = true;
			cAxes.checked = true;
			cGridAxesChanged();
			boundsApply();
		}
		
		private function boundsApply(e:Event = null):void
		{
			try{
				Dbg.log("bound");
				//перевод данных их полей ввода в переменные
				var xmin:Number;
				var xmax:Number;
				var ymin:Number;
				var ymax:Number;
				
				try{
					xmin=Utils.strToNumber(eXMin.edit.text);
					eXMin.edit.text = Utils.numberToStr(xmin);
					GuiHelper.highlightInput(eXMin, GuiHelper.INPUT_MODE_NORMAL);
				}catch (e:*) {
					GuiHelper.highlightInput(eXMin,  GuiHelper.INPUT_MODE_ERROR);
				}
				try{
					xmax=Utils.strToNumber(eXMax.edit.text);
					eXMax.edit.text = Utils.numberToStr(xmax);
					GuiHelper.highlightInput(eXMax, GuiHelper.INPUT_MODE_NORMAL);
				}catch (e:*) {
					GuiHelper.highlightInput(eXMax,  GuiHelper.INPUT_MODE_ERROR);
				}
				
				try{
					ymin=Utils.strToNumber(eYMin.edit.text);
					eYMin.edit.text = Utils.numberToStr(ymin);
					GuiHelper.highlightInput(eYMin, GuiHelper.INPUT_MODE_NORMAL);
				}catch (e:*) {
					GuiHelper.highlightInput(eYMin,  GuiHelper.INPUT_MODE_ERROR);
				}
				try{
					ymax=Utils.strToNumber(eYMax.edit.text);
					eYMax.edit.text = Utils.numberToStr(ymax);
					GuiHelper.highlightInput(eYMax, GuiHelper.INPUT_MODE_NORMAL);
				}catch (e:*) {
					GuiHelper.highlightInput(eYMax,  GuiHelper.INPUT_MODE_ERROR);
				}
				
				//проверка правильности заполнения данных
				////проверка полей на правильность формата числа
				//////границы построения
				var arr:Array = new Array(xmin, Lang.getStr("interface", "l_xmin"), eXMin, xmax, Lang.getStr("interface", "l_xmax"), eXMax, ymin, Lang.getStr("interface", "l_ymin"), eYMin, ymax, Lang.getStr("interface", "l_ymax"), eYMax);
				for (var i:int=0;i<=9;i+=3){
					if (!isFinite(arr[i]) || Math.abs(arr[i])>GraphsContainer.BOUND_MAX_VALUE){
						GuiHelper.highlightInput(arr[i+2],  GuiHelper.INPUT_MODE_ERROR);
						GuiHelper.focusInput(stage, arr[i + 2]);
						if (arr[i+2].edit.text.indexOf(',')!=-1)
							throw new Error(Utils.formatStr(Lang.getStr('error','wrong_bound'),arr[i+1],GraphsContainer.BOUND_MAX_VALUE)+'<br/><br/><font color="#666666">'+Lang.getStr('error','comma')+'</font>');
						throw new Error(Utils.formatStr(Lang.getStr('error','wrong_bound'),arr[i+1],GraphsContainer.BOUND_MAX_VALUE));
					}
				}
				////проверка, минимальной разницы
				//////между x
				if (xmax-xmin<GraphsContainer.BOUND_MIN_DISTANCE){
					if (xmax-GraphsContainer.BOUND_MIN_DISTANCE<GraphsContainer.BOUND_MAX_VALUE)
						GuiHelper.focusInput(stage, eXMax);
					else
						GuiHelper.focusInput(stage, eXMin);
						throw new Error(Utils.formatStr(Lang.getStr('error','small_range'),Lang.getStr('interface','l_xmin'),Lang.getStr('interface','l_xmax'),GraphsContainer.BOUND_MIN_DISTANCE));
				}
				//////между y
				if (ymax-ymin<GraphsContainer.BOUND_MIN_DISTANCE){
					if (ymax-GraphsContainer.BOUND_MIN_DISTANCE<GraphsContainer.BOUND_MAX_VALUE)
						GuiHelper.focusInput(stage, eYMax);
					else
						GuiHelper.focusInput(stage, eYMin);
						throw new Error(Utils.formatStr(Lang.getStr('error','small_range'),Lang.getStr('interface','l_ymin'),Lang.getStr('interface','l_ymax'),GraphsContainer.BOUND_MIN_DISTANCE));
				}
				
				//updating bounds. If they are changed, update all the graphs
				if (graphsContainer.updateBounds(new Bounds2D(xmin, xmax, ymin, ymax)))
				{
					var gid:*;
					for each (var v:* in functionPanelElements) {
						gid = v.name.substr(1);
						
						if (v.alpha != 99) //shit, I cant believe I wrote it!
							graphsContainer.graphRefresh(gid);
					}
				}
				//если всё ок
				displayMessage();
			
			//if applying bounds caused an error
			}catch (error:*) {
				var msg:String = '<font color="#8E8443" size="12"><b>'
							+Lang.getStr('interface', 'cap_f_param_error')
							+'</b></font><br/><br/>'
							+error.message;
				
				displayMessage(msg);
				/*}else if (ee==null || ee.Type!=1){
					field.em.htmlText='<font color="#8E8443" size="12"><b>'+Lang.getStr('interface','cap_f_error')+'</b></font><br/><br/>'+e.message;
				}else{
					field.em.htmlText=e.message;
				}*/			
			}
			
		}
		
		public function displayMessage(message:String = null):void
		{
			if (message == null) {
					plotArea.coordsContainer.visible = true;
					graphsContainer.visible = true;
					plotArea.em.visible = false;
					plotArea.grafContainer.visible = true;
					return
			}
			plotArea.coordsContainer.visible = false;
			plotArea.grafContainer.visible = false;
			plotArea.em.htmlText = message;
			plotArea.em.height=plotArea.em.textHeight+4;
			plotArea.em.y=DISTANCE_PLOTAREA_HEIGHT/2-plotArea.em.height/3*2;
			plotArea.em.visible = true;
		}
		
		private function getHighlightColor(color:int):int
		{
				var a:uint = 0+color;
				var R:int = Math.min(255,(color >> 16 & 0xFF) + 10);
				var G:int = Math.min(255,(color >> 8  & 0xFF) + 10);
				var B:int = Math.min(255,(color & 0xFF) + 10);
				return (R<<16) | (G<<8) | B;
		}
		private function bAddAppClicked(e:MouseEvent = null):void
		{
			if (wrapper_enabled)
				wrapper.external.showInstallBox();
			is_app_user = 1;
			updateButtonsBottom();
		}
		
		private function bAddFriendsClicked(e:MouseEvent = null):void
		{
			if (wrapper_enabled)
				wrapper.external.showInviteBox();
		}
			
		
	}
	
}