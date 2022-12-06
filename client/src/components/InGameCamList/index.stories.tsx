import { Story, Meta } from "@storybook/react";
import InGameCamList, { InGameCamListProps } from ".";

export default {
  title: "공통 컴포넌트/인게임 캠 목록",
  component: InGameCamList,
} as Meta;

const Template: Story<InGameCamListProps> = args => <InGameCamList {...args} />;

export const Default = Template.bind({});
Default.storyName = "인게임 캠 목록";
Default.args = {};
