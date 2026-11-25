//! cupertino-forge: runtime/build-time config bridge from .apple-design.json -> Rust.
//! Window corner radius fallback uses crate::apple_tokens::WINDOW_CORNER_RADIUS (marked [estimate] in tokens/shape.json).

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "kebab-case")]
pub enum Distribution {
    /// Direct download / DMG: allows macOSPrivateApi transparency + NSGlassEffectView Liquid Glass.
    #[default]
    Direct,
    /// Mac App Store: disables private API transparency and falls back to public NSVisualEffectView vibrancy.
    MacAppStore,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "kebab-case")]
pub enum WindowsChrome {
    /// Keep native Windows caption buttons.
    Native,
    /// Custom macOS traffic lights rendered by the web MacWindow (decorations off).
    #[default]
    Mac,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AppleDesignConfig {
    pub windows_chrome: WindowsChrome,
    pub distribution: Distribution,
    pub glass_intensity: f64,
    /// Optional explicit window radius override; defaults to tokens/shape.json radiusMacOS.window ([estimate]).
    pub window_radius: Option<f64>,
    pub app_name: Option<String>,
}

impl Default for AppleDesignConfig {
    fn default() -> Self {
        Self {
            windows_chrome: WindowsChrome::Mac,
            distribution: Distribution::Direct,
            glass_intensity: 0.5,
            window_radius: None,
            app_name: None,
        }
    }
}

impl AppleDesignConfig {
    pub fn from_json(raw: &str) -> Self {
        serde_json::from_str(raw).unwrap_or_default()
    }

    pub fn resolved_window_radius(&self) -> f64 {
        self.window_radius
            .unwrap_or(crate::apple_tokens::WINDOW_CORNER_RADIUS)
    }

    pub fn resolved_app_name<'a>(&'a self, fallback: &'a str) -> &'a str {
        match self.app_name.as_deref() {
            Some(name) if !name.trim().is_empty() => name,
            _ => fallback,
        }
    }
}

#[tauri::command]
pub fn get_apple_design_config(state: tauri::State<'_, AppleDesignConfig>) -> AppleDesignConfig {
    state.inner().clone()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_mas_distribution_and_native_chrome() {
        let cfg = AppleDesignConfig::from_json(
            r#"{"distribution":"mac-app-store","windowsChrome":"native","windowRadius":16.0,"appName":"Notes"}"#,
        );
        assert_eq!(cfg.distribution, Distribution::MacAppStore);
        assert_eq!(cfg.windows_chrome, WindowsChrome::Native);
        assert_eq!(cfg.resolved_window_radius(), 16.0);
        assert_eq!(cfg.resolved_app_name("Fallback"), "Notes");
    }

    #[test]
    fn falls_back_to_token_radius_and_package_name() {
        let cfg = AppleDesignConfig::from_json("{}");
        assert_eq!(cfg.distribution, Distribution::Direct);
        assert_eq!(cfg.windows_chrome, WindowsChrome::Mac);
        assert_eq!(cfg.resolved_window_radius(), crate::apple_tokens::WINDOW_CORNER_RADIUS);
        assert_eq!(cfg.resolved_app_name("FallbackApp"), "FallbackApp");
    }
}
