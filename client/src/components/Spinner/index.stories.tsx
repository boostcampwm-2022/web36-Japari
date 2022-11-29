import { Meta, Story } from "@storybook/react";
import Spinner from ".";

export default {
  title: "공통 컴포넌트/로딩 스피너",
  component: Spinner,
} as Meta;

const Template: Story = () => <Spinner />;

export const Default = Template.bind({});
Default.storyName = "로딩 스피너";
