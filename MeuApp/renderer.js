// renderer.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  traduzir: (expressao, lingua) => ipcRenderer.invoke("traduzir", expressao, lingua),
});
