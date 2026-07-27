import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const window = new BrowserWindow({
    width: 920,
    height: 820,
    useContentSize: true,
    minWidth: 360,
    minHeight: 520,
    backgroundColor: "#07091c",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.loadFile(path.join(projectDirectory, "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
