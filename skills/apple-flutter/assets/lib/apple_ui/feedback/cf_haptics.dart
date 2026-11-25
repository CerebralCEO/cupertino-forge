import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Haptics per tokens/feedback.json.
/// iOS: invokes AppleHapticsPlugin.swift MethodChannel (UINotificationFeedbackGenerator / UIImpactFeedbackGenerator /
/// UISelectionFeedbackGenerator) with graceful fallback to Flutter HapticFeedback when plugin is not registered.
/// Android: invokes AppleHapticsPlugin.kt MethodChannel with HapticFeedbackConstants (falls back to HapticFeedback).
abstract final class CfHaptics {
  static bool enabled = true;
  static const _channel = MethodChannel('cupertino_forge/haptics');

  static Future<void> _invoke(String constant, Future<void> Function() fallback) async {
    try {
      await _channel.invokeMethod('perform', constant);
    } catch (_) {
      await fallback();
    }
  }

  static bool get _isIOS => defaultTargetPlatform == TargetPlatform.iOS;
  static bool get _isAndroid => defaultTargetPlatform == TargetPlatform.android;
  static bool get _supported => enabled && (_isIOS || _isAndroid);
  static bool get supported => _supported;

  static Future<void> selection() async {
    if (!_supported) return;
    await _invoke(_isAndroid ? 'SEGMENT_TICK' : 'selection', HapticFeedback.selectionClick);
  }

  static Future<void> toggle(bool on) async {
    if (!_supported) return;
    await _invoke(_isAndroid ? (on ? 'TOGGLE_ON' : 'TOGGLE_OFF') : 'selection', HapticFeedback.selectionClick);
  }

  static Future<void> light() async {
    if (!_supported) return;
    await _invoke(_isAndroid ? 'GESTURE_THRESHOLD_ACTIVATE' : 'light', HapticFeedback.lightImpact);
  }

  static Future<void> medium() async {
    if (!_supported) return;
    await _invoke(_isAndroid ? 'LONG_PRESS' : 'medium', HapticFeedback.mediumImpact);
  }

  static Future<void> rigid() async {
    if (!_supported) return;
    await _invoke(_isAndroid ? 'CONFIRM' : 'rigid', _isAndroid ? HapticFeedback.mediumImpact : HapticFeedback.heavyImpact);
  }

  static Future<void> success() async {
    if (!_supported) return;
    if (_isAndroid) return _invoke('CONFIRM', HapticFeedback.mediumImpact);
    await _invoke('notificationSuccess', HapticFeedback.mediumImpact);
  }

  static Future<void> warning() async {
    if (!_supported) return;
    if (_isAndroid) return _invoke('REJECT', HapticFeedback.heavyImpact);
    await _invoke('notificationWarning', HapticFeedback.heavyImpact);
  }

  static Future<void> error() async {
    if (!_supported) return;
    if (_isAndroid) return _invoke('REJECT', HapticFeedback.heavyImpact);
    await _invoke('notificationError', HapticFeedback.heavyImpact);
  }
}
