import { Meta, StoryFn } from "@storybook/react-vite";
import Loader from ".";

export default {
  title: "공통 컴포넌트/화면 로더",
  component: Loader,
} as Meta;

const Template: StoryFn = () => <Loader />;

export const Default = Template.bind({});
Default.storyName = "화면 로더";
