import { BrowserRouter, Route, Routes } from "react-router-dom";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { Global, ThemeProvider } from "@emotion/react";
import { globalStyle } from "../src/styles/global";
import theme from "../src/styles/theme";
import { RecoilRoot } from "recoil";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
};

export const decorators = [
  Story => (
    <BrowserRouter>
      <RecoilRoot>
        <Global styles={globalStyle} />
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      </RecoilRoot>
    </BrowserRouter>
  ),
];
