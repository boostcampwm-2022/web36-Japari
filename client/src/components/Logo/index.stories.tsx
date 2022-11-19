import { Meta, Story } from "@storybook/react";
import Logo, { LogoProps } from "./index";

export default {
  component: Logo,
  title: "Logo",
} as Meta;

const Template: Story<LogoProps> = args => <Logo {...args} />;

export const Default = Template.bind({});
Default.args = {
  logoType: "BOTH",
};

export const ImageOnly = Template.bind({});
ImageOnly.args = {
  logoType: "IMAGE_ONLY",
};

export const WordOnly = Template.bind({});
WordOnly.args = {
  logoType: "WORD_ONLY",
};
