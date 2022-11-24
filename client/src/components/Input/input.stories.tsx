import { Meta, Story } from "@storybook/react";
import Input, { InputProps } from "./index";

export default {
  title: "공통 컴포넌트/인풋",
  component: Input,
} as Meta;

const Template: Story<InputProps> = args => <Input {...args} />;

export const Default = Template.bind({});
Default.storyName = "인풋";
Default.args = {
  type: "text",
  placeholder: "이름을 입력하세요...",
  setValue: () => {},
};
