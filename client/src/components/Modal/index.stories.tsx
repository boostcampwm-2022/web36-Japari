import { Meta, Story } from "@storybook/react";
import Modal, { ModalProps } from "./index";

export default {
  title: "공통 컴포넌트/모달",
  component: Modal,
} as Meta;

const Template: Story<ModalProps> = args => <Modal {...args} />;

export const NickNameSetting = Template.bind({});
NickNameSetting.storyName = "닉네임 설정";
NickNameSetting.args = {
  ModalType: "닉네임 설정",
};

export const PasswordSetting = Template.bind({});
PasswordSetting.storyName = "비밀번호 입력";
PasswordSetting.args = {
  ModalType: "비밀번호 입력",
};

export const RoomSetting = Template.bind({});
RoomSetting.storyName = "방 설정";
RoomSetting.args = {
  ModalType: "방 설정",
  nickname: "아임더베스트",
  email: "mathlife12345@gmail.com",
  score: 1443,
  rank: 893,
};

export const friendRequest = Template.bind({});
friendRequest.storyName = "친구 요청";
friendRequest.args = {
  ModalType: "친구 요청",
};

export const GameInvitation = Template.bind({});
GameInvitation.storyName = "게임 초대";
GameInvitation.args = {
  ModalType: "게임 초대",
};
