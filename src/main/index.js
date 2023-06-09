import { app, BrowserWindow, Tray, ipcMain  } from 'electron'
import { join } from 'path'
import { optimizer, is } from '@electron-toolkit/utils'
import stateKeeper from 'electron-window-state'
import icon from '../../resources/appicon.ico?asset'
import Store from 'electron-store'

const store = new Store();

/* 
 TODO:

 1 => (Done) Store All Redux
 2 => (Done) Store win size & position: 
 3 => (Done) Fullscreen btn problem
 4 => (Done) Custom Title Bar
 5 => Yellow Border
 6 => username & password
 7 => (Done) Some Colors Issue
 8 => (Done) Fix load config issue
 9 => (Done) Fix App Icon & Images
*/

let mainWindow, tray = null;

function createWindow() {

  let winState = stateKeeper({defaultWidth: 900, defaultHeight: 670})
  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y,
    minWidth: 850,
    minHeight: 610,
    show: false,
    title: "Electron Cafe",
    frame: false,
    // autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      devTools: is.dev,
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  winState.manage(mainWindow)


  ipcMain.on('closeApp', () => {
    mainWindow.close()
  })

  ipcMain.on('maximizeApp', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })
  
  ipcMain.on('minimizeApp', () => {
    mainWindow.minimize()
  })

  ipcMain.on('toggleFullScreen', () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false)
    } else {
      mainWindow.setFullScreen(true)
    }
  })

  if (mainWindow.isMaximized()) {
    mainWindow.webContents.send('appIsMaximized')
  } else {
    mainWindow.webContents.send('appNotMaximized')
  }

  if (mainWindow.isFullScreen()) {
    mainWindow.webContents.send('appIsFullScreen')
  } else {
    mainWindow.webContents.send('appNotInFullScreen')
  }

  mainWindow.on('maximize', () => mainWindow.webContents.send('appIsMaximized'))
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('appNotMaximized'))

  mainWindow.on('enter-full-screen', () => mainWindow.webContents.send('appIsFullScreen'))
  mainWindow.on('leave-full-screen', () => mainWindow.webContents.send('appNotInFullScreen'))
  
  mainWindow.once('ready-to-show', mainWindow.show)

  mainWindow.on('closed', () => mainWindow = null)

}

/*   
  console.log('1 => ', app.getPath('appData'));
  console.log('2 => ', app.getPath('userData'));
  console.log('3 => ', app.getAppPath());

  1 =>  C:\Users\Administrator\AppData\Roaming
  2 =>  C:\Users\Administrator\AppData\Roaming\electron-cafe
  3 =>  C:\Users\Administrator\Desktop\electron-cafe 
*/

function manageConfigFile() {

  ipcMain.on('Do_You_Have_A_Data', () => {

    const marketItems = store.get('market')
    const reports = store.get('reports')
    const theme = store.get('theme')
    const units = store.get('units')
    const data = {}
  
    if (marketItems) data.marketItems = marketItems;
    if (reports) data.reports = reports;
    if (theme) data.theme = theme;
    if (units) data.units = units;
  
    if (Object.keys(data).length > 0) {
      mainWindow.webContents.send('Yes_I_Have_Some_Data', JSON.stringify(data))
    }

  })

  ipcMain.on('setConfig_Market', (e, args) => {
    store.set('market', JSON.parse(args))
  })
  
  ipcMain.on('setConfig_Theme', (e, args) => {
    store.set('theme', JSON.parse(args))
  })

  ipcMain.on('setConfig_Units', (e, args) => {
    store.set('units', JSON.parse(args))
  })

  ipcMain.on('setConfig_Reports', (e, args) => {
    store.set('reports', JSON.parse(args))
  })


}

app.whenReady().then(() => {

  createWindow()

  manageConfigFile()

  tray = new Tray(icon)
  tray.setToolTip('Electron-Cafe.')
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
