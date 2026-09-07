import { StoryFn, Meta } from "@storybook/react-vite";
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
} as Meta<typeof Header>;

const Template: StoryFn<HeaderProps> = args => <Header {...args} />;

export const Default = Template.bind({});
Default.storyName = "헤더";
Default.args = {};
