// Place in android/app/src/main/kotlin/<your/package>/AppleHapticsPlugin.kt and register in MainActivity:
//   override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
//     super.configureFlutterEngine(flutterEngine)
//     AppleHapticsPlugin.register(flutterEngine, window.decorView)
//   }
package cupertino.forge

import android.os.Build
import android.view.HapticFeedbackConstants
import android.view.View
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

object AppleHapticsPlugin {
    fun register(engine: FlutterEngine, view: View) {
        MethodChannel(engine.dartExecutor.binaryMessenger, "cupertino_forge/haptics").setMethodCallHandler { call, result ->
            if (call.method != "perform") { result.notImplemented(); return@setMethodCallHandler }
            val c = when (call.arguments as? String) {
                "TOGGLE_ON" -> if (Build.VERSION.SDK_INT >= 34) HapticFeedbackConstants.TOGGLE_ON else HapticFeedbackConstants.CLOCK_TICK
                "TOGGLE_OFF" -> if (Build.VERSION.SDK_INT >= 34) HapticFeedbackConstants.TOGGLE_OFF else HapticFeedbackConstants.CLOCK_TICK
                "SEGMENT_TICK" -> if (Build.VERSION.SDK_INT >= 34) HapticFeedbackConstants.SEGMENT_TICK else HapticFeedbackConstants.CLOCK_TICK
                "SEGMENT_FREQUENT_TICK" -> if (Build.VERSION.SDK_INT >= 34) HapticFeedbackConstants.SEGMENT_FREQUENT_TICK else HapticFeedbackConstants.CLOCK_TICK
                "GESTURE_THRESHOLD_ACTIVATE" -> if (Build.VERSION.SDK_INT >= 34) HapticFeedbackConstants.GESTURE_THRESHOLD_ACTIVATE else HapticFeedbackConstants.CONTEXT_CLICK
                "CONFIRM" -> if (Build.VERSION.SDK_INT >= 30) HapticFeedbackConstants.CONFIRM else HapticFeedbackConstants.VIRTUAL_KEY
                "REJECT" -> if (Build.VERSION.SDK_INT >= 30) HapticFeedbackConstants.REJECT else HapticFeedbackConstants.LONG_PRESS
                "LONG_PRESS" -> HapticFeedbackConstants.LONG_PRESS
                "KEYBOARD_TAP" -> HapticFeedbackConstants.KEYBOARD_TAP
                else -> HapticFeedbackConstants.CLOCK_TICK
            }
            view.performHapticFeedback(c)
            result.success(null)
        }
    }
}
