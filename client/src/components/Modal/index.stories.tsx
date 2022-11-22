import { Meta, Story } from "@storybook/react";
import Modal, { ModalProps } from "./index";

export default {
  title: "공통 컴포넌트/모달",
  component: Modal,
  parameters: {
    backgrounds: {
      default: "gray",
      values: [
        {
          name: "gray",
          value: "gray",
        },
      ],
    },
  },
} as Meta;

const Template: Story<ModalProps> = args => <Modal {...args} />;

export const Default = Template.bind({});
Default.storyName = "모달";
Default.args = {
  ModalType: "닉네임 설정",
};
