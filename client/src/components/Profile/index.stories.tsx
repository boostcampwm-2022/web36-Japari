import { Meta, Story } from "@storybook/react";
import Profile, { ProfileProps } from "./index";

export default {
  title: "공통 컴포넌트/프로필",
  component: Profile,
} as Meta;

const Template: Story<ProfileProps> = args => <Profile {...args}></Profile>;

export const Default = Template.bind({});
Default.storyName = "프로필 (짧은 이메일)";

const dummyUser1 = {
  userId: 1,
  email: "mathlife12345678@gmail.com",
  nickname: "아임더베스트게이머",
  score: 2000,
  rank: 14,
  profileImage: "https://avatars.githubusercontent.com/u/102232291?v=4",
};

Default.args = { user: dummyUser1 };

export const LongEmail = Template.bind({});
LongEmail.storyName = "프로필 (긴 이메일)";

const dummyUser2 = {
  userId: 1,
  email: "japarijaparijaparijaparijaparijaparijapari@gmail.com",
  nickname: "아임더베스트게이머",
  score: 2000,
  rank: 14,
  profileImage: "https://avatars.githubusercontent.com/u/102232291?v=4",
};

LongEmail.args = { user: dummyUser2 };
