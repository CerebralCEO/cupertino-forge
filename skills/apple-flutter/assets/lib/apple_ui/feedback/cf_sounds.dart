import 'package:audioplayers/audioplayers.dart';

/// Original synthesized UI sounds (assets/sounds/*.wav from the plugin). Off by default.
enum CfSound { tap, toggleOn, toggleOff, tick, success, error, send, refresh, keyboard }

abstract final class CfSounds {
  static bool enabled = false; // set from .apple-design.json "sounds" AND the in-app user setting
  static const double volume = 0.35;
  static DateTime _last = DateTime.fromMillisecondsSinceEpoch(0);
  static final _pool = <CfSound, AudioPlayer>{};

  static String _file(CfSound s) => switch (s) {
        CfSound.tap => 'sounds/tap.wav',
        CfSound.toggleOn => 'sounds/toggle-on.wav',
        CfSound.toggleOff => 'sounds/toggle-off.wav',
        CfSound.tick => 'sounds/tick.wav',
        CfSound.success => 'sounds/success.wav',
        CfSound.error => 'sounds/error.wav',
        CfSound.send => 'sounds/send.wav',
        CfSound.refresh => 'sounds/refresh.wav',
        CfSound.keyboard => 'sounds/keyboard.wav',
      };

  static Future<void> play(CfSound s) async {
    if (!enabled) return;
    final now = DateTime.now();
    if (now.difference(_last).inMilliseconds < 40) return;
    _last = now;
    final p = _pool.putIfAbsent(s, () => AudioPlayer()..setPlayerMode(PlayerMode.lowLatency));
    // Ambient: never interrupts the user's music
    await p.setAudioContext(AudioContext(
      iOS: AudioContextIOS(category: AVAudioSessionCategory.ambient, options: const {AVAudioSessionOptions.mixWithOthers}),
      android: const AudioContextAndroid(audioFocus: AndroidAudioFocus.none, usageType: AndroidUsageType.assistanceSonification),
    ));
    await p.play(AssetSource(_file(s)), volume: volume);
  }
}
