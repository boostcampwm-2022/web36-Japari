import { Story, Meta } from "@storybook/react";
import ChatLog, { ChatLogProps } from ".";

export default {
  title: "공통 컴포넌트/채팅/채팅 로그",
  component: ChatLog,
} as Meta;

const Template: Story<ChatLogProps> = args => <ChatLog {...args} />;

export const Default = Template.bind({});
Default.storyName = "채팅 로그";
Default.args = {
  logs: [],
};
