// Place in ios/Runner/AppleHapticsPlugin.swift and register in AppDelegate.swift:
//   AppleHapticsPlugin.register(with: controller.binaryMessenger)

import Flutter
import UIKit

public enum AppleHapticsPlugin {
    public static func register(with messenger: FlutterBinaryMessenger) {
        let channel = FlutterMethodChannel(name: "cupertino_forge/haptics", binaryMessenger: messenger)
        let selection = UISelectionFeedbackGenerator()
        let notification = UINotificationFeedbackGenerator()

        channel.setMethodCallHandler { call, result in
            guard call.method == "perform", let kind = call.arguments as? String else {
                result(FlutterMethodNotImplemented)
                return
            }
            switch kind {
            case "notificationSuccess":
                notification.notificationOccurred(.success)
            case "notificationWarning":
                notification.notificationOccurred(.warning)
            case "notificationError":
                notification.notificationOccurred(.error)
            case "light":
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            case "medium":
                UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            case "heavy":
                UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
            case "rigid":
                UIImpactFeedbackGenerator(style: .rigid).impactOccurred()
            case "soft":
                UIImpactFeedbackGenerator(style: .soft).impactOccurred()
            case "selection":
                selection.selectionChanged()
            default:
                selection.selectionChanged()
            }
            result(nil)
        }
    }
}
