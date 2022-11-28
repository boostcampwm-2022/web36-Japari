import { Story, Meta } from "@storybook/react";
import ChatInput from ".";

export default {
  title: "공통 컴포넌트/채팅/채팅 인풋",
  component: ChatInput,
} as Meta;

const Template: Story = () => <ChatInput addLogs={() => {}} />;

export const Default = Template.bind({});
Default.storyName = "채팅 인풋";
