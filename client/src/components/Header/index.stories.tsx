import { Story, ComponentMeta } from "@storybook/react";
import { Header, HeaderProps } from "./index";

export default {
  title: "공통 컴포넌트/헤더",
  component: Header,
  parameters: {
    backgrounds: {
      default: "pink",
      values: [{ name: "pink", value: "#FDE1E3" }],
    },
  },
} as ComponentMeta<typeof Header>;

const Template: Story<HeaderProps> = args => <Header {...args} />;

export const Default = Template.bind({});
Default.storyName = "헤더";
Default.args = {};
