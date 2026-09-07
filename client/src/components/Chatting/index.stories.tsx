import { StoryFn, Meta } from "@storybook/react-vite";
import Chatting from ".";

export default {
  title: "공통 컴포넌트/채팅",
  component: Chatting,
} as Meta;

const Template: StoryFn = () => <Chatting />;

export const Default = Template.bind({});
Default.storyName = "채팅";
