import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Global, ThemeProvider } from "@emotion/react";
import { globalStyle } from "./styles/global";
import { theme } from "./styles/theme";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Global styles={globalStyle} />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
