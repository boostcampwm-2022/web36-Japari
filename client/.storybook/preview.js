import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { Global } from "@emotion/react";
import { globalStyle } from "../src/global";

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
    <>
      <Global styles={globalStyle} />
      <Story />
    </>
  ),
];
