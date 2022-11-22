import { Meta, Story } from "@storybook/react";
import UserList, { UserListProps } from "./index";

export default {
  title: "공통 컴포넌트/유저 목록 사이드바",
  component: UserList,
} as Meta;

const Template: Story<UserListProps> = args => <UserList {...args}></UserList>;

export const Default = Template.bind({});
Default.storyName = "유저 목록 사이드바";

const dummyUser1 = {
  userId: 1,
  email: "japari@gmail.com",
  nickname: "japari",
  score: 2000,
  profileImage: "",
  connected: true,
};

const dummyUser2 = {
  userId: 1,
  email: "first@gmail.com",
  nickname: "first",
  score: 3000,
  profileImage: "",
  connected: false,
};

Default.args = {
  userMap: {
    users: Array(13).fill(dummyUser1),
    friends: [dummyUser1, dummyUser2],
    rank: Array(10).fill(dummyUser2),
  },
};
