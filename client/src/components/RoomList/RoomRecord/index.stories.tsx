import { Story, Meta } from "@storybook/react";
import RoomRecord, { RoomRecordProps } from ".";

export default {
  title: "공통 컴포넌트/방 레코드",
  component: RoomRecord,
} as Meta;

const Template: Story<RoomRecordProps> = args => <RoomRecord {...args} />;

export const Default = Template.bind({});
Default.storyName = "방 레코드";
Default.args = {
  isPrivate: true,
  title: "캐마 초보만",
  gameId: 1,
  currentPeople: 1,
  maximumPeople: 8,
};
