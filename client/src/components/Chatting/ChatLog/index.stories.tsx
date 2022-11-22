import { Story, Meta } from "@storybook/react";
import ChatLog, { ChatLogProps } from ".";

export default {
  title: "공통 컴포넌트/채팅/채팅 로그",
  component: ChatLog,
} as Meta;

const Template: Story<ChatLogProps> = args => <ChatLog {...args} />;

export const dummyLog = [
  {
    sender: "user1",
    message: "안녕하세요",
    sendTime: new Date(),
  },
  {
    sender: "user2",
    message: "안녕하세요",
    sendTime: new Date(),
  },
  {
    sender: "user3",
    message: "안녕하세요",
    sendTime: new Date(),
  },
  {
    sender: "user4",
    message: "안",
    sendTime: new Date(),
  },
  {
    sender: "user5",
    message: "안녕하세요5555555",
    sendTime: new Date(),
  },
  {
    sender: "user6",
    message: "안녕하세요666666666666666666666666",
    sendTime: new Date(),
  },
];

export const Default = Template.bind({});
Default.storyName = "채팅 로그";
Default.args = {
  logs: dummyLog,
};
