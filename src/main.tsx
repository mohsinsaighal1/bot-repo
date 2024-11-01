import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TonConnectUIProvider, useTonConnectUI } from "@tonconnect/ui-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://telegram-game-seven-rose.vercel.app/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/ArgonTeq_bot/argon_game",
      }}
    >
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
