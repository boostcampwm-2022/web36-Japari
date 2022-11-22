import { Story, Meta } from "@storybook/react";
import InGameCamList, { InGameCamListProps } from ".";
import { theme } from "../../styles/theme";

export default {
  title: "공통 컴포넌트/인게임 캠 목록",
  component: InGameCamList,
  parameters: {
    backgrounds: {
      default: "primary",
      values: [{ name: "primary", value: theme.colors.primary }],
    },
  },
} as Meta;

const Template: Story<InGameCamListProps> = args => <InGameCamList {...args} />;

export const Default = Template.bind({});
Default.storyName = "인게임 캠 목록";
Default.args = {
  camList: [
    {
      isVideoOn: false,
      isAudioOn: false,
      profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
      nickname: "아임더베스트",
    },
    {
      isVideoOn: false,
      isAudioOn: false,
      profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
      nickname: "아임더세컨드",
    },
    {
      isVideoOn: false,
      isAudioOn: false,
      profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
      nickname: "아임더워스트",
    },
    {
      isVideoOn: false,
      isAudioOn: false,
      profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
      nickname: "하이요",
    },
    {
      isVideoOn: false,
      isAudioOn: false,
      profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
      nickname: "바이요",
    },
    {
      isVideoOn: false,
      isAudioOn: false,
      profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
      nickname: "캐마고수",
    },
    {
      isVideoOn: false,
      isAudioOn: false,
      profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
      nickname: "캐마초보",
    },
  ],
};
