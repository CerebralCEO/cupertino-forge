// Merge into src-tauri/src/lib.rs
mod apple_config;
mod apple_menu;
mod apple_tokens;
mod apple_window;

use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{Emitter, Manager};

struct MenuToggleState {
    sidebar_visible: AtomicBool,
    inspector_visible: AtomicBool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let design_config = apple_config::AppleDesignConfig::from_json(include_str!("../../.apple-design.json"));

    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .manage(design_config.clone())
        .manage(MenuToggleState {
            sidebar_visible: AtomicBool::new(true),
            inspector_visible: AtomicBool::new(false),
        })
        .invoke_handler(tauri::generate_handler![apple_config::get_apple_design_config])
        .setup(|app| {
            let handle = app.handle();
            let cfg = app.state::<apple_config::AppleDesignConfig>();
            let app_name = cfg.resolved_app_name(&app.package_info().name);
            let handles = apple_menu::build_apple_menu(handle, app_name)?;
            app.set_menu(handles.menu.clone())?;
            app.manage(handles);

            app.on_menu_event(|app, event| {
                let id = event.id().0.as_str();
                match id {
                    "toggle-sidebar" => {
                        let st = app.state::<MenuToggleState>();
                        let next = !st.sidebar_visible.load(Ordering::Relaxed);
                        st.sidebar_visible.store(next, Ordering::Relaxed);
                        let _ = app
                            .state::<apple_menu::AppleMenuHandles<tauri::Wry>>()
                            .set_sidebar_visible(next);
                    }
                    "toggle-inspector" => {
                        let st = app.state::<MenuToggleState>();
                        let next = !st.inspector_visible.load(Ordering::Relaxed);
                        st.inspector_visible.store(next, Ordering::Relaxed);
                        let _ = app
                            .state::<apple_menu::AppleMenuHandles<tauri::Wry>>()
                            .set_inspector_visible(next);
                    }
                    "bring-all-to-front" => {
                        for (_, win) in app.webview_windows() {
                            let _ = win.set_focus();
                        }
                    }
                    _ => {}
                }
                let _ = app.emit("menu", id);
            });

            let win = app.get_webview_window("main").expect("main window");
            apple_window::apply_apple_window(&win, cfg.inner());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
