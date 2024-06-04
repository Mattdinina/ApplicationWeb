import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { io } from 'socket.io-client';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const socket = io("ws://localhost:3000");

const createWindow = () => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const handleMessage = (message: unknown) => {
    console.log("Received message : ", message);
    mainWindow.webContents.send('socket-message', message)
  }

  ipcMain.on("send-message", (_, { message, topic }) => {
    socket.emit(topic, message);
  });

  var conv = ['conversation/1', 'conversation/2', 'conversation/3'];
  conv.forEach(element => {

    const handleMessage = (message: unknown) => {
      console.log("Received message : ", message);
      console.log("Received id : ", element);
      mainWindow.webContents.send(element, message)
    }

    console.log(element)
    socket.on(element, handleMessage);
  });


  function AddSocket(newSocket: string) {

    socket.on(newSocket, handleMessage)
    conv.push(newSocket)
  }

  function Remove(element: string) {
    conv = conv.filter(item => item !== element);
    socket.removeAllListeners(element)
  }

  mainWindow.on("close", () => {
    conv.forEach(item => {
      socket.removeAllListeners(item)
    })
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.