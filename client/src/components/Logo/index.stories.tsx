import { Meta, Story } from "@storybook/react";
import Logo, { LogoProps } from "./index";

export default {
  title: "공통 컴포넌트/로고",
  component: Logo,
} as Meta;

const Template: Story<LogoProps> = args => <Logo {...args} />;

export const Both = Template.bind({});
Both.storyName = "이미지 & 글자";
Both.args = {
  logoType: "BOTH",
};

export const ImageOnly = Template.bind({});
ImageOnly.storyName = "이미지";
ImageOnly.args = {
  logoType: "IMAGE_ONLY",
};

export const WordOnly = Template.bind({});
WordOnly.storyName = "글자";
WordOnly.args = {
  logoType: "WORD_ONLY",
};
