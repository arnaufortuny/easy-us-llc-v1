import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n";
import { registerServiceWorker } from "./lib/register-sw";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
