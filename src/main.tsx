import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://bot-repo-euzt.vercel.app/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/argonteqbot/argonapp",
      }}
    >
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
