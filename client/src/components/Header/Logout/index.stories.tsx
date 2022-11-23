import { Story, Meta } from "@storybook/react";
import Logout from ".";

export default {
  title: "공통 컴포넌트/헤더/로그아웃",
  component: Logout,
} as Meta;

const Template: Story = () => <Logout />;

export const Default = Template.bind({});
Default.storyName = "로그아웃";
