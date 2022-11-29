import { Meta, Story } from "@storybook/react";
import Loader from ".";

export default {
  title: "공통 컴포넌트/화면 로더",
  component: Loader,
} as Meta;

const Template: Story = () => <Loader />;

export const Default = Template.bind({});
Default.storyName = "화면 로더";
