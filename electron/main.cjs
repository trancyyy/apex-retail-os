const { app, BrowserWindow, ipcMain, screen, shell } = require('electron');
const path = require('path');

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow = null;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1600, width),
    height: Math.min(1000, height),
    minWidth: 1100,
    minHeight: 720,
    title: 'Apex Retail OS — Enterprise Multi-Store Apparel Suite',
    frame: true, // Standard stable Windows window with native snap & caption controls
    backgroundColor: '#1c1c1c',
    darkTheme: true,
    show: true, // Show immediately to prevent invisible launch
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      webSecurity: false,
      spellcheck: false
    }
  });

  // Always load from local dist/index.html when packaged or fallback
  const indexPath = path.join(__dirname, '../dist/index.html');
  if (app.isPackaged || !process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load local HTML file:', err);
    });
  } else {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL).catch(() => {
      mainWindow.loadFile(indexPath);
    });
  }

  // Handle render crashes or loading errors
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error(`Page failed to load (${errorCode}): ${errorDescription}`);
    // Fallback reload
    setTimeout(() => {
      if (mainWindow) mainWindow.loadFile(indexPath);
    }, 1000);
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('Renderer process gone:', details.reason);
  });

  // Open external URLs in the user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:') || url.startsWith('mailto:') || url.startsWith('https://wa.me')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// When second instance launched, focus the existing window
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in Main Process:', err);
});
