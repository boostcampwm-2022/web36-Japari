import { Meta, Story } from "@storybook/react";
import Select, { SelectProps } from "./index";

export default {
  title: "공통 컴포넌트/셀렉트",
  component: Select,
} as Meta;

const Template: Story<SelectProps> = args => <Select {...args} />;

export const Default = Template.bind({});
Default.storyName = "셀렉트";
Default.args = {
  SelectType: "게임 필터",
};
