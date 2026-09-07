import { Meta, StoryFn } from "@storybook/react-vite";
import CheckBox from "./index";

export default {
  title: "공통 컴포넌트/체크박스",
  component: CheckBox,
} as Meta;

const Template: StoryFn = (args: any) => <CheckBox {...args} />;

export const Default = Template.bind({});
Default.storyName = "체크박스";
