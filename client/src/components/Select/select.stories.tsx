import { Meta, StoryFn } from "@storybook/react-vite";
import Select, { SelectProps } from "./index";

export default {
  title: "공통 컴포넌트/셀렉트",
  component: Select,
} as Meta;

const Template: StoryFn<SelectProps> = args => <Select {...args} />;

export const Default = Template.bind({});
Default.storyName = "셀렉트";
Default.args = {
  selectType: "게임 필터",
};
