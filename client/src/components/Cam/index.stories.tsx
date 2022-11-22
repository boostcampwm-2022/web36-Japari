import { Story, Meta } from "@storybook/react";
import Cam, { VideoRecordProps } from ".";

export default {
  title: "공통 컴포넌트/캠",
  component: Cam,
  parameters: {
    backgrounds: {
      default: "secondary",
      values: [{ name: "secondary", value: "#F0EFFF" }],
    },
  },
} as Meta;

const Template: Story<VideoRecordProps> = args => <Cam {...args} />;

export const Default = Template.bind({});
Default.storyName = "캠";
Default.args = {
  isVideoOn: false,
  isAudioOn: false,
  profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
  nickname: "아임더베스트",
};

export const WithScoreRank = Template.bind({});
WithScoreRank.storyName = "캠 (점수/등수 포함)";
WithScoreRank.args = {
  isVideoOn: false,
  isAudioOn: false,
  profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
  nickname: "아임더베스트",
  scoreRank: "2412 (456위)",
};
