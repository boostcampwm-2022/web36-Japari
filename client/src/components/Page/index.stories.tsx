import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { within, userEvent } from "storybook/test";
import { Page } from ".";

export default {
  title: "Example/Page",
  component: Page,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as Meta<typeof Page>;

const Template: StoryFn<typeof Page> = args => <Page {...args} />;

export const main = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
main.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const loginButton = await canvas.getByRole("button", { name: /Log in/i });
  await userEvent.click(loginButton);
};
