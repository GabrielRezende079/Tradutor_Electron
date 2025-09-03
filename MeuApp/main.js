const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const chat = new ChatGroq({
  apiKey: "SUA_CHAVE_DE_API_AQUI", // substitua pela sua chave de API
  model: "llama-3.3-70b-versatile",
});

const template = ChatPromptTemplate.fromMessages([
  ["system", "Você é um tradutor útil que traduz {expressao} para {lingua}."],
  ["user", 'Traduza "{expressao}" para {lingua}.'],
]);

const chain = template.pipe(chat);

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"), // <-- confere se está certo
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("traduzir", async (event, expressao, lingua) => {
  console.log("Recebi pedido de tradução:", expressao, lingua);
  const resposta = await chain.invoke({ expressao, lingua });
  console.log("Resposta do modelo:", resposta.content);
  return resposta.content;
});
