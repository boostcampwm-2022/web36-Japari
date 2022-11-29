import { Story, Meta } from "@storybook/react";
import RoomList, { RoomListProps } from ".";

export default {
  title: "공통 컴포넌트/방 목록",
  component: RoomList,
} as Meta;

const Template: Story<RoomListProps> = args => <RoomList {...args} />;

export const Default = Template.bind({});
Default.storyName = "방 목록";
Default.args = {
  rooms: [
    { roomId: "1", title: "캐마 초보만", gameId: 1, currentPeople: 1, maximumPeople: 4, isPrivate: true },
    { roomId: "2", title: "캐마 고수만", gameId: 1, currentPeople: 2, maximumPeople: 6, isPrivate: false },
    { roomId: "3", title: "배틀십 ㄱㄱ", gameId: 2, currentPeople: 5, maximumPeople: 8, isPrivate: true },
    { roomId: "4", title: "자파리 갓겜", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: false },
    { roomId: "5", title: "즐겁게 한 판", gameId: 2, currentPeople: 1, maximumPeople: 8, isPrivate: true },
    { roomId: "6", title: "재밌게 한 판", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: false },
    { roomId: "7", title: "신나게 한 판", gameId: 1, currentPeople: 1, maximumPeople: 8, isPrivate: true },
    { roomId: "8", title: "비번 1234", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: true },
    { roomId: "9", title: "신나게 한 판", gameId: 1, currentPeople: 1, maximumPeople: 8, isPrivate: true },
    { roomId: "10", title: "비번 1234", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: true },
  ],
};
