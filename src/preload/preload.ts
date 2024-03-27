// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (data1: any, data2: any) => ipcRenderer.invoke('read-file', data1, data2),
    showMssage: (callback: any) => ipcRenderer.on('show-message', (_event, value) => callback(value)),
})