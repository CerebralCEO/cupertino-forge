//! cupertino-forge: native window material and chrome for Apple style Tauri 2 apps.
//! Target API: window-vibrancy 0.8.x (LiquidGlassOptions on macOS 26+ when distribution=direct,
//! public NSVisualEffectView vibrancy fallback when mac-app-store or macOS <=15).
//! Windows 11: Mica + optional custom chrome. Linux: optional decorations off.

use tauri::{Runtime, WebviewWindow};

use crate::apple_config::AppleDesignConfig;

pub fn apply_apple_window<R: Runtime>(window: &WebviewWindow<R>, config: &AppleDesignConfig) {
    let radius = config.resolved_window_radius();
    let _ = radius;

    #[cfg(target_os = "macos")]
    {
        use crate::apple_config::Distribution;
        use window_vibrancy::{
            apply_liquid_glass, apply_vibrancy, LiquidGlassOptions, NSGlassEffectViewStyle,
            NSVisualEffectMaterial, NSVisualEffectState,
        };
        match config.distribution {
            Distribution::Direct => {
                // Liquid Glass (macOS 26+) via window-vibrancy 0.8 builder API; fallback to sidebar vibrancy.
                let opts = LiquidGlassOptions::new(NSGlassEffectViewStyle::Regular).radius(radius);
                if apply_liquid_glass(window, opts).is_err() {
                    let _ = apply_vibrancy(
                        window,
                        NSVisualEffectMaterial::Sidebar,
                        Some(NSVisualEffectState::FollowsWindowActiveState),
                        Some(radius),
                    );
                }
            }
            Distribution::MacAppStore => {
                // Public API vibrancy fallback for Mac App Store builds (no private API transparency).
                let _ = apply_vibrancy(
                    window,
                    NSVisualEffectMaterial::Sidebar,
                    Some(NSVisualEffectState::FollowsWindowActiveState),
                    Some(radius),
                );
            }
        }
    }

    #[cfg(target_os = "windows")]
    {
        use crate::apple_config::WindowsChrome;
        use window_vibrancy::apply_mica;
        let dark = matches!(window.theme(), Ok(tauri::Theme::Dark));
        let _ = apply_mica(window, Some(dark));
        if config.windows_chrome == WindowsChrome::Mac {
            let _ = window.set_decorations(false);
            let _ = window.set_shadow(true);
        }
    }

    #[cfg(target_os = "linux")]
    {
        use crate::apple_config::WindowsChrome;
        if config.windows_chrome == WindowsChrome::Mac {
            let _ = window.set_decorations(false);
        }
    }
}
