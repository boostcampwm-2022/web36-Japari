// make Storybook for Mic and Cam toggle icon
import { Meta, StoryFn } from "@storybook/react-vite";
import StatusMedia from ".";

export default {
  title: "공통 컴포넌트/헤더/마이크,카메라",
  component: StatusMedia,
} as Meta;

const Template: StoryFn = args => <StatusMedia {...args} />;
export const Default = Template.bind({});
Default.storyName = "마이크,카메라";
Default.args = {
  micStatus: true,
  camStatus: true,
};
