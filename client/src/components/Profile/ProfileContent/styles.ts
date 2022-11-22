import { css } from "@emotion/react";

export const ProfileContentStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
`;

export const ImageDivStyle = css`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border: 0.1rem solid white;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
`;

export const ImageStyle = css`
  width: 100%;
  height: 100%;
`;

export const ProfileInfoStyle = css`
  flex-grow: 1;
`;

export const ProfileNicknameContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
`;

export const ProfileNicknameStyle = css`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 7rem;
`;

export const ProfileEditIconStyle = css`
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
`;

export const ProfileEmailStyle = css`
  font-size: 0.7rem;
  color: grey;
  margin-top: 1rem;
`;

export const ProfileScoreStyle = css`
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 1.25rem;
`;
