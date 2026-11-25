//! cupertino-forge: standard macOS menu bar (App, File, Edit, View, Window, Help).
//! Every toolbar or context action must also appear here with a CmdOrCtrl shortcut.
//! Handles dynamic Hide/Show Sidebar and Hide/Show Inspector labels.

use tauri::menu::{AboutMetadata, Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::{AppHandle, Runtime};

pub struct AppleMenuHandles<R: Runtime> {
    pub menu: Menu<R>,
    pub sidebar_item: MenuItem<R>,
    pub inspector_item: MenuItem<R>,
}

impl<R: Runtime> AppleMenuHandles<R> {
    pub fn set_sidebar_visible(&self, visible: bool) -> tauri::Result<()> {
        self.sidebar_item
            .set_text(if visible { "Hide Sidebar" } else { "Show Sidebar" })
    }

    pub fn set_inspector_visible(&self, visible: bool) -> tauri::Result<()> {
        self.inspector_item.set_text(if visible {
            "Hide Inspector"
        } else {
            "Show Inspector"
        })
    }
}

pub fn build_apple_menu<R: Runtime>(
    app: &AppHandle<R>,
    app_name: &str,
) -> tauri::Result<AppleMenuHandles<R>> {
    let app_menu = Submenu::with_items(
        app,
        app_name,
        true,
        &[
            &PredefinedMenuItem::about(
                app,
                Some(&format!("About {app_name}")),
                Some(AboutMetadata::default()),
            )?,
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
        ],
    )?;

    let file = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "new", "New", true, Some("CmdOrCtrl+N"))?,
            &MenuItem::with_id(app, "open", "Open...", true, Some("CmdOrCtrl+O"))?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(
                app,
                "duplicate",
                "Duplicate",
                true,
                Some("CmdOrCtrl+Shift+S"),
            )?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::close_window(app, None)?,
        ],
    )?;

    let edit = Submenu::with_items(
        app,
        "Edit",
        true,
        &[
            &PredefinedMenuItem::undo(app, None)?,
            &PredefinedMenuItem::redo(app, None)?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, None)?,
            &PredefinedMenuItem::copy(app, None)?,
            &PredefinedMenuItem::paste(app, None)?,
            &PredefinedMenuItem::select_all(app, None)?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(app, "find", "Find...", true, Some("CmdOrCtrl+F"))?,
        ],
    )?;

    let sidebar_item = MenuItem::with_id(
        app,
        "toggle-sidebar",
        "Hide Sidebar",
        true,
        Some("CmdOrCtrl+Alt+S"),
    )?;
    let inspector_item = MenuItem::with_id(
        app,
        "toggle-inspector",
        "Show Inspector",
        true,
        Some("CmdOrCtrl+Alt+I"),
    )?;
    let view = Submenu::with_items(
        app,
        "View",
        true,
        &[
            &sidebar_item,
            &inspector_item,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::fullscreen(app, None)?,
        ],
    )?;

    let window = Submenu::with_items(
        app,
        "Window",
        true,
        &[
            &PredefinedMenuItem::minimize(app, None)?,
            &PredefinedMenuItem::maximize(app, Some("Zoom"))?,
            &PredefinedMenuItem::separator(app)?,
            &MenuItem::with_id(
                app,
                "bring-all-to-front",
                "Bring All to Front",
                true,
                None::<&str>,
            )?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::close_window(app, None)?,
        ],
    )?;

    let help = Submenu::with_items(
        app,
        "Help",
        true,
        &[&MenuItem::with_id(
            app,
            "help",
            &format!("{app_name} Help"),
            true,
            Some("CmdOrCtrl+?"),
        )?],
    )?;

    let menu = Menu::with_items(app, &[&app_menu, &file, &edit, &view, &window, &help])?;
    Ok(AppleMenuHandles {
        menu,
        sidebar_item,
        inspector_item,
    })
}
