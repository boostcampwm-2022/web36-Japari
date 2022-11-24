import { Meta, Story } from "@storybook/react";
import Logo, { LogoProps } from "./index";

export default {
  title: "공통 컴포넌트/로고",
  component: Logo,
} as Meta;

const Template: Story<LogoProps> = args => <Logo {...args} />;

export const Default = Template.bind({});
Default.storyName = "로고";
Default.args = {
  logoType: "BOTH",
};
