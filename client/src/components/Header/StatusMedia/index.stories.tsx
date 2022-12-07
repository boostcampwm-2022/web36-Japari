// make Storybook for Mic and Cam toggle icon
import { Meta, Story } from "@storybook/react";
import StatusMedia from ".";

export default {
  title: "공통 컴포넌트/헤더/마이크,카메라",
  component: StatusMedia,
} as Meta;

const Template: Story = args => <StatusMedia {...args} />;
export const Default = Template.bind({});
Default.storyName = "마이크,카메라";
Default.args = {
  micStatus: true,
  camStatus: true,
};
