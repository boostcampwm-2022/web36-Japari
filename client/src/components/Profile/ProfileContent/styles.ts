import { css } from "@emotion/react";

export const ProfileContentStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
`;

export const ImageDivStyle = css`
  border-radius: 50%;
  border: 0.2rem solid rgba(200, 150, 50, 0.6);
  overflow: hidden;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImageStyle = css`
  width: 5.5rem;
  aspect-ratio: 1/1;
`;

export const ProfileInfoStyle = css`
  /* width: 10rem; */
`;

export const ProfileNicknameContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
`;

export const ProfileNicknameStyle = css`
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 9rem;
`;

export const ProfileEditIconStyle = css`
  position: relative;
  top: -0.1rem;
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
`;

export const ProfileEmailStyle = css`
  color: grey;
  margin-top: 1rem;

  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  word-break: break-all;
  width: 10rem;

  font-size: 0.65rem;
`;

export const ProfileScoreStyle = css`
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 1.25rem;

  > span {
    font-size: 0.8rem;
    font-weight: bold;
    color: mediumseagreen;
  }
`;
