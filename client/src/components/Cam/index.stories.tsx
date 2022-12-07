import { Story, Meta } from "@storybook/react";
import Cam, { CamProps } from ".";

export default {
  title: "공통 컴포넌트/캠",
  component: Cam,
} as Meta;

const Template: Story<CamProps> = args => <Cam {...args} />;

export const Default = Template.bind({});
Default.storyName = "캠";
Default.args = {
  isVideoOn: false,
  userInfo: {
    userId: 1,
    email: "iamthebest@gmail.com",
    profileImage: "https://avatars.githubusercontent.com/u/102232291?v=4",
    nickname: "아임더베스트",
    score: 0,
    rank: 1999,
  },
};
