import { Meta, Story } from "@storybook/react";
import UserList from "./index";

export default {
  title: "공통 컴포넌트/유저 목록 사이드바",
  component: UserList,
} as Meta;

const Template: Story = () => <UserList></UserList>;

export const Default = Template.bind({});
Default.storyName = "유저 목록 사이드바";
