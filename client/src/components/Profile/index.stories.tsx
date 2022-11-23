import { Meta, Story } from "@storybook/react";
import Profile, { ProfileProps } from "./index";

export default {
  title: "공통 컴포넌트/프로필",
  component: Profile,
} as Meta;

const Template: Story<ProfileProps> = args => <Profile {...args}></Profile>;

export const Default = Template.bind({});
Default.storyName = "프로필";

const dummyUser1 = {
  userId: 1,
  email: "japari@gmail.com",
  nickname: "아임더베스트게이머",
  score: 2000,
  profileImage: "",
};

Default.args = { user: dummyUser1 };
