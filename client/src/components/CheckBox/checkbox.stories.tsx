import { Meta, Story } from "@storybook/react";
import CheckBox from "./index";

export default {
  title: "공통 컴포넌트/체크박스",
  component: CheckBox,
} as Meta;

const Template: Story = args => <CheckBox {...args} />;

export const Default = Template.bind({});
Default.storyName = "체크박스";
