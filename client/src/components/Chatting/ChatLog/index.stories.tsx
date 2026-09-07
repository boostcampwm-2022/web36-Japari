import { StoryFn, Meta } from "@storybook/react-vite";
import ChatLog, { ChatLogProps } from ".";

export default {
  title: "공통 컴포넌트/채팅/채팅 로그",
  component: ChatLog,
} as Meta;

const Template: StoryFn<ChatLogProps> = args => <ChatLog {...args} />;

export const Default = Template.bind({});
Default.storyName = "채팅 로그";
Default.args = {
  logs: [],
};
