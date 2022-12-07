import { Story, Meta } from "@storybook/react";
import WaitingRoomInfo, { WaitingRoomInfoProps } from ".";

export default {
  title: "공통 컴포넌트/대기실 정보",
  component: WaitingRoomInfo,
} as Meta;

const Template: Story<WaitingRoomInfoProps> = args => <WaitingRoomInfo {...args} />;

export const Default = Template.bind({});
Default.storyName = "대기실 정보";
Default.args = {
  roomRecord: {
    roomId: "1",
    isPrivate: true,
    title: "캐마 초보만",
    gameId: 1,
    currentPeople: 6,
    maximumPeople: 8,
  },
  // camList: [
  //   {
  //     isVideoOn: false,
  //     isAudioOn: false,
  //     profile: "https://avatars.githubusercontent.com/u/102232291?v=4",
  //     nickname: "아임더베스트",
  //     scoreRank: "2500 (1위)",
  //   },
  // ],
};
