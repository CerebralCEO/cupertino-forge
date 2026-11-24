//! cupertino-forge: standard macOS menu bar (App, File, Edit, View, Window, Help).
//! Every toolbar or context action must also appear here with a shortcut.
//! On Windows and Linux the same menu becomes the window menu only if the app wants it; MacWindow does not draw one.

use tauri::menu::{AboutMetadata, Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::{AppHandle, Runtime};

pub fn build_apple_menu<R: Runtime>(app: &AppHandle<R>, app_name: &str) -> tauri::Result<Menu<R>> {
    let app_menu = Submenu::with_items(app, app_name, true, &[
        &PredefinedMenuItem::about(app, Some(&format!("About {app_name}")), Some(AboutMetadata::default()))?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "settings", "Settings...", true, Some("CmdOrCtrl+,"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::services(app, None)?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::hide(app, None)?,
        &PredefinedMenuItem::hide_others(app, None)?,
        &PredefinedMenuItem::show_all(app, None)?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::quit(app, None)?,
    ])?;

    let file = Submenu::with_items(app, "File", true, &[
        &MenuItem::with_id(app, "new", "New", true, Some("CmdOrCtrl+N"))?,
        &MenuItem::with_id(app, "open", "Open...", true, Some("CmdOrCtrl+O"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::close_window(app, None)?,
    ])?;

    let edit = Submenu::with_items(app, "Edit", true, &[
        &PredefinedMenuItem::undo(app, None)?,
        &PredefinedMenuItem::redo(app, None)?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::cut(app, None)?,
        &PredefinedMenuItem::copy(app, None)?,
        &PredefinedMenuItem::paste(app, None)?,
        &PredefinedMenuItem::select_all(app, None)?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "find", "Find...", true, Some("CmdOrCtrl+F"))?,
    ])?;

    let view = Submenu::with_items(app, "View", true, &[
        &MenuItem::with_id(app, "toggle-sidebar", "Show Sidebar", true, Some("CmdOrCtrl+Alt+S"))?,
        &MenuItem::with_id(app, "toggle-inspector", "Show Inspector", true, Some("CmdOrCtrl+Alt+I"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::fullscreen(app, None)?,
    ])?;

    let window = Submenu::with_items(app, "Window", true, &[
        &PredefinedMenuItem::minimize(app, None)?,
        &PredefinedMenuItem::maximize(app, Some("Zoom"))?,
    ])?;

    let help = Submenu::with_items(app, "Help", true, &[
        &MenuItem::with_id(app, "help", &format!("{app_name} Help"), true, Some("CmdOrCtrl+?"))?,
    ])?;

    Menu::with_items(app, &[&app_menu, &file, &edit, &view, &window, &help])
}
