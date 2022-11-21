import React from "react";
import { Meta, Story } from "@storybook/react";
import Button, { ButtonProps } from "./index";

export default {
  title: "공통 컴포넌트/버튼",
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = args => <Button {...args}></Button>;

export const CreateRoom = Template.bind({});
CreateRoom.storyName = "방 만들기";
CreateRoom.args = {
  buttonType: "방 만들기",
};

export const ExitRoom = Template.bind({});
ExitRoom.storyName = "방 나가기";
ExitRoom.args = {
  buttonType: "방 나가기",
};

export const StartGame = Template.bind({});
StartGame.storyName = "게임 시작";
StartGame.args = {
  buttonType: "게임 시작",
};

export const Accept = Template.bind({});
Accept.storyName = "수락";
Accept.args = {
  buttonType: "수락",
};

export const Decline = Template.bind({});
Decline.storyName = "거절";
Decline.args = {
  buttonType: "거절",
};

export const OK = Template.bind({});
OK.storyName = "확인";
OK.args = {
  buttonType: "확인",
};

export const Close = Template.bind({});
Close.storyName = "닫기";
Close.args = {
  buttonType: "닫기",
};
