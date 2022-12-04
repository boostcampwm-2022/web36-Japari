import { Meta, Story } from "@storybook/react";
import Camtest from ".";

export default {
  title: "공통 컴포넌트/캠 테스트",
  component: Camtest,
} as Meta;

const Template: Story = () => <Camtest />;

export const Default = Template.bind({});
Default.storyName = "캠 테스트";
