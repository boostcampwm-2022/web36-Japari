import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Global, ThemeProvider } from "@emotion/react";
import { globalStyle } from "./styles/global";
import theme from "./styles/theme";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <RecoilRoot>
    <Global styles={globalStyle} />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
