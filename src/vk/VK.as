package vk
{
  import flash.display.Loader;
  import flash.net.URLRequest;
  import flash.events.Event;
  import flash.events.IOErrorEvent;
  import flash.system.LoaderContext;
  import flash.system.ApplicationDomain;

  /**
   * @author Alexey Kharkov
   */
  public class VK
  {
    public static var MainMenu:Class = null;
    public static var RoundButton:* = null;
    public static var SquareButton:* = null;
    public static var LinkButton:* = null;
    public static var LightButton:* = null;
    public static var ComboBox:* = null;
    public static var ListBox:* = null;
    public static var Box:* = null;
    public static var CheckBox:* = null;
    public static var RadioButtonsGroup:* = null;
    public static var Pagination:* = null;
    public static var InputField:* = null;
    public static var ScrollBar:* = null;
    public static var Utils:* = null;

    public static const LINK_BUTTON:uint = 0;
    public static const BLUE_BUTTON:uint = 1;
    public static const GRAY_BUTTON:uint = 2;

    // ------------------------------------------------------------------------------ Call this before use of VK library.
    public static function init( obj:*, url:String ):void
    {
      var loader:Loader = new Loader();
      loader.contentLoaderInfo.addEventListener( Event.COMPLETE, function(e:Event):void
      {
        Utils        = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.Utils" ) as Class;
        RoundButton  = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.RoundButton" ) as Class;
        SquareButton = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.SquareButton" ) as Class;
        LinkButton   = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.LinkButton" ) as Class;
        LightButton  = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.LightButton" ) as Class;
        ComboBox     = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.ComboBox" ) as Class;
        ListBox      = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.ListBox" ) as Class;
        Box          = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.Box" ) as Class;
        CheckBox     = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.CheckBox" ) as Class;
        RadioButtonsGroup = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.RadioButtonsGroup" ) as Class;
        MainMenu     = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.MainMenu" ) as Class;
        Pagination   = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.Pagination" ) as Class;
        InputField   = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.InputField" ) as Class;
        ScrollBar    = loader.contentLoaderInfo.applicationDomain.getDefinition( "vk.gui.ScrollBar" ) as Class;
        
        obj.onVKLoaded();
      } );
      
      loader.contentLoaderInfo.addEventListener( IOErrorEvent.IO_ERROR, function(e:IOErrorEvent):void
      {
        //trace( e.toString() );
      }, false, 0, true );
      
      loader.load( new URLRequest( url ), new LoaderContext( false, ApplicationDomain.currentDomain ) );
    }
    
    // ------------------------------------------------------------------------------ Creation wrappers.
    public static function createMainMenu( wrapper:*, lazyMode:Boolean = false ):*
    {
      return new MainMenu( wrapper, lazyMode );
    }
    
    public static function createRoundButton( label:String, x:int, y:int, type:uint = 1 ):*
    {
      return new RoundButton( label, x, y, type );
    }
    
    public static function createSquareButton( label:String, x:int, y:int, type:uint = 1 ):*
    {
      return new SquareButton( label, x, y, type );
    }
    
    public static function createLinkButton( label:String, x:int, y:int, font_size:uint = 11, width:uint = 0, height:uint = 0 ):*
    {
      return new LinkButton( label, x, y, font_size, width, height );
    }
    
    public static function createLightButton( label:String, x:int, y:int, width:uint,
      color:int, active_color:int, text_color:uint, active_text_color:uint, 
      align:uint = 0, font_size:uint = 11, margins:uint = 4 ):*
    {
      return new LightButton( label, x, y, width, color, active_color, text_color, active_text_color, align, font_size, margins );
    }
    
    public static function createComboBox( wrapper:*, x:int, y:int, width:uint ):*
    {
      return new ComboBox( wrapper, x, y, width );
    }

    public static function createListBox( x:int, y:int, width:uint ):*
    {
      return new ListBox( x, y, width );
    }

    public static function createBox( title:String, content:*, y:int, width:uint, buttons:Array ):*
    {
      return new Box( title, content, y, width, buttons );
    }

    public static function createCheckBox( title:String, x:int, y:int ):*
    {
      return new CheckBox( title, x, y );
    }
    
    public static function createRadioButtonsGroup( x:int, y:int ):*
    {
      return new RadioButtonsGroup( x, y );
    }
    
    public static function createPagination( totalCount:uint, x:uint, y:uint, height:uint = 0, type:uint = 0, pagesVisible:uint = 2, elemsOnPage:uint = 10 ):*
    {
      return new Pagination( totalCount, x, y, height, type, pagesVisible, elemsOnPage );
    }
    
    public static function createInputField( x:uint, y:uint, width:uint, linesCount:uint = 1, editable:Boolean = true, border:Boolean = true ):*
    {
      return new InputField( x, y, width, linesCount, editable, border );
    }

    public static function createScrollBar( x:int, y:int, height:int ):*
    {
      return new ScrollBar( x, y, height );
    }

    public static function addText( s:String, x:int, y:int, text_color:uint = 0, text_format:uint = 0x0010, width:uint = 0, height:uint = 0, font_size:uint = 11 ):*
    {
      return Utils.addText( x, y, width, font_size, s, text_color, text_format, height );
    }
  }
}
