import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import Button, { ButtonProps } from "./index";

export default {
  title: "공통 컴포넌트/버튼",
  component: Button,
} as Meta;

const Template: StoryFn<ButtonProps> = args => <Button {...args}></Button>;

export const Default = Template.bind({});
Default.storyName = "버튼";
Default.args = {
  buttonType: "방 만들기",
};
