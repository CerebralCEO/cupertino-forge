//! cupertino-forge: native window material and chrome for Apple style Tauri 2 apps.
//! macOS 26+: Liquid Glass (NSGlassEffectView) via window-vibrancy apply_liquid_glass.
//! macOS older: NSVisualEffectView sidebar vibrancy. Windows 11: Mica. Linux: nothing.

use tauri::{Runtime, WebviewWindow};

/// Values from tokens/shape.json (radiusMacOS.window) and layout.json (traffic lights).
pub const WINDOW_RADIUS: f64 = 12.0;
pub const TRAFFIC_LIGHT_X: f64 = 16.0;
pub const TRAFFIC_LIGHT_Y: f64 = 26.0;

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum WindowsChrome {
    /// keep native Windows caption buttons
    Native,
    /// custom macOS traffic lights drawn by the web MacWindow (decorations off)
    Mac,
}

pub fn apply_apple_window<R: Runtime>(window: &WebviewWindow<R>, windows_chrome: WindowsChrome) {
    #[cfg(target_os = "macos")]
    {
        let _ = windows_chrome;
        use window_vibrancy::{apply_liquid_glass, apply_vibrancy, NSGlassEffectViewStyle, NSVisualEffectMaterial, NSVisualEffectState};
        // Try Liquid Glass first (macOS 26+), fall back to sidebar vibrancy.
        let glass = apply_liquid_glass(window, NSGlassEffectViewStyle::Regular, None, Some(WINDOW_RADIUS));
        if glass.is_err() {
            let _ = apply_vibrancy(window, NSVisualEffectMaterial::Sidebar, Some(NSVisualEffectState::FollowsWindowActiveState), Some(WINDOW_RADIUS));
        }
    }

    #[cfg(target_os = "windows")]
    {
        use window_vibrancy::apply_mica;
        let dark = matches!(window.theme(), Ok(tauri::Theme::Dark));
        let _ = apply_mica(window, Some(dark));
        if windows_chrome == WindowsChrome::Mac {
            let _ = window.set_decorations(false);
            let _ = window.set_shadow(true);
        }
    }

    #[cfg(target_os = "linux")]
    {
        if windows_chrome == WindowsChrome::Mac {
            let _ = window.set_decorations(false);
        }
    }
}
