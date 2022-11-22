// make Storybook for Mic and Cam toggle icon
import { Meta, Story } from "@storybook/react";
import StatusMicCam, { StatusMicCamProps } from ".";

export default {
  title: "공통 컴포넌트/헤더/마이크,카메라",
  component: StatusMicCam,
} as Meta;

const Template: Story<StatusMicCamProps> = args => <StatusMicCam {...args} />;
export const Default = Template.bind({});
Default.storyName = "마이크,카메라";
Default.args = {
  micStatus: true,
  camStatus: true,
};
