// Merge into src-tauri/src/lib.rs
mod apple_menu;
mod apple_window;

use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            let handle = app.handle();
            let menu = apple_menu::build_apple_menu(handle, "MyApp")?;
            app.set_menu(menu)?;
            // Forward menu clicks to the frontend: listen with listen('menu', e => ...) in React.
            app.on_menu_event(|app, event| {
                let _ = app.emit("menu", event.id().0.clone());
            });
            let win = app.get_webview_window("main").expect("main window");
            // windowsChrome comes from .apple-design.json ("mac" or "native")
            apple_window::apply_apple_window(&win, apple_window::WindowsChrome::Mac);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
