package utils
{
  import flash.display.Sprite;
  import flash.events.MouseEvent;
  import flash.text.TextField;

  import vk.VK;

  /**
   * @author Alexey Kharkov
   */
  public class Dbg
  {
    public static const DEBUG_ON:Boolean = true;

    private static var txt:* = null;
    private static var ss:String = "";
    private static var showDebugButton:Sprite = null;
    private static var showDebug:Boolean = false;
    
    public static function init( obj:* ):void
    {
      if ( !DEBUG_ON )
        return;
      
      showDebugButton = new Sprite();
      showDebugButton.x = 614;
      showDebugButton.y = 7;
      
      VK.Utils.fillRect( showDebugButton, 0, 0, 8, 8, 0xEFEFEF );
      
      showDebugButton.addEventListener( MouseEvent.MOUSE_DOWN, onDown );

      obj.addChild( showDebugButton );
      
      txt = VK.createInputField( 7, 7, 607, 20, false );
      obj.addChild( txt );
      
      txt.visible = false;
      txt.alpha = 0.95;
    }

    public static function log( s:String ):void
    {
      if ( !DEBUG_ON )
        return;
        
      //traceCurTime();
      gg( s );
    }
    
    private static function gg( s:String ):void
    {
      trace( s );
      ss += s + "\n";
      if ( txt != null )
      {
        txt.value = ss;
      }
    }
    
    private static var wasTime:uint = 0;
    
    private static function traceCurTime():void
    {
      var tt:uint = new Date().valueOf();
      //trace( tt + "   " + wasTime );
      if ( wasTime > 0 )
      {
        var dt:int = tt - wasTime;
        gg( "     dt " + dt + " ms" );
      } else
        gg( "     starting dt calc" );
      
      wasTime = tt;
      //trace( loc );
    }

    // ----------------------------------------------------------------- Mouse events		
    private static function onDown( e:MouseEvent ):void
    {
      showDebug = !showDebug;
      txt.visible = showDebug;
    }
  }
}
/* */
