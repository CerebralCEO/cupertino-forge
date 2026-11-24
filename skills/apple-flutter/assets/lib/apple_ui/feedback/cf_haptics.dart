import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Haptics per tokens/feedback.json. iOS uses UIFeedbackGenerator through HapticFeedback.
/// Android uses HapticFeedbackConstants through the AppleHapticsPlugin channel (falls back to HapticFeedback).
abstract final class CfHaptics {
  static bool enabled = true;
  static const _channel = MethodChannel('cupertino_forge/haptics');

  static Future<void> _android(String constant, Future<void> Function() fallback) async {
    try {
      await _channel.invokeMethod('perform', constant);
    } catch (_) {
      await fallback();
    }
  }

  static bool get _isAndroid => defaultTargetPlatform == TargetPlatform.android;
  static bool get _supported => enabled && (defaultTargetPlatform == TargetPlatform.iOS || _isAndroid);

  static Future<void> selection() async {
    if (!_supported) return;
    _isAndroid ? await _android('SEGMENT_TICK', HapticFeedback.selectionClick) : await HapticFeedback.selectionClick();
  }

  static Future<void> toggle(bool on) async {
    if (!_supported) return;
    _isAndroid ? await _android(on ? 'TOGGLE_ON' : 'TOGGLE_OFF', HapticFeedback.selectionClick) : await HapticFeedback.selectionClick();
  }

  static Future<void> light() async {
    if (!_supported) return;
    _isAndroid ? await _android('GESTURE_THRESHOLD_ACTIVATE', HapticFeedback.lightImpact) : await HapticFeedback.lightImpact();
  }

  static Future<void> medium() async {
    if (!_supported) return;
    _isAndroid ? await _android('LONG_PRESS', HapticFeedback.mediumImpact) : await HapticFeedback.mediumImpact();
  }

  static Future<void> rigid() async {
    if (!_supported) return;
    _isAndroid ? await _android('CONFIRM', HapticFeedback.mediumImpact) : await HapticFeedback.heavyImpact();
  }

  static Future<void> success() async {
    if (!_supported) return;
    if (_isAndroid) return _android('CONFIRM', HapticFeedback.mediumImpact);
    await HapticFeedback.lightImpact();
    await Future<void>.delayed(const Duration(milliseconds: 90));
    await HapticFeedback.mediumImpact();
  }

  static Future<void> warning() async {
    if (!_supported) return;
    if (_isAndroid) return _android('REJECT', HapticFeedback.heavyImpact);
    await HapticFeedback.mediumImpact();
    await Future<void>.delayed(const Duration(milliseconds: 110));
    await HapticFeedback.mediumImpact();
  }

  static Future<void> error() async {
    if (!_supported) return;
    if (_isAndroid) return _android('REJECT', HapticFeedback.heavyImpact);
    for (var i = 0; i < 3; i++) {
      await HapticFeedback.heavyImpact();
      await Future<void>.delayed(const Duration(milliseconds: 70));
    }
  }
}
